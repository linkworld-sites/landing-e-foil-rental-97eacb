"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { track } from "@/lib/funnel";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ocean/95 backdrop-blur-md border-b border-aqua/10 shadow-lg shadow-ocean/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-heading text-xl font-bold text-foam tracking-wider flex items-center gap-1">
          E-FOIL<span className="text-neon">.</span>RENTAL
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/#how-it-works">How It Works</NavLink>
          <NavLink href="/#pricing">Pricing</NavLink>
          <NavLink href="/blog">Journal</NavLink>
          <NavLink href="/#faq">FAQ</NavLink>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Link
              href="/book"
              onClick={() => track("intent")}
              className="hidden md:inline-flex items-center bg-neon text-ocean font-heading font-bold px-5 py-2 text-sm tracking-wider hover:bg-orange transition-colors duration-200"
            >
              BOOK NOW
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foam p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5 w-6">
              <span
                className={`block h-0.5 bg-foam transition-all duration-200 origin-center ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-foam transition-all duration-200 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-foam transition-all duration-200 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-ocean border-t border-aqua/10 px-6 py-5 space-y-4">
          <MobileNavLink href="/#how-it-works" onClick={() => setMenuOpen(false)}>
            How It Works
          </MobileNavLink>
          <MobileNavLink href="/#pricing" onClick={() => setMenuOpen(false)}>
            Pricing
          </MobileNavLink>
          <MobileNavLink href="/blog" onClick={() => setMenuOpen(false)}>
            Journal
          </MobileNavLink>
          <MobileNavLink href="/#faq" onClick={() => setMenuOpen(false)}>
            FAQ
          </MobileNavLink>
          <Link
            href="/book"
            onClick={() => {
              track("intent");
              setMenuOpen(false);
            }}
            className="block bg-neon text-ocean font-heading font-bold px-5 py-3 text-center text-sm tracking-wider mt-2"
          >
            BOOK NOW
          </Link>
        </div>
      )}
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-foam/70 hover:text-foam text-sm font-medium tracking-wide transition-colors duration-200 group"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-neon transition-all duration-200 ease-[0.25,0.1,0.25,1] group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick} className="block text-foam/80 font-medium py-1 text-base">
      {children}
    </Link>
  );
}
