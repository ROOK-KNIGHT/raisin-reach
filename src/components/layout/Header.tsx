"use client";

import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function Header() {
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
          <Link href="/#method" className="hover:text-brand-gold transition-colors">Method</Link>
          <Link href="/why-us" className="hover:text-brand-gold transition-colors">Why Us</Link>
          <Link href="/#calculator" className="hover:text-brand-gold transition-colors">ROI</Link>
          <Link href="/knowledge" className="hover:text-brand-gold transition-colors">Knowledge</Link>
          <Link href="/#contact" className="hover:text-brand-gold transition-colors">Contact</Link>
        </nav>
      </div>
    </motion.header>
  );
}
