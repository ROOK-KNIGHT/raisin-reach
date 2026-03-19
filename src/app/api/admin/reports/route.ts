import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can view reports
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "this-month";
    const clientId = searchParams.get("clientId");

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "this-week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "this-month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "last-month":
        startDate.setMonth(now.getMonth() - 2);
        break;
      case "this-quarter":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "this-year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Build where clause
    const whereClause: any = {
      callDate: {
        gte: startDate,
        lte: now,
      },
    };

    if (clientId && clientId !== "all") {
      whereClause.userId = clientId;
    }

    // Fetch all calls in period
    const calls = await prisma.callLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    // Calculate overview metrics
    const totalCalls = calls.length;
    const connectedCalls = calls.filter(
      (c) => c.callOutcome === "CONNECTED" || c.callOutcome === "SCHEDULED_MEETING"
    ).length;
    const voicemails = calls.filter((c) => c.callOutcome === "VOICEMAIL").length;
    const noAnswers = calls.filter((c) => c.callOutcome === "NO_ANSWER").length;
    const meetingsScheduled = calls.filter(
      (c) => c.callOutcome === "SCHEDULED_MEETING"
    ).length;

    // Fetch leads created in period
    const leadsWhere: any = {
      createdAt: {
        gte: startDate,
        lte: now,
      },
    };

    if (clientId && clientId !== "all") {
      leadsWhere.userId = clientId;
    }

    const leads = await prisma.lead.findMany({
      where: leadsWhere,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    const leadsGenerated = leads.length;
    const conversionRate =
      totalCalls > 0 ? ((leadsGenerated / totalCalls) * 100).toFixed(1) : "0.0";

    // Calculate client performance
    const clientMap = new Map();

    calls.forEach((call) => {
      const clientKey = call.userId;
      if (!clientMap.has(clientKey)) {
        clientMap.set(clientKey, {
          user: call.user,
          calls: 0,
          leads: 0,
          meetings: 0,
        });
      }
      const client = clientMap.get(clientKey);
      client.calls++;
      if (call.callOutcome === "SCHEDULED_MEETING") {
        client.meetings++;
      }
    });

    leads.forEach((lead) => {
      const clientKey = lead.userId;
      if (clientMap.has(clientKey)) {
        clientMap.get(clientKey).leads++;
      }
    });

    const clientPerformance = Array.from(clientMap.values()).map((client) => ({
      clientId: client.user.id,
      clientName: client.user.name || client.user.email,
      clientCompany: client.user.company,
      calls: client.calls,
      leads: client.leads,
      meetings: client.meetings,
      conversionRate:
        client.calls > 0
          ? ((client.leads / client.calls) * 100).toFixed(1) + "%"
          : "0.0%",
    }));

    // Sort by conversion rate
    clientPerformance.sort((a, b) => {
      const rateA = parseFloat(a.conversionRate);
      const rateB = parseFloat(b.conversionRate);
      return rateB - rateA;
    });

    // Calculate top performers
    const topPerformers = [];

    if (clientPerformance.length > 0) {
      // Most leads
      const mostLeads = [...clientPerformance].sort((a, b) => b.leads - a.leads)[0];
      if (mostLeads && mostLeads.leads > 0) {
        topPerformers.push({
          name: mostLeads.clientName,
          metric: "Most Leads",
          value: `${mostLeads.leads} leads`,
        });
      }

      // Highest conversion
      const highestConversion = clientPerformance[0];
      if (highestConversion && parseFloat(highestConversion.conversionRate) > 0) {
        topPerformers.push({
          name: highestConversion.clientName,
          metric: "Highest Conversion",
          value: highestConversion.conversionRate,
        });
      }

      // Most calls
      const mostCalls = [...clientPerformance].sort((a, b) => b.calls - a.calls)[0];
      if (mostCalls && mostCalls.calls > 0) {
        topPerformers.push({
          name: mostCalls.clientName,
          metric: "Most Calls",
          value: `${mostCalls.calls} calls`,
        });
      }
    }

    const reportData = {
      overview: {
        totalCalls,
        connectedCalls,
        voicemails,
        noAnswers,
        leadsGenerated,
        meetingsScheduled,
        conversionRate: conversionRate + "%",
      },
      clientPerformance,
      topPerformers,
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
    };

    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
