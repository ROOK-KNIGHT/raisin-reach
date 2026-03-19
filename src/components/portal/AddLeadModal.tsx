"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLeadModal({ isOpen, onClose, onSuccess }: AddLeadModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    industry: "",
    source: "",
    budget: "",
    authority: "",
    need: "",
    timeline: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/portal/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactName: formData.contactName,
          contactTitle: formData.contactTitle || null,
          contactEmail: formData.contactEmail || null,
          contactPhone: formData.contactPhone || null,
          status: "NEW",
          source: formData.source || null,
          industry: formData.industry || null,
          budget: formData.budget || null,
          authority: formData.authority || null,
          need: formData.need || null,
          timeline: formData.timeline || null,
          notes: formData.notes || null,
        }),
      });

      if (res.ok) {
        toast.success("Lead created successfully!");
        setFormData({
          companyName: "",
          contactName: "",
          contactTitle: "",
          contactEmail: "",
          contactPhone: "",
          industry: "",
          source: "",
          budget: "",
          authority: "",
          need: "",
          timeline: "",
          notes: "",
        });
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create lead");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-brand-plum max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-brand-plum text-brand-bone p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display font-bold uppercase">Add New Lead</h2>
            <button
              onClick={onClose}
              className="text-brand-bone hover:text-brand-gold transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Company Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="contactTitle"
                  value={formData.contactTitle}
                  onChange={handleChange}
                  placeholder="e.g., VP of Operations"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div>
            <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Lead Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Source
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="e.g., Referral, LinkedIn"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Budget
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., $50,000+"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Authority
                </label>
                <input
                  type="text"
                  name="authority"
                  value={formData.authority}
                  onChange={handleChange}
                  placeholder="e.g., Decision Maker"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Timeline
                </label>
                <input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="e.g., Q1 2026"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Need & Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Need / Pain Points
              </label>
              <textarea
                name="need"
                value={formData.need}
                onChange={handleChange}
                rows={3}
                placeholder="Describe their needs and pain points..."
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional information..."
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t-2 border-brand-plum/20">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Lead"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
