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

    // Only admin roles can create call logs
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      clientId,
      prospectName,
      prospectCompany,
      prospectPhone,
      prospectEmail,
      callOutcome,
      callDuration,
      notes,
      followUpDate,
    } = body;

    if (!clientId || !prospectName || !prospectCompany || !callOutcome) {
      return NextResponse.json(
        { error: "Client, prospect name, company, and call outcome are required" },
        { status: 400 }
      );
    }

    // Create call log
    const callLog = await prisma.callLog.create({
      data: {
        userId: clientId,
        prospectName,
        prospectCompany,
        prospectPhone: prospectPhone || null,
        prospectEmail: prospectEmail || null,
        callOutcome,
        callDuration: callDuration || null,
        notes: notes || null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
    });

    return NextResponse.json(
      {
        message: "Call log created successfully",
        callLog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating call log:", error);
    return NextResponse.json(
      { error: "Failed to create call log" },
      { status: 500 }
    );
  }
}
