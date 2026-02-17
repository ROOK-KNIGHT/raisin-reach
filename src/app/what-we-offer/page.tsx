import Header from "@/components/layout/Header";
import Link from "next/link";

export const metadata = {
  title: "What We Offer | RaisinReach",
  description: "Exclusive, BANT-qualified appointments. No shared leads. No scripts. Just results.",
};

export default function WhatWeOffer() {
  return (
    <main className="bg-brand-bone min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-brand-plum text-brand-bone text-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 uppercase tracking-tighter">
          What We <span className="text-brand-gold">Offer.</span>
        </h1>
        <p className="text-xl md:text-2xl font-sans max-w-3xl mx-auto opacity-90">
          One service. Done right. No packages, no tiers, no upsells.
        </p>
      </section>

      {/* The Offer */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-white border-2 border-brand-plum p-12 shadow-[12px_12px_0px_0px_var(--color-brand-plum)]">
          <h2 className="text-4xl font-display font-bold text-brand-plum mb-8 uppercase text-center">
            Exclusive Appointment Setting
          </h2>
          
          <div className="space-y-8 font-sans text-lg text-brand-charcoal">
            <div>
              <h3 className="text-2xl font-bold text-brand-plum mb-3">What You Get</h3>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold font-bold mt-1">→</span>
                  <span><strong>Qualified appointments</strong> with decision-makers in your target market</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold font-bold mt-1">→</span>
                  <span><strong>Full BANT qualification:</strong> Budget, Authority, Need, Timeline confirmed before handoff</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold font-bold mt-1">→</span>
                  <span><strong>100% exclusive leads:</strong> Never shared with competitors</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold font-bold mt-1">→</span>
                  <span><strong>Warm handoff:</strong> Prospect expects your call and knows why you're reaching out</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold font-bold mt-1">→</span>
                  <span><strong>Calendar integration:</strong> Appointments booked directly into your system</span>
                </li>
              </ul>
            </div>

            <div className="border-t-2 border-brand-plum/20 pt-8">
              <h3 className="text-2xl font-bold text-brand-plum mb-3">What We Don't Do</h3>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-brand-charcoal/40 font-bold mt-1">✕</span>
                  <span>Sell the same lead to multiple companies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-charcoal/40 font-bold mt-1">✕</span>
                  <span>Use scripts or robotic pitches</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-charcoal/40 font-bold mt-1">✕</span>
                  <span>Hand you unqualified "tire kickers"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-charcoal/40 font-bold mt-1">✕</span>
                  <span>Charge per lead (we work on retainer + performance)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white border-y border-brutalist">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-display font-bold text-brand-plum mb-16 uppercase text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-plum text-brand-gold font-display font-bold text-3xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-display font-bold text-xl text-brand-plum mb-3 uppercase">Discovery</h3>
              <p className="text-brand-charcoal/80 font-sans">
                We learn your business, ideal customer profile, and value proposition.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-plum text-brand-gold font-display font-bold text-3xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-display font-bold text-xl text-brand-plum mb-3 uppercase">Outreach</h3>
              <p className="text-brand-charcoal/80 font-sans">
                We identify and contact decision-makers using proven, human-centric methods.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-plum text-brand-gold font-display font-bold text-3xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-display font-bold text-xl text-brand-plum mb-3 uppercase">Qualify</h3>
              <p className="text-brand-charcoal/80 font-sans">
                We confirm Budget, Authority, Need, and Timeline before scheduling.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-plum text-brand-gold font-display font-bold text-3xl flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="font-display font-bold text-xl text-brand-plum mb-3 uppercase">Deliver</h3>
              <p className="text-brand-charcoal/80 font-sans">
                Appointment appears on your calendar. Prospect is briefed and ready to talk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Structure */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-display font-bold text-brand-plum mb-12 uppercase text-center">
          Pricing Structure
        </h2>

        <div className="bg-brand-plum text-brand-bone p-12 border-2 border-brand-gold shadow-[12px_12px_0px_0px_var(--color-brand-gold)]">
          <div className="text-center mb-8">
            <div className="text-6xl font-display font-bold text-brand-gold mb-4">Flat Retainer</div>
            <p className="text-xl">+ Performance Bonus</p>
          </div>

          <div className="space-y-4 font-sans text-lg">
            <p>
              <strong className="text-brand-gold">Monthly Retainer:</strong> Covers research, outreach, qualification, and scheduling infrastructure.
            </p>
            <p>
              <strong className="text-brand-gold">Performance Bonus:</strong> Paid per qualified appointment delivered (ensures we're aligned on results).
            </p>
            <p className="pt-4 border-t border-brand-gold/20">
              <strong className="text-brand-gold">Minimum Commitment:</strong> 90 days. This gives us time to learn your market and optimize messaging.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-brand-bone/80 italic">
              Exact pricing depends on your industry, deal size, and target volume. Let's talk.
            </p>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-24 bg-white border-y border-brutalist">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-display font-bold text-brand-plum mb-12 uppercase text-center">
            Who This Is For
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Good Fit */}
            <div className="bg-brand-bone p-8 border-2 border-brand-plum">
              <h3 className="text-2xl font-display font-bold text-brand-plum mb-6 uppercase">Good Fit</h3>
              <ul className="space-y-3 font-sans text-brand-charcoal">
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold font-bold mt-1">✓</span>
                  <span>B2B companies with deal sizes $10K+</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold font-bold mt-1">✓</span>
                  <span>Service businesses (consulting, SaaS, agencies)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold font-bold mt-1">✓</span>
                  <span>Companies testing new markets or offerings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold font-bold mt-1">✓</span>
                  <span>Businesses that close deals through consultative selling</span>
                </li>
              </ul>
            </div>

            {/* Not a Fit */}
            <div className="bg-brand-bone p-8 border-2 border-brand-charcoal/20">
              <h3 className="text-2xl font-display font-bold text-brand-charcoal mb-6 uppercase">Not a Fit</h3>
              <ul className="space-y-3 font-sans text-brand-charcoal/60">
                <li className="flex items-start gap-3">
                  <span className="font-bold mt-1">✕</span>
                  <span>B2C or transactional sales</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold mt-1">✕</span>
                  <span>Companies looking for "cheap leads"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold mt-1">✕</span>
                  <span>Businesses without a proven offer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold mt-1">✕</span>
                  <span>Companies that can't close qualified appointments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-brand-gold text-brand-plum text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">
            Ready to Fill Your Calendar?
          </h2>
          <p className="text-xl font-bold mb-12 max-w-2xl mx-auto">
            No fluff. No gimmicks. Just qualified appointments with decision-makers.
          </p>
          
          <Link 
            href="/#contact" 
            className="inline-block px-12 py-5 bg-brand-plum text-brand-gold font-bold uppercase tracking-widest hover:bg-white hover:text-brand-plum transition-all duration-300 shadow-[8px_8px_0px_0px_white]"
          >
            Let's Talk
          </Link>
        </div>
      </section>
    </main>
  );
}
