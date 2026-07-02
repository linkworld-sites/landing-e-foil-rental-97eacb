import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Journal — E-Foil Rental",
  description: "Stories, guides, and insights from the water.",
};

export default function BlogIndex() {
  const posts = getPosts();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-foam">
        {/* Header */}
        <div className="bg-ocean pt-32 pb-16 px-6">
          <div className="mx-auto max-w-4xl">
            <p className="font-heading font-bold text-xs text-aqua tracking-[0.2em] uppercase mb-4">
              Stories from the Water
            </p>
            <h1 className="font-heading font-bold text-foam text-[clamp(48px,7vw,80px)] leading-none tracking-tight">
              JOURNAL
            </h1>
          </div>
        </div>

        {/* Posts */}
        <div className="mx-auto max-w-4xl px-6 py-16">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-ocean/50 text-lg">New stories are on the way. Check back soon.</p>
              <Link href="/" className="mt-6 inline-block text-aqua font-heading font-bold text-sm tracking-wider hover:text-ocean transition-colors">
                ← Back to home
              </Link>
            </div>
          ) : (
            <ul className="space-y-0 divide-y divide-ocean/10">
              {posts.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col md:flex-row md:items-baseline md:gap-8 py-8 hover:pl-2 transition-all duration-200"
                  >
                    {p.date && (
                      <span className="text-ocean/40 text-sm font-heading font-bold tracking-wide shrink-0 mb-2 md:mb-0 md:w-28">
                        {p.date}
                      </span>
                    )}
                    <div>
                      <h2 className="font-heading font-bold text-ocean text-xl md:text-2xl group-hover:text-aqua transition-colors duration-200">
                        {p.title}
                      </h2>
                      {p.description && (
                        <p className="mt-2 text-ocean/60 text-sm leading-relaxed max-w-2xl">
                          {p.description}
                        </p>
                      )}
                    </div>
                    <span className="hidden md:block ml-auto shrink-0 text-aqua opacity-0 group-hover:opacity-100 transition-opacity font-heading font-bold text-sm">
                      Read →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
