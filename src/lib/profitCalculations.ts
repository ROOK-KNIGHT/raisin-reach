/**
 * Profit Estimator Calculation Utilities
 * 
 * This module provides calculation functions for the Profit Estimator tool.
 */

export type Frequency = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
export type TimePeriod = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

/**
 * Calculate gross profit (revenue minus direct costs)
 */
export function calculateGrossProfit(revenue: number, directCosts: number): number {
  return revenue - directCosts;
}

/**
 * Calculate net profit (gross profit minus overhead and taxes)
 */
export function calculateNetProfit(
  grossProfit: number,
  overhead: number,
  taxes: number
): number {
  return grossProfit - overhead - taxes;
}

/**
 * Calculate total tax liability based on income and tax rates
 */
export function calculateTaxLiability(
  income: number,
  federalRate: number,
  stateRate: number,
  selfEmploymentRate: number
): number {
  const federal = income * (federalRate / 100);
  const state = income * (stateRate / 100);
  const selfEmployment = income * (selfEmploymentRate / 100);
  return federal + state + selfEmployment;
}

/**
 * Calculate profit margin as a percentage
 */
export function calculateProfitMargin(profit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (profit / revenue) * 100;
}

/**
 * Calculate break-even point in units
 */
export function calculateBreakEven(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number
): number {
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  if (contributionMargin === 0) return 0;
  return fixedCosts / contributionMargin;
}

/**
 * Convert an amount to annual based on frequency
 */
export function annualizeAmount(amount: number, frequency: Frequency): number {
  const multipliers: Record<Frequency, number> = {
    WEEKLY: 52,
    MONTHLY: 12,
    QUARTERLY: 4,
    YEARLY: 1,
  };
  return amount * multipliers[frequency];
}

/**
 * Convert an amount from one frequency to another
 */
export function convertAmount(
  amount: number,
  fromFrequency: Frequency,
  toFrequency: TimePeriod
): number {
  // First convert to annual
  const annual = annualizeAmount(amount, fromFrequency);
  
  // Then convert to target frequency
  const divisors: Record<TimePeriod, number> = {
    WEEKLY: 52,
    MONTHLY: 12,
    QUARTERLY: 4,
    YEARLY: 1,
  };
  
  return annual / divisors[toFrequency];
}

/**
 * Convert an annual amount to monthly
 */
export function monthlyAmount(annualAmount: number): number {
  return annualAmount / 12;
}

/**
 * Calculate total direct costs for a project
 */
export function calculateTotalDirectCosts(
  laborCost: number,
  materialCost: number,
  otherCosts: number
): number {
  return laborCost + materialCost + otherCosts;
}

/**
 * Calculate quarterly tax estimate
 */
export function calculateQuarterlyTaxEstimate(
  annualIncome: number,
  federalRate: number,
  stateRate: number,
  selfEmploymentRate: number
): number {
  const annualTax = calculateTaxLiability(
    annualIncome,
    federalRate,
    stateRate,
    selfEmploymentRate
  );
  return annualTax / 4;
}

/**
 * Calculate ROI (Return on Investment) percentage
 */
export function calculateROI(profit: number, investment: number): number {
  if (investment === 0) return 0;
  return (profit / investment) * 100;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
