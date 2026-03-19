"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface ClientData {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  industry: string | null;
  membershipStatus: string;
  membershipTier: string | null;
  joinedAt: string;
  leads: any[];
  callLogs: any[];
  focusAreas: any[];
  adminNotes: any[];
  stats: {
    totalLeads: number;
    qualifiedLeads: number;
    totalCalls: number;
    connectedCalls: number;
    meetingsScheduled: number;
    conversionRate: string;
  };
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const user = session?.user as any || { name: "Admin User" };

  const [clientId, setClientId] = useState<string>("");
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sending, setSending] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setClientId(p.id);
      fetchClient(p.id);
    });
  }, []);

  const fetchClient = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/clients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data.client);
      } else {
        toast.error("Failed to load client");
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      toast.error("Failed to load client");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch(`/api/admin/clients/${clientId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: messageSubject,
          message: messageContent,
        }),
      });

      if (res.ok) {
        toast.success("Message sent successfully!");
        setShowMessageModal(false);
        setMessageSubject("");
        setMessageContent("");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setAddingNote(true);

    try {
      const res = await fetch(`/api/admin/clients/${clientId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent }),
      });

      if (res.ok) {
        toast.success("Note added successfully!");
        setNoteContent("");
        fetchClient(clientId); // Refresh to show new note
      } else {
        toast.error("Failed to add note");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setAddingNote(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-700",
      TRIAL: "bg-blue-100 text-blue-700",
      PAUSED: "bg-gray-100 text-gray-700",
      CANCELLED: "bg-red-100 text-red-700",
      SUSPENDED: "bg-orange-100 text-orange-700",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bone flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-plum font-mono uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-brand-bone flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-plum font-mono uppercase tracking-widest">Client not found</p>
          <Link href="/admin/clients" className="text-brand-gold hover:underline mt-4 inline-block">
            ← Back to Clients
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/admin" className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm">
              Dashboard
            </Link>
            <Link href="/admin/clients" className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm">
              Clients
            </Link>
            <Link href="/admin/leads" className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm">
              All Leads
            </Link>
            <Link href="/admin/calls" className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm">
              All Calls
            </Link>
            <Link href="/admin/reports" className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm">
              Reports
            </Link>
            {user?.role === "SUPER_ADMIN" && (
              <Link href="/admin/team" className="px-4 py-4 border-b-4 border-transparent text-brand-charcoal/60 hover:text-brand-plum hover:border-brand-plum/30 transition-all font-bold uppercase tracking-wider text-sm">
                Team
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/admin/clients" className="text-brand-plum hover:underline font-mono uppercase text-sm">
            ← Back to Clients
          </Link>
        </div>

        {/* Client Header */}
        <div className="bg-white border-2 border-brand-plum p-8 mb-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-4xl font-display font-bold text-brand-plum">{client.name || client.email}</h2>
                <span className={`px-4 py-2 text-sm font-mono uppercase font-bold ${getStatusBadge(client.membershipStatus)}`}>
                  {client.membershipStatus}
                </span>
                {client.membershipTier && (
                  <span className="px-4 py-2 bg-brand-gold/20 text-brand-plum text-sm font-mono uppercase font-bold">
                    {client.membershipTier}
                  </span>
                )}
              </div>
              {client.company && (
                <div className="text-xl text-brand-charcoal mb-2">
                  <strong>{client.company}</strong>
                </div>
              )}
              <div className="flex gap-6 text-brand-charcoal/80">
                <span>📧 {client.email}</span>
                {client.industry && <span>🏢 {client.industry}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-6 py-3 bg-brand-plum text-brand-bone font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all"
              >
                Send Message
              </button>
            </div>
          </div>

          {/* Client Info Grid */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-brand-bone border-l-4 border-brand-plum">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Join Date
              </div>
              <div className="font-bold text-brand-plum">{new Date(client.joinedAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                Client ID
              </div>
              <div className="font-bold text-brand-charcoal text-sm font-mono">{client.id}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-brand-plum p-6">
            <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Performance Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Total Leads</span>
                <span className="text-2xl font-display font-bold text-brand-gold">{client.stats.totalLeads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Qualified Leads</span>
                <span className="text-2xl font-display font-bold text-brand-gold">{client.stats.qualifiedLeads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Meetings Scheduled</span>
                <span className="text-2xl font-display font-bold text-brand-gold">{client.stats.meetingsScheduled}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6">
            <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Call Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Total Calls</span>
                <span className="text-2xl font-display font-bold text-brand-plum">{client.stats.totalCalls}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Connected</span>
                <span className="text-2xl font-display font-bold text-green-600">{client.stats.connectedCalls}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-charcoal/60">Connection Rate</span>
                <span className="text-2xl font-display font-bold text-green-600">
                  {client.stats.totalCalls > 0 ? Math.round((client.stats.connectedCalls / client.stats.totalCalls) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-brand-plum p-6">
            <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-4">Conversion</h3>
            <div className="text-center py-4">
              <div className="text-5xl font-display font-bold text-brand-gold mb-2">
                {client.stats.conversionRate}
              </div>
              <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                Lead Conversion Rate
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Focus Areas */}
            {client.focusAreas.length > 0 && (
              <div className="bg-white border-2 border-brand-plum p-6">
                <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Focus Areas</h3>
                <div className="space-y-4">
                  {client.focusAreas.map((area: any) => (
                    <div key={area.id} className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-brand-plum mb-1">{area.title}</div>
                          {area.description && (
                            <div className="text-sm text-brand-charcoal/60">{area.description}</div>
                          )}
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-mono uppercase">
                          {area.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="text-xs text-brand-charcoal/60">Calls This Month</div>
                          <div className="text-xl font-bold text-brand-plum">{area.callsThisMonth || 0}</div>
                        </div>
                        <div>
                          <div className="text-xs text-brand-charcoal/60">Leads Generated</div>
                          <div className="text-xl font-bold text-brand-gold">{area.leadsGenerated || 0}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Leads */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Recent Leads</h3>
              {client.leads.length > 0 ? (
                <div className="space-y-3">
                  {client.leads.slice(0, 5).map((lead: any) => (
                    <div key={lead.id} className="p-4 bg-brand-bone">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-brand-plum">{lead.companyName}</div>
                          <div className="text-sm text-brand-charcoal/60">{lead.contactName}</div>
                        </div>
                        <span className="px-2 py-1 text-xs font-mono uppercase bg-brand-gold text-brand-plum">
                          {lead.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-brand-charcoal/60">
                        Added: {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  <Link
                    href={`/admin/leads?client=${clientId}`}
                    className="block text-center py-3 border-2 border-brand-plum text-brand-plum font-bold uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                  >
                    View All Leads
                  </Link>
                </div>
              ) : (
                <p className="text-center text-brand-charcoal/60 py-8">No leads yet</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Calls */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Recent Calls</h3>
              {client.callLogs.length > 0 ? (
                <div className="space-y-3">
                  {client.callLogs.slice(0, 5).map((call: any) => (
                    <div key={call.id} className="p-4 bg-brand-bone">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-brand-plum">{call.prospectName}</div>
                          {call.prospectCompany && (
                            <div className="text-sm text-brand-charcoal/60">{call.prospectCompany}</div>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-mono uppercase ${
                          call.callOutcome === 'CONNECTED' || call.callOutcome === 'SCHEDULED_MEETING'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {call.callOutcome.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-brand-charcoal/60">
                        {new Date(call.callDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  <Link
                    href={`/admin/calls?client=${clientId}`}
                    className="block text-center py-3 border-2 border-brand-plum text-brand-plum font-bold uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                  >
                    View All Calls
                  </Link>
                </div>
              ) : (
                <p className="text-center text-brand-charcoal/60 py-8">No calls yet</p>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Admin Notes</h3>
              <div className="space-y-4 mb-4">
                {client.adminNotes.map((note: any) => (
                  <div key={note.id} className="p-4 bg-brand-bone">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-brand-plum">{note.createdBy.name || note.createdBy.email}</div>
                      <div className="text-xs text-brand-charcoal/60">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-brand-charcoal/80 whitespace-pre-wrap">{note.content}</div>
                  </div>
                ))}
                {client.adminNotes.length === 0 && (
                  <p className="text-center text-brand-charcoal/60 py-4">No notes yet</p>
                )}
              </div>
              <form onSubmit={handleAddNote}>
                <textarea
                  placeholder="Add a new note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans mb-3"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={addingNote || !noteContent.trim()}
                  className="w-full px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all disabled:opacity-50"
                >
                  {addingNote ? "Adding..." : "Add Note"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-brand-plum max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-brand-plum text-brand-bone p-6 border-b-4 border-brand-gold">
              <h2 className="text-2xl font-display font-bold uppercase">Send Message to {client.name || client.email}</h2>
            </div>
            <form onSubmit={handleSendMessage} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                  Subject *
                </label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  placeholder="Enter email subject..."
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                  Message *
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  required
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  placeholder="Enter your message..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
