import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const donations = await prisma.donation.findMany({
    where: { donorId: user.id },
    include: { cause: { include: { organization: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ donations });
}
