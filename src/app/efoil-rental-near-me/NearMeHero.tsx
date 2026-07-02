"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Link from "next/link";
import { track } from "@/lib/funnel";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function EfoilBoard({ shouldReduce }: { shouldReduce: boolean }) {
  return (
    <motion.div
      animate={shouldReduce ? {} : { y: [0, -14, 0] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      className="relative w-full"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-36 rounded-full bg-aqua/10 blur-3xl" />
      </div>
      <svg
        viewBox="0 0 580 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-xl mx-auto"
        aria-label="eFoil board technical illustration showing board, mast, hydrofoil wing, and water surface"
        role="img"
      >
        <defs>
          <filter id="glow-nm-h" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-nm-s" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="wing-nm-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00C2E8" stopOpacity="0" />
            <stop offset="22%" stopColor="#00C2E8" />
            <stop offset="78%" stopColor="#00C2E8" />
            <stop offset="100%" stopColor="#00C2E8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="water-nm-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C2E8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00C2E8" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="board-nm-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C2E8" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#00C2E8" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Board ambient glow */}
        <ellipse cx="290" cy="170" rx="210" ry="32" fill="rgba(0,194,232,0.07)" />

        {/* BOARD BODY */}
        <path
          d="M 88 140 Q 112 110 178 107 L 402 107 Q 468 107 492 140 Q 468 168 402 170 L 178 170 Q 112 168 88 140 Z"
          stroke="#00C2E8"
          strokeWidth="2"
          fill="url(#board-nm-g)"
          filter="url(#glow-nm-s)"
        />
        <line x1="145" y1="127" x2="435" y2="127" stroke="#00C2E8" strokeWidth="0.75" strokeDasharray="10 8" opacity="0.32" />
        <line x1="133" y1="140" x2="447" y2="140" stroke="#00C2E8" strokeWidth="0.5" opacity="0.18" />
        <line x1="145" y1="153" x2="435" y2="153" stroke="#00C2E8" strokeWidth="0.75" strokeDasharray="10 8" opacity="0.32" />

        {/* RIDER silhouette */}
        <circle cx="282" cy="92" r="13" stroke="#00FF94" strokeWidth="1.5" fill="rgba(0,255,148,0.07)" filter="url(#glow-nm-s)" opacity="0.82" />
        <path d="M 269 105 Q 258 87 263 74 Q 273 64 282 78" stroke="#00FF94" strokeWidth="1.5" fill="none" opacity="0.55" />
        <path d="M 295 105 Q 306 87 301 74 Q 291 64 282 78" stroke="#00FF94" strokeWidth="1.5" fill="none" opacity="0.55" />
        <path d="M 264 94 Q 242 80 232 87" stroke="#00FF94" strokeWidth="1.5" opacity="0.45" />
        <path d="M 300 94 Q 322 80 332 87" stroke="#00FF94" strokeWidth="1.5" opacity="0.45" />

        {/* MAST */}
        <rect x="286" y="170" width="10" height="88" rx="2" fill="rgba(0,194,232,0.12)" stroke="#00C2E8" strokeWidth="1.5" filter="url(#glow-nm-s)" />

        {/* FUSELAGE */}
        <rect x="232" y="254" width="118" height="8" rx="3" fill="rgba(0,194,232,0.10)" stroke="#00C2E8" strokeWidth="1.5" opacity="0.9" />

        {/* FRONT HYDROFOIL WING */}
        <path
          d="M 32 268 C 112 242, 218 238, 291 244 C 364 238, 468 242, 548 268"
          stroke="url(#wing-nm-g)"
          strokeWidth="4"
          filter="url(#glow-nm-h)"
        />
        <path
          d="M 32 268 C 112 290, 218 294, 291 288 C 364 294, 468 290, 548 268"
          stroke="url(#wing-nm-g)"
          strokeWidth="1.5"
          opacity="0.26"
        />

        {/* REAR STABILIZER */}
        <path
          d="M 203 264 C 242 252, 272 249, 291 251 C 310 249, 340 252, 377 264"
          stroke="#00FF94"
          strokeWidth="2"
          filter="url(#glow-nm-s)"
          opacity="0.78"
        />

        {/* WATER LINE */}
        <path
          d="M 0 326 Q 72 317 145 323 Q 218 329 291 326 Q 364 323 437 319 Q 509 315 580 326"
          stroke="#00C2E8"
          strokeWidth="1.5"
          opacity="0.48"
          fill="none"
        />
        <path
          d="M 0 326 Q 72 317 145 323 Q 218 329 291 326 Q 364 323 437 319 Q 509 315 580 326 L 580 380 L 0 380 Z"
          fill="url(#water-nm-g)"
        />

        {/* Wake */}
        <circle cx="44" cy="321" r="3.5" fill="#00C2E8" opacity="0.52" />
        <circle cx="70" cy="329" r="2.5" fill="#00C2E8" opacity="0.36" />
        <circle cx="97" cy="318" r="3" fill="#00C2E8" opacity="0.43" />
        <circle cx="432" cy="321" r="3.5" fill="#00C2E8" opacity="0.52" />
        <circle cx="458" cy="328" r="2.5" fill="#00C2E8" opacity="0.36" />
        <circle cx="485" cy="319" r="3" fill="#00C2E8" opacity="0.43" />

        {/* Speed lines */}
        <line x1="0" y1="306" x2="62" y2="306" stroke="#00C2E8" strokeWidth="1" opacity="0.28" strokeDasharray="5 9" />
        <line x1="0" y1="296" x2="44" y2="296" stroke="#00C2E8" strokeWidth="1" opacity="0.18" strokeDasharray="3 12" />

        {/* Neon accents */}
        <circle cx="282" cy="79" r="2" fill="#00FF94" opacity="0.58" />
        <circle cx="265" cy="69" r="1.5" fill="#00FF94" opacity="0.38" />
        <circle cx="300" cy="67" r="1" fill="#00FF94" opacity="0.32" />
      </svg>
    </motion.div>
  );
}

const TRUST_CHIPS = [
  "4.9★ Rating",
  "500+ Riders",
  "80% Fly Guarantee",
  "Free 24-hr Cancellation",
];

const HEADLINE_LINES: { text: string; cls: string }[] = [
  { text: "E-FOIL", cls: "text-foam" },
  { text: "RENTAL", cls: "text-foam" },
  { text: "NEAR", cls: "text-neon" },
  { text: "YOU.", cls: "text-foam" },
];

export function NearMeHero() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const shouldReduce = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-ocean flex items-center overflow-hidden pt-20"
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,194,232,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-neon/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center">
          {/* LEFT: Copy */}
          <div className="order-2 lg:order-1">
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={
                shouldReduce
                  ? { duration: 0 }
                  : { duration: 0.5, delay: 0.1, ease }
              }
              className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-4 py-1.5 text-xs font-medium text-neon tracking-widest mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
              SESSIONS AVAILABLE TODAY
            </motion.div>

            {/* Main headline — targets "e-foil rental near me" */}
            <h1
              className="font-heading font-bold leading-[0.88]"
              style={{ fontSize: "clamp(3rem,9vw,7rem)" }}
            >
              {HEADLINE_LINES.map(({ text, cls }, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.span
                    className={`block ${cls}`}
                    initial={{ y: "105%", opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={
                      shouldReduce
                        ? { duration: 0 }
                        : { delay: 0.2 + i * 0.1, duration: 0.75, ease }
                    }
                  >
                    {text}
                  </motion.span>
                </div>
              ))}
            </h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={
                shouldReduce
                  ? { duration: 0 }
                  : { delay: 0.62, duration: 0.6, ease }
              }
              className="mt-7 max-w-md text-foam/60 text-lg leading-relaxed"
            >
              Premium Lift eFoil sessions with certified instructors.{" "}
              <span className="text-aqua font-medium">
                80% of first-timers get airborne on session one.
              </span>{" "}
              No experience needed — just show up and fly.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={
                shouldReduce
                  ? { duration: 0 }
                  : { delay: 0.78, duration: 0.6, ease }
              }
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.div
                whileHover={shouldReduce ? {} : { scale: 1.05 }}
                whileTap={shouldReduce ? {} : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  href="/book"
                  onClick={() => track("intent")}
                  className="inline-flex items-center gap-2 bg-neon text-ocean font-heading font-bold px-7 py-4 text-sm tracking-wider hover:bg-orange transition-colors duration-200"
                >
                  BOOK YOUR SESSION <span aria-hidden>→</span>
                </Link>
              </motion.div>

              <motion.a
                href="#pricing"
                whileHover={shouldReduce ? {} : { scale: 1.03 }}
                className="inline-flex items-center gap-2 border border-foam/25 text-foam/65 hover:text-foam hover:border-foam/50 font-medium px-7 py-4 text-sm tracking-wide transition-all duration-200"
              >
                SEE PRICING
              </motion.a>
            </motion.div>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={
                shouldReduce ? { duration: 0 } : { delay: 1, duration: 0.6 }
              }
              className="mt-12 flex flex-wrap gap-3"
            >
              {TRUST_CHIPS.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 border border-aqua/20 bg-aqua/5 px-3 py-1.5 text-xs text-foam/55"
                >
                  <span className="h-1 w-1 rounded-full bg-aqua" aria-hidden />
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Visual */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={
              shouldReduce ? { duration: 0 } : { delay: 0.3, duration: 0.9, ease }
            }
          >
            <EfoilBoard shouldReduce={shouldReduce ?? false} />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-aqua/10" />
    </section>
  );
}
