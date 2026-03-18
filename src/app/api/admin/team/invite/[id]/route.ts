import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Only SUPER_ADMIN can revoke invitations
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    // Delete the invitation
    await prisma.adminInvite.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Invitation revoked successfully" });
  } catch (error) {
    console.error("Error revoking invitation:", error);
    return NextResponse.json(
      { error: "Failed to revoke invitation" },
      { status: 500 }
    );
  }
}
