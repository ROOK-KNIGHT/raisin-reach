"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { PostStatus, SocialPlatform } from "@prisma/client";

import AnalyticsDashboard from "@/components/portal/social-media/AnalyticsDashboard";
import SocialCalendar from "@/components/portal/social-media/SocialCalendar";
import PostCard from "@/components/portal/social-media/PostCard";
import ConnectAccountModal from "@/components/portal/social-media/ConnectAccountModal";
import CreatePostModal from "@/components/portal/social-media/CreatePostModal";

type TabType = "dashboard" | "posts" | "calendar" | "accounts";

interface Post {
  id: string;
  content: string;
  status: PostStatus;
  scheduledFor: string | null;
  publishedAt: string | null;
  engagement: any;
  account: {
    platform: SocialPlatform;
    accountName: string;
  };
}

export default function SocialMediaPage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Modal states
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // Filter states for Posts tab
  const [postStatusFilter, setPostStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchPosts();
    }
  }, [status, router]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/portal/social-media/posts");
      const result = await response.json();
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const response = await fetch(`/api/portal/social-media/posts?id=${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        toast.success("Post deleted");
        fetchPosts();
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred");
    }
  };

  const handleEditPost = (post: Post) => {
    // For now, we'll just show a toast that editing is coming soon, 
    // or we could reuse CreatePostModal with pre-filled data if we implemented that.
    toast("Editing functionality coming soon!", { icon: "🚧" });
  };

  const filteredPosts = postStatusFilter === "ALL" 
    ? posts 
    : posts.filter(post => post.status === postStatusFilter);

  if (status === "loading" || (isLoading && activeTab === "dashboard" && posts.length === 0)) { // Only block if initial load
    return (
      <div className="min-h-screen bg-brand-bone flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-plum font-mono uppercase tracking-widest">Loading Social Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bone">
      {/* Header */}
      <header className="bg-brand-plum text-brand-bone border-b-4 border-brand-gold">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold uppercase">Social Media Manager</h1>
              <p className="mt-1 text-brand-bone/80 font-sans">
                Schedule, publish, and track your content
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConnectModal(true)}
                className="px-4 py-2 border-2 border-brand-bone text-brand-bone hover:bg-brand-bone hover:text-brand-plum transition-all font-mono text-sm uppercase tracking-widest"
              >
                Connect Accounts
              </button>
              <Link
                href="/portal"
                className="px-4 py-2 border-2 border-brand-bone text-brand-bone hover:bg-brand-bone hover:text-brand-plum transition-all font-mono text-sm uppercase tracking-widest"
              >
                Back to Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b-2 border-brand-plum/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {(["dashboard", "posts", "calendar", "accounts"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 border-b-4 font-bold uppercase tracking-wider text-sm transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "border-brand-plum text-brand-plum"
                    : "border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && <AnalyticsDashboard />}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
                {["ALL", "DRAFT", "SCHEDULED", "PUBLISHED", "FAILED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setPostStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase transition-colors ${
                      postStatusFilter === status
                        ? "bg-brand-plum text-brand-bone"
                        : "bg-brand-bone text-brand-plum hover:bg-brand-plum/10"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCreatePostModal(true)}
                className="w-full md:w-auto px-6 py-3 bg-brand-gold text-brand-plum font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[4px_4px_0px_0px_var(--color-brand-plum)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
              >
                + Create Post
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="bg-white border-2 border-brand-plum p-12 text-center">
                <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest mb-4">
                  No posts found.
                </p>
                <button
                  onClick={() => setShowCreatePostModal(true)}
                  className="px-6 py-3 bg-brand-plum text-brand-bone font-bold uppercase tracking-widest hover:bg-brand-plum/90 transition-all"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
             <div className="flex justify-end">
              <button
                onClick={() => setShowCreatePostModal(true)}
                className="px-6 py-3 bg-brand-gold text-brand-plum font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[4px_4px_0px_0px_var(--color-brand-plum)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
              >
                + Schedule Post
              </button>
            </div>
            <SocialCalendar 
              posts={posts} 
              onPostClick={(post) => {
                // Navigate to posts tab filtered by this post? 
                // Or open edit modal? For now, let's just log it or alert
                // toast(`Clicked post: ${post.content.substring(0, 20)}...`);
                handleEditPost(post);
              }} 
            />
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === "accounts" && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-brand-plum uppercase">
                Connected Accounts
              </h2>
              <button
                onClick={() => setShowConnectModal(true)}
                className="px-6 py-3 bg-brand-plum text-brand-bone font-bold uppercase tracking-widest hover:bg-brand-plum/90 transition-all border-4 border-brand-plum shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
              >
                + Connect New Account
              </button>
            </div>
            <div className="bg-white border-4 border-brand-plum p-8">
              <p className="mb-4 font-mono text-sm text-gray-600">
                Manage your social media connections here. Use the "Connect New Account" button to add more platforms.
              </p>
              {/* Reuse the logic from ConnectAccountModal or similar list here? 
                  For now, the modal handles the list well. 
                  We can just show a prompt to open the modal.
              */}
              <div className="grid gap-4">
                <div className="bg-brand-bone p-4 border-l-4 border-brand-gold">
                  <h3 className="font-bold text-brand-plum mb-2">Why connect accounts?</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Schedule posts to multiple platforms at once</li>
                    <li>Track engagement metrics in one dashboard</li>
                    <li>View all your content in a unified calendar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConnectAccountModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={() => {
          // Refresh accounts if we had a list here, or just analytics
          // Maybe refresh posts too if new accounts bring new data?
        }}
      />

      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onSuccess={() => {
          fetchPosts(); // Refresh posts list
        }}
      />
    </main>
  );
}
