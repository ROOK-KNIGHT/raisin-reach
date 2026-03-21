import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/prospects
 * 
 * List all prospects with optional filtering
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can view prospects
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const industry = searchParams.get("industry");
    const assignedToId = searchParams.get("assignedToId");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (source) {
      where.source = source;
    }

    if (industry) {
      where.industry = industry;
    }

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { contactName: { contains: search, mode: "insensitive" } },
        { contactEmail: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }

    const prospects = await prisma.prospect.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(prospects);
  } catch (error) {
    console.error("Error fetching prospects:", error);
    return NextResponse.json(
      { error: "Failed to fetch prospects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/prospects
 * 
 * Create a new prospect
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can create prospects
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      companyName,
      website,
      industry,
      companySize,
      yearsInBusiness,
      servicesOffered,
      contactName,
      contactTitle,
      contactEmail,
      contactPhone,
      location,
      address,
      city,
      state,
      zipCode,
      linkedinUrl,
      facebookUrl,
      twitterUrl,
      yelpUrl,
      googlePlaceId,
      source,
      sourceDetail,
      tags,
      notes,
      assignedToId,
    } = body;

    // Validate required fields
    if (!companyName || !source) {
      return NextResponse.json(
        { error: "Company name and source are required" },
        { status: 400 }
      );
    }

    // Create the prospect
    const prospect = await prisma.prospect.create({
      data: {
        companyName,
        website,
        industry,
        companySize,
        yearsInBusiness,
        servicesOffered: servicesOffered || [],
        contactName,
        contactTitle,
        contactEmail,
        contactPhone,
        location,
        address,
        city,
        state,
        zipCode,
        linkedinUrl,
        facebookUrl,
        twitterUrl,
        yelpUrl,
        googlePlaceId,
        source,
        sourceDetail,
        tags: tags || [],
        notes,
        assignedToId,
        status: "NEW",
        readinessScore: 0,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    return NextResponse.json(prospect, { status: 201 });
  } catch (error) {
    console.error("Error creating prospect:", error);
    return NextResponse.json(
      { error: "Failed to create prospect" },
      { status: 500 }
    );
  }
}
