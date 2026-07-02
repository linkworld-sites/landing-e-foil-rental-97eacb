import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/posts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — E-Foil Rental`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-foam">
        {/* Header */}
        <div className="bg-ocean pt-32 pb-16 px-6">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-foam/40 hover:text-foam/80 text-sm transition-colors mb-8"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 8H3M3 8L8 3M3 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Journal
            </Link>
            {post.date && (
              <p className="font-heading font-bold text-xs text-aqua tracking-[0.2em] uppercase mb-4">
                {post.date}
              </p>
            )}
            <h1 className="font-heading font-bold text-foam text-[clamp(36px,5vw,64px)] leading-tight tracking-tight">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-foam/60 text-lg max-w-2xl leading-relaxed">
                {post.description}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-6 py-16">
          <article
            className="post-body text-ocean"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <div className="mt-16 pt-10 border-t border-ocean/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-aqua font-heading font-bold text-sm tracking-wider hover:text-ocean transition-colors"
            >
              ← All posts
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 bg-neon text-ocean font-heading font-bold px-6 py-3 text-sm tracking-[0.12em] hover:bg-orange transition-colors duration-200"
            >
              BOOK YOUR SESSION →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
