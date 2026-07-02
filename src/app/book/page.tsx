"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/lib/funnel";
import { FUNNEL_COMPANY_ID, FUNNEL_API } from "@/funnel-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const PACKAGES = [
  { id: "intro", label: "Intro Session", price: "€89", duration: "1 hour" },
  { id: "explorer", label: "Explorer Ride", price: "€149", duration: "2 hours" },
  { id: "sunset", label: "Sunset Session", price: "€129", duration: "1.5 hours" },
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function BookPage() {
  const [pkg, setPkg] = useState("intro");
  const [state, setState] = useState<FormState>("idle");
  const startedRef = useRef(false);

  // Track booking_start immediately when page loads
  useEffect(() => {
    track("booking_start");
  }, []);

  const onFirstInteraction = () => {
    if (startedRef.current) return;
    startedRef.current = true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("submitting");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = { ...data, package: pkg };

    track("booking_confirmed", { package: pkg });
    track("convert", { package: pkg });

    try {
      if (FUNNEL_COMPANY_ID) {
        await fetch(`${FUNNEL_API}/api/companies/${FUNNEL_COMPANY_ID}/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "booking_confirmed", fields: payload }),
        }).catch(() => undefined);
      }
      setState("success");
    } catch {
      setState("error");
    }
  };

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-foam">
        {/* Hero banner */}
        <div className="bg-ocean pt-32 pb-16 px-6">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-foam/40 hover:text-foam/80 text-sm transition-colors mb-8"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 8H3M3 8L8 3M3 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Back to home
            </Link>
            <p className="font-heading font-bold text-xs text-aqua tracking-[0.2em] uppercase mb-4">
              Reserve Your Session
            </p>
            <h1 className="font-heading font-bold text-foam text-[clamp(40px,6vw,72px)] leading-none tracking-tight">
              BOOK YOUR FLIGHT
            </h1>
            <p className="mt-4 text-foam/60 text-lg max-w-lg">
              We confirm within the hour. Show up and fly.
            </p>
          </div>
        </div>

        {/* Form area */}
        <div className="mx-auto max-w-3xl px-6 py-16">
          <AnimatePresence mode="wait">
            {state === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 rounded-full bg-neon flex items-center justify-center mx-auto mb-8">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14L11.5 19.5L22 9" stroke="#0A1628" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="font-heading font-bold text-ocean text-4xl mb-4">
                  YOU&apos;RE BOOKED IN
                </h2>
                <p className="text-ocean/60 text-lg max-w-md mx-auto mb-10">
                  We&apos;ll confirm your session within the hour. Check your email and get ready to fly.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-aqua font-heading font-bold text-sm tracking-wider hover:text-ocean transition-colors"
                >
                  ← Back to home
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onSubmit={handleSubmit}
                onFocus={onFirstInteraction}
                className="space-y-8"
              >
                {/* Package selection */}
                <div>
                  <label className="block font-heading font-bold text-xs text-ocean/50 tracking-[0.2em] uppercase mb-4">
                    Choose Your Session
                  </label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {PACKAGES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPkg(p.id)}
                        className={`text-left border-2 rounded-xl p-4 transition-all duration-200 ${
                          pkg === p.id
                            ? "border-neon bg-ocean text-foam"
                            : "border-ocean/15 bg-white text-ocean hover:border-aqua/50"
                        }`}
                      >
                        <div className="font-heading font-bold text-sm tracking-wide">{p.label}</div>
                        <div className={`text-xs mt-1 ${pkg === p.id ? "text-foam/60" : "text-ocean/50"}`}>
                          {p.duration}
                        </div>
                        <div
                          className={`font-heading font-bold text-xl mt-2 ${
                            pkg === p.id ? "text-neon" : "text-ocean"
                          }`}
                        >
                          {p.price}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Your Name" name="name" required placeholder="e.g. Alex" />
                  <FormField label="Email Address" name="email" type="email" required placeholder="you@email.com" />
                </div>

                {/* Phone + Date */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Phone (optional)" name="phone" type="tel" placeholder="+44 7..." />
                  <FormField label="Preferred Date" name="date" type="date" />
                </div>

                {/* Message */}
                <div>
                  <label className="block font-heading font-bold text-xs text-ocean/50 tracking-[0.2em] uppercase mb-2">
                    Anything else?
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Group booking? Special occasion? Let us know."
                    className="w-full border border-ocean/15 rounded-xl bg-white px-4 py-3 text-ocean placeholder:text-ocean/30 focus:outline-none focus:border-aqua transition-colors resize-none"
                  />
                </div>

                {/* Error */}
                {state === "error" && (
                  <p className="text-orange text-sm">
                    Something went wrong. Please try again or email us directly at info@efoilrental.com.
                  </p>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={state === "submitting"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-neon text-ocean font-heading font-bold py-4 text-sm tracking-[0.15em] hover:bg-orange transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state === "submitting" ? "SENDING…" : "CONFIRM YOUR FLIGHT"}
                </motion.button>

                <p className="text-center text-ocean/40 text-xs">
                  No payment now. We&apos;ll confirm your spot and handle the rest.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-heading font-bold text-xs text-ocean/50 tracking-[0.2em] uppercase mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-ocean/15 rounded-xl bg-white px-4 py-3 text-ocean placeholder:text-ocean/30 focus:outline-none focus:border-aqua transition-colors"
      />
    </div>
  );
}
