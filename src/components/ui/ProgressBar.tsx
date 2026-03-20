import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
}

export default function ProgressBar({
  current,
  total,
  className = "",
  showLabel = true,
  color = "bg-primary-600",
}: ProgressBarProps) {
  const percent = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{percent}% funded</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
