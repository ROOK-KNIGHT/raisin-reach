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
                  <span><strong>Protected territory:</strong> One client per vertical. Your competitors will never receive our services.</span>
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
                  <span>Charge per lead (we work on flat retainer)</span>
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

      {/* What Happens After You Sign Up */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-display font-bold text-brand-plum mb-12 uppercase text-center">
          What Happens After You Sign Up
        </h2>
        
        <div className="bg-brand-plum text-brand-bone p-12 mb-12 border-2 border-brand-gold shadow-[12px_12px_0px_0px_var(--color-brand-gold)]">
          <p className="text-xl font-sans text-center mb-8 leading-relaxed">
            We become your <strong className="text-brand-gold">dedicated outbound sales arm</strong>, operating as an extension of your team—identifying, engaging, and qualifying prospects on your behalf, every single day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Daily Operations */}
          <div className="bg-white border-2 border-brand-plum p-8 shadow-[8px_8px_0px_0px_var(--color-brand-plum)]">
            <h3 className="text-2xl font-display font-bold text-brand-plum mb-6 uppercase">Daily Operations</h3>
            <div className="space-y-6 font-sans text-brand-charcoal">
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Strategic Prospecting</h4>
                <p className="text-brand-charcoal/80">
                  We identify and research decision-makers within your target market, building a pipeline of high-value prospects aligned with your ideal customer profile.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Human-Centric Outreach</h4>
                <p className="text-brand-charcoal/80">
                  Acting on your behalf, we initiate conversations with prospects—no scripts, no spam. Just authentic, consultative dialogue that positions your value proposition.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Multi-Touch Engagement</h4>
                <p className="text-brand-charcoal/80">
                  We orchestrate discovery calls, exploratory meetings, proposal discussions, and RFI/RFP coordination—whatever the next logical step is to advance the opportunity.
                </p>
              </div>
            </div>
          </div>

          {/* Follow-Up & Pipeline Management */}
          <div className="bg-white border-2 border-brand-plum p-8 shadow-[8px_8px_0px_0px_var(--color-brand-plum)]">
            <h3 className="text-2xl font-display font-bold text-brand-plum mb-6 uppercase">Follow-Up & Pipeline Management</h3>
            <div className="space-y-6 font-sans text-brand-charcoal">
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Relentless Follow-Through</h4>
                <p className="text-brand-charcoal/80">
                  We track every conversation, nurture every lead, and follow up systematically. No prospect falls through the cracks.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Qualification & Vetting</h4>
                <p className="text-brand-charcoal/80">
                  Before any handoff, we confirm Budget, Authority, Need, and Timeline. You only speak with prospects who are ready, willing, and able to buy.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Warm, Primed Handoffs</h4>
                <p className="text-brand-charcoal/80">
                  When we schedule an appointment, the prospect knows who you are, why you're calling, and what problem you solve. They're expecting your call.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Consistency Advantage */}
        <div className="bg-brand-bone p-12 border-2 border-brand-plum">
          <h3 className="text-3xl font-display font-bold text-brand-plum mb-6 text-center uppercase">
            The Consistency Advantage
          </h3>
          <div className="max-w-3xl mx-auto space-y-6 font-sans text-lg text-brand-charcoal">
            <p>
              <strong className="text-brand-plum">Volume is a vanity metric.</strong> What separates elite sales operations from mediocre ones isn't the number of dials—it's the <strong className="text-brand-plum">discipline of daily execution</strong> and the <strong className="text-brand-plum">precision of persistent follow-up</strong>.
            </p>
            <p>
              Most in-house teams start strong, then fade. Reps get distracted. Priorities shift. Follow-ups slip. The pipeline dries up.
            </p>
            <p className="text-xl font-bold text-brand-plum">
              We show up every single day. Same intensity. Same focus. Same results.
            </p>
            <p>
              This isn't about making more calls—it's about making the <strong>right calls</strong>, at the <strong>right time</strong>, with the <strong>right message</strong>, and following through until the opportunity converts or disqualifies.
            </p>
            <p className="pt-6 border-t-2 border-brand-plum/20 italic text-brand-charcoal/80">
              Your pipeline doesn't grow from heroic effort. It grows from <strong className="text-brand-plum">relentless consistency</strong>—and that's what we deliver.
            </p>
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
            <p className="text-xl">One price. Predictable. Simple.</p>
          </div>

          <div className="space-y-4 font-sans text-lg">
            <p>
              <strong className="text-brand-gold">Monthly Retainer:</strong> Covers research, outreach, qualification, scheduling infrastructure, and all qualified appointments delivered.
            </p>
            <p className="pt-4 border-t border-brand-gold/20">
              <strong className="text-brand-gold">Minimum Commitment:</strong> 90 days. This gives us time to learn your market and optimize messaging.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-brand-bone/80 italic">
              Fixed pricing. Same guarantee for all clients. Let's talk.
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
                  <span>Service businesses (consulting, SaaS, agencies, contractors)</span>
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
