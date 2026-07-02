import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { NearMeHero } from "./NearMeHero";
import { ProofBand } from "@/components/sections/ProofBand";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Sessions } from "@/components/sections/Sessions";
import { FAQ } from "@/components/sections/FAQ";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "E-Foil Rental Near Me | Book a Premium eFoil Session Today",
  description:
    "Find e-foil rental near you. Book a premium 2024 Lift eFoil session with certified instructors — 80% first-timer flight rate, GoPro HD footage included, all-inclusive transparent pricing. No experience needed.",
  openGraph: {
    title: "E-Foil Rental Near Me | Book a Premium eFoil Session Today",
    description:
      "Premium electric hydrofoil board rentals near you. Certified instructors, 80% fly guarantee, GoPro footage included. Sessions from $99.",
    type: "website",
  },
  alternates: {
    canonical: "/efoil-rental-near-me",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "E-Foil Rental",
  description:
    "Premium electric hydrofoil board rentals with certified instructors. 80% first-timer flight guarantee. No prior experience needed.",
  priceRange: "$99–$389",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "500",
    bestRating: "5",
    worstRating: "1",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "eFoil Rental Sessions",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Intro Session",
        description:
          "45-minute beginner eFoil session. Safety gear, certified instructor, shore-based photo, beginner Lift eFoil board.",
        price: "99",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Explorer Session",
        description:
          "2-hour eFoil session. Premium 2024 Lift eFoil board, GoPro HD footage included at no extra charge, full bay riding access.",
        price: "169",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Group Package",
        description:
          "Half-day package for up to 4 riders. Dedicated instructor team, 4 premium Lift eFoil boards, GoPro footage per rider, private beach area.",
        price: "389",
        priceCurrency: "USD",
      },
    ],
  },
};

export default function EfoilRentalNearMePage() {
  return (
    <>
      <Nav />
      <main>
        <NearMeHero />
        <ProofBand />
        <Features />
        <HowItWorks />
        <Sessions />
        <FAQ />
        <CTABand />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
