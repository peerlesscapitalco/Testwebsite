"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface AdminDonation {
  id: string;
  amount: number;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  donor: { firstName: string; lastName: string; email: string };
  cause: { title: string; organization: { name: string } };
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/donations")
      .then((res) => res.json())
      .then((data) => setDonations(data.donations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Donations</h1>
        <p className="mt-1 text-gray-500">
          {donations.length} donations totaling {formatCurrency(totalAmount)}
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Donor</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Cause</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Organization</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {d.isAnonymous ? "Anonymous" : `${d.donor.firstName} ${d.donor.lastName}`}
                      </p>
                      {!d.isAnonymous && <p className="text-xs text-gray-400">{d.donor.email}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{d.cause.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{d.cause.organization.name}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(d.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(d.createdAt)}</td>
                    <td className="px-6 py-4"><Badge status={d.status} /></td>
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
