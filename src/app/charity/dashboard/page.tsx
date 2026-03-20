"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import StatsCard from "@/components/ui/StatsCard";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface CharityDashboard {
  organization: {
    name: string;
    status: string;
    totalReceived: number;
    totalSpent: number;
  };
  activeCauses: number;
  totalDonations: number;
  recentDonations: Array<{
    id: string;
    amount: number;
    createdAt: string;
    isAnonymous: boolean;
    donor: { firstName: string; lastName: string } | null;
    cause: { title: string };
  }>;
}

export default function CharityDashboardPage() {
  const [data, setData] = useState<CharityDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/charities/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6"><div className="h-8 bg-gray-200 rounded w-48" /><div className="grid grid-cols-4 gap-6">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}</div></div>;
  }

  const org = data?.organization;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{org?.name || "Organization Dashboard"}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge status={org?.status || "pending"} />
            {org?.status === "pending" && (
              <span className="text-sm text-warning-700">Verification pending admin approval</span>
            )}
          </div>
        </div>
        <Link href="/charity/applications">
          <Button variant="secondary">Create New Cause</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Received" value={formatCurrency(org?.totalReceived || 0)} />
        <StatsCard title="Total Spent" value={formatCurrency(org?.totalSpent || 0)} />
        <StatsCard title="Active Causes" value={data?.activeCauses || 0} />
        <StatsCard title="Total Donations" value={data?.totalDonations || 0} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations Received</CardTitle>
        </CardHeader>
        {data?.recentDonations && data.recentDonations.length > 0 ? (
          <div className="space-y-3">
            {data.recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {donation.isAnonymous ? "Anonymous Donor" : `${donation.donor?.firstName} ${donation.donor?.lastName}`}
                  </p>
                  <p className="text-sm text-gray-500">{donation.cause.title} &middot; {formatDate(donation.createdAt)}</p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(donation.amount)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No donations received yet</p>
        )}
      </Card>
    </div>
  );
}
