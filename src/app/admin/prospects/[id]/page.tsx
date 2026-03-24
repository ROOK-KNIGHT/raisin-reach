"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import SalesIntelligencePanel from "@/components/admin/SalesIntelligencePanel";

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
  salesIntelligence?: any;
  aiConfidence?: "HIGH" | "MEDIUM" | "LOW";
  lastEnrichedAt?: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
}

export default function ProspectDetailPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };
  const params = useParams();
  
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);

  // Fetch prospect data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch prospect
        const prospectRes = await fetch(`/api/admin/prospects/${params.id}`);
        if (prospectRes.ok) {
          const prospectData = await prospectRes.json();
          setProspect(prospectData);
        }
        
        // Fetch clients
        const clientsRes = await fetch('/api/admin/clients');
        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setClients(clientsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);

  const handleRunReview = async () => {
    if (!prospect) return;
    
    setIsReviewing(true);
    setReviewProgress(0);

    try {
      const response = await fetch("/api/admin/prospects/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectIds: [prospect.id],
          prospects: [prospect],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Review completed:", data);
        
        // Simulate progress
        const interval = setInterval(() => {
          setReviewProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsReviewing(false);
              setShowReviewModal(false);
              
              // Reload prospect data to show enriched information
              window.location.reload();
              return 100;
            }
            return prev + 10;
          });
        }, 500);
      } else {
        const errorData = await response.json();
        console.error("Review failed:", errorData);
        setIsReviewing(false);
        alert(`Failed to enrich prospect: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error running review:", error);
      setIsReviewing(false);
      alert("Failed to start review. Please check the console for details.");
    }
  };

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

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white border-2 border-brand-plum p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-plum mx-auto mb-4"></div>
            <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest">Loading prospect...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && !prospect && (
          <div className="bg-white border-2 border-red-500 p-12 text-center">
            <p className="text-red-500 font-mono uppercase tracking-widest mb-4">Prospect not found</p>
            <Link href="/admin/prospects" className="px-6 py-3 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum border-2 border-brand-plum transition-all inline-block">
              Back to Prospects
            </Link>
          </div>
        )}

        {/* Header Section */}
        {!isLoading && prospect && (
        <>
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
                {Array.isArray(prospect.tags) && prospect.tags.map((tag, idx) => (
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
              onClick={() => setShowReviewModal(true)}
              className="px-6 py-3 bg-green-600 text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-green-700 border-2 border-green-700 transition-all"
            >
              🔍 Run Prospect Review
            </button>
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
            {/* AI Sales Intelligence Panel */}
            <SalesIntelligencePanel
              intelligence={prospect.salesIntelligence}
              aiConfidence={prospect.aiConfidence}
              lastEnrichedAt={prospect.lastEnrichedAt}
            />

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
        </>
        )}
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

      {/* Run Review Modal */}
      {showReviewModal && prospect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-brand-plum p-8 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">
              🔍 Run Prospect Review
            </h3>
            <p className="text-brand-charcoal/80 mb-6">
              Enrich this prospect with data from multiple sources: websites, social media (LinkedIn, Facebook, Twitter), Yelp, and Google.
            </p>

            {!isReviewing ? (
              <>
                <div className="bg-brand-bone p-6 border-l-4 border-brand-gold mb-6">
                  <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                    Prospect to Review
                  </div>
                  <div className="text-2xl font-display font-bold text-brand-plum mb-2">
                    {prospect.companyName}
                  </div>
                  <div className="text-sm text-brand-charcoal/80">
                    {prospect.contactName} • {prospect.industry} • {prospect.location}
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 border-l-4 border-yellow-500 mb-6">
                  <p className="text-sm text-brand-charcoal/80">
                    <strong>Sources to scrape:</strong> Website data, LinkedIn, Facebook, Twitter/X, Yelp, Google Business
                  </p>
                  <p className="text-sm text-brand-charcoal/60 mt-2">
                    Estimated time: ~30 seconds
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRunReview}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-green-700 border-2 border-green-700 transition-all"
                  >
                    Start Review
                  </button>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-display font-bold text-brand-plum mb-2">
                    {reviewProgress}%
                  </div>
                  <p className="text-brand-charcoal/80 font-mono uppercase tracking-widest">
                    Scraping in progress...
                  </p>
                </div>
                <div className="w-full bg-brand-bone h-4 mb-4">
                  <div
                    className="bg-green-600 h-4 transition-all duration-500"
                    style={{ width: `${reviewProgress}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-brand-bone">
                    <span className="font-mono text-brand-charcoal/60">Website:</span>
                    <span className="ml-2 text-green-600">✓ Scanning</span>
                  </div>
                  <div className="p-3 bg-brand-bone">
                    <span className="font-mono text-brand-charcoal/60">LinkedIn:</span>
                    <span className="ml-2 text-green-600">✓ Scanning</span>
                  </div>
                  <div className="p-3 bg-brand-bone">
                    <span className="font-mono text-brand-charcoal/60">Facebook:</span>
                    <span className="ml-2 text-green-600">✓ Scanning</span>
                  </div>
                  <div className="p-3 bg-brand-bone">
                    <span className="font-mono text-brand-charcoal/60">Twitter/X:</span>
                    <span className="ml-2 text-green-600">✓ Scanning</span>
                  </div>
                  <div className="p-3 bg-brand-bone">
                    <span className="font-mono text-brand-charcoal/60">Yelp:</span>
                    <span className="ml-2 text-green-600">✓ Scanning</span>
                  </div>
                  <div className="p-3 bg-brand-bone">
                    <span className="font-mono text-brand-charcoal/60">Google:</span>
                    <span className="ml-2 text-green-600">✓ Scanning</span>
                  </div>
                </div>
              </div>
            )}
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
