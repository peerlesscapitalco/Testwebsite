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
    include: {
      causes: {
        include: {
          spendingReports: true,
        },
      },
    },
  });

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  const causes = org.causes.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    goalAmount: c.goalAmount,
    raisedAmount: c.raisedAmount,
    spentAmount: c.spendingReports.reduce((sum, r) => sum + r.amount, 0),
  }));

  return NextResponse.json({
    totalReceived: org.totalReceived,
    totalSpent: org.totalSpent,
    available: org.totalReceived - org.totalSpent,
    causes,
  });
}
