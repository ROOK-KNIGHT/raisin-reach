"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewLeadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any || { name: "Admin User" };

  const [formData, setFormData] = useState({
    // Client Selection
    clientId: "",
    
    // Company Info
    company: "",
    industry: "",
    companySize: "",
    revenue: "",
    location: "",
    website: "",
    founded: "",
    
    // Contact Info
    contactName: "",
    title: "",
    email: "",
    phone: "",
    linkedIn: "",
    
    // BANT Qualification
    budget: "",
    budgetStatus: "unconfirmed",
    budgetNotes: "",
    authority: "unknown",
    authorityNotes: "",
    need: "low",
    needNotes: "",
    timeline: "",
    timelineNotes: "",
    
    // Lead Details
    stage: "contacted",
    source: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log("Form submitted:", formData);
    alert("Lead created successfully!");
    router.push("/admin/leads");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-brand-bone">
      {/* Header */}
      <header className="bg-brand-plum text-brand-bone border-b-4 border-brand-gold">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold uppercase">Admin Dashboard</h1>
              <p className="mt-1 text-brand-bone/80 font-sans">
                Welcome back, <strong>{user.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                ADMIN
              </span>
              <Link
                href="/api/auth/signout"
                className="px-4 py-2 border-2 border-brand-bone text-brand-bone hover:bg-brand-bone hover:text-brand-plum transition-all font-mono text-sm uppercase tracking-widest"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b-2 border-brand-plum/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <Link
              href="/admin"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/clients"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Clients
            </Link>
            <Link
              href="/admin/leads"
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
            >
              All Leads
            </Link>
            <Link
              href="/admin/calls"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              All Calls
            </Link>
            <Link
              href="/admin/reports"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Reports
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/admin/leads" className="text-brand-plum hover:underline font-mono uppercase text-sm">
            ← Back to All Leads
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Add New Lead</h2>
          <p className="text-brand-charcoal/60">Enter lead information and BANT qualification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Selection */}
          <div className="bg-white border-2 border-brand-plum p-8">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Client Assignment</h3>
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Assign to Client *
              </label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="">Select a client...</option>
                <option value="1">John Smith (Acme Corp)</option>
                <option value="2">Sarah Johnson (Tech Solutions Inc)</option>
                <option value="3">Mike Davis (Global Manufacturing)</option>
              </select>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white border-2 border-brand-plum p-8">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Company Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
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
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Company Size
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                >
                  <option value="">Select size...</option>
                  <option value="1-50">1-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Revenue Range
                </label>
                <input
                  type="text"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleChange}
                  placeholder="e.g., $10M - $50M"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="www.example.com"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border-2 border-brand-plum p-8">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
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
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., VP of Operations"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* BANT Qualification */}
          <div className="bg-white border-2 border-brand-plum p-8">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">BANT Qualification</h3>
            
            {/* Budget */}
            <div className="mb-6 p-4 bg-brand-bone border-l-4 border-brand-gold">
              <h4 className="font-bold text-brand-plum mb-4">Budget</h4>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                    Budget Amount
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
                    Budget Status
                  </label>
                  <select
                    name="budgetStatus"
                    value={formData.budgetStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  >
                    <option value="unconfirmed">Unconfirmed</option>
                    <option value="estimated">Estimated</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Budget Notes
                </label>
                <textarea
                  name="budgetNotes"
                  value={formData.budgetNotes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Authority */}
            <div className="mb-6 p-4 bg-brand-bone border-l-4 border-brand-gold">
              <h4 className="font-bold text-brand-plum mb-4">Authority</h4>
              <div className="mb-4">
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Authority Level
                </label>
                <select
                  name="authority"
                  value={formData.authority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                >
                  <option value="unknown">Unknown</option>
                  <option value="influencer">Influencer</option>
                  <option value="decision_maker">Decision Maker</option>
                  <option value="champion">Champion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Authority Notes
                </label>
                <textarea
                  name="authorityNotes"
                  value={formData.authorityNotes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Need */}
            <div className="mb-6 p-4 bg-brand-bone border-l-4 border-brand-gold">
              <h4 className="font-bold text-brand-plum mb-4">Need</h4>
              <div className="mb-4">
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Need Priority
                </label>
                <select
                  name="need"
                  value={formData.need}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Need Description
                </label>
                <textarea
                  name="needNotes"
                  value={formData.needNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe their pain points and needs..."
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
              <h4 className="font-bold text-brand-plum mb-4">Timeline</h4>
              <div className="mb-4">
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Timeline
                </label>
                <input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="e.g., Q1 2026, Immediate, TBD"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Timeline Notes
                </label>
                <textarea
                  name="timelineNotes"
                  value={formData.timelineNotes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-white border-2 border-brand-plum p-8">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Lead Details</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Lead Stage
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                >
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="nurture">Nurture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  Lead Source
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="e.g., Cold Call, Referral, LinkedIn"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any additional information about this lead..."
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-8 py-4 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all"
            >
              Create Lead
            </button>
            <Link
              href="/admin/leads"
              className="px-8 py-4 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all inline-block"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
