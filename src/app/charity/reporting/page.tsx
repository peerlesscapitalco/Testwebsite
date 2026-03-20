"use client";

import React, { useState, useEffect } from "react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SPENDING_CATEGORIES } from "@/types";

interface SpendingReport {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  status: string;
  reportDate: string;
  cause: { id: string; title: string };
}

interface CauseOption {
  id: string;
  title: string;
}

export default function ReportingPage() {
  const [reports, setReports] = useState<SpendingReport[]>([]);
  const [causes, setCauses] = useState<CauseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    category: "personnel",
    causeId: "",
    reportDate: new Date().toISOString().split("T")[0],
  });

  const fetchReports = () => {
    fetch("/api/charities/reports")
      .then((res) => res.json())
      .then((data) => {
        setReports(data.reports || []);
        setCauses(data.causes || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/charities/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      if (res.ok) {
        setShowCreate(false);
        setForm({ title: "", description: "", amount: "", category: "personnel", causeId: "", reportDate: new Date().toISOString().split("T")[0] });
        fetchReports();
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
          <h1 className="text-2xl font-bold text-gray-900">Spending Reports</h1>
          <p className="mt-1 text-gray-500">Document how funds are being used</p>
        </div>
        <Button variant="secondary" onClick={() => setShowCreate(true)}>Submit Report</Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      ) : reports.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No spending reports submitted yet</p>
            <Button variant="secondary" onClick={() => setShowCreate(true)}>Submit First Report</Button>
          </div>
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Report</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Cause</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{report.title}</p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">{report.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.cause.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{report.category.replace("_", " ")}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(report.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(report.reportDate)}</td>
                    <td className="px-6 py-4"><Badge status={report.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Submit Spending Report" size="lg">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cause</label>
            <select
              required
              value={form.causeId}
              onChange={(e) => setForm({ ...form, causeId: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">Select a cause</option>
              {causes.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input type="number" required min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                {SPENDING_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
            <input type="date" required value={form.reportDate} onChange={(e) => setForm({ ...form, reportDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="secondary" isLoading={creating} className="flex-1">Submit Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
