import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Calculate profit metrics from database
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        projects: true,
        overheadExpenses: true,
        laborRates: true,
        taxSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate total revenue from all projects
    const totalRevenue = user.projects.reduce((sum: number, project: any) => sum + project.revenue, 0);

    // Calculate total direct costs from all projects
    const totalDirectCosts = user.projects.reduce((sum: number, project: any) => sum + project.directCosts, 0);

    // Calculate total labor costs
    const totalLaborHours = user.projects.reduce((sum: number, project: any) => sum + project.laborHours, 0);
    const averageLaborRate = user.laborRates.length > 0
      ? user.laborRates.reduce((sum: number, rate: any) => sum + rate.hourlyRate, 0) / user.laborRates.length
      : 0;
    const totalLaborCosts = totalLaborHours * averageLaborRate;

    // Calculate total overhead (annualized)
    const totalOverhead = user.overheadExpenses.reduce((sum: number, expense: any) => {
      let multiplier = 12; // Default to monthly
      if (expense.frequency === "WEEKLY") multiplier = 52;
      else if (expense.frequency === "QUARTERLY") multiplier = 4;
      else if (expense.frequency === "YEARLY") multiplier = 1;
      return sum + (expense.amount * multiplier);
    }, 0);

    // Calculate gross profit
    const grossProfit = totalRevenue - totalDirectCosts - totalLaborCosts;

    // Calculate net profit (before tax)
    const netProfit = grossProfit - totalOverhead;

    // Calculate profit margin
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Calculate taxes
    const taxSettings = user.taxSettings || {
      federalTaxRate: 22.0,
      stateTaxRate: 0.0,
      localTaxRate: 0.0,
    };

    const totalTaxRate = (taxSettings.federalTaxRate + taxSettings.stateTaxRate + taxSettings.localTaxRate) / 100;
    const totalTaxes = netProfit > 0 ? netProfit * totalTaxRate : 0;

    // Calculate profit after tax
    const profitAfterTax = netProfit - totalTaxes;

    return NextResponse.json(
      {
        totalRevenue,
        totalDirectCosts,
        totalLaborCosts,
        totalOverhead,
        grossProfit,
        netProfit,
        profitMargin,
        totalTaxes,
        profitAfterTax,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calculating profit metrics:", error);
    return NextResponse.json(
      { error: "Failed to calculate profit metrics" },
      { status: 500 }
    );
  }
}
