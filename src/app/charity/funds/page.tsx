"use client";

import React, { useState, useEffect } from "react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import StatsCard from "@/components/ui/StatsCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";

interface FundData {
  totalReceived: number;
  totalSpent: number;
  available: number;
  causes: Array<{
    id: string;
    title: string;
    category: string;
    goalAmount: number;
    raisedAmount: number;
    spentAmount: number;
  }>;
}

export default function FundManagementPage() {
  const [data, setData] = useState<FundData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/charities/funds")
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
        <h1 className="text-2xl font-bold text-gray-900">Fund Management</h1>
        <p className="mt-1 text-gray-500">Track incoming donations and fund allocation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Received" value={formatCurrency(data?.totalReceived || 0)} />
        <StatsCard title="Total Spent" value={formatCurrency(data?.totalSpent || 0)} />
        <StatsCard title="Available Balance" value={formatCurrency(data?.available || 0)} />
      </div>

      <Card>
        <CardHeader><CardTitle>Fund Allocation by Cause</CardTitle></CardHeader>
        {data?.causes && data.causes.length > 0 ? (
          <div className="space-y-6">
            {data.causes.map((cause) => (
              <div key={cause.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{cause.title}</h4>
                    <p className="text-sm text-gray-500">{getCategoryLabel(cause.category)}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-900 font-medium">Received: {formatCurrency(cause.raisedAmount)}</p>
                    <p className="text-gray-500">Spent: {formatCurrency(cause.spentAmount)}</p>
                  </div>
                </div>
                <ProgressBar current={cause.raisedAmount} total={cause.goalAmount} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No fund data available</p>
        )}
      </Card>
    </div>
  );
}
