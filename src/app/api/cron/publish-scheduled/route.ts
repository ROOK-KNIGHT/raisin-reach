import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

// Helper function to publish to Twitter
async function publishToTwitter(accessToken: string, content: string, mediaUrls: string[]): Promise<string> {
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: content,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Twitter API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.data.id;
}

// Cron job to publish scheduled posts
export async function GET(req: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find all scheduled posts that are due
    const duePosts = await prisma.socialPost.findMany({
      where: {
        status: "SCHEDULED",
        scheduledFor: {
          lte: now,
        },
      },
      include: {
        account: true,
      },
    });

    console.log(`Found ${duePosts.length} posts to publish`);

    const results = await Promise.allSettled(
      duePosts.map(async (post: any) => {
        try {
          // Update status to PUBLISHING
          await prisma.socialPost.update({
            where: { id: post.id },
            data: { status: "PUBLISHING" },
          });

          // Decrypt access token
          const accessToken = decrypt(post.account.accessToken);

          let platformPostId: string | null = null;

          // Publish to the appropriate platform
          switch (post.account.platform) {
            case 'TWITTER':
              platformPostId = await publishToTwitter(accessToken, post.content, post.mediaUrls);
              break;
            default:
              throw new Error(`Publishing to ${post.account.platform} not yet implemented`);
          }

          // Update post as published
          await prisma.socialPost.update({
            where: { id: post.id },
            data: {
              status: "PUBLISHED",
              publishedAt: new Date(),
              platformPostId,
            },
          });

          return { success: true, postId: post.id };
        } catch (error: any) {
          // Mark as failed
          await prisma.socialPost.update({
            where: { id: post.id },
            data: { status: "FAILED" },
          });

          console.error(`Failed to publish post ${post.id}:`, error);
          return { success: false, postId: post.id, error: error.message };
        }
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;

    return NextResponse.json({
      success: true,
      message: `Published ${successful} posts, ${failed} failed`,
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
