import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

// Twitter OAuth 2.0 Callback
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/social-media?error=${encodeURIComponent(error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/social-media?error=missing_parameters`
      );
    }

    // Verify state
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.email !== stateData.userEmail) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/social-media?error=invalid_state`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/social/twitter/callback`,
        code_verifier: 'challenge',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Twitter token exchange failed:', errorData);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/social-media?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get user info from Twitter
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/social-media?error=failed_to_get_user_info`
      );
    }

    const userData = await userResponse.json();
    const twitterUser = userData.data;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/social-media?error=user_not_found`
      );
    }

    // Store encrypted tokens in database
    const encryptedAccessToken = encrypt(access_token);
    const encryptedRefreshToken = refresh_token ? encrypt(refresh_token) : null;
    const tokenExpiry = new Date(Date.now() + expires_in * 1000);

    await prisma.socialMediaAccount.upsert({
      where: {
        userId_platform_accountId: {
          userId: user.id,
          platform: 'TWITTER',
          accountId: twitterUser.id,
        },
      },
      update: {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiry,
        isActive: true,
      },
      create: {
        userId: user.id,
        platform: 'TWITTER',
        accountName: twitterUser.username,
        accountId: twitterUser.id,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiry,
        isActive: true,
      },
    });

    // Redirect back to social media page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/portal/social-media?success=twitter_connected`
    );
  } catch (error) {
    console.error("Twitter OAuth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/portal/social-media?error=callback_failed`
    );
  }
}
