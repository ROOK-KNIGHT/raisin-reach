"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LeadDetailPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Demo User" };
  const params = useParams();
  const leadId = params.id;

  // Mock lead detail data - in production, fetch based on leadId
  const lead = {
    id: leadId,
    company: "Global Manufacturing",
    contact: "Mike Davis",
    title: "VP of Operations",
    email: "mike.davis@globalmanuf.com",
    phone: "(555) 345-6789",
    linkedIn: "linkedin.com/in/mikedavis",
    website: "www.globalmanufacturing.com",
    stage: "qualified",
    budget: "$50,000+",
    timeline: "Q1 2026",
    score: 95,
    bant: {
      budget: "Confirmed",
      budgetNotes: "Approved budget of $50K-75K for Q1 initiatives",
      authority: "Decision Maker",
      authorityNotes: "VP level with full authority over operations budget",
      need: "High Priority",
      needNotes: "Looking to streamline operations and reduce costs by 20%",
      timeline: "Q1 2026",
      timelineNotes: "Must implement before end of Q1 for fiscal year goals",
    },
    companyInfo: {
      industry: "Manufacturing",
      size: "500-1000 employees",
      revenue: "$100M - $250M",
      location: "Chicago, IL",
      founded: "1985",
    },
    callHistory: [
      {
        id: 1,
        date: "Feb 15, 2026",
        duration: "18:22",
        outcome: "Qualified Lead",
        notes: "Excellent conversation. Mike is very interested in our solution. Discussed their current pain points with manual processes. Budget confirmed, timeline is Q1. Sending proposal by end of week.",
        nextAction: "Send proposal by Feb 18",
      },
      {
        id: 2,
        date: "Feb 10, 2026",
        duration: "12:15",
        outcome: "Initial Contact",
        notes: "First call - introduced our services. Mike expressed interest and asked for more details. Scheduled follow-up for Feb 15.",
        nextAction: "Follow-up call scheduled",
      },
    ],
    notes: [
      {
        id: 1,
        date: "Feb 16, 2026",
        author: "Sarah (Account Manager)",
        content: "Proposal sent via email. Mike confirmed receipt and said he'll review with his team by Feb 20.",
      },
      {
        id: 2,
        date: "Feb 15, 2026",
        author: "John (Sales Rep)",
        content: "Great call today. Mike is a perfect fit for our solution. Very engaged and asked great questions about implementation timeline and ROI.",
      },
    ],
    nextSteps: [
      {
        id: 1,
        task: "Follow up on proposal",
        dueDate: "Feb 20, 2026",
        status: "pending",
      },
      {
        id: 2,
        task: "Schedule demo if proposal approved",
        dueDate: "Feb 25, 2026",
        status: "pending",
      },
      {
        id: 3,
        task: "Prepare implementation timeline",
        dueDate: "Mar 1, 2026",
        status: "pending",
      },
    ],
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
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Call Logs
            </Link>
            <Link
              href="/portal/leads"
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
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
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/portal/leads" className="text-brand-plum hover:underline font-mono uppercase text-sm">
            ← Back to Leads
          </Link>
        </div>

        {/* Lead Header */}
        <div className="bg-white border-2 border-brand-plum p-8 mb-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-4xl font-display font-bold text-brand-plum">{lead.company}</h2>
                <span className="px-4 py-2 bg-brand-gold text-brand-plum text-sm font-mono uppercase font-bold">
                  {lead.stage}
                </span>
              </div>
              <div className="text-xl text-brand-charcoal mb-2">
                <strong>{lead.contact}</strong> • {lead.title}
              </div>
              <div className="flex gap-6 text-brand-charcoal/80">
                <span>📧 {lead.email}</span>
                <span>📞 {lead.phone}</span>
                <a href={`https://${lead.linkedIn}`} className="text-brand-plum hover:underline">
                  🔗 LinkedIn
                </a>
                <a href={`https://${lead.website}`} className="text-brand-plum hover:underline">
                  🌐 Website
                </a>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-6xl font-display font-bold ${getScoreColor(lead.score)}`}>
                {lead.score}
              </div>
              <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                Lead Score
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="grid md:grid-cols-5 gap-4 p-4 bg-brand-bone border-l-4 border-brand-plum">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Industry
              </div>
              <div className="font-bold text-brand-plum">{lead.companyInfo.industry}</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Company Size
              </div>
              <div className="font-bold text-brand-plum">{lead.companyInfo.size}</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Revenue
              </div>
              <div className="font-bold text-brand-plum">{lead.companyInfo.revenue}</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Location
              </div>
              <div className="font-bold text-brand-plum">{lead.companyInfo.location}</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Founded
              </div>
              <div className="font-bold text-brand-plum">{lead.companyInfo.founded}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* BANT Qualification */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">
                BANT Qualification
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                      Budget
                    </div>
                    <div className="font-bold text-brand-plum">{lead.bant.budget}</div>
                  </div>
                  <div className="text-lg font-bold text-brand-charcoal mb-1">{lead.budget}</div>
                  <div className="text-sm text-brand-charcoal/80">{lead.bant.budgetNotes}</div>
                </div>

                <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                      Authority
                    </div>
                    <div className="font-bold text-brand-plum">{lead.bant.authority}</div>
                  </div>
                  <div className="text-sm text-brand-charcoal/80">{lead.bant.authorityNotes}</div>
                </div>

                <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                      Need
                    </div>
                    <div className="font-bold text-brand-plum">{lead.bant.need}</div>
                  </div>
                  <div className="text-sm text-brand-charcoal/80">{lead.bant.needNotes}</div>
                </div>

                <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                      Timeline
                    </div>
                    <div className="font-bold text-brand-plum">{lead.bant.timeline}</div>
                  </div>
                  <div className="text-sm text-brand-charcoal/80">{lead.bant.timelineNotes}</div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Next Steps</h3>
              <div className="space-y-3">
                {lead.nextSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3 p-3 bg-brand-bone">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-bold text-brand-plum">{step.task}</div>
                      <div className="text-sm text-brand-charcoal/60">Due: {step.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
                + Add New Task
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Call History */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Call History</h3>
              <div className="space-y-4">
                {lead.callHistory.map((call) => (
                  <div key={call.id} className="p-4 bg-brand-bone border-l-4 border-brand-plum">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-brand-plum">{call.date}</div>
                      <span className="px-3 py-1 bg-brand-gold/20 text-brand-plum text-xs font-mono uppercase font-bold">
                        {call.outcome}
                      </span>
                    </div>
                    <div className="text-sm text-brand-charcoal/60 mb-2">Duration: {call.duration}</div>
                    <div className="text-sm text-brand-charcoal/80 mb-2">{call.notes}</div>
                    <div className="text-xs text-brand-charcoal/60">
                      <strong>Next Action:</strong> {call.nextAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Notes</h3>
              <div className="space-y-4 mb-4">
                {lead.notes.map((note) => (
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
