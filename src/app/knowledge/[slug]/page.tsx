import { getKnowledgePost, getAllKnowledgePosts } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllKnowledgePosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getKnowledgePost(slug);
  if (!post) return;

  return {
    title: `${post.title} | RaisinReach Knowledge Graph`,
    description: post.description,
  };
}

export default async function KnowledgePost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getKnowledgePost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-brand-bone min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/knowledge" className="inline-block mb-8 text-brand-plum font-mono uppercase tracking-widest hover:text-brand-gold transition-colors">
          ← Return to Knowledge Graph
        </Link>

        <article>
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-plum mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-col gap-4 border-l-4 border-brand-gold pl-6 py-2 bg-brand-plum/5">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-plum/60">
                AI Executive Summary
              </span>
              <p className="text-brand-charcoal font-medium italic">
                {post.ai_summary}
              </p>
            </div>
          </header>

          <div className="prose prose-lg prose-headings:font-display prose-headings:text-brand-plum prose-p:font-sans prose-p:text-brand-charcoal prose-strong:text-brand-plum prose-a:text-brand-gold hover:prose-a:text-brand-plum">
            <MDXRemote source={post.content} />
          </div>

          {/* Structured Data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(post.structured_data) }}
          />
        </article>
      </div>
    </main>
  );
}
