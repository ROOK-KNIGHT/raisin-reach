import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only SUPER_ADMIN can access team management
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all admin/manager users
    const members = await prisma.user.findMany({
      where: {
        role: {
          in: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        joinedAt: true,
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    // Fetch pending invites
    const invites = await prisma.adminInvite.findMany({
      where: {
        acceptedAt: null,
        expiresAt: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ members, invites });
  } catch (error) {
    console.error("Error fetching team data:", error);
    return NextResponse.json(
      { error: "Failed to fetch team data" },
      { status: 500 }
    );
  }
}
