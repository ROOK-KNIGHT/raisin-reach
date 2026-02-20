"use client";

import { useState, useEffect } from "react";
import SummaryCard from "@/components/portal/profit-estimator/SummaryCard";

interface AnalyticsData {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalReach: number;
  engagementRate: number;
  platformBreakdown: Record<
    string,
    { likes: number; comments: number; shares: number; posts: number }
  >;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState("30days");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/portal/social-media/analytics?period=${period}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-plum"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex justify-end">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-white border-2 border-brand-plum p-2 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Posts"
          value={data.totalPosts.toString()}
        />
        <SummaryCard
          title="Total Reach"
          value={data.totalReach.toLocaleString()}
        />
        <SummaryCard
          title="Total Engagement"
          value={(data.totalLikes + data.totalComments + data.totalShares).toLocaleString()}
        />
        <SummaryCard
          title="Avg. Engagement Rate"
          value={`${data.engagementRate.toFixed(2)}%`}
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-4 border-brand-plum shadow-[8px_8px_0px_0px_var(--color-brand-plum)] p-6">
          <h3 className="font-display text-xl font-bold uppercase tracking-wider text-brand-plum mb-6 border-b-2 border-brand-plum/10 pb-2">
            Engagement Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-gray-600">Likes</span>
              <span className="font-bold text-xl">{data.totalLikes.toLocaleString()}</span>
            </div>
            <div className="w-full bg-brand-bone h-2">
              <div
                className="bg-red-500 h-2"
                style={{
                  width: `${(data.totalLikes / (data.totalLikes + data.totalComments + data.totalShares || 1)) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="font-mono text-gray-600">Comments</span>
              <span className="font-bold text-xl">{data.totalComments.toLocaleString()}</span>
            </div>
            <div className="w-full bg-brand-bone h-2">
              <div
                className="bg-blue-500 h-2"
                style={{
                  width: `${(data.totalComments / (data.totalLikes + data.totalComments + data.totalShares || 1)) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="font-mono text-gray-600">Shares</span>
              <span className="font-bold text-xl">{data.totalShares.toLocaleString()}</span>
            </div>
            <div className="w-full bg-brand-bone h-2">
              <div
                className="bg-green-500 h-2"
                style={{
                  width: `${(data.totalShares / (data.totalLikes + data.totalComments + data.totalShares || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-brand-plum shadow-[8px_8px_0px_0px_var(--color-brand-plum)] p-6">
          <h3 className="font-display text-xl font-bold uppercase tracking-wider text-brand-plum mb-6 border-b-2 border-brand-plum/10 pb-2">
            Platform Performance
          </h3>
          <div className="space-y-6">
            {Object.entries(data.platformBreakdown).map(([platform, stats]) => (
              <div key={platform}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-brand-plum">{platform}</span>
                  <span className="font-mono text-xs text-gray-500">{stats.posts} posts</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-brand-bone p-2">
                    <span className="block font-bold">{stats.likes}</span>
                    <span className="text-gray-500">Likes</span>
                  </div>
                  <div className="bg-brand-bone p-2">
                    <span className="block font-bold">{stats.comments}</span>
                    <span className="text-gray-500">Comments</span>
                  </div>
                  <div className="bg-brand-bone p-2">
                    <span className="block font-bold">{stats.shares}</span>
                    <span className="text-gray-500">Shares</span>
                  </div>
                </div>
              </div>
            ))}
            {Object.keys(data.platformBreakdown).length === 0 && (
              <p className="text-gray-500 italic text-center py-8">No platform data available for this period.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
