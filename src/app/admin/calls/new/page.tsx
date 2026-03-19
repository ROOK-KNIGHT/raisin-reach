"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function NewCallLogPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const [formData, setFormData] = useState({
    clientId: "",
    prospectName: "",
    prospectCompany: "",
    prospectPhone: "",
    prospectEmail: "",
    callOutcome: "CONNECTED",
    callDuration: "",
    notes: "",
    followUpDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  // Fetch clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/admin/clients");
        if (res.ok) {
          const data = await res.json();
          setClients(data.clients || []);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          callDuration: formData.callDuration ? parseInt(formData.callDuration) : null,
        }),
      });

      if (res.ok) {
        toast.success("Call log created successfully!");
        router.push("/admin/calls");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create call log");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
              className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm"
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
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
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
            href="/admin/calls"
            className="text-brand-plum hover:text-brand-gold transition-colors font-mono text-sm uppercase tracking-widest mb-4 inline-block"
          >
            ← Back to All Calls
          </Link>
          <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Log New Call</h2>
          <p className="text-brand-charcoal/60">Record a call made on behalf of a client</p>
        </div>

        <div className="bg-white border-2 border-brand-plum p-8 shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Selection */}
            <div>
              <label htmlFor="clientId" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Client *
              </label>
              <select
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </option>
                ))}
              </select>
            </div>

            {/* Prospect Name */}
            <div>
              <label htmlFor="prospectName" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Prospect Name *
              </label>
              <input
                id="prospectName"
                name="prospectName"
                type="text"
                value={formData.prospectName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="Jane Doe"
              />
            </div>

            {/* Prospect Company */}
            <div>
              <label htmlFor="prospectCompany" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Prospect Company *
              </label>
              <input
                id="prospectCompany"
                name="prospectCompany"
                type="text"
                value={formData.prospectCompany}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="Example Corp"
              />
            </div>

            {/* Contact Info Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prospectPhone" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  id="prospectPhone"
                  name="prospectPhone"
                  type="tel"
                  value={formData.prospectPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label htmlFor="prospectEmail" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="prospectEmail"
                  name="prospectEmail"
                  type="email"
                  value={formData.prospectEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            {/* Call Details Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="callOutcome" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                  Call Outcome *
                </label>
                <select
                  id="callOutcome"
                  name="callOutcome"
                  value={formData.callOutcome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                >
                  <option value="CONNECTED">Connected</option>
                  <option value="SCHEDULED_MEETING">Meeting Scheduled</option>
                  <option value="VOICEMAIL">Voicemail</option>
                  <option value="NO_ANSWER">No Answer</option>
                  <option value="GATEKEEPER">Gatekeeper</option>
                  <option value="NOT_INTERESTED">Not Interested</option>
                </select>
              </div>
              <div>
                <label htmlFor="callDuration" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                  Call Duration (seconds)
                </label>
                <input
                  id="callDuration"
                  name="callDuration"
                  type="number"
                  value={formData.callDuration}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  placeholder="120"
                />
              </div>
            </div>

            {/* Follow-up Date */}
            <div>
              <label htmlFor="followUpDate" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Follow-up Date
              </label>
              <input
                id="followUpDate"
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                Call Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                placeholder="Add any relevant notes about the call..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/admin/calls"
                className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-brand-plum text-brand-gold font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging Call..." : "Log Call"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
