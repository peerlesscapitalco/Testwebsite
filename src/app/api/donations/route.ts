import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to donate" }, { status: 401 });
  }

  const { causeId, amount, message, isAnonymous } = await request.json();

  if (!causeId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid donation data" }, { status: 400 });
  }

  const cause = await prisma.cause.findUnique({
    where: { id: causeId },
    include: { organization: true },
  });

  if (!cause || cause.status !== "active") {
    return NextResponse.json({ error: "Cause not found or not active" }, { status: 404 });
  }

  const donation = await prisma.donation.create({
    data: {
      donorId: user.id,
      causeId,
      amount,
      message: message || null,
      isAnonymous: isAnonymous || false,
      status: "completed",
    },
  });

  // Update cause raised amount
  await prisma.cause.update({
    where: { id: causeId },
    data: { raisedAmount: { increment: amount } },
  });

  // Update organization total received
  await prisma.organization.update({
    where: { id: cause.organizationId },
    data: { totalReceived: { increment: amount } },
  });

  return NextResponse.json({ donation }, { status: 201 });
}
