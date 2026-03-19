import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can create leads
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      userId,
      companyName,
      contactName,
      contactTitle,
      contactEmail,
      contactPhone,
      status,
      source,
      industry,
      budget,
      authority,
      need,
      timeline,
      notes,
      nextAction,
      nextActionDate,
    } = body;

    // Validate required fields
    if (!userId || !companyName || !contactName) {
      return NextResponse.json(
        { error: "Missing required fields: userId, companyName, contactName" },
        { status: 400 }
      );
    }

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        userId,
        companyName,
        contactName,
        contactTitle,
        contactEmail,
        contactPhone,
        status: status || "NEW",
        source,
        industry,
        budget,
        authority,
        need,
        timeline,
        notes,
        nextAction,
        nextActionDate: nextActionDate ? new Date(nextActionDate) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can view all leads
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all leads with user information
    const leads = await prisma.lead.findMany({
      include: {
        user: {
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

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
