export type UserRole = "donor" | "charity_admin" | "admin";

export type OrgStatus = "pending" | "verified" | "rejected" | "suspended";

export type CauseCategory =
  | "shelter"
  | "legal_aid"
  | "counseling"
  | "emergency"
  | "education"
  | "children"
  | "healthcare";

export type CauseStatus =
  | "pending"
  | "approved"
  | "active"
  | "funded"
  | "completed"
  | "rejected";

export type DonationStatus = "pending" | "completed" | "refunded";

export type SpendingCategory =
  | "personnel"
  | "supplies"
  | "services"
  | "facilities"
  | "transportation"
  | "other";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
}

export const CAUSE_CATEGORIES: { value: CauseCategory; label: string; icon: string }[] = [
  { value: "shelter", label: "Shelter & Housing", icon: "🏠" },
  { value: "legal_aid", label: "Legal Aid", icon: "⚖️" },
  { value: "counseling", label: "Counseling & Therapy", icon: "💬" },
  { value: "emergency", label: "Emergency Services", icon: "🚨" },
  { value: "education", label: "Education & Training", icon: "📚" },
  { value: "children", label: "Children's Services", icon: "👶" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
];

export const SPENDING_CATEGORIES: { value: SpendingCategory; label: string }[] = [
  { value: "personnel", label: "Personnel & Staff" },
  { value: "supplies", label: "Supplies & Materials" },
  { value: "services", label: "Professional Services" },
  { value: "facilities", label: "Facilities & Rent" },
  { value: "transportation", label: "Transportation" },
  { value: "other", label: "Other" },
];
