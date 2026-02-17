import Header from "@/components/layout/Header";
import Link from "next/link";

export const metadata = {
  title: "Industry Availability | RaisinReach",
  description: "Protected territory model. One client per vertical. Check if your industry is available.",
};

export default function IndustryAvailability() {
  return (
    <main className="bg-brand-bone min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-brand-plum text-brand-bone text-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 uppercase tracking-tighter">
          Industry <span className="text-brand-gold">Availability.</span>
        </h1>
        <p className="text-xl md:text-2xl font-sans max-w-3xl mx-auto opacity-90">
          Protected territory model. One client per vertical.
        </p>
      </section>

      {/* Explanation */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <p className="text-xl font-sans text-brand-charcoal leading-relaxed">
          Our commitment to <strong className="text-brand-plum">market exclusivity</strong> means we only work with one client per industry vertical. 
          This ensures your competitors will never receive our services, giving you a distinct competitive advantage.
        </p>
      </section>

      {/* Industry Status */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Currently Reserved */}
          <div className="bg-white border-2 border-brand-charcoal/20 p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
            <h2 className="text-3xl font-display font-bold text-brand-charcoal mb-8 uppercase text-center">
              Currently Reserved
            </h2>
            
            <p className="text-center text-brand-charcoal/70 mb-8 font-sans">
              These verticals are exclusively committed to existing clients.
            </p>

            <ul className="space-y-4 font-sans text-lg text-brand-charcoal/60">
              <li className="flex items-start gap-3 pb-4 border-b border-brand-charcoal/10">
                <span className="text-brand-charcoal/40 font-bold mt-1">●</span>
                <span>Plumbing & HVAC Services</span>
              </li>
              <li className="flex items-start gap-3 pb-4 border-b border-brand-charcoal/10">
                <span className="text-brand-charcoal/40 font-bold mt-1">●</span>
                <span>Financial Services & Wealth Management</span>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-brand-bone border-l-4 border-brand-charcoal/20">
              <p className="text-sm italic text-brand-charcoal/60">
                <strong>Note:</strong> We maintain a waitlist for reserved verticals. Contact us to be notified if a spot becomes available.
              </p>
            </div>
          </div>

          {/* Open Verticals */}
          <div className="bg-white border-2 border-brand-plum p-12 shadow-[12px_12px_0px_0px_var(--color-brand-plum)]">
            <h2 className="text-3xl font-display font-bold text-brand-plum mb-8 uppercase text-center">
              Open Verticals
            </h2>
            
            <p className="text-center text-brand-charcoal mb-8 font-sans text-lg">
              All other B2B service industries are currently available for engagement.
            </p>

            <div className="space-y-4 font-sans text-brand-charcoal mb-8">
              <p className="flex items-start gap-3">
                <span className="text-brand-gold font-bold mt-1">✓</span>
                <span>SaaS & Technology Services</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-brand-gold font-bold mt-1">✓</span>
                <span>Professional Consulting</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-brand-gold font-bold mt-1">✓</span>
                <span>Marketing & Creative Agencies</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-brand-gold font-bold mt-1">✓</span>
                <span>Legal & Accounting Services</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-brand-gold font-bold mt-1">✓</span>
                <span>Healthcare & Medical Services</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-brand-gold font-bold mt-1">✓</span>
                <span>Construction & General Contracting</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-brand-gold font-bold mt-1">✓</span>
                <span>Manufacturing & Distribution</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-brand-gold font-bold mt-1">✓</span>
                <span>And many more...</span>
              </p>
            </div>

            <div className="text-center">
              <Link 
                href="/#contact" 
                className="inline-block px-10 py-4 bg-brand-plum text-brand-gold font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all duration-300 shadow-[6px_6px_0px_0px_var(--color-brand-gold)]"
              >
                Inquire About Your Industry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-24 bg-white border-y border-brutalist">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-display font-bold text-brand-plum mb-12 uppercase text-center">
            Why This Matters
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-plum text-brand-gold font-display font-bold text-3xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-display font-bold text-xl text-brand-plum mb-3 uppercase">No Conflicts</h3>
              <p className="text-brand-charcoal/80 font-sans">
                Your competitors will never benefit from our expertise, strategies, or market insights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-plum text-brand-gold font-display font-bold text-3xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-display font-bold text-xl text-brand-plum mb-3 uppercase">Full Focus</h3>
              <p className="text-brand-charcoal/80 font-sans">
                We become deeply specialized in your industry, learning the nuances that drive results.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-plum text-brand-gold font-display font-bold text-3xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-display font-bold text-xl text-brand-plum mb-3 uppercase">True Partnership</h3>
              <p className="text-brand-charcoal/80 font-sans">
                Your success is our only priority in your vertical. No divided loyalties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-brand-gold text-brand-plum text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">
            Is Your Industry Available?
          </h2>
          <p className="text-xl font-bold mb-12 max-w-2xl mx-auto">
            Secure your protected territory before your competitors do.
          </p>
          
          <Link 
            href="/#contact" 
            className="inline-block px-12 py-5 bg-brand-plum text-brand-gold font-bold uppercase tracking-widest hover:bg-white hover:text-brand-plum transition-all duration-300 shadow-[8px_8px_0px_0px_white]"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </main>
  );
}
