export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatPercent(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-warning-50 text-warning-700",
    verified: "bg-success-50 text-success-700",
    approved: "bg-success-50 text-success-700",
    active: "bg-primary-50 text-primary-700",
    completed: "bg-success-50 text-success-700",
    funded: "bg-accent-50 text-accent-700",
    rejected: "bg-danger-50 text-danger-700",
    suspended: "bg-danger-50 text-danger-700",
    flagged: "bg-warning-50 text-warning-700",
  };
  return colors[status] || "bg-gray-50 text-gray-700";
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    shelter: "Shelter & Housing",
    legal_aid: "Legal Aid",
    counseling: "Counseling & Therapy",
    emergency: "Emergency Services",
    education: "Education & Training",
    children: "Children's Services",
    healthcare: "Healthcare",
  };
  return labels[category] || category;
}
