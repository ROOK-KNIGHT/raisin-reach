import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can access client list
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all clients
    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        industry: true,
        membershipStatus: true,
        membershipTier: true,
        joinedAt: true,
        _count: {
          select: {
            leads: true,
            callLogs: true,
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only SUPER_ADMIN and ADMIN can create clients
    if (!["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, company, industry, membershipTier, password } = body;

    if (!name || !email || !company || !password) {
      return NextResponse.json(
        { error: "Name, email, company, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create client
    const client = await prisma.user.create({
      data: {
        name,
        email,
        company,
        industry: industry || null,
        membershipTier: membershipTier || "standard",
        membershipStatus: "ACTIVE",
        password: hashedPassword,
        role: "CLIENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        industry: true,
        membershipTier: true,
        membershipStatus: true,
      },
    });

    return NextResponse.json(
      {
        message: "Client created successfully",
        client,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
