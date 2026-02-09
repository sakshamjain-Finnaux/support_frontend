import React from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
  resolved: {
    card: "border-green-600/30 bg-green-500/5 shadow-sm",
    badge: "bg-green-500/20 text-green-400 border-green-500/20",
  },
  completed: {
    card: "border-green-500/30 bg-green-500/5 shadow-sm",
    badge: "bg-green-500/20 text-green-400 border-green-500/20",
  },
  reverted: {
    card: "border-red-500/30 bg-red-500/5 shadow-sm",
    badge: "bg-red-500/20 text-red-400 border-red-500/20",
  },
  pending: {
    card: "border-body-800 bg-body-900/40 shadow-sm",
    badge: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  assigned: {
    card: "border-blue-500/30 bg-blue-500/5 shadow-sm",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  default: {
    card: "border-body-800 bg-body-900/40 shadow-sm",
    badge: "bg-body-500/10 text-body-400 border-body-500/20",
  },
};

export function getStatusStyles(status) {
  const key = status?.toLowerCase() || "default";
  return statusConfig[key] || statusConfig.default;
}

export function StatusCard({ status, className, children, ...props }) {
  const styles = getStatusStyles(status);

  return (
    <div
      className={cn(
        "border rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-opacity-80",
        styles.card,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status, className, children, ...props }) {
  const styles = getStatusStyles(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border",
        styles.badge,
        className,
      )}
      {...props}
    >
      {children || status}
    </span>
  );
}
