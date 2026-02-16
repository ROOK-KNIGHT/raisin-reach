import { useState, useMemo } from "react";

interface ROICalculatorInputs {
  leads: number;
  closeRate: number;
  dealValue: number;
  isRaisinModel: boolean;
}

export const useROICalculator = () => {
  const [inputs, setInputs] = useState<ROICalculatorInputs>({
    leads: 100,
    closeRate: 20, // 20% close rate on appointments
    dealValue: 5000,
    isRaisinModel: false,
  });

  const results = useMemo(() => {
    const industryApptRate = 0.025; // 2.5%
    const raisinApptRate = 0.125; // 12.5%

    const apptRate = inputs.isRaisinModel ? raisinApptRate : industryApptRate;
    const appointments = Math.round(inputs.leads * apptRate);
    const closedDeals = Math.round(appointments * (inputs.closeRate / 100));
    const revenue = closedDeals * inputs.dealValue;

    return {
      appointments,
      closedDeals,
      revenue,
      apptRateDisplay: (apptRate * 100).toFixed(1) + "%",
    };
  }, [inputs]);

  const setInput = (key: keyof ROICalculatorInputs, value: number | boolean) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return { inputs, setInput, results };
};
