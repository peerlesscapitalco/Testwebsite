import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const causes = await prisma.cause.findMany({
    include: {
      organization: { select: { name: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ causes });
}
