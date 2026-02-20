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

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

const PLATFORMS = [
  { id: "FACEBOOK", name: "Facebook", icon: "📘" },
  { id: "INSTAGRAM", name: "Instagram", icon: "📷" },
  { id: "LINKEDIN", name: "LinkedIn", icon: "💼" },
  { id: "TWITTER", name: "Twitter/X", icon: "🐦" },
  { id: "TIKTOK", name: "TikTok", icon: "🎵" },
  { id: "YOUTUBE", name: "YouTube", icon: "📹" },
];

export default function ConnectAccountModal({ isOpen, onClose, onConnect }: ConnectAccountModalProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error("Failed to load connected accounts");
    }
  };

  const handleConnect = async (platform: string) => {
    // TODO: Implement OAuth flow for each platform
    // This should redirect to the platform's OAuth authorization page
    // and handle the callback to store the access tokens
    
    toast.error(`OAuth integration for ${platform} not yet implemented. Please configure OAuth credentials and implement the authorization flow.`);
    
    // Example OAuth flow structure:
    // 1. Redirect to: https://platform.com/oauth/authorize?client_id=...&redirect_uri=...
    // 2. Handle callback at: /api/auth/callback/[platform]
    // 3. Exchange code for access token
    // 4. Store encrypted tokens in database
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm("Are you sure you want to disconnect this account?")) return;

    try {
      const response = await fetch(`/api/portal/social-media/accounts?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Account disconnected");
        fetchAccounts();
        onConnect();
      } else {
        toast.error("Failed to disconnect");
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
      toast.error("An error occurred");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-bone border-4 border-brand-plum shadow-[8px_8px_0px_0px_var(--color-brand-plum)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-brand-plum p-6 flex justify-between items-center text-brand-bone">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wider">Connect Accounts</h2>
          <button onClick={onClose} className="hover:text-brand-gold transition-colors">
            ✕
          </button>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            {/* Connected Accounts */}
            <div>
              <h3 className="font-mono text-brand-plum font-bold uppercase tracking-wider mb-4 border-b-2 border-brand-plum/20 pb-2">
                Connected Accounts
              </h3>
              {accounts.length === 0 ? (
                <p className="text-gray-500 italic">No accounts connected yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="bg-white border-2 border-brand-plum p-4 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {PLATFORMS.find((p) => p.id === account.platform)?.icon || "🌐"}
                        </span>
                        <div>
                          <p className="font-bold text-brand-plum">{account.accountName}</p>
                          <p className="text-xs text-gray-500 font-mono">{account.platform}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDisconnect(account.id)}
                        className="text-red-500 hover:text-red-700 font-mono text-xs uppercase"
                      >
                        Disconnect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Platforms */}
            <div>
              <h3 className="font-mono text-brand-plum font-bold uppercase tracking-wider mb-4 border-b-2 border-brand-plum/20 pb-2">
                Available Platforms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {PLATFORMS.map((platform) => {
                  const isConnected = accounts.some((a) => a.platform === platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => !isConnected && handleConnect(platform.id)}
                      disabled={isConnected || isLoading}
                      className={`
                        border-2 border-brand-plum p-4 flex flex-col items-center gap-3 transition-all
                        ${isConnected 
                          ? "bg-gray-100 opacity-50 cursor-not-allowed" 
                          : "bg-white hover:bg-brand-bone hover:shadow-[4px_4px_0px_0px_var(--color-brand-plum)]"
                        }
                      `}
                    >
                      <span className="text-3xl">{platform.icon}</span>
                      <span className="font-bold text-brand-plum">{platform.name}</span>
                      {isConnected && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-mono">
                          Connected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-brand-plum text-brand-bone px-6 py-3 font-mono font-bold uppercase tracking-widest hover:bg-opacity-90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
