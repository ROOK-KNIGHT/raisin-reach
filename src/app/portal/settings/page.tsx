"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any || { name: "Demo User", email: "demo@example.com" };

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  // Profile data from session
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    timezone: "America/New_York",
  });

  // Load user data from session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        phone: user.phone || "",
        timezone: "America/New_York",
      });
      setLoading(false);
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, session, router, user]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-brand-bone flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-plum font-mono uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewLead: true,
    emailOnCallComplete: false,
    emailWeeklySummary: true,
    smsOnHotLead: false,
  });

  // Billing info - in a real app, this would come from a subscription service
  const billingInfo = {
    plan: user.membershipTier || "Professional",
    status: user.membershipStatus || "Active",
    nextBillingDate: "March 15, 2026",
    amount: "$2,500/month",
  };

  return (
    <main className="min-h-screen bg-brand-bone">
      {/* Header */}
      <header className="bg-brand-plum text-brand-bone border-b-4 border-brand-gold">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold uppercase">Client Portal</h1>
              <p className="mt-1 text-brand-bone/80 font-sans">
                Welcome back, <strong>{user.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                ACTIVE
              </span>
              <Link
                href="/api/auth/signout"
                className="px-4 py-2 border-2 border-brand-bone text-brand-bone hover:bg-brand-bone hover:text-brand-plum transition-all font-mono text-sm uppercase tracking-widest"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b-2 border-brand-plum/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <Link
              href="/portal"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/portal/call-logs"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Call Logs
            </Link>
            <Link
              href="/portal/leads"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Leads
            </Link>
            <Link
              href="/portal/focus-areas"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Focus Areas
            </Link>
            <Link
              href="/portal/settings"
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Account Settings</h2>
          <p className="text-brand-charcoal/60">Manage your account preferences and billing</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1">
            <div className="bg-white border-2 border-brand-plum p-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 font-mono text-sm uppercase tracking-widest transition-all ${
                  activeTab === "profile"
                    ? "bg-brand-plum text-brand-bone"
                    : "text-brand-charcoal/60 hover:bg-brand-plum/10"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-4 py-3 font-mono text-sm uppercase tracking-widest transition-all ${
                  activeTab === "notifications"
                    ? "bg-brand-plum text-brand-bone"
                    : "text-brand-charcoal/60 hover:bg-brand-plum/10"
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`w-full text-left px-4 py-3 font-mono text-sm uppercase tracking-widest transition-all ${
                  activeTab === "billing"
                    ? "bg-brand-plum text-brand-bone"
                    : "text-brand-charcoal/60 hover:bg-brand-plum/10"
                }`}
              >
                Billing
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-4 py-3 font-mono text-sm uppercase tracking-widest transition-all ${
                  activeTab === "security"
                    ? "bg-brand-plum text-brand-bone"
                    : "text-brand-charcoal/60 hover:bg-brand-plum/10"
                }`}
              >
                Security
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white border-2 border-brand-plum p-8 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]">
                <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Profile Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Timezone
                    </label>
                    <select
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                  <button className="px-8 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white border-2 border-brand-plum p-8 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]">
                <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-brand-bone">
                    <div>
                      <div className="font-bold text-brand-plum">New Lead Notifications</div>
                      <div className="text-sm text-brand-charcoal/60">Get notified when a new qualified lead is generated</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailOnNewLead}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, emailOnNewLead: e.target.checked })
                      }
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-brand-bone">
                    <div>
                      <div className="font-bold text-brand-plum">Call Completion Notifications</div>
                      <div className="text-sm text-brand-charcoal/60">Receive updates after each call is completed</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailOnCallComplete}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, emailOnCallComplete: e.target.checked })
                      }
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-brand-bone">
                    <div>
                      <div className="font-bold text-brand-plum">Weekly Summary Report</div>
                      <div className="text-sm text-brand-charcoal/60">Get a weekly summary of all activity and results</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailWeeklySummary}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, emailWeeklySummary: e.target.checked })
                      }
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-brand-bone">
                    <div>
                      <div className="font-bold text-brand-plum">SMS for Hot Leads</div>
                      <div className="text-sm text-brand-charcoal/60">Receive SMS alerts for high-priority leads</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsOnHotLead}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, smsOnHotLead: e.target.checked })
                      }
                      className="w-6 h-6"
                    />
                  </div>
                  <button className="px-8 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="bg-white border-2 border-brand-plum p-8 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]">
                <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Billing & Subscription</h3>
                <div className="space-y-6">
                  <div className="p-6 bg-brand-bone border-l-4 border-brand-gold">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                          Current Plan
                        </div>
                        <div className="text-2xl font-display font-bold text-brand-plum">{billingInfo.plan}</div>
                      </div>
                      <div>
                        <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                          Status
                        </div>
                        <div className="text-2xl font-display font-bold text-green-600">{billingInfo.status}</div>
                      </div>
                      <div>
                        <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                          Next Billing Date
                        </div>
                        <div className="text-lg font-bold text-brand-charcoal">{billingInfo.nextBillingDate}</div>
                      </div>
                      <div>
                        <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                          Amount
                        </div>
                        <div className="text-lg font-bold text-brand-charcoal">{billingInfo.amount}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-8 py-3 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum border-2 border-brand-plum transition-all">
                      Update Payment Method
                    </button>
                    <button className="px-8 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
                      View Invoices
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white border-2 border-brand-plum p-8 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]">
                <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-brand-plum mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                        />
                      </div>
                      <button className="px-8 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>
                  <div className="pt-6 border-t-2 border-brand-plum/10">
                    <h4 className="font-bold text-brand-plum mb-4">Two-Factor Authentication</h4>
                    <p className="text-brand-charcoal/80 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <button className="px-8 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
