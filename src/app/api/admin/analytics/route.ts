import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalDonations, totalAmount, totalCharities, pendingVerifications, pendingCauseApprovals, totalUsers, donations] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.aggregate({ _sum: { amount: true } }),
    prisma.organization.count({ where: { status: "verified" } }),
    prisma.organization.count({ where: { status: "pending" } }),
    prisma.cause.count({ where: { status: "pending" } }),
    prisma.user.count(),
    prisma.donation.findMany({
      include: { cause: { select: { category: true } } },
    }),
  ]);

  // Category breakdown
  const categoryMap = new Map<string, { count: number; amount: number }>();
  for (const d of donations) {
    const cat = d.cause.category;
    const existing = categoryMap.get(cat) || { count: 0, amount: 0 };
    existing.count += 1;
    existing.amount += d.amount;
    categoryMap.set(cat, existing);
  }

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    ...data,
  }));

  return NextResponse.json({
    stats: {
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
      totalCharities,
      pendingVerifications,
      pendingCauseApprovals,
      totalUsers,
    },
    categoryBreakdown,
  });
}
