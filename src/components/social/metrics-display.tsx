"use client";

import { formatCompact, formatPrice } from "@/lib/utils/format";
import { SOCIAL_MULTIPLIERS } from "@/types/shared";

interface MetricsDisplayProps {
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
}

const metricConfig = [
  { key: "views", icon: "👁", label: "Views", multiplier: SOCIAL_MULTIPLIERS.views },
  { key: "likes", icon: "❤️", label: "Likes", multiplier: SOCIAL_MULTIPLIERS.likes },
  { key: "comments", icon: "💬", label: "Comments", multiplier: SOCIAL_MULTIPLIERS.comments },
  { key: "shares", icon: "🔄", label: "Shares", multiplier: SOCIAL_MULTIPLIERS.shares },
] as const;

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metricConfig.map((config) => {
        const count = metrics[config.key];
        const value = count * config.multiplier;

        return (
          <div
            key={config.key}
            className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-lg"
          >
            <span className="text-2xl mb-1">{config.icon}</span>
            <span className="text-lg font-mono font-bold text-white">
              {formatCompact(count)}
            </span>
            <span className="text-xs text-white/40">{config.label}</span>
            <span className="text-sm font-mono text-price-social mt-1">
              +{formatPrice(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
