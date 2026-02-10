"use client";

import { useCounter } from "@/hooks/use-counter";
import { formatPrice, formatRelativeTime } from "@/lib/utils/format";

export function CounterStats() {
  const { lastPurchasePrice, lastPurchaseAt } = useCounter();

  // Only show stats if there's a last purchase
  if (!lastPurchasePrice || !lastPurchaseAt) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm font-mono text-white/50">
      {/* Last purchase */}
      <div className="flex items-center gap-2">
        <span className="text-white/30">last sold:</span>
        <span className="text-white/70">{formatPrice(lastPurchasePrice)}</span>
        <span className="text-white/40">
          ({formatRelativeTime(lastPurchaseAt)})
        </span>
      </div>
    </div>
  );
}
