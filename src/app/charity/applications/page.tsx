"use client";

import React, { useState, useEffect } from "react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";
import { CAUSE_CATEGORIES } from "@/types";

interface Cause {
  id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  rejectionReason: string | null;
}

export default function ManageCausesPage() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "shelter",
    goalAmount: "",
  });

  const fetchCauses = () => {
    fetch("/api/charities/causes")
      .then((res) => res.json())
      .then((data) => setCauses(data.causes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCauses(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/causes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, goalAmount: parseFloat(form.goalAmount) }),
      });
      if (res.ok) {
        setShowCreate(false);
        setForm({ title: "", description: "", category: "shelter", goalAmount: "" });
        fetchCauses();
      }
    } catch {
      // handle error
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Causes</h1>
          <p className="mt-1 text-gray-500">Create and manage fundraising causes</p>
        </div>
        <Button variant="secondary" onClick={() => setShowCreate(true)}>Create New Cause</Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      ) : causes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No causes created yet</p>
            <Button variant="secondary" onClick={() => setShowCreate(true)}>Create Your First Cause</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {causes.map((cause) => (
            <Card key={cause.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{cause.title}</h3>
                    <Badge status={cause.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{getCategoryLabel(cause.category)}</p>
                  <p className="text-sm text-gray-600 mb-3">{cause.description}</p>
                  {cause.rejectionReason && (
                    <div className="p-3 bg-danger-50 text-danger-700 rounded-lg text-sm mb-3">
                      Rejection reason: {cause.rejectionReason}
                    </div>
                  )}
                  <ProgressBar current={cause.raisedAmount} total={cause.goalAmount} />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{formatCurrency(cause.raisedAmount)} raised</span>
                    <span>Goal: {formatCurrency(cause.goalAmount)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Cause" size="lg">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cause Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="e.g., Emergency Shelter for Families"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              {CAUSE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Describe the cause and how the funds will be used"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fundraising Goal ($)</label>
            <input
              type="number"
              required
              min="100"
              step="0.01"
              value={form.goalAmount}
              onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="10000"
            />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="secondary" isLoading={creating} className="flex-1">Submit for Approval</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
