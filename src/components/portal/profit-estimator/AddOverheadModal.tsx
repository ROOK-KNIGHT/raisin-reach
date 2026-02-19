"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface AddOverheadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddOverheadModal({ isOpen, onClose, onSuccess }: AddOverheadModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    frequency: "MONTHLY" as "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category.trim()) {
      toast.error("Please enter a category");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/portal/profit-estimator/overhead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Overhead expense added successfully!");
        setFormData({
          category: "",
          description: "",
          amount: "",
          frequency: "MONTHLY",
        });
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to add overhead expense");
      }
    } catch (error) {
      console.error("Add overhead expense error:", error);
      toast.error("An error occurred while adding the expense");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({
        category: "",
        description: "",
        amount: "",
        frequency: "MONTHLY",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-brand-plum max-w-lg w-full shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
        {/* Header */}
        <div className="bg-brand-plum text-brand-bone p-6 border-b-4 border-brand-gold">
          <h2 className="text-2xl font-display font-bold uppercase">Add Overhead Expense</h2>
          <p className="text-brand-bone/80 mt-1">Track your recurring business expenses</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Rent, Utilities, Insurance, Marketing"
              className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Office Rent, Internet Service"
              className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              required
            />
          </div>

          {/* Amount & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/60 font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                required
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t-2 border-brand-plum/10">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
