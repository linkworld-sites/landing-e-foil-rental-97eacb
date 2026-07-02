"use client";

import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { track } from "@/lib/funnel";
import ConversionForm from "@/components/ConversionForm";

const EASE = [0.22, 1, 0.36, 1] as const;

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const rm = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={rm ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Abstract E-Foil SVG visual ─────────────────────────────────
function EfoilVisual() {
  const rm = useReducedMotion();
  return (
    <svg
      viewBox="0 0 360 500"
      fill="none"
      className="w-full max-w-[320px] xl:max-w-[390px]"
      aria-label="Electric hydrofoil board flying above water"
    >
      <defs>
        <radialGradient id="eg1" cx="50%" cy="42%" r="52%">
          <stop offset="0%" stopColor="#00C2E8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#00C2E8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="eg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E2D5A" />
          <stop offset="100%" stopColor="#0A1E40" />
        </linearGradient>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="180" cy="210" rx="160" ry="115" fill="url(#eg1)" />

      {/* Board */}
      <path
        d="M86 130 Q98 92 180 84 Q262 92 274 130 L271 165 Q240 182 180 185 Q120 182 89 165 Z"
        fill="url(#eg2)"
        stroke="#00C2E8"
        strokeWidth="2.5"
      />
      {/* Accent stripe */}
      <path
        d="M124 128 Q180 115 236 128"
        stroke="#00FF94"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Mast */}
      <rect x="174" y="184" width="12" height="162" rx="3" fill="#00C2E8" opacity="0.9" />
      {/* Motor pod highlight */}
      <ellipse cx="180" cy="274" rx="9" ry="6" fill="#00FF94" opacity="0.55" />

      {/* Front wing */}
      <path
        d="M48 328 Q114 308 180 305 Q246 308 312 328 L313 344 Q246 356 180 358 Q114 356 47 344 Z"
        fill="#00C2E8"
        opacity="0.88"
      />
      {/* Wing glow */}
      <ellipse cx="180" cy="332" rx="134" ry="11" fill="#00C2E8" opacity="0.12" />

      {/* Rear stabilizer */}
      <path
        d="M147 358 Q165 348 180 346 Q195 348 213 358 L214 371 Q196 379 180 380 Q164 379 146 371 Z"
        fill="#00FF94"
        opacity="0.85"
      />

      {/* Water surface lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path
          key={i}
          d={`M0,${392 + i * 16} Q90,${380 + i * 16} 180,${392 + i * 16} T360,${392 + i * 16}`}
          stroke="#00C2E8"
          strokeWidth={1.8 - i * 0.28}
          opacity={0.4 - i * 0.06}
          animate={
            rm
              ? {}
              : {
                  d: [
                    `M0,${392 + i * 16} Q90,${380 + i * 16} 180,${392 + i * 16} T360,${392 + i * 16}`,
                    `M0,${392 + i * 16} Q90,${404 + i * 16} 180,${392 + i * 16} T360,${392 + i * 16}`,
                    `M0,${392 + i * 16} Q90,${380 + i * 16} 180,${392 + i * 16} T360,${392 + i * 16}`,
                  ],
                }
          }
          transition={{
            duration: 3.2 + i * 0.65,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.38,
          }}
        />
      ))}

      {/* Electric sparks */}
      {(
        [
          [150, 185],
          [210, 186],
          [134, 331],
          [226, 328],
        ] as [number, number][]
      ).map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={2.5}
          fill="#00FF94"
          animate={rm ? {} : { opacity: [0, 1, 0], r: [1.5, 3.5, 1.5] }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
            delay: i * 0.48,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Rider silhouette */}
      <circle cx="180" cy="95" r="11" fill="#F5F7FA" opacity="0.9" />
      <path
        d="M175 106 Q173 120 171 135 L189 135 Q187 120 185 106 Z"
        fill="#F5F7FA"
        opacity="0.85"
      />
      <line
        x1="168"
        y1="113"
        x2="146"
        y2="126"
        stroke="#F5F7FA"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="192"
        y1="113"
        x2="214"
        y2="126"
        stroke="#F5F7FA"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

// ── HERO ───────────────────────────────────────────────────────
function Hero() {
  const rm = useReducedMotion();

  return (
    <section
      id="top"
      className="relative min-h-screen bg-ocean flex flex-col justify-center overflow-hidden pt-24 pb-20"
    >
      {/* Background: subtle animated water lines */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-aqua"
            style={{ top: `${52 + i * 9}%`, opacity: 0.05 }}
            animate={
              rm
                ? {}
                : { scaleX: [0.65, 1.12, 0.65], opacity: [0.03, 0.07, 0.03] }
            }
            transition={{
              duration: 5.5 + i * 1.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          />
        ))}
        <div className="absolute top-[18%] right-[4%] w-[440px] h-[440px] bg-aqua/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[18%] left-[4%] w-[340px] h-[340px] bg-neon/4 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 xl:gap-20 items-center">
          {/* Copy */}
          <div className="max-w-2xl">
            <motion.div
              initial={rm ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2.5 bg-neon/10 border border-neon/20 text-neon text-xs font-bold tracking-[0.15em] uppercase px-4 py-2.5 mb-7"
            >
              <span className="text-sm leading-none" aria-hidden="true">
                ★★★★★
              </span>
              4.9 — 500+ Riders This Season
            </motion.div>

            <div className="overflow-hidden">
              <motion.h1
                initial={rm ? false : { opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.88, ease: EASE, delay: 0.08 }}
                className="font-heading text-[clamp(2.75rem,6.5vw,5rem)] font-bold text-foam leading-[1.02] tracking-tight"
              >
                E-FOIL RENTAL
                <br />
                <span className="text-aqua">NEAR YOU</span>
              </motion.h1>
            </div>

            <motion.p
              initial={rm ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.26 }}
              className="mt-6 text-foam/65 text-lg leading-relaxed max-w-[520px]"
            >
              No experience. No lessons beforehand. Just you, a premium{" "}
              <strong className="text-foam/90 font-semibold">
                Lift eFoil board
              </strong>
              , and a certified instructor helping you fly silently above the
              water — on your very first session.
            </motion.p>

            <motion.div
              initial={rm ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <motion.a
                href="#booking"
                onClick={() => track("intent")}
                whileHover={rm ? {} : { scale: 1.04 }}
                whileTap={rm ? {} : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 450, damping: 22 }}
                className="inline-flex items-center gap-2 bg-neon text-ocean font-heading font-bold px-8 py-4 text-sm tracking-[0.12em] hover:bg-white transition-colors duration-150"
              >
                BOOK MY SESSION
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 2v10M2 7l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={rm ? {} : { scale: 1.02 }}
                whileTap={rm ? {} : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center border border-foam/20 text-foam/75 font-heading font-bold px-8 py-4 text-sm tracking-[0.12em] hover:border-foam/45 hover:text-foam transition-all duration-200"
              >
                SEE HOW IT WORKS
              </motion.a>
            </motion.div>

            <motion.ul
              initial={rm ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.58 }}
              className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-sm text-foam/40"
              aria-label="Key features"
            >
              <li>✓ 80% First-Timer Flight Guarantee</li>
              <li>✓ All Safety Gear Included</li>
              <li>✓ Instant Online Booking</li>
              <li>✓ Free Cancellation (24h)</li>
            </motion.ul>
          </div>

          {/* E-foil visual */}
          <motion.div
            initial={rm ? false : { opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.05, ease: EASE, delay: 0.18 }}
            className="hidden lg:block"
          >
            <motion.div
              animate={rm ? {} : { y: [0, -16, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <EfoilVisual />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── STATS TICKER ───────────────────────────────────────────────
const STATS_ITEMS = [
  "4.9★ Average Rating",
  "500+ Riders This Season",
  "80% First-Timer Flight Rate",
  "Zero Experience Required",
  "Premium Lift eFoil Fleet",
  "GoPro HD Footage Included",
  "Instant Online Booking",
  "Free 24h Cancellation",
];

function StatsTicker() {
  const rm = useReducedMotion();
  const doubled = [...STATS_ITEMS, ...STATS_ITEMS];

  return (
    <div className="bg-neon overflow-hidden py-5" aria-hidden="true">
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={rm ? {} : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 px-7 font-heading font-bold text-ocean text-sm tracking-wide shrink-0"
          >
            {s}
            <span className="text-ocean/30 text-xl font-normal">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── USPs ───────────────────────────────────────────────────────
const USPS = [
  {
    icon: "🎯",
    title: "80% First-Timer Flight Guarantee",
    body: "Our certified instructors use a proven beginner protocol built from 500+ sessions. Most riders get their first sustained flight within 20 minutes of hitting the water.",
  },
  {
    icon: "⚡",
    title: "2024 Lift eFoil Premium Fleet",
    body: "Aerospace-grade carbon construction, whisper-quiet electric motor, 90+ minute battery life. The best hydrofoil boards on the market — for every session.",
  },
  {
    icon: "🎥",
    title: "GoPro HD Footage Included",
    body: "Every Explorer and Group session is professionally captured in HD. You walk away with shareable footage of your flight at absolutely no extra charge.",
  },
  {
    icon: "🌊",
    title: "Protected Calm-Water Riding Zone",
    body: "Our permanently secured, sheltered bay is shielded from boat traffic and ocean swells — the ideal learning environment and a durable location moat.",
  },
  {
    icon: "⭐",
    title: "4.9★ Across 500+ Riders",
    body: "A near-perfect rating across hundreds of verified guests reflects deep operational excellence and instructor quality that takes years — not months — to build.",
  },
  {
    icon: "💯",
    title: "All-Inclusive Transparent Pricing",
    body: "Safety gear, certified instruction, insurance, and GoPro footage are all bundled in. No surprise fees, no dock-side upsells — just one flat price.",
  },
];

function USPs() {
  return (
    <section className="bg-ocean py-24 px-6" id="why-us">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="text-center mb-16">
          <p className="text-aqua text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Why Riders Choose Us
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foam">
            Built Different.
            <br />
            <span className="text-aqua">Proven Better.</span>
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {USPS.map((usp, i) => (
            <FadeIn key={usp.title} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6, borderColor: "rgba(0,194,232,0.35)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                className="bg-ocean border border-aqua/10 p-7 h-full cursor-default"
              >
                <div className="text-3xl mb-4" aria-hidden="true">
                  {usp.icon}
                </div>
                <h3 className="font-heading font-bold text-foam text-lg leading-snug mb-3">
                  {usp.title}
                </h3>
                <p className="text-foam/55 text-sm leading-relaxed">{usp.body}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ───────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    title: "Book Online in 60 Seconds",
    body: "Pick your session type, choose a time, and confirm instantly. No phone calls, no waiting lists. Your spot is locked the moment you click.",
  },
  {
    n: "02",
    title: "Arrive & Gear Up",
    body: "Show up at our protected bay. We fit you with a life vest, helmet, and impact vest — everything included. Your certified instructor walks you through the fundamentals before you touch the water.",
  },
  {
    n: "03",
    title: "Fly Above the Water",
    body: "Step on the board, squeeze the throttle gently, and feel the foil lift you silently above the surface. Most first-timers fly within 15–30 minutes.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-foam py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="text-center mb-16">
          <p className="text-orange text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Simple. Fast. Unforgettable.
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ocean">
            From Zero to Flying
            <br />
            <span className="text-aqua">in 3 Steps</span>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {STEPS.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                className="relative"
              >
                <div className="font-heading text-[5.5rem] font-bold leading-none text-ocean/7 select-none mb-1">
                  {step.n}
                </div>
                <h3 className="font-heading font-bold text-ocean text-xl mb-3 -mt-5">
                  {step.title}
                </h3>
                <p className="text-ocean/60 leading-relaxed text-sm md:text-base">
                  {step.body}
                </p>
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 -right-5 text-aqua text-2xl opacity-25 select-none font-light"
                    aria-hidden="true"
                  >
                    →
                  </div>
                )}
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRICING ────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Intro",
    price: "$99",
    duration: "45 Minutes",
    riders: "1 Rider",
    popular: false,
    includes: [
      "Certified instructor lesson",
      "Safety gear (vest, helmet, impact vest)",
      "Beginner eFoil board",
      "Shore-based photo",
      "Full safety briefing",
    ],
    cta: "BOOK INTRO",
    cardClass: "bg-ocean border border-aqua/15",
    textClass: "text-foam",
    ctaClass: "bg-neon text-ocean",
  },
  {
    name: "Explorer",
    price: "$169",
    duration: "2 Hours",
    riders: "1 Rider",
    popular: true,
    includes: [
      "Premium 2024 Lift eFoil board",
      "GoPro HD footage included",
      "Full bay riding access",
      "Certified instructor",
      "All safety gear included",
      "Post-session coaching tips",
    ],
    cta: "BOOK EXPLORER",
    cardClass: "bg-neon",
    textClass: "text-ocean",
    ctaClass: "bg-ocean text-neon",
  },
  {
    name: "Group / Private",
    price: "$389",
    duration: "Half Day",
    riders: "Up to 4 Riders",
    popular: false,
    includes: [
      "4× premium Lift eFoil boards",
      "Dedicated instructor team",
      "GoPro footage per rider",
      "Private beach area",
      "Custom scheduling",
      "All safety gear included",
    ],
    cta: "BOOK GROUP",
    cardClass: "bg-ocean border border-aqua/15",
    textClass: "text-foam",
    ctaClass: "bg-neon text-ocean",
  },
];

function Pricing() {
  const rm = useReducedMotion();
  return (
    <section id="pricing" className="bg-orange py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="text-center mb-16">
          <p className="text-ocean/65 text-xs font-bold tracking-[0.2em] uppercase mb-3">
            All-Inclusive · No Hidden Fees
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ocean">
            Pick Your Session
          </h2>
          <p className="mt-4 text-ocean/65 max-w-lg mx-auto">
            Safety gear, certified instruction, and insurance are included in
            every package.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={rm ? {} : { y: -8, scale: 1.02 }}
                whileTap={rm ? {} : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className={`relative p-8 ${plan.cardClass} ${plan.popular ? "shadow-2xl shadow-neon/25" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-ocean text-neon text-[11px] font-bold tracking-widest uppercase px-5 py-1.5">
                    MOST POPULAR
                  </div>
                )}
                <div className={plan.textClass}>
                  <div className="font-heading font-bold text-[11px] tracking-widest uppercase opacity-60 mb-1">
                    {plan.name}
                  </div>
                  <div className="font-heading font-bold text-[3.25rem] leading-none mb-1">
                    {plan.price}
                  </div>
                  <div className="text-sm opacity-55 mb-7">
                    {plan.duration} &middot; {plan.riders}
                  </div>
                  <ul className="space-y-2.5 mb-8">
                    {plan.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <span className="mt-0.5 shrink-0 opacity-65">✓</span>
                        <span className="opacity-80">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.a
                    href="#booking"
                    onClick={() => track("intent")}
                    whileHover={rm ? {} : { scale: 1.03 }}
                    whileTap={rm ? {} : { scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 450, damping: 22 }}
                    className={`block text-center font-heading font-bold text-sm tracking-widest uppercase py-4 transition-opacity hover:opacity-85 ${plan.ctaClass}`}
                  >
                    {plan.cta}
                  </motion.a>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Do I need any experience to try e-foiling?",
    a: "Absolutely none. We've helped complete beginners — people who've never surfed, paddled, or even skateboarded — fly on their first session. Our certified instructors use a proven beginner protocol that gets 80% of first-timers flying. Your only job is to show up.",
  },
  {
    q: "How long until I'm actually flying above the water?",
    a: "Most of our riders get their first sustained flight within 15–30 minutes of being on the water. The eFoil's electric motor does the hard work — you focus on balance and gentle throttle control. Your instructor guides you step by step the whole way.",
  },
  {
    q: "What safety gear is included?",
    a: "Every session includes a USCG-approved life vest, a full helmet, and an impact vest — all at no extra charge. We also conduct a thorough safety briefing before every session. You do NOT need to bring any safety equipment.",
  },
  {
    q: "Do I need to know how to swim?",
    a: "Basic water comfort is helpful, but you don't need to be a strong swimmer. You'll be wearing a life vest at all times, you'll be in a calm protected bay with no boat traffic, and our instructors are always on the water right beside you.",
  },
  {
    q: "What should I wear and bring?",
    a: "Swimwear or board shorts, a towel, and sunscreen. Water shoes are a nice-to-have. All safety gear and the eFoil board are provided — just show up ready to have fun.",
  },
  {
    q: "Can I cancel or reschedule my booking?",
    a: "Yes — free cancellation or reschedule up to 24 hours before your session. No questions asked.",
  },
  {
    q: "What's included with the GoPro footage?",
    a: "Every Explorer (2-hour) session and Group session is professionally recorded in HD by one of our crew. Your footage is included at no extra charge — you'll walk away with a shareable highlight of your entire flight.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const rm = useReducedMotion();

  return (
    <section id="faq" className="bg-ocean py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <FadeIn className="text-center mb-14">
          <p className="text-aqua text-xs font-bold tracking-[0.2em] uppercase mb-3">
            First Time? No Worries.
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foam">
            Your Questions,
            <br />
            <span className="text-aqua">Answered.</span>
          </h2>
        </FadeIn>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <div className="border border-aqua/15 overflow-hidden">
                <button
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 group"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-heading font-semibold text-foam text-base leading-snug group-hover:text-aqua transition-colors duration-200">
                    {item.q}
                  </span>
                  <motion.span
                    animate={rm ? {} : { rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.26, ease: EASE }}
                    className="shrink-0 text-aqua text-2xl leading-none font-light mt-0.5"
                    aria-hidden="true"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-aqua/10">
                        <p className="pt-4 text-foam/60 leading-relaxed text-sm">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── LOCATION ───────────────────────────────────────────────────
function Location() {
  const rm = useReducedMotion();
  return (
    <section id="location" className="bg-aqua py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <p className="text-ocean/55 text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Our Riding Zone
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-ocean leading-tight mb-6">
              Calm Water.
              <br />
              The Perfect
              <br />
              Learning Zone.
            </h2>
            <p className="text-ocean/70 leading-relaxed mb-8 max-w-md">
              We operate from a permanently secured, sheltered bay — fully
              protected from boat traffic and ocean swells. The glassy surface
              makes learning dramatically easier, and advanced riding even more
              exhilarating.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Protected from boat traffic & ocean swells",
                "Calm glassy surface — ideal for every skill level",
                "Year-round riding conditions",
                "Private beach area for Group sessions",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-ocean/75 text-sm">
                  <span className="shrink-0 mt-0.5 font-bold text-ocean">✓</span>
                  {point}
                </li>
              ))}
            </ul>
            <motion.a
              href="#booking"
              onClick={() => track("intent")}
              whileHover={rm ? {} : { scale: 1.04, backgroundColor: "#081220" }}
              whileTap={rm ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              className="inline-flex items-center gap-2 bg-ocean text-neon font-heading font-bold px-8 py-4 text-sm tracking-widest transition-colors duration-200"
            >
              BOOK YOUR SESSION
            </motion.a>
          </FadeIn>

          {/* Abstract map graphic */}
          <FadeIn delay={0.12}>
            <div className="relative aspect-square max-w-md mx-auto lg:ml-auto bg-ocean/10 overflow-hidden">
              {/* Grid lines */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`h${i}`}
                  className="absolute left-0 right-0 h-px bg-ocean/12"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                />
              ))}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`v${i}`}
                  className="absolute top-0 bottom-0 w-px bg-ocean/12"
                  style={{ left: `${(i + 1) * 12.5}%` }}
                />
              ))}

              {/* Water area fill */}
              <div className="absolute inset-[15%] bg-ocean/18 rounded-full blur-3xl" />

              {/* Riding zone boundary */}
              <div className="absolute left-[22%] top-[28%] right-[18%] bottom-[28%] border-2 border-ocean/25 border-dashed">
                <div className="absolute inset-0 bg-ocean/8" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4">
                  <div className="font-heading font-bold text-ocean text-[11px] tracking-widest uppercase whitespace-nowrap">
                    RIDING ZONE
                  </div>
                  <div className="text-ocean/55 text-[10px] mt-1">
                    Protected · Calm Water
                  </div>
                </div>
              </div>

              {/* Location pin */}
              <div className="absolute left-[48%] top-[44%]">
                <motion.div
                  animate={rm ? {} : { y: [0, -7, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="30" height="38" viewBox="0 0 30 38" fill="none" aria-hidden="true">
                    <path
                      d="M15 0C6.716 0 0 6.716 0 15c0 10.313 15 23 15 23s15-12.687 15-23C30 6.716 23.284 0 15 0z"
                      fill="#0A1628"
                    />
                    <circle cx="15" cy="15" r="5.5" fill="#00FF94" />
                  </svg>
                </motion.div>
              </div>

              {/* Compass rose */}
              <div className="absolute bottom-4 right-5 text-ocean/40 font-heading font-bold text-[11px] leading-tight text-center">
                <div>N</div>
                <div className="flex gap-1 items-center">
                  <span>W</span>
                  <span className="text-[8px]">+</span>
                  <span>E</span>
                </div>
                <div>S</div>
              </div>

              {/* Scale indicator */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-ocean/35">
                <div className="w-10 h-px bg-ocean/35" />
                <span className="text-[10px] font-heading">500m</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ───────────────────────────────────────────────
const REVIEWS = [
  {
    name: "Sarah M.",
    age: 34,
    text: "Booked the Intro with zero water sports experience. I was flying within 25 minutes — the instructor was endlessly patient and encouraging. Best thing I've done all summer.",
    stars: 5,
    session: "Intro Session",
  },
  {
    name: "James K.",
    age: 43,
    text: "The calm protected water makes all the difference. No chop, no wakes — just pure focus on flying. The GoPro footage left my friends speechless. Worth every dollar.",
    stars: 5,
    session: "Explorer Session",
  },
  {
    name: "Priya T.",
    age: 29,
    text: "Brought 4 friends for a group session. Everyone flew — including the one who claimed she was 'terrified of water.' The 80% first-timer flight guarantee is completely real.",
    stars: 5,
    session: "Group Package",
  },
];

function Testimonials() {
  const rm = useReducedMotion();
  return (
    <section className="bg-foam py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="text-center mb-14">
          <p className="text-orange text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Verified Riders
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-ocean">
            500+ Riders.
            <br />
            <span className="text-aqua">One Common Story.</span>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <FadeIn key={r.name} delay={i * 0.1}>
              <motion.div
                whileHover={rm ? {} : { y: -6 }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                className="bg-white p-8 border border-ocean/8 h-full flex flex-col"
              >
                <div
                  className="flex gap-0.5 mb-5"
                  aria-label={`${r.stars} out of 5 stars`}
                >
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <span key={j} className="text-orange text-lg" aria-hidden="true">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-ocean/70 leading-relaxed flex-1 text-sm italic mb-6">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div>
                  <div className="font-heading font-bold text-ocean text-sm">
                    {r.name}, {r.age}
                  </div>
                  <div className="text-ocean/40 text-xs mt-0.5">{r.session}</div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 text-center" delay={0.2}>
          <div className="inline-flex items-center gap-4 bg-ocean text-foam px-8 py-5">
            <div className="font-heading font-bold text-4xl text-neon">4.9</div>
            <div>
              <div
                className="flex gap-0.5 text-neon text-xl leading-none mb-1"
                aria-label="5 stars"
                aria-hidden="true"
              >
                ★★★★★
              </div>
              <div className="text-foam/45 text-xs">
                Average across 500+ verified rides
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── BOOKING ────────────────────────────────────────────────────
const BOOKING_FIELDS = [
  { name: "name", label: "Your Name", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "tel" },
  { name: "session", label: "Which Session? (Intro $99 / Explorer $169 / Group $389)" },
  { name: "message", label: "Any Questions?", type: "textarea" },
];

function Booking() {
  return (
    <section id="booking" className="bg-ocean py-24 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-aqua/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        <FadeIn className="text-center mb-12">
          <p className="text-neon text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Secure Your Spot
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foam">
            Book Your Session
          </h2>
          <p className="mt-4 text-foam/50 max-w-lg mx-auto">
            Fill in your details and we&apos;ll confirm your preferred time within 2
            hours. Questions first? No commitment yet.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-foam text-ocean p-8 md:p-10">
            <ConversionForm
              startStep="intent"
              submitStep="convert"
              cta="BOOK MY SESSION"
              fields={BOOKING_FIELDS}
            />
          </div>
        </FadeIn>

        <FadeIn
          delay={0.2}
          className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-foam/35"
        >
          <span>✓ Confirmation within 2 hours</span>
          <span>✓ Free cancellation 24h before</span>
          <span>✓ All safety gear included</span>
        </FadeIn>
      </div>
    </section>
  );
}

// ── PAGE ASSEMBLY ──────────────────────────────────────────────
export default function HomeLanding() {
  return (
    <>
      <Hero />
      <StatsTicker />
      <USPs />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Location />
      <Testimonials />
      <Booking />
    </>
  );
}
