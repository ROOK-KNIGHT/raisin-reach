"use client";

import { useROICalculator } from "@/hooks/useROICalculator";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ROICalculatorProps {
  onRevenueUpdate?: (revenue: number) => void;
}

export default function ROICalculator({ onRevenueUpdate }: ROICalculatorProps) {
  const { inputs, setInput, results } = useROICalculator();

  useEffect(() => {
    if (onRevenueUpdate) {
      onRevenueUpdate(results.revenue);
    }
  }, [results.revenue, onRevenueUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: "leads" | "closeRate" | "dealValue") => {
    setInput(key, Number(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 border border-brutalist bg-white shadow-[8px_8px_0px_0px_var(--color-brand-plum)]">
      <h3 className="text-3xl font-display font-bold text-brand-plum mb-8 uppercase tracking-wide">
        Appointment ROI Calculator
      </h3>

      <div className="space-y-8 mb-12">
        {/* Monthly Lead Volume */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label htmlFor="leads" className="text-sm font-bold uppercase tracking-wider text-brand-charcoal/70">
              Monthly Leads (Dials)
            </label>
            <span className="font-mono text-xl text-brand-plum">{inputs.leads}</span>
          </div>
          <input
            id="leads"
            type="range"
            min="100"
            max="5000"
            step="100"
            value={inputs.leads}
            onChange={(e) => handleInputChange(e, "leads")}
            className="w-full h-2 bg-brand-plum/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
          />
        </div>

        {/* Close Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label htmlFor="closeRate" className="text-sm font-bold uppercase tracking-wider text-brand-charcoal/70">
              Deal Close Rate (%)
            </label>
            <span className="font-mono text-xl text-brand-plum">{inputs.closeRate}%</span>
          </div>
          <input
            id="closeRate"
            type="range"
            min="5"
            max="50"
            step="1"
            value={inputs.closeRate}
            onChange={(e) => handleInputChange(e, "closeRate")}
            className="w-full h-2 bg-brand-plum/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
          />
        </div>

        {/* Average Deal Value */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label htmlFor="dealValue" className="text-sm font-bold uppercase tracking-wider text-brand-charcoal/70">
              Avg. Contract Value ($)
            </label>
            <span className="font-mono text-xl text-brand-plum">${inputs.dealValue.toLocaleString()}</span>
          </div>
          <input
            id="dealValue"
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={inputs.dealValue}
            onChange={(e) => handleInputChange(e, "dealValue")}
            className="w-full h-2 bg-brand-plum/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
          />
        </div>
      </div>

      {/* The RaisinReach Multiplier Toggle */}
      <div className="flex items-center justify-between mb-8 p-4 bg-brand-bone/50 border border-brutalist">
        <span className="font-display font-bold text-brand-plum uppercase">
          Apply RaisinReach Method
        </span>
        <button
          onClick={() => setInput("isRaisinModel", !inputs.isRaisinModel)}
          className={clsx(
            "relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none",
            inputs.isRaisinModel ? "bg-brand-gold" : "bg-gray-300"
          )}
          aria-label="Toggle RaisinReach Model"
        >
          <motion.div
            className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
            animate={{ x: inputs.isRaisinModel ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {/* Results Display */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-brand-plum/5 border border-brutalist">
          <p className="text-xs uppercase font-bold text-brand-charcoal/60 mb-1">Appt. Rate</p>
          <p className="font-mono text-lg text-brand-plum">{results.apptRateDisplay}</p>
        </div>
        <div className="p-4 bg-brand-plum/5 border border-brutalist">
          <p className="text-xs uppercase font-bold text-brand-charcoal/60 mb-1">Appointments</p>
          <p className="font-mono text-lg text-brand-plum">{results.appointments}</p>
        </div>
      </div>

      <div className="text-center p-6 bg-brand-plum text-brand-bone">
        <p className="text-sm uppercase tracking-widest mb-2 text-brand-gold">Projected Monthly Revenue</p>
        <output 
          className="block text-4xl md:text-5xl font-mono font-bold text-brand-gold"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={results.revenue}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              ${results.revenue.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </output>
      </div>
    </div>
  );
}
