"use client";

interface ProfitChartProps {
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  title: string;
}

export default function ProfitChart({ data, title }: ProfitChartProps) {
  const total = data.reduce((sum, item) => sum + Math.abs(item.value), 0);

  return (
    <div className="bg-white border-4 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
      <h3 className="text-xl font-display font-bold text-brand-plum uppercase mb-6">
        {title}
      </h3>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (Math.abs(item.value) / total) * 100 : 0;
          const color = item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;
          
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 border-2 border-brand-plum"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-sm uppercase tracking-wider text-brand-charcoal">
                    {item.label}
                  </span>
                </div>
                <span className="font-bold text-brand-plum">
                  ${item.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="w-full h-3 bg-brand-bone border-2 border-brand-plum/20">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-xs font-mono text-brand-charcoal/60">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
