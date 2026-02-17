"use client";

import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <>
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
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 font-mono text-sm uppercase tracking-widest text-brand-bone">
            <Link href="/what-we-offer" className="hover:text-brand-gold transition-colors">What We Offer</Link>
            <Link href="/why-us" className="hover:text-brand-gold transition-colors">Why Us</Link>
            <Link href="/industry-availability" className="hover:text-brand-gold transition-colors">Industries</Link>
            <Link href="/knowledge" className="hover:text-brand-gold transition-colors">Knowledge</Link>
            <Link href="/#contact" className="hover:text-brand-gold transition-colors">Contact</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-brand-gold text-3xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-[72px] left-0 right-0 z-40 bg-brand-plum border-b border-brand-gold/20 md:hidden"
        >
          <nav className="flex flex-col gap-4 p-6 font-mono text-sm uppercase tracking-widest text-brand-bone">
            <Link href="/what-we-offer" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-gold transition-colors py-2">What We Offer</Link>
            <Link href="/why-us" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-gold transition-colors py-2">Why Us</Link>
            <Link href="/industry-availability" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-gold transition-colors py-2">Industries</Link>
            <Link href="/knowledge" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-gold transition-colors py-2">Knowledge</Link>
            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-gold transition-colors py-2">Contact</Link>
          </nav>
        </motion.div>
      )}
    </>
  );
}
