/**
 * AI-Powered Sales Intelligence
 * 
 * Uses Claude AI to analyze enrichment data and generate sales intelligence
 */

import Anthropic from "@anthropic-ai/sdk";
import type { AggregatedEnrichmentData } from "./aggregator";

export interface SalesIntelligence {
  // Structured prospect data
  companyName: string;
  contactName?: string;
  contactTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  industry: string;
  companySize?: string;
  yearsInBusiness?: number;
  servicesOffered: string[];
  
  // AI-generated insights
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
  
  // Scoring
  readinessScore: number;
  scoreReasoning: string;
  aiConfidence: "HIGH" | "MEDIUM" | "LOW";
  
  // Summary
  prospectSummary: string;
}

/**
 * Generate sales intelligence using Claude AI
 */
export async function generateSalesIntelligence(
  enrichmentData: AggregatedEnrichmentData
): Promise<SalesIntelligence> {
  const apiKey = process.env.Claude_API_Key;

  if (!apiKey) {
    throw new Error("CLAUDE_API_KEY is not configured");
  }

  const anthropic = new Anthropic({
    apiKey,
  });

  // Build the prompt with enrichment data
  const prompt = buildSalesIntelligencePrompt(enrichmentData);

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract the response
    let responseText = message.content[0].type === "text" ? message.content[0].text : "";
    
    // Clean up the response - remove markdown code blocks if present
    responseText = responseText.trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    
    // Parse the JSON response
    const intelligence = JSON.parse(responseText) as SalesIntelligence;

    return intelligence;
  } catch (error) {
    console.error("Error generating sales intelligence:", error);
    throw error;
  }
}

/**
 * Build the prompt for Claude AI
 */
function buildSalesIntelligencePrompt(data: AggregatedEnrichmentData): string {
  const { merged, sources, metadata } = data;

  return `You are a B2B sales intelligence analyst for Raisin Reach, a cold calling appointment-setting firm that serves home service businesses (plumbing, HVAC, electrical, roofing, landscaping, etc.).

Your task is to analyze the following raw data about a business prospect and generate comprehensive sales intelligence that will help our callers have more effective conversations.

RAW ENRICHMENT DATA:
${JSON.stringify({ merged, sources, metadata }, null, 2)}

INSTRUCTIONS:
1. Analyze all available data from Google Places, Yelp, and website scraping
2. Identify the industry and specific services offered
3. Generate industry-specific pain points and challenges
4. Create conversation starters tailored to this specific business
5. Predict common objections and provide rebuttals
6. Calculate a readiness score (0-100) based on data quality and business signals
7. Provide actionable insights for the sales team

RESPOND WITH VALID JSON ONLY (no markdown, no code blocks) in this exact structure:
{
  "companyName": "string",
  "contactName": "string or null",
  "contactTitle": "string or null",
  "contactEmail": "string or null",
  "contactPhone": "string or null",
  "industry": "string (normalized industry name)",
  "companySize": "string (estimate: 1-10, 10-50, 50-200, 200+)",
  "yearsInBusiness": number or null,
  "servicesOffered": ["array of services"],
  "industryPainPoints": [
    "Common pain point 1 for this industry",
    "Common pain point 2 for this industry",
    "Common pain point 3 for this industry"
  ],
  "specificChallenges": [
    "Challenge specific to THIS business based on the data",
    "Another specific challenge",
    "Another specific challenge"
  ],
  "conversationStarters": [
    "Opening line 1 tailored to this business",
    "Opening line 2 tailored to this business",
    "Opening line 3 tailored to this business"
  ],
  "objectionPrep": [
    {
      "objection": "We get enough work from referrals",
      "response": "Tailored response for this business"
    },
    {
      "objection": "We tried marketing before and it didn't work",
      "response": "Tailored response for this business"
    },
    {
      "objection": "We can't afford it right now",
      "response": "Tailored response for this business"
    }
  ],
  "competitiveInsights": [
    "Insight about their competitive position",
    "Another competitive insight"
  ],
  "idealPitchAngle": "One sentence describing the best approach for this prospect",
  "urgencySignals": [
    "Reason they should act now",
    "Another urgency signal"
  ],
  "decisionMakerNotes": "Who to ask for and how to frame the conversation",
  "readinessScore": number (0-100),
  "scoreReasoning": "Brief explanation of the score",
  "aiConfidence": "HIGH" | "MEDIUM" | "LOW",
  "prospectSummary": "2-3 sentence overview of this prospect"
}

IMPORTANT GUIDELINES:
- Be specific to THIS business, not generic
- Use data from reviews, ratings, and website content to inform insights
- If data is limited, acknowledge it in aiConfidence
- Focus on home services industry knowledge
- Make conversation starters natural, not salesy
- Objection responses should be consultative, not pushy
- Readiness score should consider: data completeness, business signals, industry fit, review quality

RESPOND WITH ONLY THE JSON OBJECT, NO OTHER TEXT.`;
}

/**
 * Calculate a simple readiness score based on data completeness
 * (This is a fallback if AI fails)
 */
export function calculateBasicReadinessScore(data: AggregatedEnrichmentData): number {
  let score = 0;

  // Data completeness (40 points)
  if (data.merged.companyName) score += 5;
  if (data.merged.contactPhone) score += 10;
  if (data.merged.contactEmail) score += 10;
  if (data.merged.website) score += 5;
  if (data.merged.address) score += 5;
  if (data.merged.categories && data.merged.categories.length > 0) score += 5;

  // Source quality (30 points)
  const sourcesSucceeded = data.metadata.sourcesSucceeded.length;
  score += sourcesSucceeded * 10;

  // Business signals (30 points)
  if (data.merged.rating && data.merged.rating >= 4.0) score += 10;
  if (data.merged.reviewCount && data.merged.reviewCount >= 10) score += 10;
  if (data.merged.socialLinks && Object.values(data.merged.socialLinks).filter(Boolean).length > 0) score += 10;

  return Math.min(100, score);
}
