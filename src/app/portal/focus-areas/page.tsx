"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AddFocusAreaModal from "@/components/portal/AddFocusAreaModal";
import PortalLayout from "@/components/portal/PortalLayout";

interface FocusArea {
  id: string;
  title: string;
  description: string | null;
  targetIndustry: string | null;
  targetJobTitles: string[];
  targetCompanySize: string | null;
  targetLocation: string | null;
  isActive: boolean;
  priority: string;
  createdAt: string;
}

export default function FocusAreasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch focus areas from API
  useEffect(() => {
    if (status === "authenticated") {
      fetchFocusAreas();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchFocusAreas = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/portal/focus-areas');
      if (res.ok) {
        const data = await res.json();
        setFocusAreas(data);
      }
    } catch (error) {
      console.error('Error fetching focus areas:', error);
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

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-display font-bold text-brand-plum uppercase mb-2">Focus Areas</h2>
            <p className="text-brand-charcoal/60">Define your ideal customer profiles and targeting criteria</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all"
          >
            + Add New Focus Area
          </button>
        </div>

        {/* Focus Areas List */}
        <div className="space-y-6">
          {focusAreas.map((area) => (
            <div
              key={area.id}
              className="bg-white border-2 border-brand-plum p-6 shadow-[2px_2px_0px_0px_var(--color-brand-plum)]"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-display font-bold text-brand-plum">{area.title}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-mono uppercase font-bold ${
                        area.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {area.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-brand-charcoal/80">{area.description || "No description provided"}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border-2 border-brand-plum text-brand-plum font-mono text-xs uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
                    Edit
                  </button>
                  <button className="px-4 py-2 border-2 border-brand-plum text-brand-plum font-mono text-xs uppercase tracking-widest hover:bg-brand-plum hover:text-brand-bone transition-all">
                    {area.isActive ? "Pause" : "Activate"}
                  </button>
                </div>
              </div>

              {/* Targeting Criteria */}
              <div className="border-t-2 border-brand-plum/10 pt-4">
                <h4 className="text-sm font-mono uppercase tracking-widest text-brand-charcoal/60 mb-3">
                  Targeting Criteria
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Industry
                    </div>
                    <div className="text-brand-charcoal font-sans">{area.targetIndustry || "Not specified"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Company Size
                    </div>
                    <div className="text-brand-charcoal font-sans">{area.targetCompanySize || "Not specified"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                      Location
                    </div>
                    <div className="text-brand-charcoal font-sans">{area.targetLocation || "Not specified"}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                    Target Job Titles
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {area.targetJobTitles && area.targetJobTitles.length > 0 ? (
                      area.targetJobTitles.map((title, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-brand-gold/20 text-brand-plum text-sm font-sans font-bold"
                        >
                          {title}
                        </span>
                      ))
                    ) : (
                      <span className="text-brand-charcoal/60 text-sm">No titles specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {focusAreas.length === 0 && (
          <div className="bg-white border-2 border-brand-plum p-12 text-center">
            <p className="text-brand-charcoal/60 font-mono uppercase tracking-widest mb-4">
              No focus areas configured yet
            </p>
            <p className="text-brand-charcoal/80 mb-6">
              Focus areas help us target the right prospects for your business. Get started by adding your first focus area.
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-brand-plum/5 border-2 border-brand-plum/20 p-6">
          <h3 className="text-lg font-display font-bold text-brand-plum uppercase mb-2">
            How Focus Areas Work
          </h3>
          <p className="text-brand-charcoal/80 mb-4">
            Focus Areas help us target the right prospects for your business. Each focus area defines specific
            criteria for industries, company sizes, and decision-maker titles we should target.
          </p>
          <ul className="space-y-2 text-brand-charcoal/80">
            <li className="flex items-start">
              <span className="text-brand-gold mr-2">▸</span>
              <span>Active focus areas are currently being targeted in our outreach campaigns</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-gold mr-2">▸</span>
              <span>You can pause/activate focus areas at any time to adjust your targeting strategy</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-gold mr-2">▸</span>
              <span>We recommend starting with 2-3 focus areas and refining based on results</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Add Focus Area Modal */}
      <AddFocusAreaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchFocusAreas}
      />
    </PortalLayout>
  );
}
