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

    // Only admin roles can access admin stats
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get total clients (users with CLIENT role)
    const totalClients = await prisma.user.count({
      where: {
        role: "CLIENT",
      },
    });

    // Get active clients
    const activeClients = await prisma.user.count({
      where: {
        role: "CLIENT",
        membershipStatus: "ACTIVE",
      },
    });

    // Get total leads across all clients
    const totalLeads = await prisma.lead.count();

    // Get calls this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const callsThisWeek = await prisma.callLog.count({
      where: {
        callDate: {
          gte: oneWeekAgo,
        },
      },
    });

    return NextResponse.json({
      totalClients,
      activeClients,
      totalLeads,
      callsThisWeek,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
