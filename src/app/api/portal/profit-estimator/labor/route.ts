import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all labor rates for user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const laborRates = await prisma.laborRate.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(laborRates, { status: 200 });
  } catch (error) {
    console.error("Error fetching labor rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch labor rates" },
      { status: 500 }
    );
  }
}

// POST - Create new labor rate
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { role, hourlyRate } = body;

    // Validation
    if (!role || hourlyRate === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (hourlyRate < 0) {
      return NextResponse.json(
        { error: "Hourly rate must be positive" },
        { status: 400 }
      );
    }

    const laborRate = await prisma.laborRate.create({
      data: {
        userId: user.id,
        role,
        hourlyRate: parseFloat(hourlyRate),
      },
    });

    return NextResponse.json(laborRate, { status: 201 });
  } catch (error) {
    console.error("Error creating labor rate:", error);
    return NextResponse.json(
      { error: "Failed to create labor rate" },
      { status: 500 }
    );
  }
}

// PUT - Update labor rate
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { id, role, hourlyRate } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Labor rate ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingLaborRate = await prisma.laborRate.findUnique({
      where: { id },
    });

    if (!existingLaborRate) {
      return NextResponse.json(
        { error: "Labor rate not found" },
        { status: 404 }
      );
    }

    if (existingLaborRate.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const laborRate = await prisma.laborRate.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(hourlyRate !== undefined && { hourlyRate: parseFloat(hourlyRate) }),
      },
    });

    return NextResponse.json(laborRate, { status: 200 });
  } catch (error) {
    console.error("Error updating labor rate:", error);
    return NextResponse.json(
      { error: "Failed to update labor rate" },
      { status: 500 }
    );
  }
}

// DELETE - Delete labor rate
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Labor rate ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingLaborRate = await prisma.laborRate.findUnique({
      where: { id },
    });

    if (!existingLaborRate) {
      return NextResponse.json(
        { error: "Labor rate not found" },
        { status: 404 }
      );
    }

    if (existingLaborRate.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.laborRate.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Labor rate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting labor rate:", error);
    return NextResponse.json(
      { error: "Failed to delete labor rate" },
      { status: 500 }
    );
  }
}
