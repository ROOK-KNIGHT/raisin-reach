"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import clsx from "clsx";

const PILLARS = [
  {
    id: "intelligence",
    title: "Deep Intelligence",
    description: "Researching the 'Ungettable' Lead.",
  },
  {
    id: "interrupt",
    title: "The Pattern Interrupt",
    description: "The first 7 seconds of the call.",
  },
  {
    id: "value",
    title: "Value Intersection",
    description: "Aligning pain with the Reach method.",
  },
  {
    id: "lock",
    title: "The Calendar Lock",
    description: "The guaranteed appointment.",
  },
];

export default function MethodPulse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to vertical position of the pulse
  const pulseY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 px-6 md:px-12 bg-brand-bone overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-plum mb-16 text-center">
          The Method
        </h2>

        {/* The Central Nerve */}
        <div className="absolute left-8 md:left-1/2 top-32 bottom-0 w-px bg-brand-plum/20 md:-translate-x-1/2">
          {/* The Golden Pulse */}
          <motion.div
            className="absolute top-0 left-1/2 w-3 h-3 bg-brand-gold rounded-full -translate-x-1/2 shadow-[0_0_10px_2px_rgba(212,175,55,0.5)]"
            style={{ top: pulseY }}
          />
        </div>

        <div className="space-y-24 relative z-10">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={clsx(
                "flex flex-col md:flex-row items-center gap-8",
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Content Card */}
              <div className="flex-1 w-full pl-16 md:pl-0">
                 <div 
                   className={clsx(
                     "p-6 border border-brutalist bg-white/50 backdrop-blur-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-transform duration-200 shadow-[4px_4px_0px_0px_var(--color-brand-gold)] hover:shadow-none",
                     index % 2 === 0 ? "md:text-right" : "md:text-left"
                   )}
                 >
                  <h3 className="text-2xl font-display font-bold text-brand-plum mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-brand-charcoal/80 font-sans">
                    {pillar.description}
                  </p>
                </div>
              </div>

              {/* Spacer for the line */}
              <div className="hidden md:block w-16" />

              {/* Empty side for balance */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
