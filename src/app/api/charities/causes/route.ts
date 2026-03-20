import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "charity_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { adminId: user.id },
  });

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  const causes = await prisma.cause.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ causes });
}
