"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

export default function SignOutPage() {
  useEffect(() => {
    // Auto sign out after 3 seconds
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bone flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white border-4 border-brand-plum shadow-[8px_8px_0px_0px_var(--color-brand-plum)]">
          {/* Header */}
          <div className="bg-brand-plum text-brand-bone p-8 border-b-4 border-brand-gold text-center">
            <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-brand-plum"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold uppercase">Signing Out</h1>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-12 h-12 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-brand-charcoal/80 mb-2">
                You're being signed out securely...
              </p>
              <p className="text-sm text-brand-charcoal/60">
                Redirecting you to the homepage
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-6 border-t-2 border-brand-plum/10 space-y-3">
              <Link
                href="/"
                className="block w-full px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all text-center"
              >
                Go to Homepage
              </Link>
              <Link
                href="/auth/signin"
                className="block w-full px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all text-center"
              >
                Sign In Again
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-brand-bone p-6 border-t-2 border-brand-plum/10 text-center">
            <p className="text-sm text-brand-charcoal/60">
              Thanks for using <span className="font-bold text-brand-plum">RaisinReach</span>
            </p>
            <p className="text-xs text-brand-charcoal/40 mt-1">
              We look forward to seeing you again soon!
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-brand-charcoal/60">
            Need help?{" "}
            <Link href="/contact" className="text-brand-plum font-bold hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
