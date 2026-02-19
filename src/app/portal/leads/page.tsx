"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  budget: string | null;
  timeline: string | null;
  nextAction: string | null;
  leadScore: number | null;
  createdAt: string;
}

export default function LeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any || { name: "Demo User" };

  const [filterStage, setFilterStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leads from API
  useEffect(() => {
    if (status === "authenticated") {
      fetchLeads();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/portal/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-brand-bone flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-plum font-mono uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  // Mock BANT data - in a real app, this would come from the database
  const getBantData = (lead: Lead) => {
    return {
      budget: lead.budget || "Unconfirmed",
      authority: lead.contactTitle?.includes("VP") || lead.contactTitle?.includes("Director") || lead.contactTitle?.includes("CEO") || lead.contactTitle?.includes("CTO") ? "Decision Maker" : "Influencer",
      need: lead.status === "QUALIFIED" || lead.status === "MEETING_SCHEDULED" ? "High Priority" : "Medium Priority",
      timeline: lead.timeline || "TBD",
    };
  };

  // Removed mock leads array - now using real data from API
  const filteredLeads = leads.filter((lead) => {
    const matchesStage = filterStage === "all" || lead.status === filterStage;
    const matchesSearch =
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStageBadge = (status: string) => {
    const badges: Record<string, string> = {
      'NEW': "bg-blue-100 text-blue-700",
      'CONTACTED': "bg-purple-100 text-purple-700",
      'QUALIFIED': "bg-brand-gold text-brand-plum",
      'MEETING_SCHEDULED': "bg-green-100 text-green-700",
      'PROPOSAL_SENT': "bg-yellow-100 text-yellow-700",
      'NEGOTIATION': "bg-orange-100 text-orange-700",
      'CLOSED_WON': "bg-green-600 text-white",
      'CLOSED_LOST': "bg-red-100 text-red-700",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-gray-600";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
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
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
                <option value="PROPOSAL_SENT">Proposal Sent</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="CLOSED_WON">Closed Won</option>
                <option value="CLOSED_LOST">Closed Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-6">
          {filteredLeads.map((lead) => {
            const bant = getBantData(lead);
            return (
              <div
                key={lead.id}
                className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-display font-bold text-brand-plum">{lead.companyName}</h3>
                      <span className={`px-3 py-1 text-xs font-mono uppercase font-bold ${getStageBadge(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-brand-charcoal/80 mb-1">
                      <strong>{lead.contactName}</strong>
                      {lead.contactTitle && ` • ${lead.contactTitle}`}
                    </div>
                    <div className="text-sm text-brand-charcoal/60">
                      {lead.contactEmail && `${lead.contactEmail}`}
                      {lead.contactEmail && lead.contactPhone && ' • '}
                      {lead.contactPhone && `${lead.contactPhone}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-display font-bold ${getScoreColor(lead.leadScore)}`}>
                      {lead.leadScore || 'N/A'}
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
                    <div className="font-bold text-brand-plum">{bant.budget}</div>
                    {lead.budget && <div className="text-sm text-brand-charcoal/80">{lead.budget}</div>}
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Authority
                    </div>
                    <div className="font-bold text-brand-plum">{bant.authority}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Need
                    </div>
                    <div className="font-bold text-brand-plum">{bant.need}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Timeline
                    </div>
                    <div className="font-bold text-brand-plum">{bant.timeline}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t-2 border-brand-plum/10">
                  <div>
                    <span className="text-sm text-brand-charcoal/60">Next Action: </span>
                    <span className="font-bold text-brand-plum">{lead.nextAction || 'Follow up'}</span>
                    <span className="text-sm text-brand-charcoal/60 ml-4">Created: {formatDate(lead.createdAt)}</span>
                  </div>
                  <Link
                    href={`/portal/leads/${lead.id}`}
                    className="px-6 py-2 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
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
