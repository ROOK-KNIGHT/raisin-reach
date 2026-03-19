"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: string;
  source: string | null;
  industry: string | null;
  budget: string | null;
  authority: string | null;
  need: string | null;
  timeline: string | null;
  notes: string | null;
  nextAction: string | null;
  nextActionDate: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    company: string | null;
  };
  callLogs: any[];
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  const [formData, setFormData] = useState({
    userId: "",
    companyName: "",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    status: "NEW",
    source: "",
    industry: "",
    budget: "",
    authority: "",
    need: "",
    timeline: "",
    notes: "",
    nextAction: "",
    nextActionDate: "",
  });
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    params.then((p) => {
      setLeadId(p.id);
      fetchLead(p.id);
    });
  }, []);

  const fetchLead = async (id: string) => {
    try {
      const [leadRes, clientsRes] = await Promise.all([
        fetch(`/api/admin/leads/${id}`),
        fetch("/api/admin/clients"),
      ]);

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData.clients || []);
      }

      if (leadRes.ok) {
        const data = await leadRes.json();
        setLead(data.lead);
        setFormData({
          userId: data.lead.userId || "",
          companyName: data.lead.companyName || "",
          contactName: data.lead.contactName || "",
          contactTitle: data.lead.contactTitle || "",
          contactEmail: data.lead.contactEmail || "",
          contactPhone: data.lead.contactPhone || "",
          status: data.lead.status || "NEW",
          source: data.lead.source || "",
          industry: data.lead.industry || "",
          budget: data.lead.budget || "",
          authority: data.lead.authority || "",
          need: data.lead.need || "",
          timeline: data.lead.timeline || "",
          notes: data.lead.notes || "",
          nextAction: data.lead.nextAction || "",
          nextActionDate: data.lead.nextActionDate ? data.lead.nextActionDate.split('T')[0] : "",
        });
      } else {
        toast.error("Lead not found");
        router.push("/admin/leads");
      }
    } catch (error) {
      console.error("Error fetching lead:", error);
      toast.error("Failed to load lead");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
        setIsEditing(false);
        toast.success("Lead updated successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update lead");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Lead deleted successfully!");
        router.push("/admin/leads");
      } else {
        toast.error("Failed to delete lead");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bone flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-plum font-mono uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <main className="min-h-screen bg-brand-bone">
      {/* Header */}
      <header className="bg-brand-plum text-brand-bone border-b-4 border-brand-gold">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold uppercase">Admin Dashboard</h1>
              <p className="mt-1 text-brand-bone/80 font-sans">
                Welcome back, <strong>{user?.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                {user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : user?.role || "ADMIN"}
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
            {user?.role === "SUPER_ADMIN" && (
              <Link
                href="/admin/team"
                className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
              >
                Team
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/admin/leads"
            className="text-brand-plum hover:text-brand-gold transition-colors font-mono text-sm uppercase tracking-widest mb-4 inline-block"
          >
            ← Back to All Leads
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">
                {lead.companyName}
              </h2>
              <p className="text-brand-charcoal/60">
                Lead for {lead.user.name || lead.user.email}
                {lead.user.company && ` (${lead.user.company})`}
              </p>
            </div>
            <div className="flex gap-4">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-brand-plum text-brand-gold font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum border-2 border-brand-plum transition-all"
                  >
                    Edit Lead
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-3 border-2 border-red-500 text-red-500 font-mono text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchLead(leadId);
                  }}
                  className="px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-brand-plum p-8 shadow-[4px_4px_0px_0px_var(--color-brand-plum)] mb-8">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">
                {isEditing ? "Edit Lead Information" : "Lead Information"}
              </h3>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Assigned Client */}
                  <div>
                    <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                      Assigned Client *
                    </label>
                    <select
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                    >
                      <option value="">Select a client...</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} - {client.company}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Company & Contact */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Company Name *
                      </label>
                      <input
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Contact Name *
                      </label>
                      <input
                        name="contactName"
                        type="text"
                        value={formData.contactName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Title
                      </label>
                      <input
                        name="contactTitle"
                        type="text"
                        value={formData.contactTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Phone
                      </label>
                      <input
                        name="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Status & Details */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
                        <option value="PROPOSAL_SENT">Proposal Sent</option>
                        <option value="NEGOTIATION">Negotiation</option>
                        <option value="WON">Won</option>
                        <option value="LOST">Lost</option>
                        <option value="NURTURE">Nurture</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Source
                      </label>
                      <input
                        name="source"
                        type="text"
                        value={formData.source}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Industry
                      </label>
                      <input
                        name="industry"
                        type="text"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* BANT Qualification */}
                  <div className="border-t-2 border-brand-plum/10 pt-6">
                    <h4 className="text-lg font-bold text-brand-plum mb-4 uppercase">BANT Qualification</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                          Budget
                        </label>
                        <input
                          name="budget"
                          type="text"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                          placeholder="e.g., $50K-$100K"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                          Authority
                        </label>
                        <input
                          name="authority"
                          type="text"
                          value={formData.authority}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                          placeholder="e.g., Decision Maker"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                          Timeline
                        </label>
                        <input
                          name="timeline"
                          type="text"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                          placeholder="e.g., Q1 2026"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Need
                      </label>
                      <textarea
                        name="need"
                        value={formData.need}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                        placeholder="Describe their needs..."
                      />
                    </div>
                  </div>

                  {/* Notes & Next Action */}
                  <div>
                    <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Next Action
                      </label>
                      <input
                        name="nextAction"
                        type="text"
                        value={formData.nextAction}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                        Next Action Date
                      </label>
                      <input
                        name="nextActionDate"
                        type="date"
                        value={formData.nextActionDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Display Mode */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Company</p>
                      <p className="text-lg font-bold text-brand-plum">{lead.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Contact</p>
                      <p className="text-lg font-bold text-brand-plum">{lead.contactName}</p>
                    </div>
                    {lead.contactTitle && (
                      <div>
                        <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Title</p>
                        <p className="text-brand-charcoal">{lead.contactTitle}</p>
                      </div>
                    )}
                    {lead.contactEmail && (
                      <div>
                        <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Email</p>
                        <p className="text-brand-charcoal">{lead.contactEmail}</p>
                      </div>
                    )}
                    {lead.contactPhone && (
                      <div>
                        <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Phone</p>
                        <p className="text-brand-charcoal">{lead.contactPhone}</p>
                      </div>
                    )}
                    {lead.industry && (
                      <div>
                        <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Industry</p>
                        <p className="text-brand-charcoal">{lead.industry}</p>
                      </div>
                    )}
                    {lead.source && (
                      <div>
                        <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Source</p>
                        <p className="text-brand-charcoal">{lead.source}</p>
                      </div>
                    )}
                  </div>

                  {(lead.budget || lead.authority || lead.need || lead.timeline) && (
                    <div className="border-t-2 border-brand-plum/10 pt-6">
                      <h4 className="text-lg font-bold text-brand-plum mb-4 uppercase">BANT Qualification</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        {lead.budget && (
                          <div>
                            <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Budget</p>
                            <p className="text-brand-charcoal">{lead.budget}</p>
                          </div>
                        )}
                        {lead.authority && (
                          <div>
                            <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Authority</p>
                            <p className="text-brand-charcoal">{lead.authority}</p>
                          </div>
                        )}
                        {lead.timeline && (
                          <div>
                            <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Timeline</p>
                            <p className="text-brand-charcoal">{lead.timeline}</p>
                          </div>
                        )}
                        {lead.need && (
                          <div className="md:col-span-2">
                            <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Need</p>
                            <p className="text-brand-charcoal">{lead.need}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {lead.notes && (
                    <div className="border-t-2 border-brand-plum/10 pt-6">
                      <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">Notes</p>
                      <p className="text-brand-charcoal whitespace-pre-wrap">{lead.notes}</p>
                    </div>
                  )}

                  {(lead.nextAction || lead.nextActionDate) && (
                    <div className="border-t-2 border-brand-plum/10 pt-6">
                      <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">Next Action</p>
                      <p className="text-brand-charcoal">
                        {lead.nextAction}
                        {lead.nextActionDate && ` - ${new Date(lead.nextActionDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Call History */}
            {lead.callLogs && lead.callLogs.length > 0 && (
              <div className="bg-white border-2 border-brand-plum p-8 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
                <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Call History</h3>
                <div className="space-y-4">
                  {lead.callLogs.map((call: any) => (
                    <div key={call.id} className="border-l-4 border-brand-gold pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-brand-plum">{call.callOutcome.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-brand-charcoal/60">
                            {new Date(call.callDate).toLocaleDateString()} • {call.callDuration ? `${Math.floor(call.callDuration / 60)}:${(call.callDuration % 60).toString().padStart(2, '0')}` : '0:00'}
                          </p>
                        </div>
                      </div>
                      {call.notes && <p className="text-sm text-brand-charcoal">{call.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)] mb-6">
              <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Status</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Current Status</p>
                  <span className="inline-block px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                    {lead.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Created</p>
                  <p className="text-brand-charcoal">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Last Updated</p>
                  <p className="text-brand-charcoal">{new Date(lead.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
              <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/calls/new?leadId=${lead.id}`}
                  className="block w-full px-4 py-3 bg-brand-plum text-brand-bone text-center font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum border-2 border-brand-plum transition-all"
                >
                  Log Call
                </Link>
                <button
                  onClick={() => setIsEditing(true)}
                  className="block w-full px-4 py-3 border-2 border-brand-plum text-brand-plum text-center font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                >
                  Edit Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
