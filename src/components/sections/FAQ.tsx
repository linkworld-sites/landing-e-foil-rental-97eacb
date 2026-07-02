"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const faqs = [
  {
    q: "Do I need any surfing or water sports experience?",
    a: "None whatsoever. The eFoil is different from surfing — it's electric-powered, so balance and throttle control is all you need. Our instructors start you from zero and have an 80% first-session flight rate to prove it.",
  },
  {
    q: "What exactly is included in the price?",
    a: "Everything: safety gear (life vest, helmet, impact vest), a certified on-site instructor, the full session time on the board, and insurance. Explorer and Group sessions also include GoPro HD footage at no extra charge.",
  },
  {
    q: "What should I wear?",
    a: "Swimwear or board shorts work great. A wetsuit is optional but not necessary — we ride in protected, calm water. We provide all the safety gear, so just show up comfortably.",
  },
  {
    q: "How hard is it to actually fly above the water?",
    a: "Easier than you'd think. Most riders get airborne within the first session. The 2024 Lift eFoils are highly stable at beginner speeds, and our instructors walk you through every step.",
  },
  {
    q: "What happens if I can't make my booking?",
    a: "Life happens. You can cancel or reschedule up to 24 hours before your session for a full refund. No questions asked.",
  },
  {
    q: "How many people can ride at once?",
    a: "The Intro and Explorer sessions are for one rider at a time, so you get full instructor attention. The Group Package accommodates up to 4 riders simultaneously with a dedicated instructor team.",
  },
];

function FAQItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduce ? { duration: 0 } : { delay, duration: 0.55, ease }}
      className="border-b border-ocean/10 last:border-none"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between py-6 text-left gap-6 group"
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-ocean text-base leading-snug group-hover:text-orange transition-colors duration-200">
          {q}
        </span>
        <motion.span
          animate={shouldReduce ? {} : { rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="shrink-0 mt-0.5 text-orange text-xl font-light leading-none"
          aria-hidden
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={shouldReduce ? { duration: 0 } : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-ocean/65 text-sm leading-relaxed max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const shouldReduce = useReducedMotion();

  return (
    <section id="faq" ref={ref} className="bg-foam py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduce ? { duration: 0 } : { duration: 0.6, ease }}
            className="lg:sticky lg:top-32 self-start"
          >
            <p className="font-heading text-xs font-bold text-ocean/40 tracking-[0.3em] uppercase mb-4">
              Questions
            </p>
            <h2 className="font-heading text-[clamp(2.4rem,5vw,4rem)] font-bold text-ocean leading-tight">
              GOT A<br />
              <span className="text-orange">QUESTION?</span>
            </h2>
            <p className="mt-5 text-ocean/55 text-base leading-relaxed max-w-sm">
              Everything you need to know before booking your first session.
            </p>
          </motion.div>

          <div>
            {inView &&
              faqs.map((faq, i) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} delay={0.1 + i * 0.07} />
              ))}
            {!inView &&
              faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} delay={0} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
