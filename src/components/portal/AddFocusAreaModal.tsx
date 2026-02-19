"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface AddFocusAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddFocusAreaModal({ isOpen, onClose, onSuccess }: AddFocusAreaModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetIndustry: "",
    targetCompanySize: "",
    targetLocation: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the focus area");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/portal/focus-areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Focus area created successfully!");
        setFormData({
          title: "",
          description: "",
          targetIndustry: "",
          targetCompanySize: "",
          targetLocation: "",
          priority: "MEDIUM",
        });
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to create focus area");
      }
    } catch (error) {
      console.error("Create focus area error:", error);
      toast.error("An error occurred while creating the focus area");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({
        title: "",
        description: "",
        targetIndustry: "",
        targetCompanySize: "",
        targetLocation: "",
        priority: "MEDIUM",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-brand-plum max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
        {/* Header */}
        <div className="bg-brand-plum text-brand-bone p-6 border-b-4 border-brand-gold">
          <h2 className="text-2xl font-display font-bold uppercase">Add New Focus Area</h2>
          <p className="text-brand-bone/80 mt-1">Define targeting criteria for your ideal prospects</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Enterprise SaaS Companies"
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
              placeholder="Describe this focus area and what makes it valuable..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans resize-none"
            />
          </div>

          {/* Target Industry */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
              Target Industry
            </label>
            <input
              type="text"
              value={formData.targetIndustry}
              onChange={(e) => setFormData({ ...formData, targetIndustry: e.target.value })}
              placeholder="e.g., Technology, Healthcare, Finance"
              className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
            />
          </div>

          {/* Company Size & Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Company Size
              </label>
              <select
                value={formData.targetCompanySize}
                onChange={(e) => setFormData({ ...formData, targetCompanySize: e.target.value })}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="">Select size...</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Geographic Region
              </label>
              <input
                type="text"
                value={formData.targetLocation}
                onChange={(e) => setFormData({ ...formData, targetLocation: e.target.value })}
                placeholder="e.g., United States, California"
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
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
              {saving ? "Creating..." : "Create Focus Area"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
