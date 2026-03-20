"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import StatsCard from "@/components/ui/StatsCard";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface AdminDashboard {
  stats: {
    totalDonations: number;
    totalAmount: number;
    totalCharities: number;
    pendingVerifications: number;
    pendingCauseApprovals: number;
    totalUsers: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6"><div className="h-8 bg-gray-200 rounded w-48" /><div className="grid grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i=><div key={i} className="h-32 bg-gray-200 rounded-xl" />)}</div></div>;
  }

  const stats = data?.stats;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-500">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatsCard title="Total Donations" value={formatCurrency(stats?.totalAmount || 0)} />
        <StatsCard title="Transactions" value={stats?.totalDonations || 0} />
        <StatsCard title="Charities" value={stats?.totalCharities || 0} />
        <StatsCard title="Pending Verifications" value={stats?.pendingVerifications || 0} />
        <StatsCard title="Pending Approvals" value={stats?.pendingCauseApprovals || 0} />
        <StatsCard title="Total Users" value={stats?.totalUsers || 0} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Verifications</CardTitle>
              <Link href="/admin/charities" className="text-sm text-primary-600 font-medium">View All</Link>
            </div>
          </CardHeader>
          <p className="text-gray-500 text-sm">
            {stats?.pendingVerifications || 0} charities awaiting verification
          </p>
          {(stats?.pendingVerifications || 0) > 0 && (
            <Link href="/admin/charities" className="inline-block mt-3 text-sm text-primary-600 font-medium hover:text-primary-700">
              Review Now &rarr;
            </Link>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Cause Approvals</CardTitle>
              <Link href="/admin/causes" className="text-sm text-primary-600 font-medium">View All</Link>
            </div>
          </CardHeader>
          <p className="text-gray-500 text-sm">
            {stats?.pendingCauseApprovals || 0} causes awaiting approval
          </p>
          {(stats?.pendingCauseApprovals || 0) > 0 && (
            <Link href="/admin/causes" className="inline-block mt-3 text-sm text-primary-600 font-medium hover:text-primary-700">
              Review Now &rarr;
            </Link>
          )}
        </Card>
      </div>
    </div>
  );
}
