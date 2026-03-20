import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    user: {
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
      phone: dbUser.phone || "",
    },
  });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { firstName, lastName, phone } = await request.json();

  await prisma.user.update({
    where: { id: user.id },
    data: { firstName, lastName, phone: phone || null },
  });

  return NextResponse.json({ success: true });
}
