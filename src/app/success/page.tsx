"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-plum text-brand-bone px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-brand-gold flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)]">
            <svg className="w-10 h-10 text-brand-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-brand-gold">
          Your Calendar is About to Get Crowded.
        </h1>
        
        <p className="text-xl md:text-2xl font-sans mb-12 text-brand-bone/80">
          Reach is reviewing your ROI data now. Expect a personal communication—not an automated sequence—within 24 business hours.
        </p>

        <Link 
          href="/" 
          className="inline-block px-8 py-4 border border-brand-gold text-brand-gold font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-colors duration-300"
        >
          Return to Home
        </Link>
      </motion.div>
    </main>
  );
}
