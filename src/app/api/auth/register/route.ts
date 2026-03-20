import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import type { SessionUser } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, role } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        role: role === "charity_admin" ? "charity_admin" : "donor",
      },
    });

    // If charity_admin, create organization
    let organizationId: string | undefined;
    if (role === "charity_admin") {
      const { orgName, orgDescription, orgMission, orgEin, orgEmail, orgPhone, orgWebsite, orgAddress, orgCity, orgState, orgZipCode } = body;

      if (!orgName || !orgDescription || !orgMission || !orgEmail) {
        return NextResponse.json({ error: "Missing organization details" }, { status: 400 });
      }

      const org = await prisma.organization.create({
        data: {
          name: orgName,
          description: orgDescription,
          mission: orgMission,
          ein: orgEin || null,
          email: orgEmail,
          phone: orgPhone || null,
          website: orgWebsite || null,
          address: orgAddress || null,
          city: orgCity || null,
          state: orgState || null,
          zipCode: orgZipCode || null,
          adminId: user.id,
          status: "pending",
        },
      });
      organizationId = org.id;
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as SessionUser["role"],
      organizationId,
    };

    const token = generateToken(sessionUser);

    const response = NextResponse.json({ user: sessionUser }, { status: 201 });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
