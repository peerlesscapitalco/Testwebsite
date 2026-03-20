import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (status) where.status = status;

  const causes = await prisma.cause.findMany({
    where,
    include: { organization: { select: { name: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ causes });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "charity_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { adminId: user.id },
  });

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const { title, description, category, goalAmount } = await request.json();

  if (!title || !description || !category || !goalAmount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const cause = await prisma.cause.create({
    data: {
      title,
      description,
      category,
      goalAmount,
      organizationId: org.id,
      status: "pending",
    },
  });

  return NextResponse.json({ cause }, { status: 201 });
}
