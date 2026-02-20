import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostStatus, SocialPlatform } from "@prisma/client";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as PostStatus | undefined;
    const platform = searchParams.get("platform") as SocialPlatform | undefined;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereClause: any = {
      userId: user.id,
    };

    if (status) {
      whereClause.status = status;
    }

    if (platform) {
      whereClause.account = {
        platform: platform,
      };
    }

    if (startDate || endDate) {
      whereClause.scheduledFor = {};
      if (startDate) {
        whereClause.scheduledFor.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.scheduledFor.lte = new Date(endDate);
      }
    }

    const posts = await prisma.socialPost.findMany({
      where: whereClause,
      include: {
        account: {
          select: {
            platform: true,
            accountName: true,
          },
        },
      },
      orderBy: {
        scheduledFor: "asc",
      },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching social posts:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
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
    const { accountIds, content, mediaUrls, scheduledFor, status } = body;

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0 || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Verify accounts belong to user
    const accounts = await prisma.socialMediaAccount.findMany({
      where: {
        id: { in: accountIds },
        userId: user.id,
      },
    });

    if (accounts.length !== accountIds.length) {
      return NextResponse.json({ success: false, error: "Invalid accounts" }, { status: 400 });
    }

    const createdPosts = await Promise.all(
      accounts.map((account) =>
        prisma.socialPost.create({
          data: {
            userId: user.id,
            accountId: account.id,
            content,
            mediaUrls: mediaUrls || [],
            scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
            status: status || "DRAFT",
          },
        })
      )
    );

    return NextResponse.json({ success: true, data: createdPosts });
  } catch (error) {
    console.error("Error creating social post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
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
    const { id, content, mediaUrls, scheduledFor, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing post ID" }, { status: 400 });
    }

    // Verify ownership
    const post = await prisma.socialPost.findFirst({
      where: { id, userId: user.id },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found or unauthorized" }, { status: 404 });
    }

    const updatedPost = await prisma.socialPost.update({
      where: { id },
      data: {
        content,
        mediaUrls,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status,
      },
    });

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Error updating social post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing post ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Verify ownership
    const post = await prisma.socialPost.findFirst({
      where: { id, userId: user.id },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found or unauthorized" }, { status: 404 });
    }

    await prisma.socialPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting social post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
