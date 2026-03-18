"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
  joinedAt: string;
  lastActive?: string;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

export default function AdminTeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("ADMIN");
  const [inviting, setInviting] = useState(false);

  // Check if user is SUPER_ADMIN
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (status === "authenticated" && !isSuperAdmin) {
      router.push("/admin");
    } else if (status === "authenticated") {
      fetchTeamData();
    }
  }, [status, isSuperAdmin, router]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      
      // Fetch team members
      const membersRes = await fetch("/api/admin/team");
      if (membersRes.ok) {
        const data = await membersRes.json();
        setTeamMembers(data.members || []);
        setPendingInvites(data.invites || []);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      const res = await fetch("/api/admin/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (res.ok) {
        toast.success("Invitation sent successfully!");
        setShowInviteModal(false);
        setInviteEmail("");
        setInviteRole("ADMIN");
        fetchTeamData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send invitation");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setInviting(false);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    if (!confirm("Are you sure you want to revoke this invitation?")) return;

    try {
      const res = await fetch(`/api/admin/team/invite/${inviteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Invitation revoked");
        fetchTeamData();
      } else {
        toast.error("Failed to revoke invitation");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const res = await fetch(`/api/admin/team/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast.success("Role updated successfully");
        fetchTeamData();
      } else {
        toast.error("Failed to update role");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      SUPER_ADMIN: "bg-purple-100 text-purple-700",
      ADMIN: "bg-blue-100 text-blue-700",
      MANAGER: "bg-green-100 text-green-700",
      CLIENT: "bg-gray-100 text-gray-700",
    };
    return badges[role as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

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

  if (!isSuperAdmin) {
    return null;
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
                Welcome back, <strong>{user?.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold">
                SUPER ADMIN
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
            <Link
              href="/admin/team"
              className="px-4 py-4 border-b-4 border-brand-plum text-brand-plum font-bold uppercase tracking-wider text-sm"
            >
              Team
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Team Management</h2>
            <p className="text-brand-charcoal/60">Manage admin team members and permissions</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all"
          >
            + Invite Team Member
          </button>
        </div>

        {/* Team Members */}
        <div className="bg-white border-2 border-brand-plum p-6 mb-8">
          <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Team Members</h3>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-brand-bone border-l-4 border-brand-plum flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-brand-plum text-lg">{member.name || "No Name"}</h4>
                    <span className={`px-3 py-1 text-xs font-mono uppercase font-bold ${getRoleBadge(member.role)}`}>
                      {member.role.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-sm text-brand-charcoal/80">{member.email}</div>
                  <div className="text-xs text-brand-charcoal/60 mt-1">
                    Joined: {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
                {member.role !== "SUPER_ADMIN" && (
                  <div className="flex gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                      className="px-3 py-2 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-mono text-xs uppercase"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
            {teamMembers.length === 0 && (
              <div className="text-center py-8 text-brand-charcoal/60">
                No team members yet
              </div>
            )}
          </div>
        </div>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div className="bg-white border-2 border-brand-plum p-6">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Pending Invitations</h3>
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="p-4 bg-yellow-50 border-l-4 border-yellow-500 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-brand-plum">{invite.email}</h4>
                      <span className={`px-3 py-1 text-xs font-mono uppercase font-bold ${getRoleBadge(invite.role)}`}>
                        {invite.role.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-xs text-brand-charcoal/60">
                      Sent: {new Date(invite.createdAt).toLocaleDateString()} • 
                      Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeInvite(invite.id)}
                    className="px-4 py-2 border-2 border-red-500 text-red-500 font-mono text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white border-2 border-brand-plum p-8 max-w-md w-full shadow-[8px_8px_0px_0px_var(--color-brand-plum)]">
            <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-6">Invite Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-plum mb-2 uppercase tracking-wider">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-sans"
                >
                  <option value="ADMIN">Admin - Full access except team management</option>
                  <option value="MANAGER">Manager - Read-only dashboard access</option>
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex-1 px-6 py-3 bg-brand-plum text-brand-gold font-mono text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-plum transition-all disabled:opacity-50"
                >
                  {inviting ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
