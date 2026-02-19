"use client";

interface SummaryCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export default function SummaryCard({
  title,
  value,
  change,
  icon,
  trend = "neutral",
}: SummaryCardProps) {
  const getTrendColor = () => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-brand-charcoal/60";
  };

  const getTrendIcon = () => {
    if (trend === "up") {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    }
    if (trend === "down") {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-4 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
            {title}
          </p>
          <p className="text-3xl font-display font-bold text-brand-plum mb-2">
            {value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-bold ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{change > 0 ? "+" : ""}{change.toFixed(1)}%</span>
              <span className="text-brand-charcoal/40 font-normal ml-1">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-brand-gold opacity-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
