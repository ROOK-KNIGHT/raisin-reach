import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can view client details
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Fetch client with all related data
    const client = await prisma.user.findUnique({
      where: { id },
      include: {
        leads: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        callLogs: {
          orderBy: { callDate: "desc" },
          take: 10,
        },
        focusAreas: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
        adminNotes: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Calculate stats
    const totalLeads = client.leads.length;
    const qualifiedLeads = client.leads.filter(
      (l) => l.status === "QUALIFIED" || l.status === "MEETING_SCHEDULED"
    ).length;
    const totalCalls = client.callLogs.length;
    const connectedCalls = client.callLogs.filter(
      (c) => c.callOutcome === "CONNECTED" || c.callOutcome === "SCHEDULED_MEETING"
    ).length;
    const meetingsScheduled = client.callLogs.filter(
      (c) => c.callOutcome === "SCHEDULED_MEETING"
    ).length;
    const conversionRate =
      totalCalls > 0 ? ((totalLeads / totalCalls) * 100).toFixed(1) + "%" : "0.0%";

    // Calculate focus area stats
    const focusAreasWithStats = await Promise.all(
      client.focusAreas.map(async (area) => {
        const calls = await prisma.callLog.count({
          where: {
            userId: client.id,
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
        });

        const leads = await prisma.lead.count({
          where: {
            userId: client.id,
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
        });

        return {
          ...area,
          callsThisMonth: calls,
          leadsGenerated: leads,
        };
      })
    );

    const clientData = {
      ...client,
      stats: {
        totalLeads,
        qualifiedLeads,
        totalCalls,
        connectedCalls,
        meetingsScheduled,
        conversionRate,
      },
      focusAreas: focusAreasWithStats,
    };

    return NextResponse.json({ client: clientData });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}
