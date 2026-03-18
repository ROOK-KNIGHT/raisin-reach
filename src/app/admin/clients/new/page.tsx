"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NewClientPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    membershipTier: "standard",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Client created successfully!");
        router.push(`/admin/clients/${data.client.id}`);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create client");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-brand-bone">
      {/* Header */}
      <header className="bg-brand-plum text-brand-bone border-b-4 border-brand-gold">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold uppercase">Admin Dashboard</h1>
              <p className="mt-1 text-brand-bone/80 font-sans">
                Welcome back, <strong>{user?.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                {user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : user?.role || "ADMIN"}
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
              href="/admin"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/clients"
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
            >
              Clients
            </Link>
            <Link
              href="/admin/leads"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              All Leads
            </Link>
            <Link
              href="/admin/calls"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              All Calls
            </Link>
            <Link
              href="/admin/reports"
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Reports
            </Link>
            {user?.role === "SUPER_ADMIN" && (
              <Link
                href="/admin/team"
                className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
              >
                Team
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/admin/clients"
            className="text-brand-plum hover:text-brand-gold transition-colors font-mono text-sm uppercase tracking-widest mb-4 inline-block"
          >
            ← Back to Clients
          </Link>
          <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Add New Client</h2>
          <p className="text-brand-charcoal/60">Create a new client account</p>
        </div>

        <div className="bg-white border-2 border-brand-plum p-8 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="John Smith"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="john@company.com"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Company Name *
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="Acme Corp"
              />
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Industry
              </label>
              <input
                id="industry"
                name="industry"
                type="text"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="Technology, Manufacturing, etc."
              />
            </div>

            {/* Membership Tier */}
            <div>
              <label htmlFor="membershipTier" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Membership Tier *
              </label>
              <select
                id="membershipTier"
                name="membershipTier"
                value={formData.membershipTier}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="trial">Trial</option>
                <option value="standard">Standard</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Temporary Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="Minimum 8 characters"
              />
              <p className="text-xs text-brand-charcoal/60 mt-1">
                Client will be prompted to change this on first login
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/admin/clients"
                className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-brand-plum text-brand-gold font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
