"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import MethodPulse from "@/components/home/MethodPulse";
import ROICalculator from "@/components/shared/ROICalculator";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { submitContactForm } from "@/app/actions";

// --- Components ---

const Header = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-colors duration-300",
        isScrolled ? "bg-brand-plum/90 backdrop-blur-md border-b border-brand-gold/20" : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-display font-bold text-brand-gold tracking-tighter">
          RAISIN REACH.
        </Link>
        <nav className="hidden md:flex gap-8 font-mono text-sm uppercase tracking-widest text-brand-bone">
          <Link href="#method" className="hover:text-brand-gold transition-colors">Method</Link>
          <Link href="#calculator" className="hover:text-brand-gold transition-colors">ROI</Link>
          <Link href="/knowledge" className="hover:text-brand-gold transition-colors">Knowledge</Link>
          <Link href="#contact" className="hover:text-brand-gold transition-colors">Contact</Link>
        </nav>
      </div>
    </motion.header>
  );
};

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
          20 YEARS. ZERO SCRIPTS. <br />
          <span className="text-brand-gold">YOUR CALENDAR, FORTIFIED.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-2xl font-sans max-w-3xl mx-auto mb-12 text-brand-bone/80"
        >
          We don't "dial for dollars." We engineer high-value human connections. Guaranteed appointments for SMBs who are tired of the noise.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Link href="#contact" className="px-8 py-4 bg-brand-gold text-brand-plum font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300 shadow-[4px_4px_0px_0px_white]">
            Book Your Strategy Call
          </Link>
          <Link href="#calculator" className="text-brand-gold underline decoration-brand-gold/50 hover:decoration-brand-gold underline-offset-4 font-mono uppercase text-sm tracking-widest">
            Calculate Your Missed Revenue
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
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-16 font-mono text-brand-gold uppercase tracking-widest text-sm md:text-base font-bold"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16">
              <span>20+ YEARS EXP</span>
              <span>//</span>
              <span>10K+ APPOINTMENTS SET</span>
              <span>//</span>
              <span>85% GATEKEEPER BYPASS</span>
              <span>//</span>
              <span>ROI GUARANTEED</span>
              <span>//</span>
              <span>NO SCRIPTS</span>
              <span>//</span>
              <span>HUMAN-CENTRIC SALES</span>
              <span>//</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TheReachFactor = () => {
  return (
    <section id="about" className="py-24 bg-white text-brand-plum">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left: Portrait */}
        <div className="relative">
          <div className="aspect-[3/4] bg-brand-charcoal relative overflow-hidden grayscale contrast-125 border border-brutalist shadow-[8px_8px_0px_0px_var(--color-brand-gold)]">
             {/* Placeholder for Reach's Portrait */}
             <div className="absolute inset-0 flex items-center justify-center text-brand-bone opacity-20 text-9xl font-display font-bold">
               REACH
             </div>
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-mono text-sm uppercase text-brand-gold">Founder & Lead Strategist</p>
             </div>
          </div>
        </div>

        {/* Right: Message */}
        <div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-brand-plum">
            The Anti-Script Philosophy.
          </h2>
          <div className="space-y-6 text-lg font-sans text-brand-charcoal/80">
            <p>
              "Most agencies hire 19-year-olds with a script and a headset. They burn through your leads like kindling."
            </p>
            <p className="font-bold text-brand-plum">
              I bring 20 years of battle-tested psychology to every dial.
            </p>
            <p>
              You aren't buying a service; you're buying my pedigree. I don't read lines. I read people. That's why I can guarantee appointments where others guarantee excuses.
            </p>
          </div>
          
          <div className="mt-12">
            {/* SVG Signature Effect */}
            <svg width="200" height="60" viewBox="0 0 200 60" className="text-brand-plum">
              <path d="M10,40 Q50,10 90,40 T180,30" fill="none" stroke="currentColor" strokeWidth="2" />
              <text x="10" y="55" fontFamily="cursive" fontSize="24" fill="currentColor">Reach.</text>
            </svg>
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
          <h2 className="text-sm font-mono font-bold text-brand-gold uppercase tracking-widest mb-4">The Mechanism</h2>
          <p className="text-3xl md:text-5xl font-display font-bold text-brand-plum mb-8">
            Why we win where your internal team fails.
          </p>
          <p className="text-lg text-brand-charcoal/70 max-w-2xl mx-auto">
            Cold calling isn't dead. It just evolved. We use a proprietary 4-stage method to turn "cold" leads into "sold" meetings.
          </p>
        </div>
        <MethodPulse />
      </section>

      <TheReachFactor />

      <section id="calculator" className="py-24 bg-brand-bone relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-plum mb-4">
              The Cost of Inaction.
            </h2>
            <p className="text-xl text-brand-charcoal/70">
              Stop guessing. See exactly how much revenue you're leaving on the table.
            </p>
          </div>
          
          <ROICalculator onRevenueUpdate={setProjectedRevenue} />

          {/* AEO Snippet Box */}
          <div className="mt-12 p-6 bg-brand-plum/5 border border-brand-plum/10 rounded-lg max-w-2xl mx-auto">
            <h4 className="font-bold text-brand-plum mb-2 flex items-center gap-2">
              <span className="text-brand-gold">✦</span> AI Insight
            </h4>
            <p className="text-sm text-brand-charcoal/80 leading-relaxed">
              Based on RaisinReach’s <strong>12.5% conversion benchmark</strong> compared to the industry average of 2.5%, businesses switching to professional appointment setting typically see a <strong>5x increase in pipeline velocity</strong> within the first 90 days.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 bg-brand-gold text-brand-plum text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">
            READY TO STOP 'TRYING' AND START 'CLOSING'?
          </h2>
          <p className="text-xl font-bold mb-12 max-w-2xl mx-auto">
            My calendar is limited. I only take on 3 new clients per quarter to maintain quality.
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
              Secure My Growth
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
