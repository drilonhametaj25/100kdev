"use client";

import { formatPrice } from "@/lib/utils/format";

interface SocialPriceDisplayProps {
  price: number;
  floorPrice: number;
  capPrice: number;
}

export function SocialPriceDisplay({ price, floorPrice, capPrice }: SocialPriceDisplayProps) {
  // Purple color for social price
  const colorHex = "#a855f7";

  return (
    <div className="flex flex-col items-center">
      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-3 h-3 rounded-full live-pulse"
          style={{ backgroundColor: colorHex }}
        />
        <span className="text-sm font-mono uppercase tracking-wider text-white/70">
          SOCIAL PRICE
        </span>
      </div>

      {/* Price */}
      <div className="text-5xl md:text-7xl font-mono font-bold glow-purple" style={{ color: colorHex }}>
        {formatPrice(price)}
      </div>

      {/* Update frequency info */}
      <div className="mt-4 text-sm font-mono text-white/40">
        Updates every 30 minutes
      </div>
    </div>
  );
}
