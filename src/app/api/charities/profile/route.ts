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
  });

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  return NextResponse.json({ organization: org });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "charity_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { adminId: user.id },
  });

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  const data = await request.json();

  await prisma.organization.update({
    where: { id: org.id },
    data: {
      name: data.name,
      description: data.description,
      mission: data.mission,
      ein: data.ein || null,
      email: data.email,
      phone: data.phone || null,
      website: data.website || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zipCode: data.zipCode || null,
    },
  });

  return NextResponse.json({ success: true });
}
