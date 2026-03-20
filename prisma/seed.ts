import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminHash = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@hopefund.org",
      passwordHash: adminHash,
      firstName: "System",
      lastName: "Admin",
      role: "admin",
      isVerified: true,
    },
  });

  // Create a donor
  const donorHash = await bcrypt.hash("donor123456", 12);
  const donor = await prisma.user.create({
    data: {
      email: "donor@example.com",
      passwordHash: donorHash,
      firstName: "Jane",
      lastName: "Donor",
      role: "donor",
      isVerified: true,
    },
  });

  // Create charity admin and org
  const charityHash = await bcrypt.hash("charity123456", 12);
  const charityAdmin = await prisma.user.create({
    data: {
      email: "charity@safehaven.org",
      passwordHash: charityHash,
      firstName: "Sarah",
      lastName: "Johnson",
      role: "charity_admin",
      isVerified: true,
    },
  });

  const org = await prisma.organization.create({
    data: {
      name: "Safe Haven Foundation",
      description: "Providing safe shelter and comprehensive support services for survivors of domestic violence and their children.",
      mission: "To empower survivors of domestic violence to rebuild their lives through safe shelter, counseling, legal advocacy, and community support.",
      ein: "12-3456789",
      email: "info@safehaven.org",
      phone: "(555) 123-4567",
      website: "https://safehaven.org",
      address: "123 Hope Street",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      status: "verified",
      verifiedAt: new Date(),
      adminId: charityAdmin.id,
    },
  });

  // Create second charity
  const charity2Hash = await bcrypt.hash("charity123456", 12);
  const charityAdmin2 = await prisma.user.create({
    data: {
      email: "director@newbeginnings.org",
      passwordHash: charity2Hash,
      firstName: "Maria",
      lastName: "Garcia",
      role: "charity_admin",
      isVerified: true,
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      name: "New Beginnings Center",
      description: "Helping survivors transition to independent, violence-free lives through education, job training, and ongoing support.",
      mission: "To break the cycle of domestic violence through empowerment, education, and sustainable support programs.",
      ein: "98-7654321",
      email: "info@newbeginnings.org",
      phone: "(555) 987-6543",
      city: "Denver",
      state: "CO",
      status: "verified",
      verifiedAt: new Date(),
      adminId: charityAdmin2.id,
    },
  });

  // Create causes
  const cause1 = await prisma.cause.create({
    data: {
      title: "Emergency Shelter Expansion",
      description: "We need to expand our emergency shelter to accommodate 20 more families. Current capacity is overwhelmed with a waitlist of 50+ families.",
      category: "shelter",
      goalAmount: 75000,
      raisedAmount: 32500,
      status: "active",
      approvedAt: new Date(),
      organizationId: org.id,
    },
  });

  const cause2 = await prisma.cause.create({
    data: {
      title: "Legal Aid for Protective Orders",
      description: "Fund legal representation for 100 survivors seeking protective orders. Many survivors cannot afford legal counsel.",
      category: "legal_aid",
      goalAmount: 50000,
      raisedAmount: 18750,
      status: "active",
      approvedAt: new Date(),
      organizationId: org.id,
    },
  });

  const cause3 = await prisma.cause.create({
    data: {
      title: "Children's Trauma Recovery Program",
      description: "Specialized therapy and support programs for children who have witnessed domestic violence. Includes art therapy and counseling.",
      category: "children",
      goalAmount: 35000,
      raisedAmount: 12000,
      status: "active",
      approvedAt: new Date(),
      organizationId: org2.id,
    },
  });

  const cause4 = await prisma.cause.create({
    data: {
      title: "Job Training & Financial Independence",
      description: "12-week career training program including resume building, interview skills, and job placement assistance for survivors.",
      category: "education",
      goalAmount: 25000,
      raisedAmount: 8500,
      status: "active",
      approvedAt: new Date(),
      organizationId: org2.id,
    },
  });

  await prisma.cause.create({
    data: {
      title: "24/7 Crisis Hotline Staffing",
      description: "Fund trained crisis counselors to staff our 24/7 domestic violence hotline for one year.",
      category: "emergency",
      goalAmount: 60000,
      raisedAmount: 0,
      status: "pending",
      organizationId: org.id,
    },
  });

  // Create sample donations
  const sampleDonations = [
    { donorId: donor.id, causeId: cause1.id, amount: 500, message: "Stay strong. You are not alone." },
    { donorId: donor.id, causeId: cause2.id, amount: 250, message: "Everyone deserves legal protection." },
    { donorId: donor.id, causeId: cause3.id, amount: 100 },
    { donorId: donor.id, causeId: cause4.id, amount: 150, isAnonymous: true },
  ];

  for (const d of sampleDonations) {
    await prisma.donation.create({
      data: {
        ...d,
        status: "completed",
        isAnonymous: d.isAnonymous || false,
      },
    });
  }

  // Create spending reports
  await prisma.spendingReport.create({
    data: {
      title: "Shelter Building Materials",
      description: "Purchased construction materials for shelter expansion including drywall, lumber, and insulation.",
      amount: 12500,
      category: "supplies",
      reportDate: new Date("2026-02-15"),
      status: "approved",
      organizationId: org.id,
      causeId: cause1.id,
    },
  });

  await prisma.spendingReport.create({
    data: {
      title: "Attorney Retainer Fees",
      description: "Retained 3 attorneys specializing in family law and protective orders.",
      amount: 9000,
      category: "services",
      reportDate: new Date("2026-03-01"),
      status: "approved",
      organizationId: org.id,
      causeId: cause2.id,
    },
  });

  await prisma.spendingReport.create({
    data: {
      title: "Art Therapy Supplies",
      description: "Art supplies and materials for children's therapy sessions.",
      amount: 1200,
      category: "supplies",
      reportDate: new Date("2026-03-10"),
      status: "pending",
      organizationId: org2.id,
      causeId: cause3.id,
    },
  });

  console.log("Database seeded successfully!");
  console.log("\nTest accounts:");
  console.log("  Admin:   admin@hopefund.org / admin123456");
  console.log("  Donor:   donor@example.com / donor123456");
  console.log("  Charity: charity@safehaven.org / charity123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
