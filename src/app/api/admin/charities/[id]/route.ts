import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { action, reason } = await request.json();

  const updateData: Record<string, unknown> = {};

  switch (action) {
    case "verify":
      updateData.status = "verified";
      updateData.verifiedAt = new Date();
      updateData.rejectionReason = null;
      break;
    case "reject":
      updateData.status = "rejected";
      updateData.rejectionReason = reason || "Not specified";
      break;
    case "suspend":
      updateData.status = "suspended";
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  await prisma.organization.update({ where: { id }, data: updateData });

  return NextResponse.json({ success: true });
}
