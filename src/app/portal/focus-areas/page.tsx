"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function FocusAreasPage() {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Demo User" };

  const [isEditing, setIsEditing] = useState(false);

  // Mock focus areas data
  const [focusAreas, setFocusAreas] = useState([
    {
      id: 1,
      name: "Enterprise Manufacturing",
      description: "Large-scale manufacturing companies with 500+ employees",
      criteria: {
        industries: ["Manufacturing", "Industrial Equipment", "Automotive"],
        companySize: "500-5000 employees",
        revenue: "$50M - $500M",
        geography: "North America",
        titles: ["VP of Operations", "Director of Manufacturing", "Plant Manager"],
      },
      status: "active",
      callsThisMonth: 42,
      leadsGenerated: 8,
    },
    {
      id: 2,
      name: "Tech Startups (Series A+)",
      description: "Fast-growing technology companies with funding",
      criteria: {
        industries: ["SaaS", "Software Development", "Cloud Services"],
        companySize: "50-500 employees",
        revenue: "$5M - $50M",
        geography: "US & Canada",
        titles: ["CTO", "VP of Engineering", "Head of Product"],
      },
      status: "active",
      callsThisMonth: 28,
      leadsGenerated: 5,
    },
    {
      id: 3,
      name: "Healthcare Providers",
      description: "Mid-size healthcare organizations and hospital systems",
      criteria: {
        industries: ["Healthcare", "Medical Devices", "Hospital Systems"],
        companySize: "200-2000 employees",
        revenue: "$20M - $200M",
        geography: "United States",
        titles: ["Chief Medical Officer", "VP of Operations", "Director of IT"],
      },
      status: "paused",
      callsThisMonth: 0,
      leadsGenerated: 0,
    },
  ]);

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
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Leads
            </Link>
            <Link
              href="/portal/focus-areas"
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Focus Areas</h2>
            <p className="text-brand-charcoal/60">Define your ideal customer profiles and targeting criteria</p>
          </div>
          <button className="px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all">
            + Add New Focus Area
          </button>
        </div>

        {/* Focus Areas List */}
        <div className="space-y-6">
          {focusAreas.map((area) => (
            <div
              key={area.id}
              className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-display font-bold text-brand-plum">{area.name}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-mono uppercase font-bold ${
                        area.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {area.status}
                    </span>
                  </div>
                  <p className="text-brand-charcoal/80">{area.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border-2 border-brand-plum text-brand-plum font-mono text-xs uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
                    Edit
                  </button>
                  <button className="px-4 py-2 border-2 border-brand-plum text-brand-plum font-mono text-xs uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
                    {area.status === "active" ? "Pause" : "Activate"}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-brand-bone border-l-4 border-brand-plum">
                  <div className="text-3xl font-display font-bold text-brand-plum">{area.callsThisMonth}</div>
                  <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                    Calls This Month
                  </div>
                </div>
                <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                  <div className="text-3xl font-display font-bold text-brand-gold">{area.leadsGenerated}</div>
                  <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                    Leads Generated
                  </div>
                </div>
              </div>

              {/* Targeting Criteria */}
              <div className="border-t-2 border-brand-plum/10 pt-4">
                <h4 className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-3">
                  Targeting Criteria
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Industries
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {area.criteria.industries.map((industry, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-brand-plum/10 text-brand-plum text-sm font-sans"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Company Size
                    </div>
                    <div className="text-brand-charcoal font-sans">{area.criteria.companySize}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Revenue Range
                    </div>
                    <div className="text-brand-charcoal font-sans">{area.criteria.revenue}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Geography
                    </div>
                    <div className="text-brand-charcoal font-sans">{area.criteria.geography}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Target Titles
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {area.criteria.titles.map((title, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-brand-gold/20 text-brand-plum text-sm font-sans font-bold"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-brand-plum/5 border-2 border-brand-plum/20 p-6">
          <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-2">
            How Focus Areas Work
          </h3>
          <p className="text-brand-charcoal/80 mb-4">
            Focus Areas help us target the right prospects for your business. Each focus area defines specific
            criteria for industries, company sizes, and decision-maker titles we should target.
          </p>
          <ul className="space-y-2 text-brand-charcoal/80">
            <li className="flex items-start">
              <span className="text-brand-gold mr-2">▸</span>
              <span>Active focus areas are currently being targeted in our outreach campaigns</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-gold mr-2">▸</span>
              <span>You can pause/activate focus areas at any time to adjust your targeting strategy</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-gold mr-2">▸</span>
              <span>We recommend starting with 2-3 focus areas and refining based on results</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
