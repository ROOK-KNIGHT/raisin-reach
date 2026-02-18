"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AdminLeadsPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterClient, setFilterClient] = useState("all");

  // Mock leads data
  const leads = [
    {
      id: 1,
      company: "Global Manufacturing",
      contact: "Mike Davis",
      title: "VP of Operations",
      email: "mike.davis@globalmanuf.com",
      phone: "(555) 345-6789",
      client: "John Smith (Acme Corp)",
      clientId: 1,
      stage: "qualified",
      score: 95,
      budget: "$50,000+",
      timeline: "Q1 2026",
      lastContact: "1 day ago",
      nextAction: "Send proposal",
    },
    {
      id: 2,
      company: "Enterprise Solutions LLC",
      contact: "Lisa Chen",
      title: "CTO",
      email: "lisa.chen@enterprisesol.com",
      phone: "(555) 456-7890",
      client: "Sarah Johnson (Tech Solutions)",
      clientId: 2,
      stage: "qualified",
      score: 98,
      budget: "$75,000+",
      timeline: "Immediate",
      lastContact: "1 day ago",
      nextAction: "Schedule demo",
    },
    {
      id: 3,
      company: "Tech Innovations Inc",
      contact: "James Wilson",
      title: "Director of Sales",
      email: "james.w@techinnovations.com",
      phone: "(555) 789-0123",
      client: "John Smith (Acme Corp)",
      clientId: 1,
      stage: "contacted",
      score: 72,
      budget: "$30,000+",
      timeline: "Q2 2026",
      lastContact: "3 days ago",
      nextAction: "Follow-up call",
    },
    {
      id: 4,
      company: "Digital Marketing Co",
      contact: "Amanda Rodriguez",
      title: "Marketing Manager",
      email: "amanda@digitalmarketing.co",
      phone: "(555) 890-1234",
      client: "Mike Davis (Global Manufacturing)",
      clientId: 3,
      stage: "nurture",
      score: 45,
      budget: "$20,000+",
      timeline: "Q3 2026",
      lastContact: "1 week ago",
      nextAction: "Send resources",
    },
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesStage = filterStage === "all" || lead.stage === filterStage;
    const matchesClient = filterClient === "all" || lead.clientId.toString() === filterClient;
    const matchesSearch =
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesClient && matchesSearch;
  });

  const getStageBadge = (stage: string) => {
    const badges = {
      qualified: "bg-brand-gold text-brand-plum",
      contacted: "bg-blue-100 text-blue-700",
      nurture: "bg-purple-100 text-purple-700",
    };
    return badges[stage as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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

            {/* Stage Filter */}
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Filter by Stage
              </label>
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="all">All Stages</option>
                <option value="qualified">Qualified</option>
                <option value="contacted">Contacted</option>
                <option value="nurture">Nurture</option>
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
                <option value="1">John Smith (Acme Corp)</option>
                <option value="2">Sarah Johnson (Tech Solutions)</option>
                <option value="3">Mike Davis (Global Manufacturing)</option>
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
                    <h3 className="text-2xl font-display font-bold text-brand-plum">{lead.company}</h3>
                    <span className={`px-3 py-1 text-xs font-mono uppercase font-bold ${getStageBadge(lead.stage)}`}>
                      {lead.stage}
                    </span>
                  </div>
                  <div className="text-brand-charcoal/80 mb-1">
                    <strong>{lead.contact}</strong> • {lead.title}
                  </div>
                  <div className="text-sm text-brand-charcoal/60 mb-2">
                    {lead.email} • {lead.phone}
                  </div>
                  <div className="text-sm text-brand-charcoal/60">
                    <span className="font-bold">Client:</span> {lead.client}
                  </div>
                </div>
                <div className="text-center mr-6">
                  <div className={`text-4xl font-display font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60">
                    Score
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
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Budget
                  </div>
                  <div className="font-bold text-brand-plum">{lead.budget}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Timeline
                  </div>
                  <div className="font-bold text-brand-plum">{lead.timeline}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Last Contact
                  </div>
                  <div className="font-bold text-brand-charcoal">{lead.lastContact}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Next Action
                  </div>
                  <div className="font-bold text-brand-charcoal">{lead.nextAction}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="bg-white border-2 border-brand-plum p-12 text-center">
            <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest">
              No leads found matching your filters
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
