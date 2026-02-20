import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ success: false, error: "Missing post ID" }, { status: 400 });
    }

    const post = await prisma.socialPost.findFirst({
      where: { id: postId, userId: user.id },
      include: {
        account: true,
      },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found or unauthorized" }, { status: 404 });
    }

    if (post.status === "PUBLISHED") {
      return NextResponse.json({ success: false, error: "Post is already published" }, { status: 400 });
    }

    // Decrypt access token to be used for publishing
    const accessToken = decrypt(post.account.accessToken);

    // TODO: Implement actual publishing logic for each platform using the decrypted token
    // switch (post.account.platform) {
    //   case 'FACEBOOK':
    //     await publishToFacebook(accessToken, post.content, post.mediaUrls);
    //     break;
    //   ...
    // }

    // Simulating successful publishing
    const updatedPost = await prisma.socialPost.update({
      where: { id: postId },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        platformPostId: `mock-id-${Date.now()}`,
      },
    });

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Error publishing post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
