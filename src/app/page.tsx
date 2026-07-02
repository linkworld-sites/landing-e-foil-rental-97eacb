"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { track } from "@/lib/funnel";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

// ─── Deterministic particle positions (no Math.random → no hydration mismatch) ──
const HERO_PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  cx: ((i * 41.3 + 20) % 1400) + 20,
  cy: ((i * 27.7 + 15) % 560) + 15,
  r: (i % 3) + 0.6,
  opacity: 0.1 + (i % 5) * 0.035,
  fill: i % 4 === 0 ? "#00C2E8" : "#F5F7FA",
}));

// ─── Hero visual SVG composition ─────────────────────────────────────────────
function HeroVisual() {
  return (
    <svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nGlow" cx="50%" cy="54%" r="32%">
          <stop offset="0%" stopColor="#00FF94" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#00FF94" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="aGlow" cx="50%" cy="56%" r="45%">
          <stop offset="0%" stopColor="#00C2E8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#00C2E8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glows */}
      <rect x="0" y="0" width="1440" height="900" fill="url(#nGlow)" />
      <rect x="0" y="0" width="1440" height="900" fill="url(#aGlow)" />

      {/* Particles */}
      {HERO_PARTICLES.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill} opacity={p.opacity} />
      ))}

      {/* Horizon line */}
      <line x1="0" y1="620" x2="1440" y2="620" stroke="#00C2E8" strokeWidth="0.5" opacity="0.2" />

      {/* Animated water surface */}
      <motion.g
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M0,624 C240,612 480,630 720,618 C960,607 1200,625 1440,618" stroke="#00C2E8" strokeWidth="1.5" opacity="0.55" />
        <path d="M0,638 C300,626 600,644 900,632 C1100,622 1300,637 1440,632" stroke="#00C2E8" strokeWidth="1" opacity="0.3" />
        <path d="M0,652 C360,640 720,657 1080,645 C1260,638 1360,649 1440,645" stroke="#00C2E8" strokeWidth="0.5" opacity="0.18" />
      </motion.g>

      {/* Water fill */}
      <path d="M0,620 C240,608 480,626 720,614 C960,604 1200,620 1440,614 L1440,900 L0,900 Z" fill="#00C2E8" opacity="0.055" />

      {/* ── E-foil silhouette floating above water ── */}
      <motion.g
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
      >
        {/* Speed lines */}
        <line x1="445" y1="475" x2="540" y2="475" stroke="#00FF94" strokeWidth="1.5" opacity="0.22" />
        <line x1="458" y1="484" x2="547" y2="484" stroke="#00C2E8" strokeWidth="1" opacity="0.18" />
        <line x1="452" y1="493" x2="543" y2="493" stroke="#00FF94" strokeWidth="0.75" opacity="0.13" />

        {/* Board main body */}
        <rect x="556" y="469" width="330" height="26" rx="13" fill="#0A1628" stroke="#00FF94" strokeWidth="1.5" />
        {/* Board neon top edge */}
        <rect x="556" y="469" width="330" height="6" rx="3" fill="#00FF94" opacity="0.55" />

        {/* Rider — head */}
        <ellipse cx="700" cy="450" rx="13" ry="14" fill="#F5F7FA" opacity="0.4" />
        {/* Rider — torso */}
        <rect x="693" y="462" width="14" height="20" rx="3" fill="#F5F7FA" opacity="0.28" />
        {/* Rider — arms suggestion */}
        <line x1="680" y1="470" x2="693" y2="468" stroke="#F5F7FA" strokeWidth="2" opacity="0.2" />
        <line x1="707" y1="468" x2="720" y2="470" stroke="#F5F7FA" strokeWidth="2" opacity="0.2" />

        {/* Board underside glow */}
        <ellipse cx="721" cy="489" rx="155" ry="9" fill="#00FF94" opacity="0.07" />
      </motion.g>

      {/* Mast (static — anchors board to foil below) */}
      <line x1="721" y1="495" x2="721" y2="622" stroke="#00C2E8" strokeWidth="3.5" opacity="0.75" strokeLinecap="round" />

      {/* Fuselage */}
      <line x1="656" y1="622" x2="786" y2="622" stroke="#00C2E8" strokeWidth="3.5" opacity="0.7" strokeLinecap="round" />

      {/* Front hydrofoil wing */}
      <path d="M595,624 Q658,584 721,592 Q784,584 847,624" stroke="#00C2E8" strokeWidth="4" opacity="0.75" strokeLinecap="round" />

      {/* Motor pod */}
      <rect x="706" y="616" width="30" height="12" rx="6" fill="#00C2E8" opacity="0.45" />

      {/* Rear stabilizer */}
      <path d="M680,622 Q721,613 762,622" stroke="#00C2E8" strokeWidth="2.5" opacity="0.55" strokeLinecap="round" />

      {/* Mast entry rings */}
      <circle cx="721" cy="622" r="5" fill="none" stroke="#00C2E8" strokeWidth="1" opacity="0.35" />
      <circle cx="721" cy="622" r="11" fill="none" stroke="#00C2E8" strokeWidth="0.5" opacity="0.18" />

      {/* Technical annotation lines */}
      <line x1="888" y1="490" x2="945" y2="474" stroke="#00C2E8" strokeWidth="0.5" opacity="0.22" strokeDasharray="4,4" />
      <text x="950" y="471" fill="#00C2E8" fontSize="9" opacity="0.38" fontFamily="monospace" letterSpacing="2">HYDROFOIL BOARD</text>
      <line x1="852" y1="622" x2="945" y2="638" stroke="#00C2E8" strokeWidth="0.5" opacity="0.22" strokeDasharray="4,4" />
      <text x="950" y="641" fill="#00C2E8" fontSize="9" opacity="0.38" fontFamily="monospace" letterSpacing="2">ELECTRIC MOTOR</text>
    </svg>
  );
}

// ─── 1. HERO ─────────────────────────────────────────────────────────────────
function HeroSection() {
  const [session, setSession] = useState<"1hr" | "2hr" | "half">( "1hr");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.65], [0, -40]);

  const sessions = [
    { id: "1hr" as const, label: "1 HR" },
    { id: "2hr" as const, label: "2 HRS" },
    { id: "half" as const, label: "HALF DAY" },
  ];

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] overflow-hidden bg-ocean">
      {/* Background visual */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0 origin-center">
        <HeroVisual />
      </motion.div>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean/40 via-transparent to-ocean/60 pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6"
      >
        {/* Pre-headline badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="inline-flex items-center gap-2 border border-neon/40 text-neon text-xs font-heading font-bold tracking-[0.2em] px-4 py-2 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
          ELECTRIC. SILENT. SURREAL.
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="font-heading font-bold text-foam leading-none tracking-tight text-[clamp(72px,12vw,180px)]"
        >
          RIDE THE SKY
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
          className="mt-4 text-foam/70 text-lg md:text-xl max-w-lg leading-relaxed"
        >
          No experience. No excuses. Just fly.
        </motion.p>

        {/* Session picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="mt-10 flex items-center gap-2 border border-foam/20 p-1"
        >
          {sessions.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSession(id)}
              className={`px-5 py-2 font-heading font-bold text-xs tracking-[0.15em] transition-all duration-200 ${
                session === id
                  ? "bg-neon text-ocean"
                  : "text-foam/60 hover:text-foam"
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
          className="mt-8"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/book"
            onClick={() => track("intent")}
            className="inline-flex items-center gap-3 bg-neon text-ocean font-heading font-bold px-10 py-4 text-base tracking-[0.12em] hover:bg-orange transition-colors duration-200"
          >
            BOOK YOUR FLIGHT
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-foam/30 text-xs font-heading tracking-[0.2em]">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-foam/30 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── 2. FEELING STRIP ─────────────────────────────────────────────────────────
const STRIP_ITEMS = ["FLY", "GLIDE", "ZERO CHOP", "ELECTRIC", "NO EXPERIENCE NEEDED"];

function FeelingStrip() {
  const x = useMotionValue(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const shouldReduce = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (shouldReduce) return;
    const vel = Math.abs(scrollVelocity.get());
    const speed = Math.min(80 + vel * 0.065, 290);
    const inner = innerRef.current;
    if (!inner) return;
    const halfWidth = inner.scrollWidth / 2;
    if (halfWidth <= 0) return;
    let newX = x.get() - speed * (delta / 1000);
    if (newX <= -halfWidth) newX += halfWidth;
    x.set(newX);
  });

  const doubled = [...STRIP_ITEMS, ...STRIP_ITEMS];

  return (
    <div className="overflow-hidden bg-ocean border-y border-aqua/15 py-5 select-none" aria-hidden="true">
      <motion.div ref={innerRef} className="flex whitespace-nowrap" style={{ x }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="font-heading font-bold text-aqua tracking-[0.08em] text-2xl md:text-4xl px-8">
              {item}
            </span>
            <span className="text-orange font-bold text-xl">—</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── 3. EXPLAINER ─────────────────────────────────────────────────────────────
function ExplainerSection() {
  const shouldReduce = useReducedMotion();

  const points = [
    { num: "01", text: "An electric motor powers a hydrofoil wing beneath the board." },
    { num: "02", text: "At speed, the wing generates lift — the board rises above the water." },
    { num: "03", text: "You're flying. Silently. On a board. Above the ocean." },
    { num: "04", text: "No waves needed. No surfing experience. Just stand up and fly." },
  ];

  return (
    <section className="bg-foam py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: technical diagram */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="bg-ocean rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center p-8">
              <svg viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Water line */}
                <line x1="30" y1="175" x2="470" y2="175" stroke="#00C2E8" strokeWidth="1" strokeDasharray="6,4" opacity="0.4" />
                <text x="30" y="170" fill="#00C2E8" fontSize="8" opacity="0.5" fontFamily="monospace">WATER SURFACE</text>

                {/* Board on water */}
                <rect x="150" y="158" width="200" height="18" rx="9" fill="#0A1628" stroke="#00FF94" strokeWidth="1.5" />
                <rect x="150" y="158" width="200" height="6" rx="3" fill="#00FF94" opacity="0.6" />
                <text x="180" y="152" fill="#F5F7FA" fontSize="9" opacity="0.6" fontFamily="monospace" letterSpacing="1">BOARD</text>

                {/* Rider silhouette */}
                <ellipse cx="230" cy="144" rx="10" ry="11" fill="#F5F7FA" opacity="0.35" />
                <rect x="224" y="153" width="12" height="16" rx="3" fill="#F5F7FA" opacity="0.25" />

                {/* Mast */}
                <line x1="250" y1="176" x2="250" y2="240" stroke="#00C2E8" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                <text x="258" y="210" fill="#00C2E8" fontSize="8" opacity="0.5" fontFamily="monospace">MAST</text>

                {/* Fuselage */}
                <line x1="205" y1="240" x2="295" y2="240" stroke="#00C2E8" strokeWidth="3" opacity="0.75" strokeLinecap="round" />

                {/* Front wing */}
                <path d="M165,242 Q207,208 250,215 Q293,208 335,242" stroke="#00C2E8" strokeWidth="3.5" opacity="0.8" strokeLinecap="round" />

                {/* Motor */}
                <rect x="236" y="235" width="28" height="10" rx="5" fill="#00C2E8" opacity="0.55" />
                <text x="238" y="264" fill="#00C2E8" fontSize="8" opacity="0.5" fontFamily="monospace">MOTOR</text>

                {/* Stabilizer */}
                <path d="M222,240 Q250,232 278,240" stroke="#00C2E8" strokeWidth="2" opacity="0.5" strokeLinecap="round" />

                {/* Lift arrow */}
                <motion.g
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <line x1="370" y1="220" x2="370" y2="165" stroke="#00FF94" strokeWidth="1.5" opacity="0.7" />
                  <path d="M363,172 L370,158 L377,172" fill="#00FF94" opacity="0.7" />
                  <text x="380" y="195" fill="#00FF94" fontSize="9" opacity="0.7" fontFamily="monospace" letterSpacing="1">LIFT</text>
                </motion.g>

                {/* Speed arrows */}
                <line x1="100" y1="215" x2="140" y2="215" stroke="#FF5C2B" strokeWidth="1.5" opacity="0.5" />
                <path d="M133,210 L143,215 L133,220" fill="#FF5C2B" opacity="0.5" />
                <text x="70" y="219" fill="#FF5C2B" fontSize="8" opacity="0.5" fontFamily="monospace">SPEED</text>

                {/* Labels */}
                <text x="155" y="295" fill="#00C2E8" fontSize="9" opacity="0.4" fontFamily="monospace" letterSpacing="2">HYDROFOIL CROSS-SECTION</text>
              </svg>
            </div>
            <div className="absolute top-4 left-4 font-heading text-xs font-bold text-neon tracking-[0.2em] opacity-60">
              HOW IT WORKS
            </div>
          </motion.div>

          {/* Right: 4 punchy points */}
          <div className="space-y-8">
            <motion.p
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-bold text-xs text-aqua tracking-[0.2em] uppercase"
            >
              What is an E-Foil?
            </motion.p>

            {points.map((p, i) => (
              <motion.div
                key={p.num}
                initial={shouldReduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="flex items-start gap-5"
              >
                <span className="font-heading font-bold text-2xl text-neon leading-none mt-0.5 shrink-0">
                  {p.num}
                </span>
                <p className="text-ocean text-lg leading-snug font-medium">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. PRICING ───────────────────────────────────────────────────────────────
const PACKAGES = [
  {
    name: "INTRO SESSION",
    duration: "1 Hour",
    price: "€89",
    tag: "Perfect first flight",
    features: ["Safety briefing included", "Instructor on the water", "All gear provided"],
    accent: "aqua",
    featured: false,
  },
  {
    name: "EXPLORER RIDE",
    duration: "2 Hours",
    price: "€149",
    tag: "Most popular",
    features: ["Everything in Intro", "Time to really fly", "Go further from shore"],
    accent: "neon",
    featured: true,
  },
  {
    name: "SUNSET SESSION",
    duration: "1.5 Hours",
    price: "€129",
    tag: "The magic hour",
    features: ["Golden hour timing", "Perfect for photos/video", "Quietest water of the day"],
    accent: "orange",
    featured: false,
  },
];

function PricingSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="pricing" className="bg-ocean py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-heading font-bold text-xs text-aqua tracking-[0.2em] uppercase mb-4">
            Choose Your Session
          </p>
          <h2 className="font-heading font-bold text-foam text-[clamp(40px,6vw,72px)] leading-none tracking-tight">
            PICK YOUR FLIGHT
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg, i) => {
            const accentColor =
              pkg.accent === "neon"
                ? "#00FF94"
                : pkg.accent === "aqua"
                ? "#00C2E8"
                : "#FF5C2B";

            return (
              <motion.div
                key={pkg.name}
                initial={shouldReduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                whileHover={{ y: -8, boxShadow: `0 24px 60px ${accentColor}25` }}
                className={`relative group rounded-2xl border overflow-hidden cursor-pointer ${
                  pkg.featured
                    ? "border-neon/50 bg-[#0f2036]"
                    : "border-aqua/20 bg-[#0d1c30]"
                }`}
              >
                {/* Featured label */}
                {pkg.featured && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-neon" />
                )}

                {/* Shimmer overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${accentColor}12, transparent 70%)`,
                  }}
                />

                <div className="p-8">
                  {/* Tag */}
                  <div
                    className="inline-block font-heading font-bold text-xs tracking-[0.15em] px-3 py-1 mb-6"
                    style={{ color: accentColor, borderColor: `${accentColor}40`, border: "1px solid" }}
                  >
                    {pkg.tag.toUpperCase()}
                  </div>

                  {/* Package name */}
                  <h3 className="font-heading font-bold text-foam text-2xl leading-tight tracking-tight">
                    {pkg.name}
                  </h3>
                  <p className="text-foam/50 text-sm mt-1">{pkg.duration}</p>

                  {/* Price */}
                  <div className="my-8">
                    <span
                      className="font-heading font-bold text-[clamp(52px,7vw,72px)] leading-none"
                      style={{ color: accentColor }}
                    >
                      {pkg.price}
                    </span>
                    <span className="text-foam/40 text-sm ml-2">per person</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-10">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-foam/70 text-sm">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6.5" stroke={accentColor} strokeOpacity="0.4" />
                          <path d="M4 7L6 9L10 5" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/book"
                      onClick={() => track("intent")}
                      className="block text-center font-heading font-bold text-sm tracking-[0.15em] py-3 transition-colors duration-200"
                      style={{
                        backgroundColor: accentColor,
                        color: "#0A1628",
                      }}
                    >
                      RESERVE
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 5. HOW IT WORKS ─────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Book",
    copy: "Pick your session. We confirm within the hour.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="7" width="22" height="20" rx="2" stroke="#00C2E8" strokeWidth="1.5" />
        <line x1="10" y1="4" x2="10" y2="10" stroke="#00C2E8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="4" x2="22" y2="10" stroke="#00C2E8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="14" x2="27" y2="14" stroke="#00C2E8" strokeWidth="1.5" />
        <rect x="10" y="18" width="4" height="4" rx="0.5" fill="#00FF94" opacity="0.8" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Show Up",
    copy: "Arrive at our launch spot. We have everything ready.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="13" r="4" stroke="#00C2E8" strokeWidth="1.5" />
        <path d="M16 19C10.477 19 6 23 6 27H26C26 23 21.523 19 16 19Z" stroke="#00C2E8" strokeWidth="1.5" />
        <path d="M16 2V6M24 4.4L21.5 7.6M27 12H23M24 20L21.5 17" stroke="#00FF94" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Brief Lesson",
    copy: "15 minutes of coaching. You'll fly faster than you expect.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 24L16 8L24 24" stroke="#00C2E8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10.5" y1="19" x2="21.5" y2="19" stroke="#00C2E8" strokeWidth="1.5" />
        <circle cx="16" cy="8" r="3" stroke="#00FF94" strokeWidth="1.5" opacity="0.8" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Fly",
    copy: "Time on the board is yours. We're nearby if you need us.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 22L12 14L17 19L22 10L28 16" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 27H26" stroke="#00C2E8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="28" cy="16" r="3" fill="#00FF94" opacity="0.8" />
      </svg>
    ),
  },
];

function HowItWorksSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="how-it-works" className="bg-foam py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Intro */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-20"
        >
          <p className="font-heading font-bold text-xs text-aqua tracking-[0.2em] uppercase mb-4">
            From Click to Flight
          </p>
          <h2 className="font-heading font-bold text-ocean text-[clamp(36px,5vw,64px)] leading-none tracking-tight mb-6">
            FOUR STEPS TO THE SKY
          </h2>
          <p className="text-ocean/60 text-lg leading-relaxed">
            You&apos;ll figure out the foil in 15 minutes. The smile takes longer to wipe off.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={shouldReduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-4 left-[calc(100%+0px)] w-8 h-px bg-aqua/25 z-0" />
              )}

              <div className="bg-ocean/5 border border-ocean/10 rounded-2xl p-6 h-full">
                {/* Icon */}
                <div className="mb-5">{step.icon}</div>

                {/* Step number */}
                <div className="font-heading font-bold text-neon text-4xl leading-none mb-3 opacity-80">
                  {step.num}
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-ocean text-xl mb-2">{step.title}</h3>

                {/* Copy */}
                <p className="text-ocean/60 text-sm leading-relaxed">{step.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 6. LOCATION ─────────────────────────────────────────────────────────────
function LocationSection() {
  const shouldReduce = useReducedMotion();

  const conditions = [
    { label: "Wind", value: "8 kts SW", icon: "↗" },
    { label: "Water Temp", value: "22°C", icon: "🌊" },
    { label: "Visibility", value: "20 km", icon: "◎" },
    { label: "Session Status", value: "OPEN", icon: "✓" },
  ];

  return (
    <section className="bg-aqua py-24 md:py-32 relative overflow-hidden">
      {/* Background grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="400" stroke="#0A1628" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#0A1628" strokeWidth="0.5" />
        ))}
        <circle cx="400" cy="200" r="80" stroke="#0A1628" strokeWidth="0.5" fill="none" />
        <circle cx="400" cy="200" r="160" stroke="#0A1628" strokeWidth="0.5" fill="none" />
        <circle cx="400" cy="200" r="240" stroke="#0A1628" strokeWidth="0.5" fill="none" />
        <circle cx="400" cy="200" r="6" fill="#0A1628" opacity="0.6" />
        <line x1="394" y1="200" x2="254" y2="200" stroke="#0A1628" strokeWidth="0.5" strokeDasharray="6,4" />
        <line x1="400" y1="194" x2="400" y2="60" stroke="#0A1628" strokeWidth="0.5" strokeDasharray="6,4" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-heading font-bold text-xs text-ocean/60 tracking-[0.2em] uppercase mb-4">
              Launch Site
            </p>
            <h2 className="font-heading font-bold text-ocean text-[clamp(36px,5vw,60px)] leading-none tracking-tight mb-6">
              FIND YOUR FLIGHT
            </h2>
            <p className="text-ocean text-xl font-medium mb-2">Marina del Foil, Berth 12</p>
            <p className="text-ocean/60 text-base mb-10 leading-relaxed">
              Calm protected waters, easy road access, parking on site.
              We&apos;re at the water&apos;s edge — you can&apos;t miss us.
            </p>
            <div className="inline-block bg-ocean/10 border border-ocean/20 px-6 py-4 rounded-xl">
              <p className="font-heading font-bold text-ocean text-sm tracking-wide">
                &ldquo;Conditions are good today.
                <br />
                Your calendar isn&apos;t.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Right: conditions widget */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <div className="bg-ocean rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-aqua/15 flex items-center justify-between">
                <span className="font-heading font-bold text-xs text-foam/50 tracking-[0.2em] uppercase">
                  Today&apos;s Conditions
                </span>
                <span className="flex items-center gap-1.5 text-neon text-xs font-heading font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="divide-y divide-aqua/10">
                {conditions.map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={shouldReduce ? false : { opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <span className="text-foam/50 text-sm">{c.label}</span>
                    <span
                      className={`font-heading font-bold text-sm ${
                        c.label === "Session Status" ? "text-neon" : "text-foam"
                      }`}
                    >
                      {c.value}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="px-6 py-5">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/book"
                    onClick={() => track("intent")}
                    className="block text-center bg-neon text-ocean font-heading font-bold text-sm tracking-[0.15em] py-3 hover:bg-orange transition-colors duration-200"
                  >
                    BOOK TODAY&apos;S SESSION
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. SOCIAL PROOF ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Jamie", quote: "I was standing on the water within 10 minutes. Genuinely insane.", bg: "bg-[#0d1c30]", accent: "aqua" },
  { name: "Alex", quote: "The Sunset Session was the best hour of our whole holiday.", bg: "bg-ocean", accent: "neon" },
  { name: "Sarah", quote: "Told myself I'd never be a water sports person. Lied.", bg: "bg-[#0f2036]", accent: "orange" },
  { name: "Marcus", quote: "Brought my 45-year-old dad. He cried. Good crying.", bg: "bg-ocean", accent: "aqua" },
  { name: "Priya", quote: "Booked on impulse. Rescheduled nothing. Zero regrets.", bg: "bg-[#0d1c30]", accent: "neon" },
  { name: "Tom", quote: "The silence when you lift up is something else. Nothing prepares you.", bg: "bg-[#0f2036]", accent: "aqua" },
  { name: "Claudia", quote: "I'm not sporty. I'm not outdoorsy. I flew above the ocean. Make it make sense.", bg: "bg-ocean", accent: "orange" },
  { name: "Kai", quote: "Came for one session. Came back four times in a week.", bg: "bg-[#0d1c30]", accent: "neon" },
];

function SocialProofSection() {
  const shouldReduce = useReducedMotion();

  // Split into two columns for parallax
  const col1 = TESTIMONIALS.filter((_, i) => i % 2 === 0);
  const col2 = TESTIMONIALS.filter((_, i) => i % 2 === 1);

  return (
    <section className="bg-ocean py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="font-heading font-bold text-xs text-aqua tracking-[0.2em] uppercase mb-4">
            Real People. Real Flights.
          </p>
          <h2 className="font-heading font-bold text-foam text-[clamp(36px,5vw,64px)] leading-none tracking-tight">
            WHAT THEY SAID
          </h2>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <TestimonialColumn cards={col1} yStart={0} yEnd={-30} shouldReduce={shouldReduce ?? false} />
          <TestimonialColumn cards={col2} yStart={-20} yEnd={20} shouldReduce={shouldReduce ?? false} />
        </div>
      </div>
    </section>
  );
}

function TestimonialColumn({
  cards,
  yStart,
  yEnd,
  shouldReduce,
}: {
  cards: typeof TESTIMONIALS;
  yStart: number;
  yEnd: number;
  shouldReduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${yStart}px`, `${yEnd}px`]);

  return (
    <motion.div ref={ref} style={shouldReduce ? {} : { y }} className="space-y-6">
      {cards.map((t, i) => {
        const accentColor =
          t.accent === "neon" ? "#00FF94" : t.accent === "aqua" ? "#00C2E8" : "#FF5C2B";
        return (
          <motion.div
            key={t.name}
            initial={shouldReduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
            className={`${t.bg} border border-aqua/15 rounded-2xl p-7`}
          >
            <div className="text-3xl mb-4" style={{ color: accentColor }} aria-hidden="true">
              "
            </div>
            <p className="text-foam text-base md:text-lg leading-snug font-medium mb-5">
              {t.quote}
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs text-ocean"
                style={{ backgroundColor: accentColor }}
              >
                {t.name[0]}
              </div>
              <span className="text-foam/50 text-sm font-heading font-bold tracking-wide">
                {t.name}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── 8. FAQ ───────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Can I do this with zero experience?",
    a: "Absolutely. Most guests are flying within 10–15 minutes. We've taught beginners from age 12 to 70. If you can balance on two feet, you can ride an e-foil.",
  },
  {
    q: "What do I wear?",
    a: "Swimwear or a wetsuit works perfectly. We provide all safety gear including a life vest and helmet. Bring a change of clothes and sunscreen.",
  },
  {
    q: "Are there age or weight restrictions?",
    a: "Riders must be at least 12 years old. Under 18s need a guardian present. Weight limit is 120kg. That's it.",
  },
  {
    q: "What if I fall in?",
    a: "You will fall in — it's part of the experience. The e-foil automatically kills the motor on impact, so it's completely safe. The water's warm and the board floats.",
  },
  {
    q: "How long until I'm actually flying?",
    a: "Most people lift off for the first time within 15 minutes. A few take a bit longer. Exactly zero people have done a session and not wanted to come back.",
  },
  {
    q: "Can I book a group session?",
    a: "Yes — we accommodate groups of up to 8. Book multiple back-to-back sessions and we handle the logistics. Email us for group rates.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ocean/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left gap-6"
      >
        <span className="font-body font-medium text-ocean text-base md:text-lg">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="shrink-0 text-aqua"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-ocean/65 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="faq" className="bg-foam py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <p className="font-heading font-bold text-xs text-aqua tracking-[0.2em] uppercase mb-4">
            Before You Book
          </p>
          <h2 className="font-heading font-bold text-ocean text-[clamp(36px,5vw,64px)] leading-none tracking-tight">
            GOOD QUESTIONS
          </h2>
        </motion.div>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={item.q}
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
            >
              <FAQItem q={item.q} a={item.a} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 9. FOOTER CTA BAND ──────────────────────────────────────────────────────
function FooterCTASection() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="bg-neon py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.h2
          initial={shouldReduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-bold text-ocean leading-none tracking-tight text-[clamp(36px,6vw,80px)] mb-10"
        >
          YOUR FIRST FLIGHT IS ONE CLICK AWAY
        </motion.h2>

        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/book"
            onClick={() => track("intent")}
            className="inline-flex items-center gap-3 bg-ocean text-neon font-heading font-bold px-12 py-5 text-base tracking-[0.15em] hover:bg-[#0f2036] transition-colors duration-200"
          >
            BOOK NOW
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.5 9H14.5M14.5 9L9.5 4M14.5 9L9.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <FeelingStrip />
        <ExplainerSection />
        <PricingSection />
        <HowItWorksSection />
        <LocationSection />
        <SocialProofSection />
        <FAQSection />
        <FooterCTASection />
      </main>
      <Footer />
    </>
  );
}
