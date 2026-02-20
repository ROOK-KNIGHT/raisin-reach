"use client";

import { PostStatus, SocialPlatform } from "@prisma/client";
import { format } from "date-fns";

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

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const PLATFORM_ICONS: Record<string, string> = {
  FACEBOOK: "📘",
  INSTAGRAM: "📷",
  LINKEDIN: "💼",
  TWITTER: "🐦",
  TIKTOK: "🎵",
  YOUTUBE: "📹",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-200 text-gray-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  PUBLISHING: "bg-yellow-100 text-yellow-700",
  PUBLISHED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const isPublished = post.status === "PUBLISHED";
  const dateToDisplay = isPublished ? post.publishedAt : post.scheduledFor;
  const formattedDate = dateToDisplay ? format(new Date(dateToDisplay), "MMM d, yyyy h:mm a") : "Unscheduled";

  return (
    <div className="bg-white border-2 border-brand-plum p-4 shadow-sm hover:shadow-[4px_4px_0px_0px_var(--color-brand-plum)] transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{PLATFORM_ICONS[post.account.platform] || "🌐"}</span>
          <span className="font-bold text-sm text-brand-plum">{post.account.accountName}</span>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-full uppercase ${STATUS_COLORS[post.status] || "bg-gray-100"}`}>
          {post.status}
        </span>
      </div>

      <p className="text-gray-800 mb-4 line-clamp-3 font-sans">{post.content}</p>

      <div className="flex justify-between items-center text-sm text-gray-500 font-mono border-t border-brand-plum/10 pt-3">
        <div>
          {dateToDisplay && (
            <span className="flex items-center gap-1">
              <span>{isPublished ? "Published:" : "Scheduled:"}</span>
              <span className="font-bold">{formattedDate}</span>
            </span>
          )}
        </div>
      </div>

      {isPublished && post.engagement && (
        <div className="flex gap-4 mt-3 text-xs font-mono text-gray-600 bg-brand-bone p-2 rounded">
          <span>❤️ {post.engagement.likes || 0}</span>
          <span>💬 {post.engagement.comments || 0}</span>
          <span>🔄 {post.engagement.shares || 0}</span>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => onEdit(post)}
          className="text-brand-plum hover:text-brand-gold font-bold uppercase text-xs tracking-wider px-2 py-1"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="text-red-500 hover:text-red-700 font-bold uppercase text-xs tracking-wider px-2 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
