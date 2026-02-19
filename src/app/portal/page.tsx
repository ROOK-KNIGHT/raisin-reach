"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalCalls: number;
  callsThisWeek: number;
  activeLeads: number;
  meetingsScheduled: number;
}

interface CallLog {
  id: string;
  prospectName: string;
  prospectCompany: string;
  callOutcome: string;
  notes: string | null;
  callDate: string;
}

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  status: string;
  budget: string | null;
  timeline: string | null;
  nextAction: string | null;
}

export default function PortalDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalCalls: 0,
    callsThisWeek: 0,
    activeLeads: 0,
    meetingsScheduled: 0,
  });
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);
  const [hotLeads, setHotLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch('/api/portal/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch recent calls (limit 2)
      const callsRes = await fetch('/api/portal/calls');
      if (callsRes.ok) {
        const callsData = await callsRes.json();
        setRecentCalls(callsData.slice(0, 2));
      }

      // Fetch hot leads (qualified or meeting scheduled)
      const leadsRes = await fetch('/api/portal/leads');
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        const hot = leadsData.filter((lead: Lead) => 
          lead.status === 'QUALIFIED' || lead.status === 'MEETING_SCHEDULED'
        ).slice(0, 2);
        setHotLeads(hot);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  // Mock user for demo
  const user = session?.user as any || { name: "Demo User", membershipStatus: "ACTIVE" };

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
                {user.membershipStatus || "ACTIVE"}
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
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
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
              href="/portal/profit-estimator"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Profit Estimator
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
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Total Calls */}
          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-plum mb-2">{stats.totalCalls}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Total Calls Made</div>
          </div>

          {/* Calls This Week */}
          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-plum mb-2">{stats.callsThisWeek}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Calls This Week</div>
          </div>

          {/* Active Leads */}
          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-gold mb-2">{stats.activeLeads}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Active Leads</div>
          </div>

          {/* Meetings Scheduled */}
          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-gold mb-2">{stats.meetingsScheduled}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Meetings Scheduled</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Calls */}
          <div className="bg-white border-2 border-brand-plum p-6">
            <h2 className="text-2xl font-display font-bold text-brand-plum mb-6 uppercase">Recent Calls</h2>
            <div className="space-y-4">
              {recentCalls.length > 0 ? (
                <>
                  {recentCalls.map((call) => {
                    const outcome = formatOutcome(call.callOutcome);
                    return (
                      <div key={call.id} className="p-4 bg-brand-bone border-l-4 border-brand-plum">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-brand-plum">{call.prospectName}</div>
                            <div className="text-sm text-brand-charcoal/60">{call.prospectCompany}</div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-mono uppercase ${outcome.color}`}>
                            {outcome.label}
                          </span>
                        </div>
                        {call.notes && (
                          <p className="text-sm text-brand-charcoal/80 mt-2">{call.notes}</p>
                        )}
                        <div className="text-xs text-brand-charcoal/60 mt-2">{formatDate(call.callDate)}</div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-center py-8 text-brand-charcoal/60">
                  No recent calls yet
                </div>
              )}

              <Link
                href="/portal/call-logs"
                className="block text-center py-3 border-2 border-brand-plum text-brand-plum font-bold uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
              >
                View All Calls
              </Link>
            </div>
          </div>

          {/* Hot Leads */}
          <div className="bg-white border-2 border-brand-plum p-6">
            <h2 className="text-2xl font-display font-bold text-brand-plum mb-6 uppercase">Hot Leads</h2>
            <div className="space-y-4">
              {hotLeads.length > 0 ? (
                <>
                  {hotLeads.map((lead) => (
                    <div key={lead.id} className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-brand-plum">{lead.companyName}</div>
                          <div className="text-sm text-brand-charcoal/60">Contact: {lead.contactName}</div>
                        </div>
                        <span className="px-3 py-1 bg-brand-gold text-brand-plum text-xs font-mono uppercase font-bold">
                          {lead.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-brand-charcoal/80 mt-2">
                        {lead.budget && `Budget: ${lead.budget}`}
                        {lead.budget && lead.timeline && ' | '}
                        {lead.timeline && `Timeline: ${lead.timeline}`}
                      </p>
                      {lead.nextAction && (
                        <div className="text-xs text-brand-charcoal/60 mt-2">Next action: {lead.nextAction}</div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-brand-charcoal/60">
                  No hot leads yet
                </div>
              )}

              <Link
                href="/portal/leads"
                className="block text-center py-3 border-2 border-brand-plum text-brand-plum font-bold uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
              >
                View All Leads
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
