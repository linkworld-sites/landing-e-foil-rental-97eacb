"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Link from "next/link";
import { track } from "@/lib/funnel";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function CTABand() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const shouldReduce = useReducedMotion();

  return (
    <section ref={ref} className="bg-orange py-20 md:py-28 overflow-hidden relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(10,22,40,0.2) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.5, ease }}
          className="font-heading text-xs font-bold text-ocean/50 tracking-[0.3em] uppercase mb-6"
        >
          Ready To Fly?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduce ? { duration: 0 } : { delay: 0.1, duration: 0.7, ease }}
          className="font-heading text-[clamp(2.8rem,8vw,6rem)] font-bold text-ocean leading-[0.9] mb-8"
        >
          FEEL THE<br />IMPOSSIBLE.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={shouldReduce ? { duration: 0 } : { delay: 0.3, duration: 0.6 }}
          className="text-ocean/65 text-lg mb-10 max-w-xl mx-auto"
        >
          Join 500+ riders who discovered what it feels like to glide silently above the water. No experience needed — we&apos;ll get you flying.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={shouldReduce ? { duration: 0 } : { delay: 0.42, duration: 0.6, ease }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={shouldReduce ? {} : { scale: 1.06 }}
            whileTap={shouldReduce ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <Link
              href="/book"
              onClick={() => track("intent")}
              className="inline-flex items-center gap-2 bg-ocean text-foam font-heading font-bold px-8 py-5 text-base tracking-wider hover:bg-neon hover:text-ocean transition-colors duration-200"
            >
              BOOK YOUR SESSION <span aria-hidden>→</span>
            </Link>
          </motion.div>

          <motion.a
            href="#pricing"
            whileHover={shouldReduce ? {} : { scale: 1.03 }}
            className="inline-flex items-center gap-2 border-2 border-ocean/30 text-ocean/75 hover:border-ocean hover:text-ocean font-medium px-8 py-5 text-base transition-all duration-200"
          >
            SEE PRICING
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={shouldReduce ? { duration: 0 } : { delay: 0.6, duration: 0.5 }}
          className="mt-8 text-xs text-ocean/45 tracking-wide"
        >
          Free 24-hour cancellation · All-inclusive pricing · No hidden fees
        </motion.p>
      </div>
    </section>
  );
}
