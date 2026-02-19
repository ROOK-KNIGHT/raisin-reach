"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProjectModal({ isOpen, onClose, onSuccess }: AddProjectModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PLANNED" as "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
    startDate: "",
    endDate: "",
    projectedRevenue: "",
    actualRevenue: "",
    laborCost: "",
    materialCost: "",
    otherCosts: "",
    laborHours: "",
    numberOfWorkers: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please enter start and end dates");
      return;
    }

    if (!formData.projectedRevenue || parseFloat(formData.projectedRevenue) < 0) {
      toast.error("Please enter a valid projected revenue");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/portal/profit-estimator/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Project added successfully!");
        setFormData({
          name: "",
          description: "",
          status: "PLANNED",
          startDate: "",
          endDate: "",
          projectedRevenue: "",
          actualRevenue: "",
          laborCost: "",
          materialCost: "",
          otherCosts: "",
          laborHours: "",
          numberOfWorkers: "",
        });
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to add project");
      }
    } catch (error) {
      console.error("Add project error:", error);
      toast.error("An error occurred while adding the project");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({
        name: "",
        description: "",
        status: "PLANNED",
        startDate: "",
        endDate: "",
        projectedRevenue: "",
        actualRevenue: "",
        laborCost: "",
        materialCost: "",
        otherCosts: "",
        laborHours: "",
        numberOfWorkers: "",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white border-4 border-brand-plum max-w-3xl w-full my-8 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
        {/* Header */}
        <div className="bg-brand-plum text-brand-bone p-6 border-b-4 border-brand-gold">
          <h2 className="text-2xl font-display font-bold uppercase">Add New Project</h2>
          <p className="text-brand-bone/80 mt-1">Track project revenue and costs</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Website Redesign, Mobile App Development"
              className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the project..."
              rows={2}
              className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans resize-none"
            />
          </div>

          {/* Status & Dates */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                required
              >
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                required
              />
            </div>
          </div>

          {/* Revenue */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Projected Revenue <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/60 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.projectedRevenue}
                  onChange={(e) => setFormData({ ...formData, projectedRevenue: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Actual Revenue
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/60 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.actualRevenue}
                  onChange={(e) => setFormData({ ...formData, actualRevenue: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Costs */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Labor Cost
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/60 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.laborCost}
                  onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Material Cost
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/60 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.materialCost}
                  onChange={(e) => setFormData({ ...formData, materialCost: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Other Costs
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/60 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.otherCosts}
                  onChange={(e) => setFormData({ ...formData, otherCosts: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Labor Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Labor Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.laborHours}
                onChange={(e) => setFormData({ ...formData, laborHours: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
            </div>

            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Number of Workers
              </label>
              <input
                type="number"
                min="0"
                value={formData.numberOfWorkers}
                onChange={(e) => setFormData({ ...formData, numberOfWorkers: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
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
              {saving ? "Adding..." : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
