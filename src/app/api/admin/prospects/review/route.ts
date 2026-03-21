import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enrichProspect } from "@/lib/enrichment/aggregator";
import { generateSalesIntelligence, calculateBasicReadinessScore } from "@/lib/enrichment/ai-intelligence";

/**
 * POST /api/admin/prospects/review
 * 
 * Runs a comprehensive prospect review by enriching from multiple sources:
 * - Google Places API (business info, reviews, ratings)
 * - Yelp Fusion API (reviews, ratings, categories)
 * - Website scraping (contact info, social links, content)
 * - Claude AI analysis (sales intelligence, pain points, conversation starters)
 * 
 * This creates a complete sales intelligence profile for the prospect
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can run prospect reviews
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { prospectIds, prospects } = body;

    // Validate required fields
    if (!prospectIds || !Array.isArray(prospectIds) || prospectIds.length === 0) {
      return NextResponse.json(
        { error: "Prospect IDs are required" },
        { status: 400 }
      );
    }

    // Process each prospect
    const results = [];
    
    for (const prospectId of prospectIds) {
      try {
        // Get prospect from database
        const prospect = await prisma.prospect.findUnique({
          where: { id: prospectId },
        });

        if (!prospect) {
          results.push({
            prospectId,
            status: "error",
            error: "Prospect not found",
          });
          continue;
        }

        // Create enrichment job
        const enrichmentJob = await prisma.enrichmentJob.create({
          data: {
            prospectId: prospect.id,
            status: "PROCESSING",
            progress: 0,
            sources: ["google", "yelp", "website"],
            sourcesCompleted: [],
            sourcesFailed: [],
          },
        });

        // Run enrichment
        const enrichmentData = await enrichProspect(
          prospect.companyName,
          prospect.location || undefined,
          prospect.website || undefined,
          { google: true, yelp: true, website: true }
        );

        // Generate AI sales intelligence
        let salesIntelligence;
        let aiConfidence = "MEDIUM";
        
        try {
          salesIntelligence = await generateSalesIntelligence(enrichmentData);
          aiConfidence = salesIntelligence.aiConfidence;
        } catch (aiError) {
          console.error("AI intelligence generation failed, using fallback:", aiError);
          // Fallback to basic scoring if AI fails
          const basicScore = calculateBasicReadinessScore(enrichmentData);
          salesIntelligence = {
            readinessScore: basicScore,
            aiConfidence: "LOW",
          };
        }

        // Update prospect with enriched data
        await prisma.prospect.update({
          where: { id: prospect.id },
          data: {
            // Update from merged data
            contactPhone: enrichmentData.merged.contactPhone || prospect.contactPhone,
            contactEmail: enrichmentData.merged.contactEmail || prospect.contactEmail,
            website: enrichmentData.merged.website || prospect.website,
            address: enrichmentData.merged.address || prospect.address,
            city: enrichmentData.merged.city || prospect.city,
            state: enrichmentData.merged.state || prospect.state,
            zipCode: enrichmentData.merged.zipCode || prospect.zipCode,
            facebookUrl: enrichmentData.merged.socialLinks?.facebook || prospect.facebookUrl,
            twitterUrl: enrichmentData.merged.socialLinks?.twitter || prospect.twitterUrl,
            linkedinUrl: enrichmentData.merged.socialLinks?.linkedin || prospect.linkedinUrl,
            yelpUrl: enrichmentData.sources.yelp?.yelpUrl || prospect.yelpUrl,
            googlePlaceId: enrichmentData.sources.google?.googlePlaceId || prospect.googlePlaceId,
            
            // Update from AI intelligence
            industry: salesIntelligence.industry || prospect.industry,
            companySize: salesIntelligence.companySize || prospect.companySize,
            yearsInBusiness: salesIntelligence.yearsInBusiness || prospect.yearsInBusiness,
            servicesOffered: salesIntelligence.servicesOffered || prospect.servicesOffered,
            contactName: salesIntelligence.contactName || prospect.contactName,
            contactTitle: salesIntelligence.contactTitle || prospect.contactTitle,
            
            // Store enrichment and intelligence data
            enrichmentData: enrichmentData as any,
            salesIntelligence: salesIntelligence as any,
            aiConfidence,
            readinessScore: salesIntelligence.readinessScore,
            lastEnrichedAt: new Date(),
            status: "RESEARCHING",
          },
        });

        // Update enrichment job
        await prisma.enrichmentJob.update({
          where: { id: enrichmentJob.id },
          data: {
            status: "COMPLETED",
            progress: 100,
            sourcesCompleted: enrichmentData.metadata.sourcesSucceeded,
            sourcesFailed: enrichmentData.metadata.sourcesFailed,
            completedAt: new Date(),
          },
        });

        results.push({
          prospectId,
          status: "success",
          readinessScore: salesIntelligence.readinessScore,
          sourcesEnriched: enrichmentData.metadata.sourcesSucceeded.length,
        });

      } catch (error) {
        console.error(`Error enriching prospect ${prospectId}:`, error);
        results.push({
          prospectId,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      status: "completed",
      results,
      totalProcessed: prospectIds.length,
      successful: results.filter(r => r.status === "success").length,
      failed: results.filter(r => r.status === "error").length,
    });

  } catch (error) {
    console.error("Error starting prospect review:", error);
    return NextResponse.json(
      { error: "Failed to start prospect review" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/prospects/review?jobId=xxx
 * 
 * Check the status of a running prospect review job
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Mock response - in production, check actual job status
    const mockStatus = {
      jobId,
      status: "completed",
      progress: 100,
      prospectsFound: 47,
      prospectsQualified: 12,
      sources: {
        website: { status: "completed", found: 15 },
        linkedin: { status: "completed", found: 8 },
        facebook: { status: "completed", found: 5 },
        twitter: { status: "completed", found: 3 },
        yelp: { status: "completed", found: 10 },
        google: { status: "completed", found: 6 }
      },
      completedAt: new Date().toISOString()
    };

    return NextResponse.json(mockStatus);
  } catch (error) {
    console.error("Error checking review status:", error);
    return NextResponse.json(
      { error: "Failed to check review status" },
      { status: 500 }
    );
  }
}
