"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

interface Prospect {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  linkedinUrl: string | null;
  industry: string | null;
  companySize: string | null;
  location: string | null;
  source: string;
  sourceDetail: string | null;
  readinessScore: number;
  status: "NEW" | "RESEARCHING" | "QUALIFIED" | "DISQUALIFIED" | "CONVERTED";
  assignedClient: string | null;
  tags: string[];
  notes: string | null;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
}

// Mock data
const mockProspect: Prospect = {
  id: "1",
  companyName: "ABC Plumbing Services",
  contactName: "John Smith",
  contactTitle: "Owner",
  contactEmail: "john@abcplumbing.com",
  contactPhone: "(555) 123-4567",
  website: "https://abcplumbing.com",
  linkedinUrl: "https://linkedin.com/company/abc-plumbing",
  industry: "Plumbing",
  companySize: "10-50 employees",
  location: "Sacramento, CA",
  source: "American Home Shield",
  sourceDetail: "Contractor directory - verified provider",
  readinessScore: 85,
  status: "QUALIFIED",
  assignedClient: null,
  tags: ["Licensed", "5+ Years", "High Rating", "Emergency Service"],
  notes: "Strong online presence. BBB A+ rating. Specializes in residential plumbing.",
  createdAt: "2026-03-18T10:00:00Z",
};

const mockClients: Client[] = [
  { id: "1", name: "Raisin Reach", company: "Raisin Reach", email: "admin@raisinreach.com" },
  { id: "2", name: "John Doe", company: "Doe Enterprises", email: "john@doe.com" },
  { id: "3", name: "Jane Smith", company: "Smith Corp", email: "jane@smith.com" },
];

export default function ProspectDetailPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };
  const params = useParams();
  
  const [prospect] = useState<Prospect>(mockProspect);
  const [clients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);

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

  const scoreBreakdown = [
    { category: "Data Completeness", score: 22, max: 25, description: "Has email, phone, website, LinkedIn" },
    { category: "Industry Fit", score: 25, max: 25, description: "Perfect match for home services" },
    { category: "Company Size Match", score: 12, max: 15, description: "Within ideal range (10-50)" },
    { category: "Recency", score: 8, max: 10, description: "Added 2 days ago" },
    { category: "Source Quality", score: 10, max: 10, description: "Verified directory (AHS)" },
    { category: "Engagement Signals", score: 8, max: 15, description: "Active website, no recent engagement" },
  ];

  const handleAssign = () => {
    console.log("Assigning prospect to client:", selectedClient);
    setShowAssignModal(false);
    // Mock functionality - would make API call here
  };

  const handleConvert = () => {
    console.log("Converting prospect to lead for client:", selectedClient);
    setShowConvertModal(false);
    // Mock functionality - would make API call here
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
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/admin/prospects" className="text-brand-plum hover:underline font-mono text-sm">
            ← Back to Prospects
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-white border-2 border-brand-plum p-6 mb-8 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-4xl font-display font-bold text-brand-plum uppercase">{prospect.companyName}</h2>
                <span className={`px-3 py-1 text-xs font-mono uppercase font-bold ${getStatusBadge(prospect.status)}`}>
                  {prospect.status}
                </span>
              </div>
              <div className="text-xl text-brand-charcoal/80 mb-2">
                <strong>{prospect.contactName}</strong>
                {prospect.contactTitle && ` • ${prospect.contactTitle}`}
              </div>
              <div className="flex gap-2 mb-3">
                {prospect.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-brand-bone text-brand-plum text-sm font-mono border border-brand-plum/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className={`px-6 py-4 ${getScoreBg(prospect.readinessScore)} border-2 border-brand-plum`}>
              <div className="text-center">
                <div className={`text-5xl font-display font-bold ${getScoreColor(prospect.readinessScore)} mb-1`}>
                  {prospect.readinessScore}
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60">
                  Readiness Score
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-brand-plum/20">
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-6 py-3 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum border-2 border-brand-plum transition-all"
            >
              Assign to Client
            </button>
            <button
              onClick={() => setShowConvertModal(true)}
              className="px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all"
            >
              Convert to Lead
            </button>
            <button className="px-6 py-3 border-2 border-red-500 text-red-500 font-mono text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
              Disqualify
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Email</div>
                  <div className="font-sans text-brand-charcoal">
                    {prospect.contactEmail ? (
                      <a href={`mailto:${prospect.contactEmail}`} className="text-brand-plum hover:underline">
                        {prospect.contactEmail}
                      </a>
                    ) : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Phone</div>
                  <div className="font-sans text-brand-charcoal">
                    {prospect.contactPhone ? (
                      <a href={`tel:${prospect.contactPhone}`} className="text-brand-plum hover:underline">
                        {prospect.contactPhone}
                      </a>
                    ) : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Website</div>
                  <div className="font-sans text-brand-charcoal">
                    {prospect.website ? (
                      <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-brand-plum hover:underline">
                        {prospect.website}
                      </a>
                    ) : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">LinkedIn</div>
                  <div className="font-sans text-brand-charcoal">
                    {prospect.linkedinUrl ? (
                      <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-brand-plum hover:underline">
                        View Profile
                      </a>
                    ) : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Company Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Industry</div>
                  <div className="font-sans text-brand-charcoal">{prospect.industry || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Company Size</div>
                  <div className="font-sans text-brand-charcoal">{prospect.companySize || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Location</div>
                  <div className="font-sans text-brand-charcoal">{prospect.location || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">Source</div>
                  <div className="font-sans text-brand-charcoal">{prospect.source}</div>
                  {prospect.sourceDetail && (
                    <div className="text-sm text-brand-charcoal/60 mt-1">{prospect.sourceDetail}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Notes</h3>
              <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                <p className="text-brand-charcoal">{prospect.notes || "No notes yet."}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Readiness Score Breakdown */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                {scoreBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/80">
                        {item.category}
                      </div>
                      <div className="text-sm font-mono font-bold text-brand-plum">
                        {item.score}/{item.max}
                      </div>
                    </div>
                    <div className="w-full bg-brand-bone h-2 mb-1">
                      <div
                        className="bg-brand-plum h-2"
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-brand-charcoal/60">{item.description}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t-2 border-brand-plum/20">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-mono uppercase tracking-widest text-brand-charcoal/80">
                    Total Score
                  </div>
                  <div className={`text-3xl font-display font-bold ${getScoreColor(prospect.readinessScore)}`}>
                    {prospect.readinessScore}/100
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Status */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Assignment</h3>
              {prospect.assignedClient ? (
                <div className="p-4 bg-green-50 border-l-4 border-green-500">
                  <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Assigned To
                  </div>
                  <div className="font-bold text-brand-plum">{prospect.assignedClient}</div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
                  <div className="text-sm font-mono uppercase tracking-widest text-yellow-700 mb-1">
                    Unassigned
                  </div>
                  <div className="text-sm text-brand-charcoal/60">
                    This prospect has not been assigned to a client yet.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-brand-plum p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Assign to Client</h3>
            <p className="text-brand-charcoal/80 mb-6">
              Select a client to assign this prospect to. This will make the prospect visible in their dashboard.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Select Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="">-- Select a client --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAssign}
                disabled={!selectedClient}
                className="flex-1 px-6 py-3 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum border-2 border-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-brand-plum p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Convert to Lead</h3>
            <p className="text-brand-charcoal/80 mb-6">
              Convert this prospect into an active lead. Select which client this lead should be assigned to.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Select Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="">-- Select a client --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConvert}
                disabled={!selectedClient}
                className="flex-1 px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Convert
              </button>
              <button
                onClick={() => setShowConvertModal(false)}
                className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
