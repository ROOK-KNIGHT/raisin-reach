"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import MethodPulse from "@/components/home/MethodPulse";
import ROICalculator from "@/components/shared/ROICalculator";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { submitContactForm } from "@/app/actions";
import Header from "@/components/layout/Header";

// --- Components ---

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-brand-plum text-brand-bone">
      {/* Background Grid Interaction */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <motion.div 
          className="absolute w-96 h-96 bg-brand-gold/20 rounded-full blur-[100px]"
          style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
        />
      </div>

      <div className="relative z-10 text-center max-w-5xl px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tight leading-none"
        >
          You've tried the agencies. <br />
          Bought the lists. <br />
          <span className="text-brand-gold">and probably are right where you started.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-2xl font-sans max-w-3xl mx-auto mb-12 text-brand-bone/80"
        >
          The lead gen industry is designed to sell you hope and deliver spreadsheets. We built Raisin Reach because your business deserves better than that.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Link href="#contact" className="px-8 py-4 bg-brand-gold text-brand-plum font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300 shadow-[4px_4px_0px_0px_white]">
            Let's Talk About Your Growth
          </Link>
          <Link href="#calculator" className="text-brand-gold underline decoration-brand-gold/50 hover:decoration-brand-gold underline-offset-4 font-mono uppercase text-sm tracking-widest">
            See What You Might Leaving Behind
          </Link>
          <Link href="/what-we-offer" className="text-brand-bone underline decoration-brand-bone/50 hover:decoration-brand-bone underline-offset-4 font-mono uppercase text-sm tracking-widest">
            See Everything We Offer →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const ValidationStrip = () => {
  return (
    <section id="validation" className="bg-brand-plum border-y border-brand-gold/20 overflow-hidden py-4">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex gap-8 font-mono text-brand-gold uppercase tracking-widest text-sm md:text-base font-bold"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8">
              <span>TRIED SEO</span>
              <span>→</span>
              <span>THUMBTACK</span>
              <span>→</span>
              <span>ANGIE'S LIST</span>
              <span>→</span>
              <span>GOOGLE ADS</span>
              <span>→</span>
              <span>BILLBOARDS</span>
              <span>→</span>
              <span>SOCIAL MEDIA ADS</span>
              <span>→</span>
              <span>YELP</span>
              <span>→</span>
              <span>HOMEADVISOR</span>
              <span>→</span>
              <span>NETWORKING EVENTS</span>
              <span>→</span>
              <span>REFERRAL PROGRAMS</span>
              <span>→</span>
              <span>DOOR KNOCKING</span>
              <span>→</span>
              <span className="text-white">AND YOU'RE STILL LOOKING FOR THE NEXT LEAD</span>
              <span>→</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const HowWereDifferent = () => {
  return (
    <section id="different" className="py-24 bg-white text-brand-plum">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 text-center text-brand-plum">
          How We're Different.
        </h2>
        <p className="text-xl text-brand-charcoal/70 text-center max-w-3xl mx-auto mb-16">
          The lead gen industry has a dirty secret: they sell volume, not value. We built something better.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Block 1 */}
          <div className="p-8 border border-brutalist bg-brand-bone/50 shadow-[4px_4px_0px_0px_var(--color-brand-gold)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
            <h3 className="text-2xl font-display font-bold text-brand-plum mb-4 uppercase">
              AI-Powered, Human-Verified
            </h3>
            <p className="text-brand-charcoal/80 leading-relaxed">
              We don't hand you a list and call it "leads." Our AI scans thousands of prospects across multiple lines of business, filters for fit, and pre-qualifies every single one. Then a real person vets them — before they ever earn the title of "lead."
            </p>
          </div>

          {/* Block 2 */}
          <div className="p-8 border border-brutalist bg-brand-bone/50 shadow-[4px_4px_0px_0px_var(--color-brand-gold)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
            <h3 className="text-2xl font-display font-bold text-brand-plum mb-4 uppercase">
              We Learn Their Business. Then We Learn Yours.
            </h3>
            <p className="text-brand-charcoal/80 leading-relaxed">
              Every prospect is different. We study their needs, understand how their business works, and craft a targeted, personalized approach — not a template, not a script. A conversation designed specifically for them and for you.
            </p>
          </div>

          {/* Block 3 */}
          <div className="p-8 border border-brutalist bg-brand-bone/50 shadow-[4px_4px_0px_0px_var(--color-brand-gold)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
            <h3 className="text-2xl font-display font-bold text-brand-plum mb-4 uppercase">
              We're Not a Vendor. We're Your Sales Team.
            </h3>
            <p className="text-brand-charcoal/80 leading-relaxed">
              Your prospects don't build a relationship with Raisin Reach. They build a relationship with you. We show up as your team, represent your brand, and grow your business like it's our own — because that's exactly what a real partner does.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [projectedRevenue, setProjectedRevenue] = useState(0);

  return (
    <main className="bg-brand-bone min-h-screen">
      <Header />
      <Hero />
      <ValidationStrip />
      
      <section id="method" className="relative">
        <div className="py-24 px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-mono font-bold text-brand-gold uppercase tracking-widest mb-4">The Method</h2>
          <p className="text-3xl md:text-5xl font-display font-bold text-brand-plum mb-8">
            Most lead gen feels like a slot machine. Pull the lever, hope for the best.
          </p>
          <p className="text-lg text-brand-charcoal/70 max-w-2xl mx-auto">
            We built a method that replaces hope with certainty. Here's how we turn prospects into appointments — every single time.
          </p>
        </div>
        <MethodPulse />
      </section>

      <HowWereDifferent />

      {/* Operations / Growth Engine Section */}
      <section id="operations" className="py-24 bg-brand-bone text-brand-plum">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 text-center text-brand-plum">
            More Than Leads. A Full Growth Engine.
          </h2>
          <p className="text-xl text-brand-charcoal/70 text-center max-w-3xl mx-auto mb-16">
            Sales is just the beginning. We built an entire operations platform around your business — so you can focus on what you do best, and we handle the rest.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Card 1: CRM */}
            <div className="p-8 border border-brutalist bg-white shadow-[4px_4px_0px_0px_var(--color-brand-plum)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
              <h3 className="text-2xl font-display font-bold text-brand-plum mb-4 uppercase">
                Your Own CRM — Built for You
              </h3>
              <p className="text-brand-charcoal/80 leading-relaxed">
                Track every lead, send emails, set goals, add notes, and manage projects — all from one place. No more spreadsheets. No more guessing where things stand.
              </p>
            </div>

            {/* Card 2: Profit Estimator */}
            <div className="p-8 border border-brutalist bg-white shadow-[4px_4px_0px_0px_var(--color-brand-plum)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
              <h3 className="text-2xl font-display font-bold text-brand-plum mb-4 uppercase">
                Profit Estimator — Know Your Numbers
              </h3>
              <p className="text-brand-charcoal/80 leading-relaxed">
                A built-in tool to track your costs, overhead, and see estimated net profit in real time. Make smarter decisions with real data, not gut feelings.
              </p>
            </div>

            {/* Card 3: Social Media */}
            <div className="p-8 border border-brutalist bg-white shadow-[4px_4px_0px_0px_var(--color-brand-plum)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
              <h3 className="text-2xl font-display font-bold text-brand-plum mb-4 uppercase">
                Social Media on Autopilot
              </h3>
              <p className="text-brand-charcoal/80 leading-relaxed">
                We automate your posts across Facebook, Instagram, and X (Twitter). Consistent presence without you lifting a finger. Your brand stays active while you stay focused.
              </p>
            </div>

            {/* Card 4: Photography */}
            <div className="p-8 border border-brutalist bg-white shadow-[4px_4px_0px_0px_var(--color-brand-plum)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
              <h3 className="text-2xl font-display font-bold text-brand-plum mb-4 uppercase">
                Professional Photography — In-House
              </h3>
              <p className="text-brand-charcoal/80 leading-relaxed">
                No more stock photos or phone snaps. Our in-house photographer delivers professional images that make your brand look as good as your work actually is.
              </p>
            </div>

            {/* Card 5: Development */}
            <div className="p-8 border border-brutalist bg-white shadow-[4px_4px_0px_0px_var(--color-brand-plum)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
              <h3 className="text-2xl font-display font-bold text-brand-plum mb-4 uppercase">
                Developers on Your Team
              </h3>
              <p className="text-brand-charcoal/80 leading-relaxed">
                Need a website update? A custom AI agent built for your workflow? Our in-house development team builds the tools your business needs to run smarter.
              </p>
            </div>

            {/* Card 6: Client Portal */}
            <div className="p-8 border border-brutalist bg-white shadow-[4px_4px_0px_0px_var(--color-brand-plum)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
              <h3 className="text-2xl font-display font-bold text-brand-plum mb-4 uppercase">
                100% Transparent Client Portal
              </h3>
              <p className="text-brand-charcoal/80 leading-relaxed">
                Everything you need — leads, projects, reports, goals — visible from your dashboard. No hidden work. No black boxes. Total transparency, tailored for you.
              </p>
            </div>
          </div>

          {/* Closing Callout */}
          <div className="bg-brand-plum text-brand-bone p-8 md:p-12 text-center border-2 border-brand-gold shadow-[8px_8px_0px_0px_var(--color-brand-gold)]">
            <p className="text-xl md:text-2xl font-sans leading-relaxed">
              You're not hiring a service. You're gaining a team — <strong className="text-brand-gold">sales, marketing, photography, development, and operations</strong> — all working under your brand, for your growth.
            </p>
            <Link 
              href="/what-we-offer" 
              className="inline-block mt-6 text-brand-gold underline decoration-brand-gold/50 hover:decoration-brand-gold underline-offset-4 font-mono uppercase text-sm tracking-widest"
            >
              See the Full Picture →
            </Link>
          </div>
        </div>
      </section>

      <section id="calculator" className="py-24 bg-brand-bone relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-plum mb-4">
              What Could Next Quarter Look Like?
            </h2>
            <p className="text-xl text-brand-charcoal/70">
              Plug in your numbers. See the difference a real pipeline partner can make.
            </p>
          </div>
          
          <ROICalculator onRevenueUpdate={setProjectedRevenue} />

          {/* AEO Snippet Box */}
          <div className="mt-12 p-6 bg-brand-plum/5 border border-brand-plum/10 rounded-lg max-w-2xl mx-auto">
            <h4 className="font-bold text-brand-plum mb-2 flex items-center gap-2">
              <span className="text-brand-gold">✦</span> What This Means
            </h4>
            <p className="text-sm text-brand-charcoal/80 leading-relaxed">
              With Raisin Reach's <strong>12.5% appointment rate</strong> compared to the industry average of 2.5%, businesses partnering with us typically see a <strong>5x increase in qualified conversations</strong> within the first 90 days — without burning through their lists or their budget.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 bg-brand-gold text-brand-plum text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">
            YOU'VE READ THIS FAR BECAUSE SOMETHING RESONATED.
          </h2>
          <p className="text-xl font-bold mb-12 max-w-2xl mx-auto">
            That's enough for us. Let's have a real conversation — no pitch, no pressure — about what growth could actually look like for your business.
          </p>
          
          <form 
            action={submitContactForm}
            className="max-w-md mx-auto space-y-4 bg-white p-8 border-2 border-brand-plum shadow-[8px_8px_0px_0px_var(--color-brand-plum)]"
          >
            <input type="hidden" name="projectedRevenue" value={projectedRevenue} />
            <input 
              name="name"
              type="text" 
              placeholder="YOUR NAME" 
              required
              className="w-full p-4 bg-brand-bone border border-brand-plum/20 placeholder-brand-plum/50 font-bold focus:outline-none focus:border-brand-plum"
            />
            <input 
              name="email"
              type="email" 
              placeholder="WORK EMAIL" 
              required
              className="w-full p-4 bg-brand-bone border border-brand-plum/20 placeholder-brand-plum/50 font-bold focus:outline-none focus:border-brand-plum"
            />
             <input 
              name="goal"
              type="text" 
              placeholder="MONTHLY REVENUE GOAL" 
              required
              className="w-full p-4 bg-brand-bone border border-brand-plum/20 placeholder-brand-plum/50 font-bold focus:outline-none focus:border-brand-plum"
            />
            <button 
              type="submit" 
              className="w-full py-4 bg-brand-plum text-brand-gold font-bold uppercase tracking-widest hover:bg-brand-plum/90 transition-colors shadow-[4px_4px_0px_0px_var(--color-brand-gold)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none active:translate-y-[4px] active:translate-x-[4px]"
            >
              Start the Conversation
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
