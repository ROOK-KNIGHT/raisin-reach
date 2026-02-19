import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  calculateGrossProfit,
  calculateNetProfit,
  calculateTaxLiability,
  calculateProfitMargin,
  calculateBreakEven,
  calculateQuarterlyTaxEstimate,
  annualizeAmount,
  calculateTotalDirectCosts,
} from "@/lib/profitCalculations";
import type { Frequency } from "@/lib/profitCalculations";

// POST - Calculate profit metrics
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      revenue,
      laborCost,
      materialCost,
      otherCosts,
      overheadExpenses, // Array of { amount, frequency }
      federalTaxRate,
      stateTaxRate,
      selfEmploymentTax,
    } = body;

    // Validation
    if (revenue === undefined) {
      return NextResponse.json(
        { error: "Revenue is required" },
        { status: 400 }
      );
    }

    // Calculate total direct costs
    const totalDirectCosts = calculateTotalDirectCosts(
      laborCost || 0,
      materialCost || 0,
      otherCosts || 0
    );

    // Calculate gross profit
    const grossProfit = calculateGrossProfit(revenue, totalDirectCosts);

    // Calculate total annual overhead
    let totalAnnualOverhead = 0;
    if (overheadExpenses && Array.isArray(overheadExpenses)) {
      totalAnnualOverhead = overheadExpenses.reduce((sum, expense) => {
        const annualized = annualizeAmount(
          expense.amount,
          expense.frequency as Frequency
        );
        return sum + annualized;
      }, 0);
    }

    // Calculate tax liability
    const taxableIncome = grossProfit - totalAnnualOverhead;
    const taxLiability = calculateTaxLiability(
      taxableIncome,
      federalTaxRate || 22.0,
      stateTaxRate || 0.0,
      selfEmploymentTax || 15.3
    );

    // Calculate net profit
    const netProfit = calculateNetProfit(
      grossProfit,
      totalAnnualOverhead,
      taxLiability
    );

    // Calculate profit margins
    const grossProfitMargin = calculateProfitMargin(grossProfit, revenue);
    const netProfitMargin = calculateProfitMargin(netProfit, revenue);

    // Calculate quarterly tax estimate
    const quarterlyTaxEstimate = calculateQuarterlyTaxEstimate(
      taxableIncome,
      federalTaxRate || 22.0,
      stateTaxRate || 0.0,
      selfEmploymentTax || 15.3
    );

    // Calculate break-even (simplified)
    const breakEvenRevenue = totalAnnualOverhead + totalDirectCosts;

    return NextResponse.json(
      {
        calculations: {
          revenue,
          totalDirectCosts,
          grossProfit,
          totalAnnualOverhead,
          taxableIncome,
          taxLiability,
          netProfit,
          grossProfitMargin,
          netProfitMargin,
          quarterlyTaxEstimate,
          breakEvenRevenue,
        },
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
