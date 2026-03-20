"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import StatsCard from "@/components/ui/StatsCard";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DonorStats {
  totalDonated: number;
  totalDonations: number;
  causesSupported: number;
  recentDonations: Array<{
    id: string;
    amount: number;
    createdAt: string;
    cause: { title: string; category: string; organization: { name: string } };
  }>;
}

export default function DonorDashboard() {
  const [stats, setStats] = useState<DonorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/donors/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="mt-1 text-gray-500">Track your donations and impact</p>
        </div>
        <Link href="/donor/causes">
          <Button>Donate Now</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Donated"
          value={formatCurrency(stats?.totalDonated || 0)}
          subtitle="Lifetime contributions"
        />
        <StatsCard
          title="Donations Made"
          value={stats?.totalDonations || 0}
          subtitle="Individual contributions"
        />
        <StatsCard
          title="Causes Supported"
          value={stats?.causesSupported || 0}
          subtitle="Unique causes helped"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Donations</CardTitle>
            <Link href="/donor/donations" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>
        </CardHeader>
        {stats?.recentDonations && stats.recentDonations.length > 0 ? (
          <div className="space-y-4">
            {stats.recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{donation.cause.title}</p>
                  <p className="text-sm text-gray-500">
                    {donation.cause.organization.name} &middot; {formatDate(donation.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(donation.amount)}</p>
                  <Badge status="completed" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven&apos;t made any donations yet</p>
            <Link href="/donor/causes">
              <Button>Browse Causes</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
