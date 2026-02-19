"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CallLog {
  id: string;
  prospectName: string;
  prospectCompany: string;
  prospectPhone: string | null;
  callOutcome: string;
  callDuration: number | null;
  notes: string | null;
  callDate: string;
}

export default function CallLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any || { name: "Demo User" };

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch call logs from API
  useEffect(() => {
    if (status === "authenticated") {
      fetchCallLogs();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchCallLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/portal/calls');
      if (res.ok) {
        const data = await res.json();
        setCallLogs(data);
      }
    } catch (error) {
      console.error('Error fetching call logs:', error);
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

  // Helper function to format call outcome
  const formatOutcome = (outcome: string) => {
    const outcomeMap: Record<string, { label: string; color: string }> = {
      'CONNECTED': { label: 'Connected', color: 'bg-green-100 text-green-700' },
      'SCHEDULED_MEETING': { label: 'Meeting Scheduled', color: 'bg-blue-100 text-blue-700' },
      'VOICEMAIL': { label: 'Voicemail', color: 'bg-yellow-100 text-yellow-700' },
      'NO_ANSWER': { label: 'No Answer', color: 'bg-gray-100 text-gray-700' },
      'GATEKEEPER': { label: 'Gatekeeper', color: 'bg-orange-100 text-orange-700' },
      'NOT_INTERESTED': { label: 'Not Interested', color: 'bg-red-100 text-red-700' },
    };
    return outcomeMap[outcome] || { label: outcome, color: 'bg-gray-100 text-gray-700' };
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
    return `${diffDays} days ago`;
  };

  // Helper function to format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredLogs = callLogs.filter((log) => {
    const matchesStatus = filterStatus === "all" || log.callOutcome === filterStatus;
    const matchesSearch =
      log.prospectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.prospectCompany.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
            >
              Call Logs
            </Link>
            <Link
              href="/portal/leads"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
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
          <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Call Logs</h2>
          <p className="text-brand-charcoal/60">Complete history of all calls made on your behalf</p>
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
                placeholder="Search by name or company..."
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
                <option value="all">All Calls</option>
                <option value="CONNECTED">Connected</option>
                <option value="SCHEDULED_MEETING">Meeting Scheduled</option>
                <option value="VOICEMAIL">Voicemail</option>
                <option value="NO_ANSWER">No Answer</option>
                <option value="GATEKEEPER">Gatekeeper</option>
                <option value="NOT_INTERESTED">Not Interested</option>
              </select>
            </div>
          </div>
        </div>

        {/* Call Logs List */}
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const outcome = formatOutcome(log.callOutcome);
            return (
              <div
                key={log.id}
                className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-display font-bold text-brand-plum">{log.prospectName}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-mono uppercase ${outcome.color}`}
                      >
                        {outcome.label}
                      </span>
                    </div>
                    <div className="text-brand-charcoal/60 mb-1">
                      <strong>{log.prospectCompany}</strong>
                      {log.prospectPhone && ` • ${log.prospectPhone}`}
                    </div>
                    <div className="text-sm text-brand-charcoal/60">
                      Duration: {formatDuration(log.callDuration)} • {formatDate(log.callDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-2 bg-brand-gold/20 text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                      {outcome.label}
                    </span>
                  </div>
                </div>
                {log.notes && (
                  <div className="border-t-2 border-brand-plum/10 pt-4">
                    <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">Notes</p>
                    <p className="text-brand-charcoal">{log.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="bg-white border-2 border-brand-plum p-12 text-center">
            <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest">
              No calls found matching your filters
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
