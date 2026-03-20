"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";

interface AdminCause {
  id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  rejectionReason: string | null;
  organization: { name: string; status: string };
}

export default function AdminCausesPage() {
  const [causes, setCauses] = useState<AdminCause[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<AdminCause | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchCauses = () => {
    fetch("/api/admin/causes")
      .then((res) => res.json())
      .then((data) => setCauses(data.causes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCauses(); }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessing(true);
    try {
      const body: Record<string, string> = { action };
      if (action === "reject") body.reason = rejectionReason;

      await fetch(`/api/admin/causes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setSelected(null);
      setRejectionReason("");
      fetchCauses();
    } catch {} finally { setProcessing(false); }
  };

  const filtered = filter === "all" ? causes : causes.filter((c) => c.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cause Management</h1>
        <p className="mt-1 text-gray-500">Approve and manage fundraising causes</p>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "pending", "approved", "active", "completed", "rejected"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f} {f !== "all" && `(${causes.filter((c) => c.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><div className="text-center py-12"><p className="text-gray-500">No causes found</p></div></Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((cause) => (
            <Card key={cause.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{cause.title}</h3>
                    <Badge status={cause.status} />
                    <Badge status={cause.organization.status} label={cause.organization.name} />
                  </div>
                  <p className="text-sm text-gray-500">{getCategoryLabel(cause.category)} &middot; Goal: {formatCurrency(cause.goalAmount)} &middot; Raised: {formatCurrency(cause.raisedAmount)}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{cause.description}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelected(cause)}>Review</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setRejectionReason(""); }} title="Review Cause">
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Cause</p>
              <p className="font-semibold">{selected.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="font-medium">{selected.organization.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p>{getCategoryLabel(selected.category)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Goal</p>
              <p className="font-medium">{formatCurrency(selected.goalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-sm">{selected.description}</p>
            </div>

            {selected.status === "pending" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                  <textarea rows={2} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" isLoading={processing} onClick={() => handleAction(selected.id, "approve")} className="flex-1">Approve</Button>
                  <Button variant="danger" isLoading={processing} onClick={() => handleAction(selected.id, "reject")} className="flex-1" disabled={!rejectionReason}>Reject</Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
