"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user as any || { name: "Demo User", membershipStatus: "ACTIVE" };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profitEstimatorOpen, setProfitEstimatorOpen] = useState(pathname?.startsWith("/portal/profit-estimator"));
  const [socialMediaOpen, setSocialMediaOpen] = useState(pathname?.startsWith("/portal/social-media"));

  const isActive = (path: string) => pathname === path;
  const isParentActive = (path: string) => pathname?.startsWith(path);

  return (
    <div className="min-h-screen bg-brand-bone flex flex-col">
      {/* Header */}
      <header className="bg-brand-plum text-brand-bone border-b-4 border-brand-gold">
        <div className="max-w-full mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-brand-bone hover:bg-brand-bone/10 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold uppercase">Client Portal</h1>
                <p className="mt-1 text-brand-bone/80 font-sans text-sm">
                  Welcome back, <strong>{user.name}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                {user.membershipStatus || "ACTIVE"}
              </span>
              <Link
                href="/api/auth/signout"
                className="hidden md:block px-4 py-2 border-2 border-brand-bone text-brand-bone hover:bg-brand-bone hover:text-brand-plum transition-all font-mono text-sm uppercase tracking-widest"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r-2 border-brand-plum/20">
          <nav className="p-4 space-y-1">
            <Link
              href="/portal"
              className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                isActive("/portal")
                  ? "bg-brand-plum text-brand-bone"
                  : "text-brand-charcoal hover:bg-brand-plum/10"
              }`}
            >
              Dashboard
            </Link>
            
            <Link
              href="/portal/call-logs"
              className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                isActive("/portal/call-logs")
                  ? "bg-brand-plum text-brand-bone"
                  : "text-brand-charcoal hover:bg-brand-plum/10"
              }`}
            >
              Call Logs
            </Link>
            
            <Link
              href="/portal/leads"
              className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                isParentActive("/portal/leads")
                  ? "bg-brand-plum text-brand-bone"
                  : "text-brand-charcoal hover:bg-brand-plum/10"
              }`}
            >
              Leads
            </Link>
            
            <Link
              href="/portal/focus-areas"
              className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                isActive("/portal/focus-areas")
                  ? "bg-brand-plum text-brand-bone"
                  : "text-brand-charcoal hover:bg-brand-plum/10"
              }`}
            >
              Focus Areas
            </Link>

            {/* Profit Estimator - Collapsible */}
            <div>
              <button
                onClick={() => setProfitEstimatorOpen(!profitEstimatorOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                  isParentActive("/portal/profit-estimator")
                    ? "bg-brand-plum text-brand-bone"
                    : "text-brand-charcoal hover:bg-brand-plum/10"
                }`}
              >
                <span>Profit Estimator</span>
                <svg
                  className={`w-4 h-4 transition-transform ${profitEstimatorOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {profitEstimatorOpen && (
                <div className="ml-4 space-y-1 mt-1">
                  <Link
                    href="/portal/profit-estimator"
                    className={`block px-4 py-2 text-sm transition-all ${
                      isActive("/portal/profit-estimator")
                        ? "text-brand-plum font-bold bg-brand-gold/20"
                        : "text-brand-charcoal/80 hover:text-brand-plum hover:bg-brand-plum/5"
                    }`}
                  >
                    Overview
                  </Link>
                </div>
              )}
            </div>

            {/* Social Media - Collapsible */}
            <div>
              <button
                onClick={() => setSocialMediaOpen(!socialMediaOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                  isParentActive("/portal/social-media")
                    ? "bg-brand-plum text-brand-bone"
                    : "text-brand-charcoal hover:bg-brand-plum/10"
                }`}
              >
                <span>Social Media</span>
                <svg
                  className={`w-4 h-4 transition-transform ${socialMediaOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {socialMediaOpen && (
                <div className="ml-4 space-y-1 mt-1">
                  <Link
                    href="/portal/social-media"
                    className={`block px-4 py-2 text-sm transition-all ${
                      isActive("/portal/social-media")
                        ? "text-brand-plum font-bold bg-brand-gold/20"
                        : "text-brand-charcoal/80 hover:text-brand-plum hover:bg-brand-plum/5"
                    }`}
                  >
                    Overview
                  </Link>
                </div>
              )}
            </div>
            
            <Link
              href="/portal/settings"
              className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                isActive("/portal/settings")
                  ? "bg-brand-plum text-brand-bone"
                  : "text-brand-charcoal hover:bg-brand-plum/10"
              }`}
            >
              Settings
            </Link>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Side Menu */}
            <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg lg:hidden overflow-y-auto">
              <div className="p-6 bg-brand-plum text-brand-bone">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold uppercase text-lg">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-brand-bone/10 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                    isActive("/portal")
                      ? "bg-brand-plum text-brand-bone"
                      : "text-brand-charcoal hover:bg-brand-plum/10"
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link
                  href="/portal/call-logs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                    isActive("/portal/call-logs")
                      ? "bg-brand-plum text-brand-bone"
                      : "text-brand-charcoal hover:bg-brand-plum/10"
                  }`}
                >
                  Call Logs
                </Link>
                
                <Link
                  href="/portal/leads"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                    isParentActive("/portal/leads")
                      ? "bg-brand-plum text-brand-bone"
                      : "text-brand-charcoal hover:bg-brand-plum/10"
                  }`}
                >
                  Leads
                </Link>
                
                <Link
                  href="/portal/focus-areas"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                    isActive("/portal/focus-areas")
                      ? "bg-brand-plum text-brand-bone"
                      : "text-brand-charcoal hover:bg-brand-plum/10"
                  }`}
                >
                  Focus Areas
                </Link>

                {/* Profit Estimator - Mobile */}
                <div>
                  <button
                    onClick={() => setProfitEstimatorOpen(!profitEstimatorOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                      isParentActive("/portal/profit-estimator")
                        ? "bg-brand-plum text-brand-bone"
                        : "text-brand-charcoal hover:bg-brand-plum/10"
                    }`}
                  >
                    <span>Profit Estimator</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${profitEstimatorOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {profitEstimatorOpen && (
                    <div className="ml-4 space-y-1 mt-1">
                      <Link
                        href="/portal/profit-estimator"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-2 text-sm transition-all ${
                          isActive("/portal/profit-estimator")
                            ? "text-brand-plum font-bold bg-brand-gold/20"
                            : "text-brand-charcoal/80 hover:text-brand-plum hover:bg-brand-plum/5"
                        }`}
                      >
                        Overview
                      </Link>
                    </div>
                  )}
                </div>

                {/* Social Media - Mobile */}
                <div>
                  <button
                    onClick={() => setSocialMediaOpen(!socialMediaOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                      isParentActive("/portal/social-media")
                        ? "bg-brand-plum text-brand-bone"
                        : "text-brand-charcoal hover:bg-brand-plum/10"
                    }`}
                  >
                    <span>Social Media</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${socialMediaOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {socialMediaOpen && (
                    <div className="ml-4 space-y-1 mt-1">
                      <Link
                        href="/portal/social-media"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-2 text-sm transition-all ${
                          isActive("/portal/social-media")
                            ? "text-brand-plum font-bold bg-brand-gold/20"
                            : "text-brand-charcoal/80 hover:text-brand-plum hover:bg-brand-plum/5"
                        }`}
                      >
                        Overview
                      </Link>
                    </div>
                  )}
                </div>
                
                <Link
                  href="/portal/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                    isActive("/portal/settings")
                      ? "bg-brand-plum text-brand-bone"
                      : "text-brand-charcoal hover:bg-brand-plum/10"
                  }`}
                >
                  Settings
                </Link>

                <div className="mt-6 pt-6 border-t-2 border-brand-plum/20">
                  <Link
                    href="/api/auth/signout"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-brand-plum text-brand-bone text-center font-bold uppercase tracking-wider text-sm"
                  >
                    Sign Out
                  </Link>
                </div>
              </nav>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
