import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

// Helper function to publish to Twitter
async function publishToTwitter(accessToken: string, content: string, mediaUrls: string[]): Promise<string> {
  // Post tweet using Twitter API v2
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: content,
      // TODO: Add media support if mediaUrls are provided
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Twitter API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.data.id; // Return the tweet ID
}

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

    // Update status to PUBLISHING
    await prisma.socialPost.update({
      where: { id: postId },
      data: { status: "PUBLISHING" },
    });

    let platformPostId: string | null = null;

    try {
      // Publish to the appropriate platform
      switch (post.account.platform) {
        case 'TWITTER':
          platformPostId = await publishToTwitter(accessToken, post.content, post.mediaUrls);
          break;
        case 'FACEBOOK':
        case 'INSTAGRAM':
        case 'LINKEDIN':
        case 'TIKTOK':
        case 'YOUTUBE':
          throw new Error(`Publishing to ${post.account.platform} not yet implemented`);
        default:
          throw new Error(`Unknown platform: ${post.account.platform}`);
      }

      // Update post as published
      const updatedPost = await prisma.socialPost.update({
        where: { id: postId },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          platformPostId,
        },
      });

      return NextResponse.json({ success: true, data: updatedPost });
    } catch (publishError: any) {
      // Mark as failed if publishing fails
      await prisma.socialPost.update({
        where: { id: postId },
        data: { status: "FAILED" },
      });

      console.error("Publishing error:", publishError);
      return NextResponse.json({ 
        success: false, 
        error: publishError.message || "Failed to publish post" 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error publishing post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
