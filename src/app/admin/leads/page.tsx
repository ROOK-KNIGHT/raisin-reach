"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

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
  timeline: string | null;
  nextAction: string | null;
  nextActionDate: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    company: string | null;
  };
}

export default function AdminLeadsPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClient, setFilterClient] = useState("all");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leads and clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsRes, clientsRes] = await Promise.all([
          fetch("/api/admin/leads"),
          fetch("/api/admin/clients"),
        ]);

        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData.leads || []);
        }

        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setClients(clientsData.clients || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    const matchesClient = filterClient === "all" || lead.user.id === filterClient;
    const matchesSearch =
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.user.name && lead.user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesClient && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      'NEW': 'bg-blue-100 text-blue-700',
      'CONTACTED': 'bg-purple-100 text-purple-700',
      'QUALIFIED': 'bg-brand-gold text-brand-plum',
      'MEETING_SCHEDULED': 'bg-green-100 text-green-700',
      'PROPOSAL_SENT': 'bg-yellow-100 text-yellow-700',
      'NEGOTIATION': 'bg-orange-100 text-orange-700',
      'WON': 'bg-green-500 text-white',
      'LOST': 'bg-red-100 text-red-700',
      'NURTURE': 'bg-indigo-100 text-indigo-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
              href="/admin/prospects"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Prospects
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">All Leads</h2>
            <p className="text-brand-charcoal/60">Manage leads across all clients</p>
          </div>
          <Link
            href="/admin/leads/new"
            className="px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all"
          >
            + Add New Lead
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-brand-plum p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by company, contact, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="all">All Statuses</option>
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

            {/* Client Filter */}
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Filter by Client
              </label>
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="all">All Clients</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-display font-bold text-brand-plum">{lead.companyName}</h3>
                    <span className={`px-3 py-1 text-xs font-mono uppercase font-bold ${getStatusBadge(lead.status)}`}>
                      {formatStatus(lead.status)}
                    </span>
                  </div>
                  <div className="text-brand-charcoal/80 mb-1">
                    <strong>{lead.contactName}</strong>
                    {lead.contactTitle && ` • ${lead.contactTitle}`}
                  </div>
                  <div className="text-sm text-brand-charcoal/60 mb-2">
                    {lead.contactEmail && `${lead.contactEmail}`}
                    {lead.contactPhone && ` • ${lead.contactPhone}`}
                  </div>
                  <div className="text-sm text-brand-charcoal/60">
                    <span className="font-bold">Client:</span> {lead.user.name || lead.user.email}
                    {lead.user.company && ` (${lead.user.company})`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="px-4 py-2 bg-brand-plum text-brand-bone font-mono text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all"
                  >
                    View/Edit
                  </Link>
                </div>
              </div>

              {/* Lead Info */}
              <div className="grid md:grid-cols-4 gap-4 p-4 bg-brand-bone border-l-4 border-brand-gold">
                {lead.budget && (
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Budget
                    </div>
                    <div className="font-bold text-brand-plum">{lead.budget}</div>
                  </div>
                )}
                {lead.timeline && (
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Timeline
                    </div>
                    <div className="font-bold text-brand-plum">{lead.timeline}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Created
                  </div>
                  <div className="font-bold text-brand-charcoal">{formatDate(lead.createdAt)}</div>
                </div>
                {lead.nextAction && (
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Next Action
                    </div>
                    <div className="font-bold text-brand-charcoal">{lead.nextAction}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredLeads.length === 0 && !loading && (
          <div className="bg-white border-2 border-brand-plum p-12 text-center">
            <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest mb-4">
              {leads.length === 0 ? "No leads yet" : "No leads found matching your filters"}
            </p>
            {leads.length === 0 && (
              <Link
                href="/admin/leads/new"
                className="inline-block px-6 py-3 bg-brand-plum text-brand-gold font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum border-2 border-brand-plum transition-all"
              >
                Add Your First Lead
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
