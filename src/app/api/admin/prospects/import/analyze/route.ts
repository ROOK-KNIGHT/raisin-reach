import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyzeCSVFormat } from "@/lib/enrichment/csv-mapper";

/**
 * POST /api/admin/prospects/import/analyze
 * 
 * Analyze CSV file format using AI
 * Returns column mapping, skip rows, source detection, and sample preview
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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is 50MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
        },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Invalid file type. Only CSV files are supported." },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();

    // Analyze with AI
    const analysis = await analyzeCSVFormat(fileContent, file.name);

    // Count total rows
    const lines = fileContent.split("\n");
    const totalDataRows = lines.length - analysis.skipRows - 1; // -1 for header

    return NextResponse.json({
      analysis,
      fileName: file.name,
      fileSize: file.size,
      totalRows: totalDataRows,
    });
  } catch (error) {
    console.error("Error analyzing CSV:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze CSV file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
