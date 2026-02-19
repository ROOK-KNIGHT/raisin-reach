import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch tax settings for user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { taxSettings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If no tax settings exist, create default ones
    if (!user.taxSettings) {
      const taxSettings = await prisma.taxSettings.create({
        data: {
          userId: user.id,
          federalTaxRate: 22.0,
          stateTaxRate: 0.0,
          localTaxRate: 0.0,
        },
      });
      return NextResponse.json(taxSettings, { status: 200 });
    }

    return NextResponse.json(user.taxSettings, { status: 200 });
  } catch (error) {
    console.error("Error fetching tax settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch tax settings" },
      { status: 500 }
    );
  }
}

// PUT - Update tax settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { taxSettings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { federalTaxRate, stateTaxRate, localTaxRate } = body;

    // Validation
    if (
      federalTaxRate !== undefined &&
      (federalTaxRate < 0 || federalTaxRate > 100)
    ) {
      return NextResponse.json(
        { error: "Federal tax rate must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (stateTaxRate !== undefined && (stateTaxRate < 0 || stateTaxRate > 100)) {
      return NextResponse.json(
        { error: "State tax rate must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (
      localTaxRate !== undefined &&
      (localTaxRate < 0 || localTaxRate > 100)
    ) {
      return NextResponse.json(
        { error: "Local tax rate must be between 0 and 100" },
        { status: 400 }
      );
    }

    let taxSettings;

    // If tax settings don't exist, create them
    if (!user.taxSettings) {
      taxSettings = await prisma.taxSettings.create({
        data: {
          userId: user.id,
          federalTaxRate: federalTaxRate !== undefined ? parseFloat(federalTaxRate) : 22.0,
          stateTaxRate: stateTaxRate !== undefined ? parseFloat(stateTaxRate) : 0.0,
          localTaxRate: localTaxRate !== undefined ? parseFloat(localTaxRate) : 0.0,
        },
      });
    } else {
      // Update existing tax settings
      taxSettings = await prisma.taxSettings.update({
        where: { userId: user.id },
        data: {
          ...(federalTaxRate !== undefined && {
            federalTaxRate: parseFloat(federalTaxRate),
          }),
          ...(stateTaxRate !== undefined && {
            stateTaxRate: parseFloat(stateTaxRate),
          }),
          ...(localTaxRate !== undefined && {
            localTaxRate: parseFloat(localTaxRate),
          }),
        },
      });
    }

    return NextResponse.json(taxSettings, { status: 200 });
  } catch (error) {
    console.error("Error updating tax settings:", error);
    return NextResponse.json(
      { error: "Failed to update tax settings" },
      { status: 500 }
    );
  }
}
