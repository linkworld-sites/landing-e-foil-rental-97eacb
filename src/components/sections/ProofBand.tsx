"use client";

const stats = [
  { value: "4.9★", label: "Average Guest Rating" },
  { value: "500+", label: "Riders This Season" },
  { value: "80%", label: "First-Timer Flight Rate" },
  { value: "2024", label: "Lift eFoil Fleet" },
  { value: "FREE", label: "GoPro HD Footage" },
  { value: "0", label: "Hidden Fees" },
  { value: "1 hr", label: "Min Session Length" },
  { value: "∞", label: "Good Vibes" },
];

export function ProofBand() {
  const doubled = [...stats, ...stats];

  return (
    <section className="bg-orange overflow-hidden py-5 border-y-4 border-ocean/10">
      <div className="flex animate-marquee">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-3 px-8"
          >
            <span className="font-heading text-2xl font-bold text-ocean whitespace-nowrap">
              {item.value}
            </span>
            <span className="text-sm font-medium text-ocean/70 whitespace-nowrap tracking-wide">
              {item.label}
            </span>
            <span className="mx-4 text-ocean/30 text-xl font-bold" aria-hidden>·</span>
          </div>
        ))}
      </div>
    </section>
  );
}
