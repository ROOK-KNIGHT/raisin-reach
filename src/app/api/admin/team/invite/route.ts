import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only SUPER_ADMIN can invite team members
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["ADMIN", "MANAGER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN or MANAGER" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Check if there's already a pending invite
    const existingInvite = await prisma.adminInvite.findFirst({
      where: {
        email,
        acceptedAt: null,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "An active invitation already exists for this email" },
        { status: 400 }
      );
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString("hex");

    // Create invite (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.adminInvite.create({
      data: {
        email,
        role,
        token,
        invitedById: user.id,
        expiresAt,
      },
    });

    // Send invitation email
    const inviteUrl = `${process.env.NEXTAUTH_URL || 'https://raisinreach.com'}/auth/accept-invite?token=${token}`;
    
    try {
      await resend.emails.send({
        from: 'RaisinReach Admin <onboarding@raisinreach.com>',
        to: email,
        subject: 'You\'ve been invited to join the RaisinReach Admin Team',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4A1D4A; color: #F4E5D3; padding: 30px; text-align: center; }
                .content { background: #fff; padding: 30px; border: 2px solid #4A1D4A; }
                .button { display: inline-block; padding: 15px 30px; background: #D4AF37; color: #4A1D4A; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                .role-badge { display: inline-block; padding: 5px 15px; background: #D4AF37; color: #4A1D4A; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0; font-size: 32px;">RAISIN REACH</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Admin Team Invitation</p>
                </div>
                <div class="content">
                  <h2 style="color: #4A1D4A;">You've Been Invited!</h2>
                  <p>You've been invited to join the RaisinReach admin team with the role of:</p>
                  <p style="text-align: center;">
                    <span class="role-badge">${role}</span>
                  </p>
                  <p>Click the button below to accept your invitation and set up your account:</p>
                  <p style="text-align: center;">
                    <a href="${inviteUrl}" class="button">Accept Invitation</a>
                  </p>
                  <p style="font-size: 14px; color: #666;">
                    Or copy and paste this link into your browser:<br>
                    <a href="${inviteUrl}" style="color: #4A1D4A; word-break: break-all;">${inviteUrl}</a>
                  </p>
                  <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    <strong>Note:</strong> This invitation will expire in 7 days.
                  </p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} RaisinReach. All rights reserved.</p>
                  <p>If you didn't expect this invitation, you can safely ignore this email.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Error sending invitation email:", emailError);
      // Don't fail the request if email fails - invitation is still created
    }

    return NextResponse.json(
      {
        message: "Invitation created successfully",
        invite: {
          id: invite.id,
          email: invite.email,
          role: invite.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}
