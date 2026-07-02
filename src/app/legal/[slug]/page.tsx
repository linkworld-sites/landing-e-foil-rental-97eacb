import Link from "next/link";
import { notFound } from "next/navigation";
import { getLegalPage, getLegalSlugs } from "@/lib/legal";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return getLegalSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return {};
  return { title: `${page.title} — E-Foil Rental` };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-foam">
        <div className="bg-ocean pt-32 pb-12 px-6">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-foam/40 hover:text-foam/80 text-sm transition-colors mb-8"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 8H3M3 8L8 3M3 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Home
            </Link>
            <h1 className="font-heading font-bold text-foam text-4xl md:text-5xl leading-tight">
              {page.title}
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-16">
          <article
            className="post-body text-ocean"
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
