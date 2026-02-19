import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all projects for user
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

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST - Create new project
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
    const {
      name,
      description,
      status,
      startDate,
      endDate,
      projectedRevenue,
      actualRevenue,
      laborCost,
      materialCost,
      otherCosts,
      laborHours,
      numberOfWorkers,
    } = body;

    // Validation
    if (!name || !startDate || !endDate || projectedRevenue === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (projectedRevenue < 0) {
      return NextResponse.json(
        { error: "Projected revenue must be positive" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
        status: status || "PLANNED",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        projectedRevenue: parseFloat(projectedRevenue),
        actualRevenue: actualRevenue ? parseFloat(actualRevenue) : null,
        laborCost: laborCost ? parseFloat(laborCost) : 0,
        materialCost: materialCost ? parseFloat(materialCost) : 0,
        otherCosts: otherCosts ? parseFloat(otherCosts) : 0,
        laborHours: laborHours ? parseFloat(laborHours) : null,
        numberOfWorkers: numberOfWorkers ? parseInt(numberOfWorkers) : null,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT - Update project
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
    const {
      id,
      name,
      description,
      status,
      startDate,
      endDate,
      projectedRevenue,
      actualRevenue,
      laborCost,
      materialCost,
      otherCosts,
      laborHours,
      numberOfWorkers,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (existingProject.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(projectedRevenue !== undefined && {
          projectedRevenue: parseFloat(projectedRevenue),
        }),
        ...(actualRevenue !== undefined && {
          actualRevenue: actualRevenue ? parseFloat(actualRevenue) : null,
        }),
        ...(laborCost !== undefined && { laborCost: parseFloat(laborCost) }),
        ...(materialCost !== undefined && {
          materialCost: parseFloat(materialCost),
        }),
        ...(otherCosts !== undefined && { otherCosts: parseFloat(otherCosts) }),
        ...(laborHours !== undefined && {
          laborHours: laborHours ? parseFloat(laborHours) : null,
        }),
        ...(numberOfWorkers !== undefined && {
          numberOfWorkers: numberOfWorkers ? parseInt(numberOfWorkers) : null,
        }),
      },
    });

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
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
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (existingProject.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
