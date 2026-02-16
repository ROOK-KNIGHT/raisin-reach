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
                  <td className="py-6 px-6 bg-brand-plum/5 font-bold text-brand-plum">Flat Retainer + Performance</td>
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
