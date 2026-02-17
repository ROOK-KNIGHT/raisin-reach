import Header from "@/components/layout/Header";
import Link from "next/link";

export const metadata = {
  title: "Why RaisinReach? | The End of Shared Leads",
  description: "Stop competing with 5 other contractors for the same low-quality lead. Discover the RaisinReach exclusive appointment setting method.",
};

export default function WhyUs() {
  return (
    <main className="bg-brand-bone min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-brand-plum text-brand-bone text-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 uppercase tracking-tighter">
          Stop Buying <span className="text-brand-gold">Shared Leads.</span>
        </h1>
        <p className="text-xl md:text-2xl font-sans max-w-3xl mx-auto opacity-90">
          The "Lead Gen" industry is broken. You're paying for the privilege of a race to the bottom.
        </p>
      </section>

      {/* The Pipeline Illusion */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-plum mb-8">
          The Pipeline Illusion.
        </h2>
        <div className="prose prose-lg prose-p:font-sans prose-p:text-brand-charcoal">
          <p>
            Most agencies sell you "activity." They hand you a list of names and call it a pipeline. But a name isn't a lead. A name is just data.
          </p>
          <p>
            When you buy from Angie's List or HomeAdvisor, that lead is sold to 3-5 of your competitors simultaneously. You aren't paying for a customer; you're paying for a <strong>fight</strong>.
          </p>
          <p className="font-bold text-brand-plum text-xl">
            This creates "Cognitive Friction" in your sales process. You start every call defensive, trying to prove you aren't spam.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-white border-y border-brutalist">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-3xl font-display font-bold text-brand-plum mb-16 uppercase">
            The Difference
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-plum">
                  <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-brand-charcoal/60">Feature</th>
                  <th className="py-4 px-6 font-display font-bold text-xl text-brand-charcoal bg-gray-100 w-1/3">The "Lead Gen" Giants</th>
                  <th className="py-4 px-6 font-display font-bold text-xl text-brand-bone bg-brand-plum w-1/3">Raisin Reach</th>
                </tr>
              </thead>
              <tbody className="font-sans text-brand-charcoal">
                <tr className="border-b border-brand-plum/10">
                  <td className="py-6 px-6 font-bold">Exclusivity</td>
                  <td className="py-6 px-6 bg-gray-50">Shared with 3-5 competitors</td>
                  <td className="py-6 px-6 bg-brand-plum/5 font-bold text-brand-plum">100% Exclusive to You</td>
                </tr>
                <tr className="border-b border-brand-plum/10">
                  <td className="py-6 px-6 font-bold">Lead Warmth</td>
                  <td className="py-6 px-6 bg-gray-50">Ice Cold (Form fill only)</td>
                  <td className="py-6 px-6 bg-brand-plum/5 font-bold text-brand-plum">Warm Hand-off (Spoken to human)</td>
                </tr>
                <tr className="border-b border-brand-plum/10">
                  <td className="py-6 px-6 font-bold">Qualification</td>
                  <td className="py-6 px-6 bg-gray-50">Pulse check only</td>
                  <td className="py-6 px-6 bg-brand-plum/5 font-bold text-brand-plum">Full BANT Qualification</td>
                </tr>
                <tr className="border-b border-brand-plum/10">
                  <td className="py-6 px-6 font-bold">Cost Model</td>
                  <td className="py-6 px-6 bg-gray-50">Per Lead (Sold multiple times)</td>
                  <td className="py-6 px-6 bg-brand-plum/5 font-bold text-brand-plum">Flat Monthly Retainer</td>
                </tr>
                <tr>
                  <td className="py-6 px-6 font-bold">Outcome</td>
                  <td className="py-6 px-6 bg-gray-50">Price Shopping</td>
                  <td className="py-6 px-6 bg-brand-plum/5 font-bold text-brand-plum">Relationship Building</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The In-House Trap */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-plum mb-8 text-center">
          The In-House Sales Team Trap.
        </h2>
        <p className="text-xl text-brand-charcoal/80 text-center max-w-3xl mx-auto mb-16">
          "We'll just hire our own sales team." Famous last words. Here's what that actually costs.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left: Cost Breakdown */}
          <div className="bg-white border-2 border-brand-plum p-8 shadow-[8px_8px_0px_0px_var(--color-brand-plum)]">
            <h3 className="text-2xl font-display font-bold text-brand-plum mb-6 uppercase">
              Year 1 In-House Costs
            </h3>
            <div className="space-y-4 font-sans text-brand-charcoal">
              <div className="flex justify-between border-b border-brand-plum/10 pb-2">
                <span className="font-bold">Sales Rep Salary (2x)</span>
                <span className="font-mono">$120,000</span>
              </div>
              <div className="flex justify-between border-b border-brand-plum/10 pb-2">
                <span className="font-bold">Benefits & Taxes (30%)</span>
                <span className="font-mono">$36,000</span>
              </div>
              <div className="flex justify-between border-b border-brand-plum/10 pb-2">
                <span className="font-bold">CRM Software</span>
                <span className="font-mono">$12,000</span>
              </div>
              <div className="flex justify-between border-b border-brand-plum/10 pb-2">
                <span className="font-bold">Lead Data & Tools</span>
                <span className="font-mono">$18,000</span>
              </div>
              <div className="flex justify-between border-b border-brand-plum/10 pb-2">
                <span className="font-bold">Training & Onboarding</span>
                <span className="font-mono">$8,000</span>
              </div>
              <div className="flex justify-between border-b border-brand-plum/10 pb-2">
                <span className="font-bold">Office Space & Equipment</span>
                <span className="font-mono">$15,000</span>
              </div>
              <div className="flex justify-between border-b border-brand-plum/10 pb-2">
                <span className="font-bold">Sales Manager Oversight</span>
                <span className="font-mono">$25,000</span>
              </div>
              <div className="flex justify-between pt-4 text-xl font-bold text-brand-plum">
                <span>TOTAL YEAR 1</span>
                <span className="font-mono">$234,000</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-brand-charcoal/60 italic">
              * And that's assuming zero turnover, which is unrealistic in sales.
            </p>
          </div>

          {/* Right: Hidden Costs */}
          <div>
            <h3 className="text-2xl font-display font-bold text-brand-plum mb-6 uppercase">
              The Hidden Costs
            </h3>
            <div className="space-y-6 font-sans text-brand-charcoal">
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Ramp-Up Time</h4>
                <p className="text-brand-charcoal/80">
                  It takes 3-6 months for a new sales rep to become productive. That's half a year of paying someone to learn on your dime.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Turnover</h4>
                <p className="text-brand-charcoal/80">
                  Average sales rep tenure is 18 months. When they leave, you start the cycle again: recruiting, hiring, training, ramping.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Inconsistent Performance</h4>
                <p className="text-brand-charcoal/80">
                  Even "good" reps have bad months. Your pipeline becomes a rollercoaster, making forecasting impossible.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-brand-plum mb-2">Management Overhead</h4>
                <p className="text-brand-charcoal/80">
                  Someone has to manage, coach, and hold reps accountable. That's either you (taking time from running the business) or another hire.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Raisin Reach Alternative */}
        <div className="bg-brand-plum text-brand-bone p-12 border-2 border-brand-gold shadow-[12px_12px_0px_0px_var(--color-brand-gold)]">
          <h3 className="text-3xl font-display font-bold mb-6 text-center uppercase">
            The Raisin Reach Alternative
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-display font-bold text-brand-gold mb-2">$0</div>
              <p className="font-mono text-sm uppercase tracking-widest">Hiring Costs</p>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-brand-gold mb-2">$0</div>
              <p className="font-mono text-sm uppercase tracking-widest">Training Time</p>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-brand-gold mb-2">$0</div>
              <p className="font-mono text-sm uppercase tracking-widest">Turnover Risk</p>
            </div>
          </div>
          <div className="mt-8 text-center max-w-2xl mx-auto">
            <p className="text-lg mb-4">
              <strong className="text-brand-gold">Flat monthly retainer.</strong> Predictable costs. Immediate results.
            </p>
            <p className="text-brand-bone/80">
              You get 20 years of sales mastery without the overhead, drama, or risk of building an in-house team.
            </p>
          </div>
        </div>
      </section>

      {/* Market Testing & Expansion */}
      <section className="py-24 bg-white border-y border-brutalist">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-plum mb-8 text-center">
            Test New Markets Without the Risk.
          </h2>
          <p className="text-xl text-brand-charcoal/80 text-center max-w-3xl mx-auto mb-16">
            Launching a new service line? Entering a new vertical? Testing a subscription model? Don't hire a team until you know it works.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Scenario 1 */}
            <div className="bg-brand-bone p-8 border-2 border-brand-plum shadow-[6px_6px_0px_0px_var(--color-brand-plum)]">
              <h3 className="text-xl font-display font-bold text-brand-plum mb-4 uppercase">
                New Service Launch
              </h3>
              <p className="text-brand-charcoal/80 mb-4">
                You've built a new offering but don't know if the market wants it. Hiring a sales team is a $200K+ bet.
              </p>
              <div className="bg-brand-plum text-brand-bone p-4 font-mono text-sm">
                <strong className="text-brand-gold">RaisinReach Approach:</strong> We run a 90-day pilot. 30 qualified appointments. If it converts, scale. If not, pivot. Zero sunk cost.
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="bg-brand-bone p-8 border-2 border-brand-plum shadow-[6px_6px_0px_0px_var(--color-brand-plum)]">
              <h3 className="text-xl font-display font-bold text-brand-plum mb-4 uppercase">
                New Market Entry
              </h3>
              <p className="text-brand-charcoal/80 mb-4">
                You want to expand into healthcare, finance, or manufacturing. But you don't know the language, pain points, or buyers yet.
              </p>
              <div className="bg-brand-plum text-brand-bone p-4 font-mono text-sm">
                <strong className="text-brand-gold">RaisinReach Approach:</strong> We learn the vertical, test messaging, and deliver qualified conversations. You decide if it's worth building a dedicated team.
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="bg-brand-bone p-8 border-2 border-brand-plum shadow-[6px_6px_0px_0px_var(--color-brand-plum)]">
              <h3 className="text-xl font-display font-bold text-brand-plum mb-4 uppercase">
                Subscription Model Test
              </h3>
              <p className="text-brand-charcoal/80 mb-4">
                You're moving from project-based to recurring revenue. The sales motion is completely different. Your current team isn't trained for it.
              </p>
              <div className="bg-brand-plum text-brand-bone p-4 font-mono text-sm">
                <strong className="text-brand-gold">RaisinReach Approach:</strong> We handle the "land" (initial sale). You handle the "expand" (upsell/retention). Prove the model before retraining your team.
              </div>
            </div>
          </div>

          {/* The Strategic Advantage */}
          <div className="bg-brand-plum text-brand-bone p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-display font-bold mb-6 text-center uppercase text-brand-gold">
              The Strategic Advantage
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-5xl font-display font-bold text-brand-gold mb-2">90 Days</div>
                <p className="font-mono text-sm uppercase tracking-widest">To Validate or Kill an Idea</p>
              </div>
              <div>
                <div className="text-5xl font-display font-bold text-brand-gold mb-2">$0</div>
                <p className="font-mono text-sm uppercase tracking-widest">Wasted on Bad Hires</p>
              </div>
            </div>
            <p className="mt-8 text-center text-lg">
              Most businesses fail because they commit too early. <strong className="text-brand-gold">We let you test, learn, and pivot</strong> without the financial anchor of full-time headcount.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-brand-gold text-brand-plum text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">
            Build a Real Pipeline.
          </h2>
          <p className="text-xl font-bold mb-12 max-w-2xl mx-auto">
            Stop gambling on shared leads. Start investing in your own asset.
          </p>
          
          <Link 
            href="/#contact" 
            className="inline-block px-12 py-5 bg-brand-plum text-brand-gold font-bold uppercase tracking-widest hover:bg-white hover:text-brand-plum transition-all duration-300 shadow-[8px_8px_0px_0px_white]"
          >
            Get the Pedigree
          </Link>
        </div>
      </section>
    </main>
  );
}
