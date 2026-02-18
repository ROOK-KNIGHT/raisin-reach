"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClientDetailPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };
  const params = useParams();
  const clientId = params.id;

  // Mock client detail data
  const client = {
    id: clientId,
    name: "John Smith",
    company: "Acme Corp",
    email: "john@acmecorp.com",
    phone: "(555) 123-4567",
    status: "active",
    membershipPlan: "Professional",
    joinDate: "Jan 15, 2026",
    billingAmount: "$2,500/month",
    nextBillingDate: "March 15, 2026",
    address: "123 Business St, New York, NY 10001",
    
    stats: {
      totalLeads: 12,
      qualifiedLeads: 8,
      totalCalls: 47,
      connectedCalls: 32,
      meetingsScheduled: 5,
      conversionRate: "17.0%",
    },

    focusAreas: [
      {
        id: 1,
        name: "Enterprise Manufacturing",
        industries: ["Manufacturing", "Industrial Equipment"],
        status: "active",
        callsThisMonth: 28,
        leadsGenerated: 5,
      },
      {
        id: 2,
        name: "Tech Startups",
        industries: ["SaaS", "Software Development"],
        status: "active",
        callsThisMonth: 19,
        leadsGenerated: 3,
      },
    ],

    recentLeads: [
      {
        id: 1,
        company: "Global Manufacturing",
        contact: "Mike Davis",
        stage: "qualified",
        score: 95,
        addedDate: "Feb 15, 2026",
      },
      {
        id: 2,
        company: "Tech Innovations Inc",
        contact: "James Wilson",
        stage: "contacted",
        score: 72,
        addedDate: "Feb 10, 2026",
      },
      {
        id: 3,
        company: "Industrial Solutions",
        contact: "Mary Johnson",
        stage: "qualified",
        score: 88,
        addedDate: "Feb 8, 2026",
      },
    ],

    recentCalls: [
      {
        id: 1,
        contact: "Mike Davis",
        company: "Global Manufacturing",
        status: "connected",
        outcome: "Qualified Lead",
        date: "Feb 15, 2026",
      },
      {
        id: 2,
        contact: "James Wilson",
        company: "Tech Innovations Inc",
        status: "voicemail",
        outcome: "Follow-up Required",
        date: "Feb 14, 2026",
      },
      {
        id: 3,
        contact: "Mary Johnson",
        company: "Industrial Solutions",
        status: "connected",
        outcome: "Meeting Scheduled",
        date: "Feb 13, 2026",
      },
    ],

    notes: [
      {
        id: 1,
        author: "Admin",
        date: "Feb 16, 2026",
        content: "Client is very satisfied with the quality of leads. Requested to increase call volume for next month.",
      },
      {
        id: 2,
        author: "Admin",
        date: "Feb 1, 2026",
        content: "Monthly review completed. Client wants to focus more on enterprise manufacturing sector.",
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-green-100 text-green-700",
      trial: "bg-blue-100 text-blue-700",
      paused: "bg-gray-100 text-gray-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getStageBadge = (stage: string) => {
    const badges = {
      qualified: "bg-brand-gold text-brand-plum",
      contacted: "bg-blue-100 text-blue-700",
      nurture: "bg-purple-100 text-purple-700",
    };
    return badges[stage as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
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
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/admin/clients" className="text-brand-plum hover:underline font-mono uppercase text-sm">
            ← Back to Clients
          </Link>
        </div>

        {/* Client Header */}
        <div className="bg-white border-2 border-brand-plum p-8 mb-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-4xl font-display font-bold text-brand-plum">{client.name}</h2>
                <span className={`px-4 py-2 text-sm font-mono uppercase font-bold ${getStatusBadge(client.status)}`}>
                  {client.status}
                </span>
                <span className="px-4 py-2 bg-brand-gold/20 text-brand-plum text-sm font-mono uppercase font-bold">
                  {client.membershipPlan}
                </span>
              </div>
              <div className="text-xl text-brand-charcoal mb-2">
                <strong>{client.company}</strong>
              </div>
              <div className="flex gap-6 text-brand-charcoal/80">
                <span>📧 {client.email}</span>
                <span>📞 {client.phone}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-6 py-3 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all">
                Edit Client
              </button>
              <button className="px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
                Send Message
              </button>
            </div>
          </div>

          {/* Client Info Grid */}
          <div className="grid md:grid-cols-4 gap-4 p-4 bg-brand-bone border-l-4 border-brand-plum">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Join Date
              </div>
              <div className="font-bold text-brand-plum">{client.joinDate}</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Billing Amount
              </div>
              <div className="font-bold text-brand-plum">{client.billingAmount}</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Next Billing
              </div>
              <div className="font-bold text-brand-charcoal">{client.nextBillingDate}</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Address
              </div>
              <div className="font-bold text-brand-charcoal text-sm">{client.address}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-brand-plum p-6">
            <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Performance Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Total Leads</span>
                <span className="text-2xl font-display font-bold text-brand-gold">{client.stats.totalLeads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Qualified Leads</span>
                <span className="text-2xl font-display font-bold text-brand-gold">{client.stats.qualifiedLeads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Meetings Scheduled</span>
                <span className="text-2xl font-display font-bold text-brand-gold">{client.stats.meetingsScheduled}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6">
            <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Call Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Total Calls</span>
                <span className="text-2xl font-display font-bold text-brand-plum">{client.stats.totalCalls}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Connected</span>
                <span className="text-2xl font-display font-bold text-green-600">{client.stats.connectedCalls}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Connection Rate</span>
                <span className="text-2xl font-display font-bold text-green-600">
                  {Math.round((client.stats.connectedCalls / client.stats.totalCalls) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6">
            <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Conversion</h3>
            <div className="text-center py-4">
              <div className="text-5xl font-display font-bold text-brand-gold mb-2">
                {client.stats.conversionRate}
              </div>
              <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                Lead Conversion Rate
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Focus Areas */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Focus Areas</h3>
              <div className="space-y-4">
                {client.focusAreas.map((area) => (
                  <div key={area.id} className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-brand-plum mb-1">{area.name}</div>
                        <div className="flex flex-wrap gap-2">
                          {area.industries.map((industry, idx) => (
                            <span key={idx} className="px-2 py-1 bg-brand-plum/10 text-brand-plum text-xs">
                              {industry}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-mono uppercase">
                        {area.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-brand-charcoal/60">Calls This Month</div>
                        <div className="text-xl font-bold text-brand-plum">{area.callsThisMonth}</div>
                      </div>
                      <div>
                        <div className="text-xs text-brand-charcoal/60">Leads Generated</div>
                        <div className="text-xl font-bold text-brand-gold">{area.leadsGenerated}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Recent Leads</h3>
              <div className="space-y-3">
                {client.recentLeads.map((lead) => (
                  <div key={lead.id} className="p-4 bg-brand-bone">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-brand-plum">{lead.company}</div>
                        <div className="text-sm text-brand-charcoal/60">{lead.contact}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-display font-bold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                        <span className={`px-2 py-1 text-xs font-mono uppercase ${getStageBadge(lead.stage)}`}>
                          {lead.stage}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-brand-charcoal/60">Added: {lead.addedDate}</div>
                  </div>
                ))}
                <Link
                  href={`/admin/leads?client=${clientId}`}
                  className="block text-center py-3 border-2 border-brand-plum text-brand-plum font-bold uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                >
                  View All Leads
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Calls */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Recent Calls</h3>
              <div className="space-y-3">
                {client.recentCalls.map((call) => (
                  <div key={call.id} className="p-4 bg-brand-bone">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-brand-plum">{call.contact}</div>
                        <div className="text-sm text-brand-charcoal/60">{call.company}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-mono uppercase ${
                        call.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {call.status}
                      </span>
                    </div>
                    <div className="text-sm text-brand-charcoal/80 mb-1">{call.outcome}</div>
                    <div className="text-xs text-brand-charcoal/60">{call.date}</div>
                  </div>
                ))}
                <Link
                  href={`/admin/calls?client=${clientId}`}
                  className="block text-center py-3 border-2 border-brand-plum text-brand-plum font-bold uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                >
                  View All Calls
                </Link>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Admin Notes</h3>
              <div className="space-y-4 mb-4">
                {client.notes.map((note) => (
                  <div key={note.id} className="p-4 bg-brand-bone">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-brand-plum">{note.author}</div>
                      <div className="text-xs text-brand-charcoal/60">{note.date}</div>
                    </div>
                    <div className="text-sm text-brand-charcoal/80">{note.content}</div>
                  </div>
                ))}
              </div>
              <textarea
                placeholder="Add a new note..."
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans mb-3"
                rows={3}
              />
              <button className="w-full px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all">
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
