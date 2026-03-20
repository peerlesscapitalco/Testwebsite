import React from "react";
import Card from "./Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
}

export default function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <p
              className={`mt-1 text-sm font-medium ${
                trend.isPositive ? "text-success-700" : "text-danger-700"
              }`}
            >
              {trend.isPositive ? "+" : "-"}{trend.value}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 rounded-lg text-primary-600">{icon}</div>
        )}
      </div>
    </Card>
  );
}
