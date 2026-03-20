"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface Prospect {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  industry: string | null;
  location: string | null;
  source: string;
  readinessScore: number;
  status: "NEW" | "RESEARCHING" | "QUALIFIED" | "DISQUALIFIED" | "CONVERTED";
  assignedClient: string | null;
  tags: string[];
  createdAt: string;
}

// Mock data for demonstration
const mockProspects: Prospect[] = [
  {
    id: "1",
    companyName: "ABC Plumbing Services",
    contactName: "John Smith",
    contactTitle: "Owner",
    contactEmail: "john@abcplumbing.com",
    contactPhone: "(555) 123-4567",
    industry: "Plumbing",
    location: "Sacramento, CA",
    source: "American Home Shield",
    readinessScore: 85,
    status: "QUALIFIED",
    assignedClient: null,
    tags: ["Licensed", "5+ Years", "High Rating"],
    createdAt: "2026-03-18T10:00:00Z",
  },
  {
    id: "2",
    companyName: "Elite HVAC Solutions",
    contactName: "Sarah Johnson",
    contactTitle: "CEO",
    contactEmail: "sarah@elitehvac.com",
    contactPhone: "(555) 234-5678",
    industry: "HVAC",
    location: "Los Angeles, CA",
    source: "Angi",
    readinessScore: 92,
    status: "NEW",
    assignedClient: null,
    tags: ["Licensed", "BBB A+", "10+ Years"],
    createdAt: "2026-03-19T14:30:00Z",
  },
  {
    id: "3",
    companyName: "Quick Fix Electrical",
    contactName: "Mike Davis",
    contactTitle: "Master Electrician",
    contactEmail: "mike@quickfixelectric.com",
    contactPhone: "(555) 345-6789",
    industry: "Electrical",
    location: "San Diego, CA",
    source: "Yelp",
    readinessScore: 78,
    status: "RESEARCHING",
    assignedClient: null,
    tags: ["Licensed", "Emergency Service"],
    createdAt: "2026-03-17T09:15:00Z",
  },
  {
    id: "4",
    companyName: "Pro Roofing Co",
    contactName: "David Martinez",
    contactTitle: "Operations Manager",
    contactEmail: "david@proroofing.com",
    contactPhone: "(555) 456-7890",
    industry: "Roofing",
    location: "San Francisco, CA",
    source: "BBB",
    readinessScore: 65,
    status: "NEW",
    assignedClient: null,
    tags: ["Licensed", "Insured"],
    createdAt: "2026-03-16T11:45:00Z",
  },
  {
    id: "5",
    companyName: "Sunshine Landscaping",
    contactName: "Maria Garcia",
    contactTitle: "Owner",
    contactEmail: "maria@sunshinelandscape.com",
    contactPhone: "(555) 567-8901",
    industry: "Landscaping",
    location: "Oakland, CA",
    source: "Thumbtack",
    readinessScore: 45,
    status: "DISQUALIFIED",
    assignedClient: null,
    tags: ["No License Info"],
    createdAt: "2026-03-15T16:20:00Z",
  },
];

export default function ProspectsPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [prospects] = useState<Prospect[]>(mockProspects);

  const filteredProspects = prospects.filter((prospect) => {
    const matchesStatus = filterStatus === "all" || prospect.status === filterStatus;
    const matchesSource = filterSource === "all" || prospect.source === filterSource;
    const matchesSearch =
      prospect.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prospect.industry && prospect.industry.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSource && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      'NEW': 'bg-blue-100 text-blue-700',
      'RESEARCHING': 'bg-purple-100 text-purple-700',
      'QUALIFIED': 'bg-green-100 text-green-700',
      'DISQUALIFIED': 'bg-red-100 text-red-700',
      'CONVERTED': 'bg-brand-gold text-brand-plum',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
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

  const stats = {
    totalProspects: prospects.length,
    qualified: prospects.filter(p => p.status === "QUALIFIED").length,
    avgScore: Math.round(prospects.reduce((sum, p) => sum + p.readinessScore, 0) / prospects.length),
    unassigned: prospects.filter(p => !p.assignedClient).length,
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
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
            >
              Prospects
            </Link>
            <Link
              href="/admin/leads"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
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
            <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Prospects</h2>
            <p className="text-brand-charcoal/60">Pre-screen and assign potential leads to clients</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
              Upload CSV
            </button>
            <button className="px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all">
              + Add Prospect
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-plum mb-2">{stats.totalProspects}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Total Prospects</div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-green-600 mb-2">{stats.qualified}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Qualified</div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-gold mb-2">{stats.avgScore}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Avg Score</div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-plum mb-2">{stats.unassigned}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Unassigned</div>
          </div>
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
                placeholder="Search by company, contact, or industry..."
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
                <option value="RESEARCHING">Researching</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="DISQUALIFIED">Disqualified</option>
                <option value="CONVERTED">Converted</option>
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Filter by Source
              </label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="all">All Sources</option>
                <option value="American Home Shield">American Home Shield</option>
                <option value="Angi">Angi</option>
                <option value="Yelp">Yelp</option>
                <option value="BBB">BBB</option>
                <option value="Thumbtack">Thumbtack</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prospects List */}
        <div className="space-y-4">
          {filteredProspects.map((prospect) => (
            <div
              key={prospect.id}
              className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-display font-bold text-brand-plum">{prospect.companyName}</h3>
                    <span className={`px-3 py-1 text-xs font-mono uppercase font-bold ${getStatusBadge(prospect.status)}`}>
                      {prospect.status}
                    </span>
                    <div className={`px-3 py-1 ${getScoreBg(prospect.readinessScore)} rounded-full`}>
                      <span className={`text-sm font-mono font-bold ${getScoreColor(prospect.readinessScore)}`}>
                        Score: {prospect.readinessScore}
                      </span>
                    </div>
                  </div>
                  <div className="text-brand-charcoal/80 mb-1">
                    <strong>{prospect.contactName}</strong>
                    {prospect.contactTitle && ` • ${prospect.contactTitle}`}
                  </div>
                  <div className="text-sm text-brand-charcoal/60 mb-2">
                    {prospect.contactEmail && `${prospect.contactEmail}`}
                    {prospect.contactPhone && ` • ${prospect.contactPhone}`}
                  </div>
                  <div className="flex gap-2 mb-2">
                    {prospect.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-brand-bone text-brand-plum text-xs font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/prospects/${prospect.id}`}
                    className="px-4 py-2 bg-brand-plum text-brand-bone font-mono text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all"
                  >
                    Review
                  </Link>
                </div>
              </div>

              {/* Prospect Info */}
              <div className="grid md:grid-cols-5 gap-4 p-4 bg-brand-bone border-l-4 border-brand-gold">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Industry
                  </div>
                  <div className="font-bold text-brand-plum">{prospect.industry || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Location
                  </div>
                  <div className="font-bold text-brand-charcoal">{prospect.location || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Source
                  </div>
                  <div className="font-bold text-brand-charcoal">{prospect.source}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Added
                  </div>
                  <div className="font-bold text-brand-charcoal">{formatDate(prospect.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Assigned To
                  </div>
                  <div className="font-bold text-brand-charcoal">{prospect.assignedClient || "Unassigned"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProspects.length === 0 && (
          <div className="bg-white border-2 border-brand-plum p-12 text-center">
            <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest mb-4">
              No prospects found matching your filters
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
