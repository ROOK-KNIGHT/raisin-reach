"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface AddLaborRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLaborRateModal({ isOpen, onClose, onSuccess }: AddLaborRateModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    hourlyRate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
      toast.error("Please enter a valid hourly rate");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/portal/profit-estimator/labor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Labor rate added successfully!");
        setFormData({
          role: "",
          hourlyRate: "",
        });
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to add labor rate");
      }
    } catch (error) {
      console.error("Add labor rate error:", error);
      toast.error("An error occurred while adding the labor rate");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({
        role: "",
        hourlyRate: "",
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
          <h2 className="text-2xl font-display font-bold uppercase">Add Labor Rate</h2>
          <p className="text-brand-bone/80 mt-1">Define hourly rates for different roles</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Project Manager, Developer, Designer"
              className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              required
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
              Hourly Rate <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/60 font-bold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-charcoal/60 text-sm">
                /hour
              </span>
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
              {saving ? "Adding..." : "Add Labor Rate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
