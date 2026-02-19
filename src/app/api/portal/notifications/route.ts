import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get or create notification preferences
    let preferences = await prisma.notificationPreferences.findUnique({
      where: { userId: user.id },
    });

    if (!preferences) {
      // Create default preferences
      preferences = await prisma.notificationPreferences.create({
        data: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error("Get notification preferences error:", error);
    return NextResponse.json(
      { error: "Failed to get notification preferences" },
      { status: 500 }
    );
  }
}

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
    const { emailOnNewLead, emailOnCallComplete, emailWeeklySummary, smsOnHotLead } = body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Upsert notification preferences
    const preferences = await prisma.notificationPreferences.upsert({
      where: { userId: user.id },
      update: {
        emailOnNewLead: emailOnNewLead ?? true,
        emailOnCallComplete: emailOnCallComplete ?? false,
        emailWeeklySummary: emailWeeklySummary ?? true,
        smsOnHotLead: smsOnHotLead ?? false,
      },
      create: {
        userId: user.id,
        emailOnNewLead: emailOnNewLead ?? true,
        emailOnCallComplete: emailOnCallComplete ?? false,
        emailWeeklySummary: emailWeeklySummary ?? true,
        smsOnHotLead: smsOnHotLead ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error("Update notification preferences error:", error);
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}
