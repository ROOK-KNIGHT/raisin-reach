"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PortalLayout from "@/components/portal/PortalLayout";

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: string;
  source: string | null;
  industry: string | null;
  budget: string | null;
  authority: string | null;
  need: string | null;
  timeline: string | null;
  notes: string | null;
  nextAction: string | null;
  nextActionDate: string | null;
  createdAt: string;
  updatedAt: string;
  callLogs: any[];
}

export default function LeadDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any || { name: "Demo User" };
  const params = useParams();
  const leadId = params.id;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchLead();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, leadId, router]);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/portal/leads/${leadId}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data);
      } else {
        console.error("Failed to fetch lead");
      }
    } catch (error) {
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
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

  if (!lead) {
    return (
      <div className="min-h-screen bg-brand-bone flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-plum font-mono uppercase tracking-widest mb-4">Lead not found</p>
          <Link href="/portal/leads" className="text-brand-gold hover:underline">
            ← Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Calculate a simple lead score based on available data
  const calculateLeadScore = () => {
    let score = 50; // Base score
    if (lead.budget) score += 15;
    if (lead.authority) score += 15;
    if (lead.need) score += 10;
    if (lead.timeline) score += 10;
    return Math.min(score, 100);
  };

  const leadScore = calculateLeadScore();

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/portal/leads" className="text-brand-plum hover:underline font-mono uppercase text-sm">
            ← Back to Leads
          </Link>
        </div>

        {/* Lead Header */}
        <div className="bg-white border-2 border-brand-plum p-8 mb-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-4xl font-display font-bold text-brand-plum">{lead.companyName}</h2>
                <span className="px-4 py-2 bg-brand-gold text-brand-plum text-sm font-mono uppercase font-bold">
                  {lead.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-xl text-brand-charcoal mb-2">
                <strong>{lead.contactName}</strong>
                {lead.contactTitle && ` • ${lead.contactTitle}`}
              </div>
              <div className="flex gap-6 text-brand-charcoal/80 flex-wrap">
                {lead.contactEmail && <span>📧 {lead.contactEmail}</span>}
                {lead.contactPhone && <span>📞 {lead.contactPhone}</span>}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-6xl font-display font-bold ${getScoreColor(leadScore)}`}>
                {leadScore}
              </div>
              <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60">
                Lead Score
              </div>
            </div>
          </div>

          {/* Company Info */}
          {lead.industry && (
            <div className="grid md:grid-cols-3 gap-4 p-4 bg-brand-bone border-l-4 border-brand-plum">
              {lead.industry && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Industry
                  </div>
                  <div className="font-bold text-brand-plum">{lead.industry}</div>
                </div>
              )}
              {lead.source && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Source
                  </div>
                  <div className="font-bold text-brand-plum">{lead.source}</div>
                </div>
              )}
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                  Created
                </div>
                <div className="font-bold text-brand-plum">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* BANT Qualification */}
            <div className="bg-white border-2 border-brand-plum p-6">
              <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">
                BANT Qualification
              </h3>
              <div className="space-y-4">
                {lead.budget && (
                  <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Budget
                    </div>
                    <div className="text-lg font-bold text-brand-charcoal">{lead.budget}</div>
                  </div>
                )}

                {lead.authority && (
                  <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Authority
                    </div>
                    <div className="text-sm text-brand-charcoal/80">{lead.authority}</div>
                  </div>
                )}

                {lead.need && (
                  <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Need
                    </div>
                    <div className="text-sm text-brand-charcoal/80 whitespace-pre-wrap">{lead.need}</div>
                  </div>
                )}

                {lead.timeline && (
                  <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                    <div className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
                      Timeline
                    </div>
                    <div className="text-sm text-brand-charcoal/80">{lead.timeline}</div>
                  </div>
                )}

                {!lead.budget && !lead.authority && !lead.need && !lead.timeline && (
                  <p className="text-center text-brand-charcoal/60 py-8">No BANT data available yet</p>
                )}
              </div>
            </div>

            {/* Next Action */}
            {lead.nextAction && (
              <div className="bg-white border-2 border-brand-plum p-6">
                <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Next Action</h3>
                <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
                  <div className="font-bold text-brand-plum mb-2">{lead.nextAction}</div>
                  {lead.nextActionDate && (
                    <div className="text-sm text-brand-charcoal/60">
                      Due: {new Date(lead.nextActionDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Call History */}
            {lead.callLogs && lead.callLogs.length > 0 && (
              <div className="bg-white border-2 border-brand-plum p-6">
                <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Call History</h3>
                <div className="space-y-4">
                  {lead.callLogs.map((call: any) => (
                    <div key={call.id} className="p-4 bg-brand-bone border-l-4 border-brand-plum">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-brand-plum">
                          {new Date(call.callDate).toLocaleDateString()}
                        </div>
                        <span className="px-3 py-1 bg-brand-gold/20 text-brand-plum text-xs font-mono uppercase font-bold">
                          {call.callOutcome.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {call.callDuration && (
                        <div className="text-sm text-brand-charcoal/60 mb-2">
                          Duration: {Math.floor(call.callDuration / 60)}:{(call.callDuration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                      {call.notes && (
                        <div className="text-sm text-brand-charcoal/80">{call.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {lead.notes && (
              <div className="bg-white border-2 border-brand-plum p-6">
                <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">Notes</h3>
                <div className="p-4 bg-brand-bone">
                  <div className="text-sm text-brand-charcoal/80 whitespace-pre-wrap">{lead.notes}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
