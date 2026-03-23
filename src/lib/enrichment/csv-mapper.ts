/**
 * AI-Powered CSV Column Mapper
 * 
 * Uses Claude AI to intelligently map CSV columns to Prospect fields,
 * detect junk rows (disclaimers, footers), and validate data patterns.
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ColumnMapping {
  [csvColumn: string]: string; // CSV column name → Prospect field name
}

export interface CSVAnalysisResult {
  skipRows: number; // Number of rows to skip at the beginning (disclaimers, etc.)
  headerRow: number; // Which row contains the actual column headers
  mapping: ColumnMapping;
  source: string; // Detected source (e.g., "CSLB", "Yelp", "Manual")
  sourceDetail?: string;
  expectedColumnCount: number;
  sampleRows: any[]; // 5 sample rows with mapping applied
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

/**
 * Analyze CSV format using AI
 * Sends first ~50 lines to Claude to detect format, headers, and mapping
 */
export async function analyzeCSVFormat(
  fileContent: string,
  fileName: string
): Promise<CSVAnalysisResult> {
  // Extract first 50 lines for analysis
  const lines = fileContent.split("\n").slice(0, 50);
  const sample = lines.join("\n");

  const prompt = `You are a CSV data analyst. Analyze this CSV file and provide a JSON response with the following structure:

{
  "skipRows": <number of junk/disclaimer rows at the top to skip>,
  "headerRow": <which row number (0-indexed) contains the actual column headers>,
  "mapping": {
    "<CSV Column Name>": "<Prospect Field Name>",
    ...
  },
  "source": "<detected source like CSLB, Yelp, Google, BBB, Manual, etc.>",
  "sourceDetail": "<optional additional context about the source>",
  "expectedColumnCount": <number of columns in the data>,
  "confidence": "HIGH" | "MEDIUM" | "LOW"
}

Available Prospect fields to map to:
- companyName (required)
- website
- industry
- companySize
- yearsInBusiness
- servicesOffered (array - can map multiple columns or split comma-separated values)
- contactName
- contactTitle
- contactEmail
- contactPhone
- location (general location string)
- address
- city
- state
- zipCode
- linkedinUrl
- facebookUrl
- twitterUrl
- yelpUrl
- tags (array - put any useful info that doesn't fit elsewhere, like license numbers, ratings, certifications)
- notes (text - put any additional context)

Special mapping rules:
1. If a column contains license numbers, certifications, or ratings → map to "tags"
2. If a column has general notes or descriptions → map to "notes"
3. If you see "Business Name", "Company Name", "Contractor Name" → map to "companyName"
4. If you see combined location like "Sacramento, CA" → map to "location" (we'll parse it later)
5. If you see classification codes like "C-36 Plumbing" → extract industry ("Plumbing") and put code in tags
6. Ignore columns that are clearly internal IDs, timestamps, or irrelevant metadata

File name: ${fileName}

CSV Sample (first 50 lines):
${sample}

Return ONLY valid JSON, no markdown formatting.`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  // Parse the JSON response
  const analysis: CSVAnalysisResult = JSON.parse(content.text);

  // Parse sample rows to show preview
  const allLines = fileContent.split("\n");
  const dataStartRow = analysis.skipRows;
  const headerLine = allLines[analysis.headerRow];
  const headers = parseCSVLine(headerLine);

  // Get 5 sample data rows
  const sampleRows: any[] = [];
  for (let i = 0; i < 5; i++) {
    const rowIndex = dataStartRow + i + 1; // +1 to skip header
    if (rowIndex < allLines.length) {
      const line = allLines[rowIndex];
      const values = parseCSVLine(line);
      const row: any = {};

      // Apply mapping
      headers.forEach((header, idx) => {
        const prospectField = analysis.mapping[header];
        if (prospectField && values[idx]) {
          row[prospectField] = values[idx];
        }
      });

      sampleRows.push(row);
    }
  }

  analysis.sampleRows = sampleRows;

  return analysis;
}

/**
 * Simple CSV line parser (handles quoted fields)
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Validate a single row against expected pattern
 */
export function validateRow(
  row: string[],
  expectedColumnCount: number,
  avgRowLength: number
): {
  isValid: boolean;
  reason?: string;
} {
  // Check column count
  if (row.length !== expectedColumnCount) {
    return {
      isValid: false,
      reason: `Wrong column count: expected ${expectedColumnCount}, got ${row.length}`,
    };
  }

  // Check if row looks like a footer
  const joined = row.join(" ").toLowerCase();

  const footerKeywords = [
    "disclaimer",
    "total records",
    "generated on",
    "copyright",
    "end of report",
    "page ",
    "confidential",
    "all rights reserved",
  ];

  for (const keyword of footerKeywords) {
    if (joined.includes(keyword)) {
      return {
        isValid: false,
        reason: `Footer detected: contains "${keyword}"`,
      };
    }
  }

  // Check if row is mostly empty
  const nonEmptyCells = row.filter((c) => c?.trim()).length;
  if (nonEmptyCells < expectedColumnCount * 0.3) {
    return {
      isValid: false,
      reason: `Mostly empty: only ${nonEmptyCells}/${expectedColumnCount} cells have data`,
    };
  }

  // Check if row content is abnormally long (likely paragraph text)
  if (joined.length > avgRowLength * 5) {
    return {
      isValid: false,
      reason: `Abnormally long content: ${joined.length} chars vs avg ${avgRowLength}`,
    };
  }

  return { isValid: true };
}

/**
 * Parse entire CSV file and apply mapping
 */
export function parseCSVWithMapping(
  fileContent: string,
  analysis: CSVAnalysisResult
): {
  validRows: any[];
  skippedRows: Array<{ rowNumber: number; reason: string; content: string }>;
  stats: {
    total: number;
    valid: number;
    skipped: number;
    duplicates: number;
  };
} {
  const lines = fileContent.split("\n");
  const headerLine = lines[analysis.headerRow];
  const headers = parseCSVLine(headerLine);

  const validRows: any[] = [];
  const skippedRows: Array<{ rowNumber: number; reason: string; content: string }> = [];
  const seenCompanies = new Set<string>();

  // Calculate average row length for validation
  const sampleSize = Math.min(100, lines.length - analysis.skipRows - 1);
  let totalLength = 0;
  for (let i = 0; i < sampleSize; i++) {
    const idx = analysis.skipRows + 1 + i;
    if (idx < lines.length) {
      totalLength += lines[idx].length;
    }
  }
  const avgRowLength = totalLength / sampleSize;

  // Process each data row
  for (let i = analysis.skipRows + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      skippedRows.push({
        rowNumber: i + 1,
        reason: "Empty line",
        content: "",
      });
      continue;
    }

    try {
      const values = parseCSVLine(line);

      // Validate row pattern
      const validation = validateRow(values, analysis.expectedColumnCount, avgRowLength);
      if (!validation.isValid) {
        skippedRows.push({
          rowNumber: i + 1,
          reason: validation.reason || "Invalid row",
          content: line.substring(0, 100),
        });
        continue;
      }

      // Apply mapping
      const row: any = {};
      let hasCompanyName = false;

      headers.forEach((header, idx) => {
        const prospectField = analysis.mapping[header];
        if (prospectField && values[idx]) {
          const value = values[idx].trim();

          // Handle array fields
          if (prospectField === "servicesOffered" || prospectField === "tags") {
            row[prospectField] = row[prospectField] || [];
            row[prospectField].push(value);
          } else {
            row[prospectField] = value;
          }

          if (prospectField === "companyName" && value) {
            hasCompanyName = true;
          }
        }
      });

      // Must have company name
      if (!hasCompanyName) {
        skippedRows.push({
          rowNumber: i + 1,
          reason: "Missing company name",
          content: line.substring(0, 100),
        });
        continue;
      }

      // Check for duplicates
      const companyKey = `${row.companyName}|${row.contactPhone || ""}|${row.contactEmail || ""}`;
      if (seenCompanies.has(companyKey)) {
        skippedRows.push({
          rowNumber: i + 1,
          reason: "Duplicate entry",
          content: line.substring(0, 100),
        });
        continue;
      }
      seenCompanies.add(companyKey);

      // Add metadata
      row.source = analysis.source;
      row.sourceDetail = analysis.sourceDetail;
      row.status = "NEW";
      row.readinessScore = 0;

      validRows.push(row);
    } catch (error) {
      skippedRows.push({
        rowNumber: i + 1,
        reason: `Parse error: ${error instanceof Error ? error.message : "Unknown error"}`,
        content: line.substring(0, 100),
      });
    }
  }

  return {
    validRows,
    skippedRows,
    stats: {
      total: lines.length - analysis.skipRows - 1,
      valid: validRows.length,
      skipped: skippedRows.length,
      duplicates: skippedRows.filter((r) => r.reason === "Duplicate entry").length,
    },
  };
}
