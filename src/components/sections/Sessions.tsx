"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Link from "next/link";
import { track } from "@/lib/funnel";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const sessions = [
  {
    id: "intro",
    name: "INTRO",
    tagline: "Try eFoiling",
    duration: "45 minutes",
    capacity: "1 rider",
    price: "$99",
    popular: false,
    bg: "bg-ocean",
    border: "border-aqua/20",
    accentText: "text-aqua",
    accentBg: "bg-aqua",
    ctaBg: "bg-aqua text-ocean",
    ctaHover: "hover:bg-neon",
    features: [
      "Safety gear, helmet & life vest",
      "Certified patient instructor",
      "Beginner Lift eFoil board",
      "Shore-based photo included",
      "Protected calm-water zone",
      "Online booking, instant confirm",
    ],
  },
  {
    id: "explorer",
    name: "EXPLORER",
    tagline: "Go the distance",
    duration: "2 hours",
    capacity: "1 rider",
    price: "$169",
    popular: true,
    bg: "bg-aqua",
    border: "border-ocean/10",
    accentText: "text-ocean",
    accentBg: "bg-ocean",
    ctaBg: "bg-neon text-ocean",
    ctaHover: "hover:bg-ocean hover:text-foam",
    features: [
      "2024 Lift eFoil premium board",
      "GoPro HD footage included FREE",
      "Full bay riding access",
      "Post-session coaching tips",
      "Safety gear + insurance",
      "Flexible 24-hr cancellation",
    ],
  },
  {
    id: "group",
    name: "GROUP",
    tagline: "Bring your crew",
    duration: "Half day",
    capacity: "Up to 4 riders",
    price: "$389",
    popular: false,
    bg: "bg-orange",
    border: "border-ocean/10",
    accentText: "text-ocean",
    accentBg: "bg-ocean",
    ctaBg: "bg-ocean text-foam",
    ctaHover: "hover:bg-foam hover:text-ocean",
    features: [
      "4 premium Lift eFoil boards",
      "Dedicated instructor team",
      "GoPro footage per rider",
      "Private beach area reserved",
      "Custom scheduling & timing",
      "Group photo package",
    ],
  },
];

export function Sessions() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const shouldReduce = useReducedMotion();

  return (
    <section id="pricing" ref={ref} className="bg-foam py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.6, ease }}
          className="mb-16 text-center"
        >
          <p className="font-heading text-xs font-bold text-ocean/40 tracking-[0.3em] uppercase mb-4">
            Sessions & Pricing
          </p>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,4.5rem)] font-bold text-ocean leading-tight">
            CHOOSE YOUR<br />
            <span className="text-orange">ADVENTURE.</span>
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-ocean/55 text-base leading-relaxed">
            All sessions include safety gear, a certified instructor, and flexible
            24-hour cancellation. No hidden fees — ever.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={shouldReduce ? { duration: 0 } : { delay: i * 0.12, duration: 0.65, ease }}
              whileHover={shouldReduce ? {} : { y: -6, scale: 1.01 }}
              transition-type="spring"
              className={`relative ${s.bg} ${s.border} border rounded-sm overflow-hidden flex flex-col`}
            >
              {s.popular && (
                <div className="absolute top-4 right-4 bg-neon text-ocean text-[10px] font-heading font-bold tracking-widest px-2.5 py-1">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8 flex-1">
                <p className={`font-heading text-xs font-bold tracking-[0.3em] ${s.accentText} mb-2`}>
                  {s.tagline}
                </p>
                <h3 className={`font-heading text-3xl font-bold ${s.id === "explorer" ? "text-ocean" : "text-foam"} mb-1`}>
                  {s.name}
                </h3>
                <p className={`text-sm ${s.id === "explorer" ? "text-ocean/60" : "text-foam/50"} mb-8`}>
                  {s.duration} · {s.capacity}
                </p>

                <div className={`font-heading text-6xl font-bold ${s.id === "explorer" ? "text-ocean" : "text-foam"} mb-8 leading-none`}>
                  {s.price}
                </div>

                <ul className="space-y-3">
                  {s.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${s.id === "explorer" ? "text-ocean/75" : "text-foam/70"}`}>
                      <svg
                        className={`mt-0.5 h-4 w-4 shrink-0 ${s.accentText}`}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 8.5L6.5 12L13 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0">
                <motion.div
                  whileHover={shouldReduce ? {} : { scale: 1.03 }}
                  whileTap={shouldReduce ? {} : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Link
                    href="/book"
                    onClick={() => track("intent")}
                    className={`block w-full py-4 text-center font-heading font-bold text-sm tracking-wider ${s.ctaBg} ${s.ctaHover} transition-colors duration-200`}
                  >
                    BOOK THIS SESSION →
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={shouldReduce ? { duration: 0 } : { delay: 0.6, duration: 0.5 }}
          className="mt-10 text-center text-xs text-ocean/40"
        >
          All prices include safety gear, instructor, and insurance. Group discounts available for 5+ riders — <Link href="/book" className="underline hover:text-ocean/70">contact us</Link>.
        </motion.p>
      </div>
    </section>
  );
}
