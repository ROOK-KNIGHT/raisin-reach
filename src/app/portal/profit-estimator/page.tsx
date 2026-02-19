"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import SummaryCard from "@/components/portal/profit-estimator/SummaryCard";
import ProfitChart from "@/components/portal/profit-estimator/ProfitChart";
import AddProjectModal from "@/components/portal/profit-estimator/AddProjectModal";
import AddOverheadModal from "@/components/portal/profit-estimator/AddOverheadModal";
import AddLaborRateModal from "@/components/portal/profit-estimator/AddLaborRateModal";

type TabType = "dashboard" | "projects" | "overhead" | "labor" | "tax";

interface Project {
  id: string;
  name: string;
  revenue: number;
  directCosts: number;
  laborHours: number;
  status: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

interface OverheadExpense {
  id: string;
  category: string;
  description: string;
  amount: number;
  frequency: string;
  createdAt: string;
}

interface LaborRate {
  id: string;
  role: string;
  hourlyRate: number;
  createdAt: string;
}

interface TaxSettings {
  id: string;
  federalTaxRate: number;
  stateTaxRate: number;
  localTaxRate: number;
  updatedAt: string;
}

interface Calculations {
  totalRevenue: number;
  totalDirectCosts: number;
  totalLaborCosts: number;
  totalOverhead: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  totalTaxes: number;
  profitAfterTax: number;
}

export default function ProfitEstimatorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY">("MONTHLY");
  
  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [overhead, setOverhead] = useState<OverheadExpense[]>([]);
  const [laborRates, setLaborRates] = useState<LaborRate[]>([]);
  const [taxSettings, setTaxSettings] = useState<TaxSettings | null>(null);
  const [calculations, setCalculations] = useState<Calculations | null>(null);
  
  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showOverheadModal, setShowOverheadModal] = useState(false);
  const [showLaborModal, setShowLaborModal] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchAllData();
    }
  }, [status, router]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProjects(),
        fetchOverhead(),
        fetchLaborRates(),
        fetchTaxSettings(),
        fetchCalculations(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load profit estimator data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    const res = await fetch("/api/portal/profit-estimator/projects");
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
  };

  const fetchOverhead = async () => {
    const res = await fetch("/api/portal/profit-estimator/overhead");
    if (res.ok) {
      const data = await res.json();
      setOverhead(data);
    }
  };

  const fetchLaborRates = async () => {
    const res = await fetch("/api/portal/profit-estimator/labor");
    if (res.ok) {
      const data = await res.json();
      setLaborRates(data);
    }
  };

  const fetchTaxSettings = async () => {
    const res = await fetch("/api/portal/profit-estimator/tax-settings");
    if (res.ok) {
      const data = await res.json();
      setTaxSettings(data);
    }
  };

  const fetchCalculations = async () => {
    const res = await fetch("/api/portal/profit-estimator/calculations");
    if (res.ok) {
      const data = await res.json();
      setCalculations(data);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`/api/portal/profit-estimator/projects?id=${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        toast.success("Project deleted successfully");
        fetchProjects();
        fetchCalculations();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      toast.error("Error deleting project");
    }
  };

  const handleDeleteOverhead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      const res = await fetch(`/api/portal/profit-estimator/overhead?id=${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        toast.success("Expense deleted successfully");
        fetchOverhead();
        fetchCalculations();
      } else {
        toast.error("Failed to delete expense");
      }
    } catch (error) {
      toast.error("Error deleting expense");
    }
  };

  const handleDeleteLaborRate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this labor rate?")) return;
    
    try {
      const res = await fetch(`/api/portal/profit-estimator/labor?id=${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        toast.success("Labor rate deleted successfully");
        fetchLaborRates();
        fetchCalculations();
      } else {
        toast.error("Failed to delete labor rate");
      }
    } catch (error) {
      toast.error("Error deleting labor rate");
    }
  };

  const handleUpdateTaxSettings = async () => {
    if (!taxSettings) return;
    
    const federal = prompt("Enter Federal Tax Rate (%):", taxSettings.federalTaxRate.toString());
    const state = prompt("Enter State Tax Rate (%):", taxSettings.stateTaxRate.toString());
    const local = prompt("Enter Local Tax Rate (%):", taxSettings.localTaxRate.toString());
    
    if (federal === null || state === null || local === null) return;
    
    try {
      const res = await fetch("/api/portal/profit-estimator/tax-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          federalTaxRate: parseFloat(federal),
          stateTaxRate: parseFloat(state),
          localTaxRate: parseFloat(local),
        }),
      });
      
      if (res.ok) {
        toast.success("Tax settings updated successfully");
        fetchTaxSettings();
        fetchCalculations();
      } else {
        toast.error("Failed to update tax settings");
      }
    } catch (error) {
      toast.error("Error updating tax settings");
    }
  };

  const convertToTimePeriod = (annualAmount: number) => {
    const divisors = {
      WEEKLY: 52,
      MONTHLY: 12,
      QUARTERLY: 4,
      YEARLY: 1,
    };
    return annualAmount / divisors[timePeriod];
  };

  const getTimePeriodLabel = () => {
    const labels = {
      WEEKLY: "Weekly",
      MONTHLY: "Monthly",
      QUARTERLY: "Quarterly",
      YEARLY: "Yearly",
    };
    return labels[timePeriod];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-brand-bone flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-plum font-mono uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  const user = session?.user as any || { name: "Demo User" };

  return (
    <main className="min-h-screen bg-brand-bone">
      {/* Header */}
      <header className="bg-brand-plum text-brand-bone border-b-4 border-brand-gold">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold uppercase">Profit Estimator</h1>
              <p className="mt-1 text-brand-bone/80 font-sans">
                Track projects, expenses, and profitability
              </p>
            </div>
            <Link
              href="/portal"
              className="px-4 py-2 border-2 border-brand-bone text-brand-bone hover:bg-brand-bone hover:text-brand-plum transition-all font-mono text-sm uppercase tracking-widest"
            >
              Back to Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b-2 border-brand-plum/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-4 border-b-4 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === "dashboard"
                  ? "border-brand-plum text-brand-plum"
                  : "border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-4 border-b-4 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === "projects"
                  ? "border-brand-plum text-brand-plum"
                  : "border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("overhead")}
              className={`px-4 py-4 border-b-4 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === "overhead"
                  ? "border-brand-plum text-brand-plum"
                  : "border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30"
              }`}
            >
              Overhead
            </button>
            <button
              onClick={() => setActiveTab("labor")}
              className={`px-4 py-4 border-b-4 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === "labor"
                  ? "border-brand-plum text-brand-plum"
                  : "border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30"
              }`}
            >
              Labor Rates
            </button>
            <button
              onClick={() => setActiveTab("tax")}
              className={`px-4 py-4 border-b-4 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === "tax"
                  ? "border-brand-plum text-brand-plum"
                  : "border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30"
              }`}
            >
              Tax Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Time Period Selector */}
            <div className="mb-6 flex items-center justify-end gap-4">
              <label className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                View By:
              </label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as any)}
                className="px-4 py-2 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest focus:outline-none focus:border-brand-gold"
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            {!calculations ? (
              <div className="bg-white border-2 border-brand-plum p-12 text-center">
                <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest mb-4">
                  No data available yet. Add projects, overhead expenses, and labor rates to see your profit calculations.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="px-6 py-3 bg-brand-plum text-brand-bone font-bold uppercase tracking-widest hover:bg-brand-plum/90 transition-all"
                  >
                    Add Project
                  </button>
                  <button
                    onClick={() => setActiveTab("overhead")}
                    className="px-6 py-3 border-2 border-brand-plum text-brand-plum font-bold uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                  >
                    Add Overhead
                  </button>
                </div>
              </div>
            ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <SummaryCard
                title={`${getTimePeriodLabel()} Revenue`}
                value={formatCurrency(convertToTimePeriod(calculations.totalRevenue))}
                trend={calculations.totalRevenue > 0 ? "up" : "neutral"}
              />
              <SummaryCard
                title={`${getTimePeriodLabel()} Gross Profit`}
                value={formatCurrency(convertToTimePeriod(calculations.grossProfit))}
                trend={calculations.grossProfit > 0 ? "up" : "down"}
              />
              <SummaryCard
                title={`${getTimePeriodLabel()} Net Profit`}
                value={formatCurrency(convertToTimePeriod(calculations.netProfit))}
                trend={calculations.netProfit > 0 ? "up" : "down"}
              />
              <SummaryCard
                title="Profit Margin"
                value={`${calculations.profitMargin.toFixed(1)}%`}
                trend={calculations.profitMargin > 20 ? "up" : calculations.profitMargin > 10 ? "neutral" : "down"}
              />
            </div>

            {/* Profit Breakdown Chart */}
            <ProfitChart
              title={`${getTimePeriodLabel()} Profit Breakdown`}
              data={[
                { label: "Revenue", value: convertToTimePeriod(calculations.totalRevenue), color: "#6B2D5C" },
                { label: "Direct Costs", value: convertToTimePeriod(calculations.totalDirectCosts), color: "#D4A574" },
                { label: "Labor Costs", value: convertToTimePeriod(calculations.totalLaborCosts), color: "#2D2D2D" },
                { label: "Overhead", value: convertToTimePeriod(calculations.totalOverhead), color: "#8B4F7D" },
                { label: "Taxes", value: convertToTimePeriod(calculations.totalTaxes), color: "#A67C52" },
              ]}
            />

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-brand-plum p-6">
                <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Active Projects
                </div>
                <div className="text-4xl font-display font-bold text-brand-plum">
                  {projects.filter(p => p.status === "ACTIVE").length}
                </div>
              </div>
              <div className="bg-white border-2 border-brand-plum p-6">
                <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  {getTimePeriodLabel()} Overhead
                </div>
                <div className="text-4xl font-display font-bold text-brand-plum">
                  {formatCurrency(convertToTimePeriod(calculations.totalOverhead))}
                </div>
              </div>
              <div className="bg-white border-2 border-brand-plum p-6">
                <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  {getTimePeriodLabel()} After-Tax Profit
                </div>
                <div className="text-4xl font-display font-bold text-brand-gold">
                  {formatCurrency(convertToTimePeriod(calculations.profitAfterTax))}
                </div>
              </div>
            </div>
          </div>
            )}
          </>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-brand-plum uppercase">
                Projects
              </h2>
              <button
                onClick={() => setShowProjectModal(true)}
                className="px-6 py-3 bg-brand-plum text-brand-bone font-bold uppercase tracking-widest hover:bg-brand-plum/90 transition-all border-4 border-brand-plum shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
              >
                + Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white border-2 border-brand-plum p-12 text-center">
                <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest">
                  No projects yet. Add your first project to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border-4 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-display font-bold text-brand-plum">
                          {project.name}
                        </h3>
                        <p className="text-sm text-brand-charcoal/60 mt-1">
                          {formatDate(project.startDate)}
                          {project.endDate && ` - ${formatDate(project.endDate)}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-4 py-2 font-mono text-sm uppercase tracking-widest ${
                            project.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : project.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {project.status}
                        </span>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                          Revenue
                        </div>
                        <div className="text-lg font-bold text-brand-plum">
                          {formatCurrency(project.revenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                          Direct Costs
                        </div>
                        <div className="text-lg font-bold text-brand-charcoal">
                          {formatCurrency(project.directCosts)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                          Labor Hours
                        </div>
                        <div className="text-lg font-bold text-brand-charcoal">
                          {project.laborHours}h
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                          Profit
                        </div>
                        <div className="text-lg font-bold text-brand-gold">
                          {formatCurrency(project.revenue - project.directCosts)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Overhead Tab */}
        {activeTab === "overhead" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-brand-plum uppercase">
                Overhead Expenses
              </h2>
              <button
                onClick={() => setShowOverheadModal(true)}
                className="px-6 py-3 bg-brand-plum text-brand-bone font-bold uppercase tracking-widest hover:bg-brand-plum/90 transition-all border-4 border-brand-plum shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
              >
                + Add Expense
              </button>
            </div>

            {overhead.length === 0 ? (
              <div className="bg-white border-2 border-brand-plum p-12 text-center">
                <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest">
                  No overhead expenses yet. Add your first expense to track costs.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {overhead.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white border-4 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-display font-bold text-brand-plum">
                            {expense.category}
                          </h3>
                          <span className="px-3 py-1 bg-brand-bone text-brand-charcoal font-mono text-xs uppercase">
                            {expense.frequency}
                          </span>
                        </div>
                        <p className="text-brand-charcoal/80">{expense.description}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-display font-bold text-brand-plum">
                            {formatCurrency(expense.amount)}
                          </div>
                          <div className="text-xs text-brand-charcoal/60">
                            per {expense.frequency.toLowerCase()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteOverhead(expense.id)}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Labor Rates Tab */}
        {activeTab === "labor" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-brand-plum uppercase">
                Labor Rates
              </h2>
              <button
                onClick={() => setShowLaborModal(true)}
                className="px-6 py-3 bg-brand-plum text-brand-bone font-bold uppercase tracking-widest hover:bg-brand-plum/90 transition-all border-4 border-brand-plum shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
              >
                + Add Labor Rate
              </button>
            </div>

            {laborRates.length === 0 ? (
              <div className="bg-white border-2 border-brand-plum p-12 text-center">
                <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest">
                  No labor rates yet. Add roles and hourly rates to calculate labor costs.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {laborRates.map((rate) => (
                  <div
                    key={rate.id}
                    className="bg-white border-4 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-display font-bold text-brand-plum mb-2">
                          {rate.role}
                        </h3>
                        <div className="text-3xl font-display font-bold text-brand-gold">
                          {formatCurrency(rate.hourlyRate)}/hr
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLaborRate(rate.id)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tax Settings Tab */}
        {activeTab === "tax" && (
          <>
            {!taxSettings ? (
              <div className="bg-white border-2 border-brand-plum p-12 text-center">
                <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest">
                  Loading tax settings...
                </p>
              </div>
            ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-brand-plum uppercase">
                Tax Settings
              </h2>
              <button
                onClick={handleUpdateTaxSettings}
                className="px-6 py-3 bg-brand-plum text-brand-bone font-bold uppercase tracking-widest hover:bg-brand-plum/90 transition-all border-4 border-brand-plum shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
              >
                Update Rates
              </button>
            </div>

            <div className="bg-white border-4 border-brand-plum p-8 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Federal Tax Rate
                    </div>
                    <div className="text-4xl font-display font-bold text-brand-plum">
                      {taxSettings.federalTaxRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      State Tax Rate
                    </div>
                    <div className="text-4xl font-display font-bold text-brand-plum">
                      {taxSettings.stateTaxRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Local Tax Rate
                    </div>
                    <div className="text-4xl font-display font-bold text-brand-plum">
                      {taxSettings.localTaxRate}%
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-brand-plum/20">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                      Combined Tax Rate
                    </div>
                    <div className="text-3xl font-display font-bold text-brand-gold">
                      {(taxSettings.federalTaxRate + taxSettings.stateTaxRate + taxSettings.localTaxRate).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="text-xs text-brand-charcoal/60 mt-4">
                  Last updated: {formatDate(taxSettings.updatedAt)}
                </div>
              </div>
            </div>

            <div className="bg-brand-bone border-2 border-brand-plum/20 p-6">
              <h3 className="font-bold text-brand-plum mb-2 uppercase tracking-wider">
                About Tax Calculations
              </h3>
              <p className="text-sm text-brand-charcoal/80">
                Tax rates are applied to your net profit to calculate estimated tax liability. 
                These are estimates only and should not be used for actual tax filing. 
                Consult with a tax professional for accurate tax planning.
              </p>
            </div>
          </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AddProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSuccess={() => {
          setShowProjectModal(false);
          fetchProjects();
          fetchCalculations();
        }}
      />

      <AddOverheadModal
        isOpen={showOverheadModal}
        onClose={() => setShowOverheadModal(false)}
        onSuccess={() => {
          setShowOverheadModal(false);
          fetchOverhead();
          fetchCalculations();
        }}
      />

      <AddLaborRateModal
        isOpen={showLaborModal}
        onClose={() => setShowLaborModal(false)}
        onSuccess={() => {
          setShowLaborModal(false);
          fetchLaborRates();
          fetchCalculations();
        }}
      />
    </main>
  );
}
