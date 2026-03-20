"use client";

import React, { useState, useEffect } from "react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

interface Charity {
  id: string;
  name: string;
  description: string;
  mission: string;
  ein: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  status: string;
  createdAt: string;
  admin: { firstName: string; lastName: string; email: string };
}

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Charity | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchCharities = () => {
    fetch("/api/admin/charities")
      .then((res) => res.json())
      .then((data) => setCharities(data.charities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCharities(); }, []);

  const handleAction = async (id: string, action: "verify" | "reject" | "suspend") => {
    setProcessing(true);
    try {
      const body: Record<string, string> = { action };
      if (action === "reject") body.reason = rejectionReason;

      await fetch(`/api/admin/charities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setSelected(null);
      setRejectionReason("");
      fetchCharities();
    } catch {} finally { setProcessing(false); }
  };

  const filtered = filter === "all" ? charities : charities.filter((c) => c.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Charity Management</h1>
        <p className="mt-1 text-gray-500">Verify and manage charity organizations</p>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "pending", "verified", "rejected", "suspended"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f} {f !== "all" && `(${charities.filter((c) => c.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><div className="text-center py-12"><p className="text-gray-500">No charities found</p></div></Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((charity) => (
            <Card key={charity.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{charity.name}</h3>
                    <Badge status={charity.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{charity.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>Admin: {charity.admin.firstName} {charity.admin.lastName}</span>
                    {charity.ein && <span>EIN: {charity.ein}</span>}
                    {charity.city && charity.state && <span>{charity.city}, {charity.state}</span>}
                    <span>Registered: {formatDate(charity.createdAt)}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelected(charity)}>
                  Review
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setRejectionReason(""); }} title="Review Charity" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium">{selected.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge status={selected.status} />
              </div>
              <div>
                <p className="text-sm text-gray-500">EIN</p>
                <p className="font-medium">{selected.ein || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Admin</p>
                <p className="font-medium">{selected.admin.firstName} {selected.admin.lastName}</p>
                <p className="text-xs text-gray-400">{selected.admin.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selected.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selected.city && selected.state ? `${selected.city}, ${selected.state}` : "Not provided"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mission</p>
              <p className="text-sm">{selected.mission}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-sm">{selected.description}</p>
            </div>

            {selected.status === "pending" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason (if rejecting)</label>
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Provide a reason for rejection"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" isLoading={processing} onClick={() => handleAction(selected.id, "verify")} className="flex-1">
                    Verify Charity
                  </Button>
                  <Button variant="danger" isLoading={processing} onClick={() => handleAction(selected.id, "reject")} className="flex-1" disabled={!rejectionReason}>
                    Reject
                  </Button>
                </div>
              </>
            )}

            {selected.status === "verified" && (
              <Button variant="danger" isLoading={processing} onClick={() => handleAction(selected.id, "suspend")} className="w-full">
                Suspend Charity
              </Button>
            )}

            {selected.status === "suspended" && (
              <Button variant="primary" isLoading={processing} onClick={() => handleAction(selected.id, "verify")} className="w-full">
                Reinstate Charity
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
