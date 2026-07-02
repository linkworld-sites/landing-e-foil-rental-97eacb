"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const steps = [
  {
    num: "01",
    title: "BOOK ONLINE",
    body: "Pick your session type, choose your date, and lock it in — instant confirmation. No phone calls, no waiting.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <rect x="8" y="6" width="32" height="36" rx="3" stroke="#00FF94" strokeWidth="2" />
        <line x1="16" y1="18" x2="32" y2="18" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="25" x2="28" y2="25" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="32" x2="24" y2="32" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="36" r="7" fill="#00FF94" />
        <path d="M33 36.5L35.5 39L39 33" stroke="#0A1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "ARRIVE & GEAR UP",
    body: "Meet your certified instructor at the beach. Get fitted with your life vest, helmet, and impact vest — takes about 10 minutes.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="24" cy="12" r="7" stroke="#00C2E8" strokeWidth="2" />
        <path d="M12 42c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#00C2E8" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 22l-4 4 4 4" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 22l4 4-4 4" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "LIFT OFF",
    body: "Get on the board, ease the throttle, and feel the moment you lift above the surface. That feeling? That's what we live for.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <path d="M24 38V14" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 28L24 14L40 28" stroke="#00C2E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 36h40" stroke="#00C2E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <circle cx="24" cy="38" r="3" fill="#00FF94" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const shouldReduce = useReducedMotion();

  return (
    <section id="how-it-works" ref={ref} className="bg-ocean py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.6, ease }}
          className="mb-16"
        >
          <p className="font-heading text-xs font-bold text-neon/60 tracking-[0.3em] uppercase mb-4">
            How It Works
          </p>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,4.5rem)] font-bold text-foam leading-tight">
            THREE STEPS TO<br />
            <span className="text-aqua">FLYING.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-aqua/15" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={
                shouldReduce
                  ? { duration: 0 }
                  : { delay: 0.1 + i * 0.15, duration: 0.7, ease }
              }
              className="relative"
            >
              <div className="flex items-start gap-5 md:flex-col md:gap-0">
                <div className="relative shrink-0 md:mb-6">
                  <div className="w-14 h-14 rounded-full border border-aqua/20 bg-aqua/5 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <div className="md:pt-0">
                  <p className="font-heading text-[4rem] font-bold text-foam/6 leading-none mb-4 -ml-1 hidden md:block select-none">
                    {step.num}
                  </p>
                  <h3 className="font-heading text-xl font-bold text-foam mb-3 tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-foam/55 text-sm leading-relaxed max-w-xs">
                    {step.body}
                  </p>
                </div>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-16 -right-4 z-10 items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <circle cx="4" cy="4" r="3" fill="#00C2E8" opacity="0.5" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduce ? { duration: 0 } : { delay: 0.65, duration: 0.6, ease }}
          className="mt-16 pt-12 border-t border-aqua/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          {[
            { num: "80%", label: "of first-timers get airborne on session one" },
            { num: "15 min", label: "average time to first lift for beginners" },
            { num: "90+ min", label: "battery life on the 2024 Lift eFoil fleet" },
          ].map(({ num, label }) => (
            <div key={num}>
              <div className="font-heading text-4xl font-bold text-neon mb-2">{num}</div>
              <p className="text-foam/45 text-sm">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
