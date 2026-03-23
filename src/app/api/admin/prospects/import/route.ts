import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCSVWithMapping, type CSVAnalysisResult } from "@/lib/enrichment/csv-mapper";

/**
 * POST /api/admin/prospects/import
 * 
 * Bulk import prospects from CSV file
 * Processes in batches with error handling and duplicate detection
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can import prospects
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const analysisJson = formData.get("analysis") as string;

    if (!file || !analysisJson) {
      return NextResponse.json(
        { error: "Missing file or analysis data" },
        { status: 400 }
      );
    }

    const analysis: CSVAnalysisResult = JSON.parse(analysisJson);

    // Read file content
    const fileContent = await file.text();

    // Parse CSV with mapping and validation
    const { validRows, skippedRows, stats } = parseCSVWithMapping(
      fileContent,
      analysis
    );

    // Check for existing prospects to avoid duplicates
    const existingProspects = await prisma.prospect.findMany({
      where: {
        companyName: {
          in: validRows.map((r) => r.companyName),
        },
      },
      select: {
        companyName: true,
        contactPhone: true,
        contactEmail: true,
      },
    });

    // Create a set of existing prospect keys
    const existingKeys = new Set(
      existingProspects.map(
        (p: any) => `${p.companyName}|${p.contactPhone || ""}|${p.contactEmail || ""}`
      )
    );

    // Filter out duplicates that already exist in database
    const newProspects = validRows.filter((row) => {
      const key = `${row.companyName}|${row.contactPhone || ""}|${row.contactEmail || ""}`;
      return !existingKeys.has(key);
    });

    const dbDuplicates = validRows.length - newProspects.length;

    // Batch insert prospects (500 at a time)
    const batchSize = 500;
    let imported = 0;
    const errors: Array<{ row: any; error: string }> = [];

    for (let i = 0; i < newProspects.length; i += batchSize) {
      const batch = newProspects.slice(i, i + batchSize);

      try {
        // Prepare data for Prisma
        const prospectsToCreate = batch.map((row) => ({
          companyName: row.companyName,
          website: row.website || null,
          industry: row.industry || null,
          companySize: row.companySize || null,
          yearsInBusiness: row.yearsInBusiness ? parseInt(row.yearsInBusiness) : null,
          servicesOffered: row.servicesOffered || [],
          contactName: row.contactName || null,
          contactTitle: row.contactTitle || null,
          contactEmail: row.contactEmail || null,
          contactPhone: row.contactPhone || null,
          location: row.location || null,
          address: row.address || null,
          city: row.city || null,
          state: row.state || null,
          zipCode: row.zipCode || null,
          linkedinUrl: row.linkedinUrl || null,
          facebookUrl: row.facebookUrl || null,
          twitterUrl: row.twitterUrl || null,
          yelpUrl: row.yelpUrl || null,
          source: row.source,
          sourceDetail: row.sourceDetail || null,
          tags: row.tags || [],
          notes: row.notes || null,
          status: "NEW" as const,
          readinessScore: 0,
        }));

        await prisma.prospect.createMany({
          data: prospectsToCreate,
          skipDuplicates: true,
        });

        imported += batch.length;
      } catch (error) {
        console.error(`Error importing batch ${i / batchSize + 1}:`, error);
        // Log errors but continue with next batch
        batch.forEach((row) => {
          errors.push({
            row,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        });
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalRows: stats.total,
        validRows: stats.valid,
        imported,
        skipped: stats.skipped,
        duplicatesInFile: stats.duplicates,
        duplicatesInDatabase: dbDuplicates,
        errors: errors.length,
      },
      skippedRows: skippedRows.slice(0, 50), // Return first 50 skipped rows for review
      errors: errors.slice(0, 20), // Return first 20 errors for review
    });
  } catch (error) {
    console.error("Error importing CSV:", error);
    return NextResponse.json(
      {
        error: "Failed to import CSV file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
