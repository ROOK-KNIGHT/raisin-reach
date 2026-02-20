"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { SocialPlatform } from "@prisma/client";

interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  isActive: boolean;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PLATFORMS = [
  { id: "FACEBOOK", icon: "📘" },
  { id: "INSTAGRAM", icon: "📷" },
  { id: "LINKEDIN", icon: "💼" },
  { id: "TWITTER", icon: "🐦" },
  { id: "TIKTOK", icon: "🎵" },
  { id: "YOUTUBE", icon: "📹" },
];

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]); // Placeholder for now
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/portal/social-media/accounts");
      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((accId) => accId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAccountIds.length === 0) {
      toast.error("Please select at least one account");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter post content");
      return;
    }

    if (isScheduled && !scheduledDate) {
      toast.error("Please select a date and time");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/portal/social-media/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountIds: selectedAccountIds,
          content,
          mediaUrls,
          scheduledFor: isScheduled ? new Date(scheduledDate).toISOString() : null,
          status: isScheduled ? "SCHEDULED" : "DRAFT", // Or PUBLISHING if immediate? Let's stick to DRAFT/SCHEDULED for now
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(isScheduled ? "Post scheduled!" : "Draft created!");
        resetForm();
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedAccountIds([]);
    setContent("");
    setMediaUrls([]);
    setIsScheduled(false);
    setScheduledDate("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-bone border-4 border-brand-plum shadow-[8px_8px_0px_0px_var(--color-brand-plum)] w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="bg-brand-plum p-6 flex justify-between items-center text-brand-bone shrink-0">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wider">Create New Post</h2>
          <button onClick={onClose} className="hover:text-brand-gold transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Account Selector */}
          <div>
            <label className="block font-mono text-sm font-bold uppercase tracking-wider text-brand-plum mb-3">
              Select Accounts
            </label>
            {accounts.length === 0 ? (
              <p className="text-gray-500 italic text-sm">No accounts connected. Please connect an account first.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {accounts.map((account) => {
                  const isSelected = selectedAccountIds.includes(account.id);
                  const platformIcon = PLATFORMS.find((p) => p.id === account.platform)?.icon;
                  return (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => toggleAccount(account.id)}
                      className={`
                        border-2 px-4 py-2 flex items-center gap-2 transition-all
                        ${isSelected 
                          ? "border-brand-plum bg-brand-plum text-brand-bone shadow-[4px_4px_0px_0px_#D4AF37]" 
                          : "border-brand-plum/30 bg-white text-gray-600 hover:border-brand-plum"
                        }
                      `}
                    >
                      <span>{platformIcon}</span>
                      <span className="font-bold text-sm">{account.accountName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div>
            <label className="block font-mono text-sm font-bold uppercase tracking-wider text-brand-plum mb-3">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share?"
              className="w-full h-40 border-2 border-brand-plum p-4 bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--color-brand-plum)] transition-shadow resize-none"
            />
            <div className="flex justify-end mt-2">
              <span className={`text-xs font-mono ${content.length > 280 ? "text-red-500" : "text-gray-500"}`}>
                {content.length} characters
              </span>
            </div>
          </div>

          {/* Media Upload (Placeholder) */}
          <div>
            <label className="block font-mono text-sm font-bold uppercase tracking-wider text-brand-plum mb-3">
              Media
            </label>
            <div className="border-2 border-dashed border-brand-plum/30 bg-brand-bone p-8 text-center rounded-lg hover:bg-white hover:border-brand-plum transition-colors cursor-pointer">
              <p className="text-brand-plum font-bold">Drag & Drop images or videos here</p>
              <p className="text-xs text-gray-500 mt-2">(Coming Soon)</p>
            </div>
          </div>

          {/* Scheduling */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="schedule"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="w-5 h-5 accent-brand-plum"
              />
              <label htmlFor="schedule" className="font-mono text-sm font-bold uppercase tracking-wider text-brand-plum cursor-pointer">
                Schedule for later
              </label>
            </div>

            {isScheduled && (
              <div className="pl-8">
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="border-2 border-brand-plum p-2 focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
                />
              </div>
            )}
          </div>
        </form>

        <div className="p-6 border-t-2 border-brand-plum/10 bg-brand-bone shrink-0 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 font-mono font-bold uppercase tracking-widest text-brand-plum hover:bg-brand-plum/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || accounts.length === 0}
            className="bg-brand-gold text-brand-plum px-8 py-3 font-mono font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_var(--color-brand-plum)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
          >
            {isSubmitting ? "Saving..." : isScheduled ? "Schedule Post" : "Save Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}
