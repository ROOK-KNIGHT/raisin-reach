"use client";

interface SalesIntelligence {
  companyName: string;
  contactName?: string;
  contactTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  industry: string;
  companySize?: string;
  yearsInBusiness?: number;
  servicesOffered: string[];
  industryPainPoints: string[];
  specificChallenges: string[];
  conversationStarters: string[];
  objectionPrep: Array<{
    objection: string;
    response: string;
  }>;
  competitiveInsights: string[];
  idealPitchAngle: string;
  urgencySignals: string[];
  decisionMakerNotes: string;
  readinessScore: number;
  scoreReasoning: string;
  aiConfidence: "HIGH" | "MEDIUM" | "LOW";
  prospectSummary: string;
}

interface SalesIntelligencePanelProps {
  intelligence: SalesIntelligence | null;
  aiConfidence?: "HIGH" | "MEDIUM" | "LOW";
  lastEnrichedAt?: string;
}

export default function SalesIntelligencePanel({
  intelligence,
  aiConfidence,
  lastEnrichedAt,
}: SalesIntelligencePanelProps) {
  if (!intelligence) {
    return (
      <div className="bg-white border-2 border-brand-plum p-6">
        <h3 className="text-2xl font-display font-bold text-brand-plum uppercase mb-4">
          🤖 AI Sales Intelligence
        </h3>
        <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 text-center">
          <p className="text-brand-charcoal/80 mb-4">
            No AI intelligence available yet. Run a prospect review to generate insights.
          </p>
          <p className="text-sm text-brand-charcoal/60">
            AI will analyze this prospect and provide conversation starters, pain points, objection handling, and more.
          </p>
        </div>
      </div>
    );
  }

  const getConfidenceBadge = (confidence: string) => {
    const badges: Record<string, string> = {
      HIGH: "bg-green-100 text-green-700 border-green-300",
      MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
      LOW: "bg-red-100 text-red-700 border-red-300",
    };
    return badges[confidence] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div className="space-y-6">
      {/* AI Confidence Header */}
      <div className="bg-white border-2 border-brand-plum p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-display font-bold text-brand-plum uppercase">
            🤖 AI Sales Intelligence
          </h3>
          <span
            className={`px-3 py-1 text-xs font-mono uppercase font-bold border-2 ${getConfidenceBadge(
              aiConfidence || intelligence.aiConfidence
            )}`}
          >
            {aiConfidence || intelligence.aiConfidence} Confidence
          </span>
        </div>

        {lastEnrichedAt && (
          <p className="text-sm text-brand-charcoal/60 font-mono">
            Last enriched: {new Date(lastEnrichedAt).toLocaleString()}
          </p>
        )}

        {/* Prospect Summary */}
        <div className="mt-4 p-4 bg-brand-bone border-l-4 border-brand-gold">
          <div className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-2">
            AI Summary
          </div>
          <p className="text-brand-charcoal leading-relaxed">{intelligence.prospectSummary}</p>
        </div>
      </div>

      {/* Ideal Pitch Angle */}
      <div className="bg-white border-2 border-brand-plum p-6">
        <h4 className="text-xl font-display font-bold text-brand-plum uppercase mb-3">
          🎯 Ideal Pitch Angle
        </h4>
        <div className="p-4 bg-green-50 border-l-4 border-green-500">
          <p className="text-brand-charcoal font-medium">{intelligence.idealPitchAngle}</p>
        </div>
      </div>

      {/* Conversation Starters */}
      <div className="bg-white border-2 border-brand-plum p-6">
        <h4 className="text-xl font-display font-bold text-brand-plum uppercase mb-3">
          💬 Conversation Starters
        </h4>
        <div className="space-y-3">
          {Array.isArray(intelligence.conversationStarters) && intelligence.conversationStarters.map((starter, idx) => (
            <div key={idx} className="p-4 bg-brand-bone border-l-4 border-brand-gold">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-plum text-brand-bone rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <p className="text-brand-charcoal flex-1">{starter}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Pain Points */}
      <div className="bg-white border-2 border-brand-plum p-6">
        <h4 className="text-xl font-display font-bold text-brand-plum uppercase mb-3">
          🔥 Industry Pain Points
        </h4>
        <ul className="space-y-2">
          {Array.isArray(intelligence.industryPainPoints) && intelligence.industryPainPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-brand-gold text-xl">•</span>
              <span className="text-brand-charcoal">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Specific Challenges */}
      <div className="bg-white border-2 border-brand-plum p-6">
        <h4 className="text-xl font-display font-bold text-brand-plum uppercase mb-3">
          ⚠️ Specific Challenges
        </h4>
        <ul className="space-y-2">
          {Array.isArray(intelligence.specificChallenges) && intelligence.specificChallenges.map((challenge, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-red-500 text-xl">•</span>
              <span className="text-brand-charcoal">{challenge}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Objection Prep */}
      <div className="bg-white border-2 border-brand-plum p-6">
        <h4 className="text-xl font-display font-bold text-brand-plum uppercase mb-3">
          🛡️ Objection Handling
        </h4>
        <div className="space-y-4">
          {Array.isArray(intelligence.objectionPrep) && intelligence.objectionPrep.map((obj, idx) => (
            <div key={idx} className="border-2 border-brand-plum/20 p-4">
              <div className="mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
                  Objection:
                </span>
                <p className="text-brand-charcoal font-medium mt-1">"{obj.objection}"</p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-green-600 font-bold">
                  Response:
                </span>
                <p className="text-brand-charcoal mt-1">{obj.response}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Insights */}
      {Array.isArray(intelligence.competitiveInsights) && intelligence.competitiveInsights.length > 0 && (
        <div className="bg-white border-2 border-brand-plum p-6">
          <h4 className="text-xl font-display font-bold text-brand-plum uppercase mb-3">
            🏆 Competitive Insights
          </h4>
          <ul className="space-y-2">
            {intelligence.competitiveInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-brand-plum text-xl">•</span>
                <span className="text-brand-charcoal">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Urgency Signals */}
      {Array.isArray(intelligence.urgencySignals) && intelligence.urgencySignals.length > 0 && (
        <div className="bg-white border-2 border-brand-plum p-6">
          <h4 className="text-xl font-display font-bold text-brand-plum uppercase mb-3">
            ⏰ Urgency Signals
          </h4>
          <ul className="space-y-2">
            {intelligence.urgencySignals.map((signal, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">•</span>
                <span className="text-brand-charcoal">{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Decision Maker Notes */}
      <div className="bg-white border-2 border-brand-plum p-6">
        <h4 className="text-xl font-display font-bold text-brand-plum uppercase mb-3">
          👤 Decision Maker Notes
        </h4>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
          <p className="text-brand-charcoal">{intelligence.decisionMakerNotes}</p>
        </div>
      </div>

      {/* AI Score Reasoning */}
      <div className="bg-white border-2 border-brand-plum p-6">
        <h4 className="text-xl font-display font-bold text-brand-plum uppercase mb-3">
          📊 Score Reasoning
        </h4>
        <div className="p-4 bg-brand-bone border-l-4 border-brand-gold">
          <p className="text-brand-charcoal">{intelligence.scoreReasoning}</p>
        </div>
      </div>
    </div>
  );
}
