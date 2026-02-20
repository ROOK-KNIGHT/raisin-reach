"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { PostStatus, SocialPlatform } from "@prisma/client";

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

interface SocialCalendarProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const PLATFORM_COLORS: Record<string, string> = {
  FACEBOOK: "bg-blue-600",
  INSTAGRAM: "bg-pink-600",
  LINKEDIN: "bg-blue-800",
  TWITTER: "bg-sky-500",
  TIKTOK: "bg-black",
  YOUTUBE: "bg-red-600",
};

export default function SocialCalendar({ posts, onPostClick }: SocialCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => {
      const date = post.scheduledFor ? new Date(post.scheduledFor) : post.publishedAt ? new Date(post.publishedAt) : null;
      return date && isSameDay(date, day);
    });
  };

  return (
    <div className="bg-white border-4 border-brand-plum shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
      <div className="bg-brand-plum p-4 flex justify-between items-center text-brand-bone">
        <button onClick={prevMonth} className="hover:text-brand-gold font-bold">
          {'<'} PREV
        </button>
        <h2 className="font-display text-xl font-bold uppercase tracking-wider">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button onClick={nextMonth} className="hover:text-brand-gold font-bold">
          NEXT {'>'}
        </button>
      </div>

      <div className="grid grid-cols-7 border-b-2 border-brand-plum bg-brand-bone">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center font-mono text-sm font-bold text-brand-plum uppercase border-r border-brand-plum/20 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {/* Placeholder for empty days at start of month */}
        {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
          <div key={`empty-start-${i}`} className="min-h-[120px] bg-gray-50 border-r border-b border-brand-plum/20" />
        ))}

        {daysInMonth.map((day) => {
          const dayPosts = getPostsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] p-2 border-r border-b border-brand-plum/20 relative ${
                isToday ? "bg-brand-gold/10" : "bg-white"
              }`}
            >
              <span className={`text-sm font-mono font-bold ${isToday ? "text-brand-plum" : "text-gray-500"}`}>
                {format(day, "d")}
              </span>

              <div className="mt-2 space-y-1">
                {dayPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    className={`w-full text-left text-[10px] text-white px-1 py-0.5 rounded truncate ${
                      PLATFORM_COLORS[post.account.platform] || "bg-gray-500"
                    }`}
                  >
                    {format(new Date(post.scheduledFor || post.publishedAt!), "HH:mm")} {post.account.platform.slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Placeholder for empty days at end of month */}
        {Array.from({ length: 6 - endOfMonth(currentDate).getDay() }).map((_, i) => (
          <div key={`empty-end-${i}`} className="min-h-[120px] bg-gray-50 border-r border-b border-brand-plum/20" />
        ))}
      </div>
    </div>
  );
}
