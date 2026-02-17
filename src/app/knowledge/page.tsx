import Link from "next/link";
import { getAllKnowledgePosts } from "@/lib/mdx";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "Knowledge Graph | RaisinReach",
  description: "The Cold Calling Knowledge Graph. Expert strategies for high-ticket appointment setting.",
};

export default function KnowledgeIndex() {
  const posts = getAllKnowledgePosts();

  return (
    <main className="bg-brand-bone min-h-screen">
      <Header />
      <div className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-plum mb-16 uppercase tracking-tighter">
          Knowledge <span className="text-brand-gold">Graph</span>
        </h1>

        <div className="grid gap-8">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/knowledge/${post.slug}`}
              className="block group"
            >
              <article className="border border-brutalist bg-white p-8 shadow-[4px_4px_0px_0px_var(--color-brand-plum)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-200">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-plum mb-4 group-hover:text-brand-gold transition-colors">
                  {post.title}
                </h2>
                <p className="text-brand-charcoal/80 mb-6 font-sans text-lg">
                  {post.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-plum/60">
                  <span>AI Summary:</span>
                  <span className="text-brand-plum truncate max-w-md">{post.ai_summary}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </main>
  );
}
