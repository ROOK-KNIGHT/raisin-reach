"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function CallLogsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any || { name: "Demo User" };

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock call logs data
  const callLogs = [
    {
      id: 1,
      contactName: "John Smith",
      company: "Acme Corp",
      phone: "(555) 123-4567",
      status: "connected",
      duration: "12:34",
      notes: "Discussed Q1 needs, scheduling follow-up meeting for next week",
      timestamp: "2 hours ago",
      outcome: "Meeting Scheduled",
    },
    {
      id: 2,
      contactName: "Sarah Johnson",
      company: "Tech Solutions Inc",
      phone: "(555) 234-5678",
      status: "voicemail",
      duration: "0:45",
      notes: "Left message about our services and pricing",
      timestamp: "5 hours ago",
      outcome: "Follow-up Required",
    },
    {
      id: 3,
      contactName: "Mike Davis",
      company: "Global Manufacturing",
      phone: "(555) 345-6789",
      status: "connected",
      duration: "18:22",
      notes: "Qualified lead - Budget $50K+, Timeline Q1 2026. Sending proposal.",
      timestamp: "1 day ago",
      outcome: "Qualified Lead",
    },
    {
      id: 4,
      contactName: "Lisa Chen",
      company: "Enterprise Solutions LLC",
      phone: "(555) 456-7890",
      status: "connected",
      duration: "15:10",
      notes: "Hot lead - Budget $75K+, immediate timeline. Scheduling demo.",
      timestamp: "1 day ago",
      outcome: "Demo Scheduled",
    },
    {
      id: 5,
      contactName: "Robert Williams",
      company: "Startup Ventures",
      phone: "(555) 567-8901",
      status: "no-answer",
      duration: "0:00",
      notes: "No answer, will try again tomorrow",
      timestamp: "2 days ago",
      outcome: "Retry",
    },
    {
      id: 6,
      contactName: "Emily Brown",
      company: "Marketing Pro",
      phone: "(555) 678-9012",
      status: "connected",
      duration: "8:45",
      notes: "Not interested at this time, follow up in 6 months",
      timestamp: "2 days ago",
      outcome: "Not Interested",
    },
  ];

  const filteredLogs = callLogs.filter((log) => {
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesSearch =
      log.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      connected: "bg-green-100 text-green-700",
      voicemail: "bg-yellow-100 text-yellow-700",
      "no-answer": "bg-red-100 text-red-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
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
                <option value="connected">Connected</option>
                <option value="voicemail">Voicemail</option>
                <option value="no-answer">No Answer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Call Logs List */}
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-display font-bold text-brand-plum">{log.contactName}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-mono uppercase ${getStatusBadge(log.status)}`}
                    >
                      {log.status.replace("-", " ")}
                    </span>
                  </div>
                  <div className="text-brand-charcoal/60 mb-1">
                    <strong>{log.company}</strong> • {log.phone}
                  </div>
                  <div className="text-sm text-brand-charcoal/60">
                    Duration: {log.duration} • {log.timestamp}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-4 py-2 bg-brand-gold/20 text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                    {log.outcome}
                  </span>
                </div>
              </div>
              <div className="border-t-2 border-brand-plum/10 pt-4">
                <p className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">Notes</p>
                <p className="text-brand-charcoal">{log.notes}</p>
              </div>
            </div>
          ))}
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
