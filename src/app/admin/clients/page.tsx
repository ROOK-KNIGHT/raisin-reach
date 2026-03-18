"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Client {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  industry: string | null;
  membershipStatus: string;
  membershipTier: string | null;
  joinedAt: string;
  _count: {
    leads: number;
    callLogs: number;
  };
}

export default function AdminClientsPage() {
  const { data: session, status } = useSession();
  const user = session?.user as any || { name: "Admin User" };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchClients();
    }
  }, [status]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      } else {
        toast.error("Failed to load clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  // Transform clients data for display
  const displayClients = clients.map((client) => ({
    id: client.id,
    name: client.name || "No Name",
    company: client.company || "No Company",
    email: client.email,
    phone: "N/A",
    status: client.membershipStatus.toLowerCase(),
    membershipPlan: client.membershipTier || "standard",
    joinDate: new Date(client.joinedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    totalLeads: client._count.leads,
    totalCalls: client._count.callLogs,
    lastActivity: "N/A",
  }));

  const filteredClients = displayClients.filter((client) => {
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-green-100 text-green-700",
      trial: "bg-blue-100 text-blue-700",
      paused: "bg-gray-100 text-gray-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
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
                Welcome back, <strong>{user.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                ADMIN
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
            {user.role === "SUPER_ADMIN" && (
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Client Management</h2>
          <p className="text-brand-charcoal/60">View and manage all client accounts</p>
        </div>

        {/* Add Client Button */}
        <div className="mb-8 flex justify-end">
          <Link
            href="/admin/clients/new"
            className="px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all"
          >
            + Add New Client
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-brand-plum p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, company, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
              >
                <option value="all">All Clients</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-brand-plum font-mono uppercase tracking-widest">Loading clients...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-display font-bold text-brand-plum">{client.name}</h3>
                    <span className={`px-3 py-1 text-xs font-mono uppercase font-bold ${getStatusBadge(client.status)}`}>
                      {client.status}
                    </span>
                    <span className="px-3 py-1 bg-brand-gold/20 text-brand-plum text-xs font-mono uppercase font-bold">
                      {client.membershipPlan}
                    </span>
                  </div>
                  <div className="text-brand-charcoal/80 mb-1">
                    <strong>{client.company}</strong>
                  </div>
                  <div className="text-sm text-brand-charcoal/60">
                    {client.email} • {client.phone}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/clients/${client.id}`}
                    className="px-4 py-2 bg-brand-plum text-brand-bone font-mono text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2 border-2 border-brand-plum text-brand-plum font-mono text-xs uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
                    Edit
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-4 p-4 bg-brand-bone border-l-4 border-brand-plum">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Join Date
                  </div>
                  <div className="font-bold text-brand-plum">{client.joinDate}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Total Leads
                  </div>
                  <div className="font-bold text-brand-gold">{client.totalLeads}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Total Calls
                  </div>
                  <div className="font-bold text-brand-plum">{client.totalCalls}</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Last Activity
                  </div>
                  <div className="font-bold text-brand-charcoal">{client.lastActivity}</div>
                </div>
              </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredClients.length === 0 && (
          <div className="bg-white border-2 border-brand-plum p-12 text-center">
            <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest">
              No clients found matching your filters
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
