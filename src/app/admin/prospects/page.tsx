"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

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

export default function ProspectsPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [csvAnalysis, setCsvAnalysis] = useState<any>(null);

  // Fetch prospects on mount
  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/prospects");
      if (response.ok) {
        const data = await response.json();
        setProspects(data);
      } else {
        console.error("Failed to fetch prospects");
      }
    } catch (error) {
      console.error("Error fetching prospects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProspectSelection = (prospectId: string) => {
    setSelectedProspects(prev => 
      prev.includes(prospectId) 
        ? prev.filter(id => id !== prospectId)
        : [...prev, prospectId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProspects.length === filteredProspects.length) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(filteredProspects.map(p => p.id));
    }
  };

  const handleRunReview = async () => {
    if (selectedProspects.length === 0) {
      alert("Please select at least one prospect to review");
      return;
    }

    setIsReviewing(true);
    setReviewProgress(0);

    // Get selected prospect details
    const selectedProspectData = prospects.filter(p => selectedProspects.includes(p.id));

    try {
      const response = await fetch("/api/admin/prospects/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectIds: selectedProspects,
          prospects: selectedProspectData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Review complete:", data);
        
        // Close modal and refresh prospects
        setIsReviewing(false);
        setShowReviewModal(false);
        setSelectedProspects([]);
        
        // Refresh the prospects list to show updated data
        await fetchProspects();
        
        alert(`Review complete! Enriched ${data.successful} of ${data.totalProcessed} prospects.`);
      } else {
        throw new Error("Review failed");
      }
    } catch (error) {
      console.error("Error running review:", error);
      setIsReviewing(false);
      alert("Failed to start review");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleAnalyzeCSV = async () => {
    if (!uploadFile) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await fetch("/api/admin/prospects/import/analyze", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCsvAnalysis(data);
      } else {
        const error = await response.json();
        alert(`Failed to analyze CSV: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error analyzing CSV:", error);
      alert("Failed to analyze CSV file");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImportCSV = async () => {
    if (!uploadFile || !csvAnalysis) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("analysis", JSON.stringify(csvAnalysis.analysis));

    try {
      const response = await fetch("/api/admin/prospects/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Import complete!\n\n` +
          `Total rows: ${data.stats.totalRows}\n` +
          `Imported: ${data.stats.imported}\n` +
          `Skipped: ${data.stats.skipped}\n` +
          `Duplicates in file: ${data.stats.duplicatesInFile}\n` +
          `Duplicates in database: ${data.stats.duplicatesInDatabase}\n` +
          `Errors: ${data.stats.errors}`
        );
        
        // Close modal and refresh
        setShowUploadModal(false);
        setUploadFile(null);
        setCsvAnalysis(null);
        await fetchProspects();
      } else {
        const error = await response.json();
        alert(`Failed to import CSV: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error importing CSV:", error);
      alert("Failed to import CSV file");
    } finally {
      setIsUploading(false);
    }
  };

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
            <button 
              onClick={() => setShowReviewModal(true)}
              className="px-6 py-3 bg-green-600 text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-green-700 border-2 border-green-700 transition-all"
            >
              🔍 Run Prospect Review
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
            >
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

        {/* Selection Controls */}
        {filteredProspects.length > 0 && (
          <div className="bg-white border-2 border-brand-plum p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedProspects.length === filteredProspects.length && filteredProspects.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 border-2 border-brand-plum"
              />
              <span className="font-mono text-sm uppercase tracking-widest text-brand-charcoal/80">
                {selectedProspects.length > 0 
                  ? `${selectedProspects.length} Selected` 
                  : 'Select All'}
              </span>
            </div>
            {selectedProspects.length > 0 && (
              <button
                onClick={() => setSelectedProspects([])}
                className="px-4 py-2 text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-plum transition-all"
              >
                Clear Selection
              </button>
            )}
          </div>
        )}

        {/* Prospects List */}
        <div className="space-y-4">
          {filteredProspects.map((prospect) => (
            <div
              key={prospect.id}
              className={`bg-white border-2 p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)] transition-all ${
                selectedProspects.includes(prospect.id) 
                  ? 'border-green-600 bg-green-50' 
                  : 'border-brand-plum'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedProspects.includes(prospect.id)}
                    onChange={() => toggleProspectSelection(prospect.id)}
                    className="w-5 h-5 border-2 border-brand-plum mt-1"
                  />
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

      {/* Run Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-brand-plum p-8 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">
              🔍 Run Prospect Review
            </h3>
            <p className="text-brand-charcoal/80 mb-6">
              Enrich selected prospects with data from multiple sources: websites, social media (LinkedIn, Facebook, Twitter), Yelp, and Google.
            </p>

            {!isReviewing ? (
              <>
                <div className="bg-brand-bone p-6 border-l-4 border-brand-gold mb-6">
                  <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                    Selected Prospects
                  </div>
                  <div className="text-2xl font-display font-bold text-brand-plum mb-3">
                    {selectedProspects.length} {selectedProspects.length === 1 ? 'Prospect' : 'Prospects'}
                  </div>
                  {selectedProspects.length > 0 && (
                    <div className="space-y-1">
                      {prospects.filter(p => selectedProspects.includes(p.id)).map(p => (
                        <div key={p.id} className="text-sm text-brand-charcoal/80">
                          • {p.companyName} ({p.contactName})
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedProspects.length === 0 && (
                    <p className="text-sm text-brand-charcoal/60">
                      No prospects selected. Please select prospects from the list to review.
                    </p>
                  )}
                </div>

                <div className="bg-yellow-50 p-4 border-l-4 border-yellow-500 mb-6">
                  <p className="text-sm text-brand-charcoal/80">
                    <strong>Sources to scrape:</strong> Website data, LinkedIn, Facebook, Twitter/X, Yelp, Google Business
                  </p>
                  <p className="text-sm text-brand-charcoal/60 mt-2">
                    Estimated time: ~30 seconds per prospect
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRunReview}
                    disabled={selectedProspects.length === 0}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-green-700 border-2 border-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Review ({selectedProspects.length})
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
                    ⏳
                  </div>
                  <p className="text-brand-charcoal/80 font-mono uppercase tracking-widest">
                    Enriching prospects...
                  </p>
                  <p className="text-sm text-brand-charcoal/60 mt-2">
                    This may take 30-60 seconds per prospect
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-plum"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload CSV Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-brand-plum p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">
              📤 Upload CSV File
            </h3>
            <p className="text-brand-charcoal/80 mb-6">
              Upload a CSV file containing prospect data. Our AI will automatically detect the format and map columns.
            </p>

            {!csvAnalysis ? (
              <>
                <div className="bg-brand-bone p-6 border-l-4 border-brand-gold mb-6">
                  <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                    Select File
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  />
                  {uploadFile && (
                    <div className="mt-3 text-sm text-brand-charcoal/80">
                      Selected: <strong>{uploadFile.name}</strong> ({(uploadFile.size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-brand-charcoal/80">
                    <strong>Supported columns:</strong> Company Name, Contact Name, Email, Phone, Industry, Location, Website, LinkedIn, Facebook, Twitter, Yelp, and more.
                  </p>
                  <p className="text-sm text-brand-charcoal/60 mt-2">
                    The AI will automatically detect and map your CSV columns to the correct fields.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyzeCSV}
                    disabled={!uploadFile || isAnalyzing}
                    className="flex-1 px-6 py-3 bg-brand-plum text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum/90 border-2 border-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze CSV"}
                  </button>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadFile(null);
                      setCsvAnalysis(null);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 p-6 border-l-4 border-green-500 mb-6">
                  <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                    Analysis Complete
                  </div>
                  <div className="text-2xl font-display font-bold text-green-600 mb-3">
                    ✓ Ready to Import
                  </div>
                  <div className="space-y-1 text-sm text-brand-charcoal/80">
                    <div>• File: <strong>{csvAnalysis.fileName}</strong></div>
                    <div>• Total rows: <strong>{csvAnalysis.totalRows}</strong></div>
                    <div>• Source detected: <strong>{csvAnalysis.analysis.source}</strong></div>
                    <div>• Columns mapped: <strong>{Object.keys(csvAnalysis.analysis.columnMapping).length}</strong></div>
                  </div>
                </div>

                <div className="bg-brand-bone p-6 border-l-4 border-brand-gold mb-6 max-h-64 overflow-y-auto">
                  <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-3">
                    Column Mapping Preview
                  </div>
                  <div className="space-y-2">
                    {Object.entries(csvAnalysis.analysis.columnMapping).map(([field, csvColumn]: [string, any]) => (
                      <div key={field} className="flex justify-between text-sm">
                        <span className="text-brand-charcoal/60">{field}:</span>
                        <span className="font-bold text-brand-plum">{csvColumn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {csvAnalysis.analysis.sampleData && csvAnalysis.analysis.sampleData.length > 0 && (
                  <div className="bg-white p-6 border-2 border-brand-plum/20 mb-6 max-h-64 overflow-y-auto">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-3">
                      Sample Data (First 3 Rows)
                    </div>
                    <div className="space-y-3">
                      {csvAnalysis.analysis.sampleData.slice(0, 3).map((row: any, idx: number) => (
                        <div key={idx} className="p-3 bg-brand-bone text-xs">
                          <div><strong>Company:</strong> {row.companyName || "N/A"}</div>
                          <div><strong>Contact:</strong> {row.contactName || "N/A"}</div>
                          <div><strong>Phone:</strong> {row.contactPhone || "N/A"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleImportCSV}
                    disabled={isUploading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-green-700 border-2 border-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Importing..." : `Import ${csvAnalysis.totalRows} Prospects`}
                  </button>
                  <button
                    onClick={() => {
                      setCsvAnalysis(null);
                      setUploadFile(null);
                    }}
                    disabled={isUploading}
                    className="px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadFile(null);
                      setCsvAnalysis(null);
                    }}
                    disabled={isUploading}
                    className="px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
