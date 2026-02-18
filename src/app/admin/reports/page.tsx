"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AdminReportsPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };

  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [selectedClient, setSelectedClient] = useState("all");

  // Mock report data
  const reportData = {
    overview: {
      totalCalls: 156,
      connectedCalls: 98,
      voicemails: 42,
      noAnswers: 16,
      leadsGenerated: 23,
      meetingsScheduled: 15,
      conversionRate: "14.7%",
    },
    clientPerformance: [
      {
        client: "John Smith (Acme Corp)",
        calls: 47,
        leads: 8,
        meetings: 5,
        conversionRate: "17.0%",
      },
      {
        client: "Sarah Johnson (Tech Solutions)",
        calls: 62,
        leads: 10,
        meetings: 7,
        conversionRate: "16.1%",
      },
      {
        client: "Mike Davis (Global Manufacturing)",
        calls: 31,
        leads: 3,
        meetings: 2,
        conversionRate: "9.7%",
      },
      {
        client: "Lisa Chen (Enterprise Solutions)",
        calls: 16,
        leads: 2,
        meetings: 1,
        conversionRate: "12.5%",
      },
    ],
    topPerformers: [
      { name: "Sarah Johnson", metric: "Most Leads", value: "10 leads" },
      { name: "John Smith", metric: "Highest Conversion", value: "17.0%" },
      { name: "Sarah Johnson", metric: "Most Calls", value: "62 calls" },
    ],
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
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              All Calls
            </Link>
            <Link
              href="/admin/reports"
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
            >
              Reports
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Performance Reports</h2>
          <p className="text-brand-charcoal/60">Analyze performance metrics and generate reports</p>
        </div>

        {/* Report Filters */}
        <div className="bg-white border-2 border-brand-plum p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Time Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Client Filter
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="all">All Clients</option>
                <option value="1">John Smith (Acme Corp)</option>
                <option value="2">Sarah Johnson (Tech Solutions)</option>
                <option value="3">Mike Davis (Global Manufacturing)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all">
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="bg-white border-2 border-brand-plum p-8 mb-8">
          <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Overview</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-4 bg-brand-bone border-l-4 border-brand-plum">
              <div className="text-4xl font-display font-bold text-brand-plum mb-2">
                {reportData.overview.totalCalls}
              </div>
              <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                Total Calls
              </div>
            </div>
            <div className="p-4 bg-brand-bone border-l-4 border-green-500">
              <div className="text-4xl font-display font-bold text-green-600 mb-2">
                {reportData.overview.connectedCalls}
              </div>
              <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                Connected
              </div>
            </div>
            <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
              <div className="text-4xl font-display font-bold text-brand-gold mb-2">
                {reportData.overview.leadsGenerated}
              </div>
              <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                Leads Generated
              </div>
            </div>
            <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
              <div className="text-4xl font-display font-bold text-brand-gold mb-2">
                {reportData.overview.meetingsScheduled}
              </div>
              <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                Meetings Scheduled
              </div>
            </div>
          </div>

          <div className="mt-6 p-6 bg-brand-gold/10 border-l-4 border-brand-gold">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                  Overall Conversion Rate
                </div>
                <div className="text-3xl font-display font-bold text-brand-plum">
                  {reportData.overview.conversionRate}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-brand-charcoal/60">
                  {reportData.overview.leadsGenerated} leads from {reportData.overview.totalCalls} calls
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Performance */}
        <div className="bg-white border-2 border-brand-plum p-8 mb-8">
          <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Client Performance</h3>
          <div className="space-y-4">
            {reportData.clientPerformance.map((client, idx) => (
              <div key={idx} className="p-6 bg-brand-bone border-l-4 border-brand-plum">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-display font-bold text-brand-plum">{client.client}</h4>
                  <span className="px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                    {client.conversionRate}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Total Calls
                    </div>
                    <div className="text-2xl font-display font-bold text-brand-plum">{client.calls}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Leads Generated
                    </div>
                    <div className="text-2xl font-display font-bold text-brand-gold">{client.leads}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Meetings Scheduled
                    </div>
                    <div className="text-2xl font-display font-bold text-brand-gold">{client.meetings}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white border-2 border-brand-plum p-8">
          <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Top Performers</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {reportData.topPerformers.map((performer, idx) => (
              <div key={idx} className="p-6 bg-brand-gold/10 border-2 border-brand-gold">
                <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                  {performer.metric}
                </div>
                <div className="text-2xl font-display font-bold text-brand-plum mb-1">{performer.name}</div>
                <div className="text-xl font-bold text-brand-gold">{performer.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
