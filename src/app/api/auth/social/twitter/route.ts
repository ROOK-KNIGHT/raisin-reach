import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Twitter OAuth 2.0 Authorization
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = process.env.TWITTER_CLIENT_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/social/twitter/callback`;
    
    if (!clientId) {
      return NextResponse.json({ error: "Twitter API credentials not configured" }, { status: 500 });
    }

    // Generate state for CSRF protection
    const state = Buffer.from(JSON.stringify({
      userEmail: session.user.email,
      timestamp: Date.now(),
    })).toString('base64');

    // Twitter OAuth 2.0 authorization URL
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', 'tweet.read tweet.write users.read offline.access');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge', 'challenge');
    authUrl.searchParams.append('code_challenge_method', 'plain');

    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error("Twitter OAuth error:", error);
    return NextResponse.json({ error: "Failed to initiate OAuth" }, { status: 500 });
  }
}
