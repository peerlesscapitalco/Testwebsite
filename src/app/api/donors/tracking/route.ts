import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const donations = await prisma.donation.findMany({
    where: { donorId: user.id },
    include: {
      cause: {
        include: {
          organization: true,
          spendingReports: { orderBy: { reportDate: "desc" } },
        },
      },
    },
  });

  // Group by cause
  const causeMap = new Map<string, { cause: typeof donations[0]["cause"]; myDonation: number }>();
  for (const d of donations) {
    const existing = causeMap.get(d.causeId);
    if (existing) {
      existing.myDonation += d.amount;
    } else {
      causeMap.set(d.causeId, { cause: d.cause, myDonation: d.amount });
    }
  }

  const causes = Array.from(causeMap.values()).map(({ cause, myDonation }) => ({
    id: cause.id,
    title: cause.title,
    category: cause.category,
    goalAmount: cause.goalAmount,
    raisedAmount: cause.raisedAmount,
    status: cause.status,
    organization: { name: cause.organization.name },
    myDonation,
    spendingReports: cause.spendingReports,
  }));

  return NextResponse.json({ causes });
}
