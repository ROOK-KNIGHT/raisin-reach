import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, password } = body;

    console.log("[REGISTER] Received registration request for:", email);

    if (!name || !email || !password) {
      console.log("[REGISTER] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log("[REGISTER] Checking if user exists...");
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("[REGISTER] User already exists");
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    console.log("[REGISTER] Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    console.log("[REGISTER] Creating user in database...");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        company: company || null,
        password: hashedPassword,
        membershipStatus: "TRIAL", // Start with trial
      },
    });

    console.log("[REGISTER] User created successfully:", user.id);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER] Registration error:", error);
    console.error("[REGISTER] Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
