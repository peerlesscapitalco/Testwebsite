import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "donor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const donations = await prisma.donation.findMany({
    where: { donorId: user.id },
    include: { cause: { include: { organization: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const causesSupported = new Set(donations.map((d) => d.causeId)).size;

  return NextResponse.json({
    totalDonated,
    totalDonations: donations.length,
    causesSupported,
    recentDonations: donations.slice(0, 5),
  });
}
