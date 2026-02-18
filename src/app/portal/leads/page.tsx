"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LeadsPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Demo User" };

  const [filterStage, setFilterStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock leads data
  const leads = [
    {
      id: 1,
      company: "Global Manufacturing",
      contact: "Mike Davis",
      title: "VP of Operations",
      email: "mike.davis@globalmanuf.com",
      phone: "(555) 345-6789",
      stage: "qualified",
      budget: "$50,000+",
      timeline: "Q1 2026",
      bant: {
        budget: "Confirmed",
        authority: "Decision Maker",
        need: "High Priority",
        timeline: "Q1 2026",
      },
      nextAction: "Send proposal",
      lastContact: "1 day ago",
      score: 95,
    },
    {
      id: 2,
      company: "Enterprise Solutions LLC",
      contact: "Lisa Chen",
      title: "CTO",
      email: "lisa.chen@enterprisesol.com",
      phone: "(555) 456-7890",
      stage: "qualified",
      budget: "$75,000+",
      timeline: "Immediate",
      bant: {
        budget: "Confirmed",
        authority: "Decision Maker",
        need: "Critical",
        timeline: "Immediate",
      },
      nextAction: "Schedule demo",
      lastContact: "1 day ago",
      score: 98,
    },
    {
      id: 3,
      company: "Tech Innovations Inc",
      contact: "James Wilson",
      title: "Director of Sales",
      email: "james.w@techinnovations.com",
      phone: "(555) 789-0123",
      stage: "contacted",
      budget: "$30,000+",
      timeline: "Q2 2026",
      bant: {
        budget: "Estimated",
        authority: "Influencer",
        need: "Medium Priority",
        timeline: "Q2 2026",
      },
      nextAction: "Follow-up call",
      lastContact: "3 days ago",
      score: 72,
    },
    {
      id: 4,
      company: "Digital Marketing Co",
      contact: "Amanda Rodriguez",
      title: "Marketing Manager",
      email: "amanda@digitalmarketing.co",
      phone: "(555) 890-1234",
      stage: "nurture",
      budget: "$20,000+",
      timeline: "Q3 2026",
      bant: {
        budget: "Unconfirmed",
        authority: "Influencer",
        need: "Low Priority",
        timeline: "Q3 2026",
      },
      nextAction: "Send resources",
      lastContact: "1 week ago",
      score: 45,
    },
    {
      id: 5,
      company: "Startup Ventures",
      contact: "Robert Williams",
      title: "CEO",
      email: "robert@startupventures.io",
      phone: "(555) 567-8901",
      stage: "contacted",
      budget: "$15,000+",
      timeline: "TBD",
      bant: {
        budget: "Limited",
        authority: "Decision Maker",
        need: "Exploring",
        timeline: "TBD",
      },
      nextAction: "Retry contact",
      lastContact: "2 days ago",
      score: 58,
    },
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesStage = filterStage === "all" || lead.stage === filterStage;
    const matchesSearch =
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
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
              <h1 className="text-3xl font-display font-bold uppercase">Client Portal</h1>
              <p className="mt-1 text-brand-bone/80 font-sans">
                Welcome back, <strong>{user.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                ACTIVE
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
              href="/portal"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/portal/call-logs"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Call Logs
            </Link>
            <Link
              href="/portal/leads"
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
            >
              Leads
            </Link>
            <Link
              href="/portal/focus-areas"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Focus Areas
            </Link>
            <Link
              href="/portal/settings"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Leads Pipeline</h2>
          <p className="text-brand-charcoal/60">Track and manage your qualified prospects</p>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-brand-plum p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by company or contact..."
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
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
            >
              {/* Header */}
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
                  <div className="text-sm text-brand-charcoal/60">
                    {lead.email} • {lead.phone}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-display font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60">
                    Lead Score
                  </div>
                </div>
              </div>

              {/* BANT Qualification */}
              <div className="grid md:grid-cols-4 gap-4 mb-4 p-4 bg-brand-bone border-l-4 border-brand-gold">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Budget
                  </div>
                  <div className="font-bold text-brand-plum">{lead.bant.budget}</div>
                  <div className="text-sm text-brand-charcoal/80">{lead.budget}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Authority
                  </div>
                  <div className="font-bold text-brand-plum">{lead.bant.authority}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Need
                  </div>
                  <div className="font-bold text-brand-plum">{lead.bant.need}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Timeline
                  </div>
                  <div className="font-bold text-brand-plum">{lead.bant.timeline}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t-2 border-brand-plum/10">
                <div>
                  <span className="text-sm text-brand-charcoal/60">Next Action: </span>
                  <span className="font-bold text-brand-plum">{lead.nextAction}</span>
                  <span className="text-sm text-brand-charcoal/60 ml-4">Last Contact: {lead.lastContact}</span>
                </div>
                <Link
                  href={`/portal/leads/${lead.id}`}
                  className="px-6 py-2 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all inline-block"
                >
                  View Details
                </Link>
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
