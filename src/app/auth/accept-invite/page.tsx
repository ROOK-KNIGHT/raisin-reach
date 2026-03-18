"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const res = await fetch(`/api/auth/verify-invite?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        setInviteData(data);
      } else {
        toast.error("Invalid or expired invitation");
      }
    } catch (error) {
      toast.error("Failed to verify invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: formData.name,
          password: formData.password,
        }),
      });

      if (res.ok) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/auth/signin");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to accept invitation");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bone flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-plum font-mono uppercase tracking-widest">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (!token || !inviteData) {
    return (
      <main className="min-h-screen bg-brand-bone flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white border-2 border-red-500 p-8 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]">
            <h1 className="text-3xl font-display font-bold text-red-500 mb-6 uppercase text-center">
              Invalid Invitation
            </h1>
            <p className="text-center text-brand-charcoal/80 mb-6">
              This invitation link is invalid or has expired.
            </p>
            <Link
              href="/"
              className="block text-center py-3 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bone flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-display font-bold text-brand-plum">
            RAISIN REACH.
          </Link>
          <p className="mt-2 text-brand-charcoal/60 font-mono text-sm uppercase tracking-widest">
            Admin Team Invitation
          </p>
        </div>

        {/* Accept Invite Card */}
        <div className="bg-white border-2 border-brand-plum p-8 shadow-[8px_8px_0px_0px_var(--color-brand-plum)]">
          <h1 className="text-3xl font-display font-bold text-brand-plum mb-4 uppercase text-center">
            Welcome!
          </h1>

          <div className="mb-6 p-4 bg-brand-bone border-l-4 border-brand-gold">
            <p className="text-sm text-brand-charcoal/80 mb-2">
              You've been invited to join as:
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-brand-gold text-brand-plum text-xs font-mono uppercase font-bold">
                {inviteData.role}
              </span>
              <span className="text-sm text-brand-charcoal/60">
                {inviteData.email}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="John Smith"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="Minimum 8 characters"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-brand-plum text-brand-gold font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating Account..." : "Accept Invitation"}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-brand-plum hover:text-brand-gold transition-colors font-mono text-sm uppercase tracking-widest">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
