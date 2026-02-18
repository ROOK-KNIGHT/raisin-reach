"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any || { name: "Admin User" };

  // Mock admin stats
  const stats = {
    totalClients: 12,
    activeClients: 10,
    totalLeads: 47,
    callsThisWeek: 156,
  };

  const recentActivity = [
    {
      id: 1,
      type: "lead_added",
      client: "John Smith (Acme Corp)",
      action: "New lead added: Global Manufacturing",
      timestamp: "10 minutes ago",
    },
    {
      id: 2,
      type: "call_logged",
      client: "Sarah Johnson (Tech Solutions)",
      action: "Call logged: Connected with Mike Davis",
      timestamp: "1 hour ago",
    },
    {
      id: 3,
      type: "client_signup",
      client: "New Client",
      action: "Robert Williams signed up",
      timestamp: "3 hours ago",
    },
  ];

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
                ADMIN
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
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-plum mb-2">{stats.totalClients}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Total Clients</div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-green-600 mb-2">{stats.activeClients}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Active Clients</div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-gold mb-2">{stats.totalLeads}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Total Leads</div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
            <div className="text-5xl font-display font-bold text-brand-plum mb-2">{stats.callsThisWeek}</div>
            <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">Calls This Week</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border-2 border-brand-plum p-6 mb-8">
          <h2 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href="/admin/leads/new"
              className="px-6 py-4 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all text-center"
            >
              + Add New Lead
            </Link>
            <Link
              href="/admin/calls/new"
              className="px-6 py-4 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum border-2 border-brand-plum transition-all text-center"
            >
              + Log Call
            </Link>
            <Link
              href="/admin/clients"
              className="px-6 py-4 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all text-center"
            >
              View All Clients
            </Link>
            <Link
              href="/admin/reports"
              className="px-6 py-4 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all text-center"
            >
              Generate Report
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-2 border-brand-plum p-6">
          <h2 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 bg-brand-bone border-l-4 border-brand-plum">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-brand-plum">{activity.client}</div>
                    <div className="text-sm text-brand-charcoal/80">{activity.action}</div>
                  </div>
                  <div className="text-xs text-brand-charcoal/60">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
