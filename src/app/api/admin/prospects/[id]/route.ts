import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/prospects/[id]
 * 
 * Get a single prospect by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const prospect = await prisma.prospect.findUnique({
      where: { id: params.id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        convertedLead: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            status: true,
          },
        },
        enrichmentJobs: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(prospect);
  } catch (error) {
    console.error("Error fetching prospect:", error);
    return NextResponse.json(
      { error: "Failed to fetch prospect" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/prospects/[id]
 * 
 * Update a prospect
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

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
      status,
      tags,
      notes,
      assignedToId,
      readinessScore,
    } = body;

    const prospect = await prisma.prospect.update({
      where: { id: params.id },
      data: {
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
        status,
        tags,
        notes,
        assignedToId,
        readinessScore,
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

    return NextResponse.json(prospect);
  } catch (error) {
    console.error("Error updating prospect:", error);
    return NextResponse.json(
      { error: "Failed to update prospect" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/prospects/[id]
 * 
 * Delete a prospect
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    if (!["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.prospect.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prospect:", error);
    return NextResponse.json(
      { error: "Failed to delete prospect" },
      { status: 500 }
    );
  }
}
