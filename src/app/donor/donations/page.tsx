"use client";

import React, { useState, useEffect } from "react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatDate, getCategoryLabel } from "@/lib/utils";

interface Donation {
  id: string;
  amount: number;
  status: string;
  isAnonymous: boolean;
  message: string | null;
  createdAt: string;
  cause: {
    title: string;
    category: string;
    organization: { name: string };
  };
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/donors/donations")
      .then((res) => res.json())
      .then((data) => setDonations(data.donations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Donations</h1>
        <p className="mt-1 text-gray-500">View your complete donation history</p>
      </div>

      {donations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No donations yet. Start making a difference today!</p>
          </div>
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Cause</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Organization</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{donation.cause.title}</p>
                      {donation.message && (
                        <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">&quot;{donation.message}&quot;</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{donation.cause.organization.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getCategoryLabel(donation.cause.category)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(donation.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(donation.createdAt)}</td>
                    <td className="px-6 py-4"><Badge status={donation.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
