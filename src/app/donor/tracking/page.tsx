"use client";

import React, { useState, useEffect } from "react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import StatsCard from "@/components/ui/StatsCard";
import { formatCurrency, formatDate, getCategoryLabel } from "@/lib/utils";

interface TrackedCause {
  id: string;
  title: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  organization: { name: string };
  myDonation: number;
  spendingReports: Array<{
    id: string;
    title: string;
    amount: number;
    category: string;
    reportDate: string;
    status: string;
  }>;
}

export default function TrackingPage() {
  const [trackedCauses, setTrackedCauses] = useState<TrackedCause[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCause, setExpandedCause] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/donors/tracking")
      .then((res) => res.json())
      .then((data) => setTrackedCauses(data.causes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalDonated = trackedCauses.reduce((sum, c) => sum + c.myDonation, 0);
  const totalSpent = trackedCauses.reduce(
    (sum, c) => sum + c.spendingReports.reduce((s, r) => s + r.amount, 0),
    0
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Track Your Impact</h1>
        <p className="mt-1 text-gray-500">See how your donations are being used</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Your Contributions" value={formatCurrency(totalDonated)} />
        <StatsCard title="Verified Spending" value={formatCurrency(totalSpent)} />
        <StatsCard title="Causes Tracked" value={trackedCauses.length} />
      </div>

      {trackedCauses.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No donations to track yet. Donate to a cause to start tracking impact.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {trackedCauses.map((cause) => (
            <Card key={cause.id}>
              <div
                className="cursor-pointer"
                onClick={() => setExpandedCause(expandedCause === cause.id ? null : cause.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cause.title}</h3>
                    <p className="text-sm text-gray-500">
                      {cause.organization.name} &middot; {getCategoryLabel(cause.category)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge status={cause.status} />
                    <p className="text-sm text-gray-500 mt-1">Your donation: {formatCurrency(cause.myDonation)}</p>
                  </div>
                </div>
                <ProgressBar current={cause.raisedAmount} total={cause.goalAmount} />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formatCurrency(cause.raisedAmount)} raised</span>
                  <span>Goal: {formatCurrency(cause.goalAmount)}</span>
                </div>
              </div>

              {expandedCause === cause.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Spending Reports</h4>
                  {cause.spendingReports.length === 0 ? (
                    <p className="text-sm text-gray-500">No spending reports available yet</p>
                  ) : (
                    <div className="space-y-3">
                      {cause.spendingReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{report.title}</p>
                            <p className="text-sm text-gray-500">
                              {getCategoryLabel(report.category)} &middot; {formatDate(report.reportDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(report.amount)}</p>
                            <Badge status={report.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
