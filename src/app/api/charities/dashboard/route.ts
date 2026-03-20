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
          donations: {
            include: { donor: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  const activeCauses = org.causes.filter((c) => c.status === "active").length;
  const allDonations = org.causes.flatMap((c) =>
    c.donations.map((d) => ({ ...d, cause: { title: c.title } }))
  );
  allDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    organization: {
      name: org.name,
      status: org.status,
      totalReceived: org.totalReceived,
      totalSpent: org.totalSpent,
    },
    activeCauses,
    totalDonations: allDonations.length,
    recentDonations: allDonations.slice(0, 10),
  });
}
