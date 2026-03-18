import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

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

    // TODO: Send invitation email with link containing token
    // For now, we'll just return the invite
    // In production, you'd send an email with a link like:
    // https://raisinreach.com/auth/accept-invite?token=${token}

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
