"use client";

import React, { useState, useEffect } from "react";
import StatsCard from "@/components/ui/StatsCard";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

interface Analytics {
  stats: {
    totalDonations: number;
    totalAmount: number;
    totalCharities: number;
    pendingVerifications: number;
    pendingCauseApprovals: number;
    totalUsers: number;
  };
  categoryBreakdown: Array<{ category: string; count: number; amount: number }>;
  monthlyDonations: Array<{ month: string; amount: number; count: number }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6"><div className="h-8 bg-gray-200 rounded w-48" /><div className="grid grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="h-32 bg-gray-200 rounded-xl" />)}</div></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="mt-1 text-gray-500">Comprehensive platform performance data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Revenue" value={formatCurrency(data?.stats.totalAmount || 0)} />
        <StatsCard title="Total Transactions" value={data?.stats.totalDonations || 0} />
        <StatsCard title="Active Charities" value={data?.stats.totalCharities || 0} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Donations by Category</CardTitle></CardHeader>
          {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{cat.category.replace("_", " ")}</p>
                    <p className="text-sm text-gray-500">{cat.count} donations</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(cat.amount)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>

        <Card>
          <CardHeader><CardTitle>Platform Overview</CardTitle></CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Registered Users</span>
              <span className="font-semibold">{data?.stats.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Verified Charities</span>
              <span className="font-semibold">{data?.stats.totalCharities || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-warning-50 rounded-lg">
              <span className="text-warning-700">Pending Verifications</span>
              <span className="font-semibold text-warning-700">{data?.stats.pendingVerifications || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-warning-50 rounded-lg">
              <span className="text-warning-700">Pending Cause Approvals</span>
              <span className="font-semibold text-warning-700">{data?.stats.pendingCauseApprovals || 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
