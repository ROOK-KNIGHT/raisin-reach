import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const period = searchParams.get("period") || "30days"; // 7days, 30days, 90days

    const endDate = new Date();
    let startDate = new Date();

    if (period === "7days") {
      startDate.setDate(endDate.getDate() - 7);
    } else if (period === "90days") {
      startDate.setDate(endDate.getDate() - 90);
    } else {
      startDate.setDate(endDate.getDate() - 30);
    }

    const posts = await prisma.socialPost.findMany({
      where: {
        userId: user.id,
        publishedAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "PUBLISHED",
      },
      include: {
        account: {
          select: {
            platform: true,
          },
        },
      },
    });

    // Aggregate metrics
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalReach = 0;

    const platformBreakdown: Record<string, any> = {};

    posts.forEach((post) => {
      const engagement = (post.engagement as any) || {};
      const likes = engagement.likes || 0;
      const comments = engagement.comments || 0;
      const shares = engagement.shares || 0;
      const reach = engagement.reach || 0;

      totalLikes += likes;
      totalComments += comments;
      totalShares += shares;
      totalReach += reach;

      const platform = post.account.platform;
      if (!platformBreakdown[platform]) {
        platformBreakdown[platform] = { likes: 0, comments: 0, shares: 0, posts: 0 };
      }
      platformBreakdown[platform].likes += likes;
      platformBreakdown[platform].comments += comments;
      platformBreakdown[platform].shares += shares;
      platformBreakdown[platform].posts += 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalPosts: posts.length,
        totalLikes,
        totalComments,
        totalShares,
        totalReach,
        engagementRate: totalReach > 0 ? ((totalLikes + totalComments + totalShares) / totalReach) * 100 : 0,
        platformBreakdown,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
