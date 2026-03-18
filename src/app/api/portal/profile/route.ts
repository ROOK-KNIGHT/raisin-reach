import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, company, phone, timezone } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email is being changed and if it's already taken
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email,
        company,
        // Note: phone and timezone fields need to be added to the User model
        // For now, we'll only update the fields that exist
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        image: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Prevent admin users from deleting their accounts through this endpoint
    if (["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json(
        { error: "Admin accounts cannot be deleted through this endpoint" },
        { status: 403 }
      );
    }

    // Delete all user data
    await prisma.$transaction([
      // Delete user's leads
      prisma.lead.deleteMany({
        where: { userId: user.id },
      }),
      // Delete user's call logs
      prisma.callLog.deleteMany({
        where: { userId: user.id },
      }),
      // Delete user's focus areas
      prisma.focusArea.deleteMany({
        where: { userId: user.id },
      }),
      // Delete user's notification preferences
      prisma.notificationPreferences.deleteMany({
        where: { userId: user.id },
      }),
      // Finally, delete the user
      prisma.user.delete({
        where: { id: user.id },
      }),
    ]);

    return NextResponse.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
