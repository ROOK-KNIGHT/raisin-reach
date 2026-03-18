import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only SUPER_ADMIN can update team member roles
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Validate role
    if (!["ADMIN", "MANAGER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN or MANAGER" },
        { status: 400 }
      );
    }

    // Prevent changing SUPER_ADMIN role
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (targetUser?.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Cannot change SUPER_ADMIN role" },
        { status: 403 }
      );
    }

    // Update user role
    await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
