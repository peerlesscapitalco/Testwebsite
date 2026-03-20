import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "charity_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { adminId: user.id },
    include: { causes: { select: { id: true, title: true } } },
  });

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  const reports = await prisma.spendingReport.findMany({
    where: { organizationId: org.id },
    include: { cause: { select: { id: true, title: true } } },
    orderBy: { reportDate: "desc" },
  });

  return NextResponse.json({
    reports,
    causes: org.causes,
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "charity_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { adminId: user.id },
  });

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  const { title, description, amount, category, causeId, reportDate } = await request.json();

  if (!title || !description || !amount || !category || !causeId || !reportDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify cause belongs to this org
  const cause = await prisma.cause.findFirst({
    where: { id: causeId, organizationId: org.id },
  });

  if (!cause) {
    return NextResponse.json({ error: "Cause not found" }, { status: 404 });
  }

  const report = await prisma.spendingReport.create({
    data: {
      title,
      description,
      amount,
      category,
      reportDate: new Date(reportDate),
      organizationId: org.id,
      causeId,
      status: "pending",
    },
  });

  // Update org total spent
  await prisma.organization.update({
    where: { id: org.id },
    data: { totalSpent: { increment: amount } },
  });

  return NextResponse.json({ report }, { status: 201 });
}
