"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleActive = async (userId: string, isActive: boolean) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchUsers();
  };

  const filtered = filter === "all" ? users : users.filter((u) => u.role === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-gray-500">{users.length} registered users</p>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "donor", "charity_admin", "admin"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f.replace("_", " ")} ({f === "all" ? users.length : users.filter((u) => u.role === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">User</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Joined</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={user.role === "admin" ? "approved" : user.role === "charity_admin" ? "active" : "completed"} label={user.role.replace("_", " ")} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Badge status={user.isActive ? "verified" : "suspended"} label={user.isActive ? "Active" : "Inactive"} />
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant={user.isActive ? "danger" : "primary"} onClick={() => toggleActive(user.id, user.isActive)}>
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
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
