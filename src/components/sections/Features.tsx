"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const usps = [
  {
    icon: "🛡️",
    title: "80% First-Timer Flight Guarantee",
    body: "A documented 80% success rate backed by certified instructors and proven beginner protocols — not just a marketing promise.",
    accent: "text-neon",
  },
  {
    icon: "⚡",
    title: "2024 Lift eFoil Premium Fleet",
    body: "Aerospace-grade carbon boards with 90+ minute battery life. Current-generation Lift eFoils — the best boards money can rent.",
    accent: "text-aqua",
  },
  {
    icon: "🎥",
    title: "GoPro HD Footage Included",
    body: "Every Explorer and Group session is recorded in HD. Your footage is included at no extra charge — no awkward upsell.",
    accent: "text-neon",
  },
  {
    icon: "🌊",
    title: "Protected Calm-Water Zone",
    body: "A permanently sheltered bay, shielded from boat traffic and ocean swells. Ideal conditions every session, not just on perfect days.",
    accent: "text-aqua",
  },
  {
    icon: "⭐",
    title: "4.9★ Rating · 500+ Riders",
    body: "Near-perfect ratings across hundreds of verified riders reflect deep operational excellence you can't fake or rush.",
    accent: "text-neon",
  },
  {
    icon: "💰",
    title: "All-Inclusive Transparent Pricing",
    body: "Safety gear, insurance, certified instruction, and HD footage — all bundled. One flat price. Zero hidden fees.",
    accent: "text-aqua",
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const shouldReduce = useReducedMotion();

  return (
    <section id="features" ref={ref} className="bg-ocean border-t border-aqua/10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.6, ease }}
          className="mb-16"
        >
          <p className="font-heading text-xs font-bold text-aqua/50 tracking-[0.3em] uppercase mb-4">
            Why Choose Us
          </p>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,4.5rem)] font-bold text-foam leading-tight max-w-2xl">
            NOT ALL EFOIL RENTALS<br />
            <span className="text-orange">ARE CREATED EQUAL.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usps.map((usp, i) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={shouldReduce ? { duration: 0 } : { delay: i * 0.08, duration: 0.65, ease }}
              whileHover={shouldReduce ? {} : { y: -4 }}
              transition-type="spring"
              className="group border border-aqua/12 bg-foam/[0.03] p-8 hover:bg-aqua/5 hover:border-aqua/25 transition-all duration-300"
            >
              <span className="text-3xl mb-5 block" aria-hidden>
                {usp.icon}
              </span>
              <h3 className={`font-heading text-base font-bold ${usp.accent} mb-3 leading-snug`}>
                {usp.title}
              </h3>
              <p className="text-foam/50 text-sm leading-relaxed">{usp.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
