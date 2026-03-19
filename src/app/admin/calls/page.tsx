"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CallLog {
  id: string;
  prospectName: string;
  prospectCompany: string;
  prospectPhone: string | null;
  prospectEmail: string | null;
  callOutcome: string;
  callDuration: number | null;
  notes: string | null;
  callDate: string;
  followUpDate: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    company: string | null;
  };
}

export default function AdminCallsPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClient, setFilterClient] = useState("all");
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch calls and clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [callsRes, clientsRes] = await Promise.all([
          fetch("/api/admin/calls"),
          fetch("/api/admin/clients"),
        ]);

        if (callsRes.ok) {
          const callsData = await callsRes.json();
          setCalls(callsData.calls || []);
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

  // Helper functions
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
    return date.toLocaleDateString();
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getOutcomeBadge = (outcome: string) => {
    const badges: Record<string, string> = {
      'CONNECTED': 'bg-green-100 text-green-700',
      'SCHEDULED_MEETING': 'bg-blue-100 text-blue-700',
      'VOICEMAIL': 'bg-yellow-100 text-yellow-700',
      'NO_ANSWER': 'bg-gray-100 text-gray-700',
      'GATEKEEPER': 'bg-orange-100 text-orange-700',
      'NOT_INTERESTED': 'bg-red-100 text-red-700',
    };
    return badges[outcome] || 'bg-gray-100 text-gray-700';
  };

  const formatOutcome = (outcome: string) => {
    return outcome.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredCalls = calls.filter((call) => {
    const matchesStatus = filterStatus === "all" || call.callOutcome === filterStatus;
    const matchesClient = filterClient === "all" || call.user.id === filterClient;
    const matchesSearch =
      call.prospectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.prospectCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (call.user.name && call.user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesClient && matchesSearch;
  });

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
              href="/admin/leads"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              All Leads
            </Link>
            <Link
              href="/admin/calls"
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
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
            <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">All Calls</h2>
            <p className="text-brand-charcoal/60">View and manage call logs across all clients</p>
          </div>
          <Link
            href="/admin/calls/new"
            className="px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all"
          >
            + Log New Call
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
                placeholder="Search by name, company, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Filter by Outcome
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="all">All Outcomes</option>
                <option value="CONNECTED">Connected</option>
                <option value="SCHEDULED_MEETING">Meeting Scheduled</option>
                <option value="VOICEMAIL">Voicemail</option>
                <option value="NO_ANSWER">No Answer</option>
                <option value="GATEKEEPER">Gatekeeper</option>
                <option value="NOT_INTERESTED">Not Interested</option>
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

        {/* Calls List */}
        <div className="space-y-4">
          {filteredCalls.map((call) => (
            <div
              key={call.id}
              className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-display font-bold text-brand-plum">{call.prospectName}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-mono uppercase ${getOutcomeBadge(call.callOutcome)}`}
                    >
                      {formatOutcome(call.callOutcome)}
                    </span>
                  </div>
                  <div className="text-brand-charcoal/60 mb-1">
                    <strong>{call.prospectCompany}</strong>
                    {call.prospectPhone && ` • ${call.prospectPhone}`}
                    {call.prospectEmail && ` • ${call.prospectEmail}`}
                  </div>
                  <div className="text-sm text-brand-charcoal/60 mb-2">
                    Duration: {formatDuration(call.callDuration)} • {formatDate(call.callDate)}
                  </div>
                  <div className="text-sm text-brand-charcoal/60">
                    <span className="font-bold">Client:</span> {call.user.name || call.user.email}
                    {call.user.company && ` (${call.user.company})`}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-4 py-2 bg-brand-gold/20 text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                    {formatOutcome(call.callOutcome)}
                  </span>
                </div>
              </div>
              {call.notes && (
                <div className="border-t-2 border-brand-plum/10 pt-4">
                  <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">Notes</p>
                  <p className="text-brand-charcoal">{call.notes}</p>
                </div>
              )}
              {call.followUpDate && (
                <div className="mt-2 text-sm text-brand-charcoal/60">
                  <span className="font-bold">Follow-up:</span> {new Date(call.followUpDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCalls.length === 0 && !loading && (
          <div className="bg-white border-2 border-brand-plum p-12 text-center">
            <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest mb-4">
              {calls.length === 0 ? "No calls logged yet" : "No calls found matching your filters"}
            </p>
            {calls.length === 0 && (
              <Link
                href="/admin/calls/new"
                className="inline-block px-6 py-3 bg-brand-plum text-brand-gold font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum border-2 border-brand-plum transition-all"
              >
                Log Your First Call
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
