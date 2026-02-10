"use client";

import { useCounter } from "@/hooks/use-counter";
import { formatPriceParts } from "@/lib/utils/format";

export function PriceDisplay() {
  const { price, isLoading, error, colorConfig, isDropActive } = useCounter();
  const { symbol, dollars, cents } = formatPriceParts(price);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl md:text-8xl lg:text-9xl font-mono font-bold text-white/20 animate-pulse">
          $---.--
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl text-red-500">Error loading price</div>
        <div className="text-sm text-white/50 mt-2">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-3 h-3 rounded-full live-pulse"
          style={{ backgroundColor: colorConfig.hex }}
        />
        <span className="text-sm font-mono uppercase tracking-wider text-white/70">
          {isDropActive ? "FLASH DROP" : "LIVE"}
        </span>
      </div>

      {/* Main price display */}
      <div
        className={`relative transition-all duration-300 ${colorConfig.glow}`}
        style={{ color: colorConfig.hex }}
      >
        {/* Price container */}
        <div className="flex items-baseline font-mono font-bold tracking-tighter">
          {/* Dollar symbol */}
          <span className="text-4xl md:text-6xl lg:text-7xl opacity-70">
            {symbol}
          </span>

          {/* Dollars */}
          <span className="text-6xl md:text-8xl lg:text-9xl">
            {dollars}
          </span>

          {/* Decimal point */}
          <span className="text-4xl md:text-6xl lg:text-7xl opacity-70">
            .
          </span>

          {/* Cents - animated */}
          <span className="text-4xl md:text-6xl lg:text-7xl tabular-nums w-[2ch]">
            {cents}
          </span>
        </div>
      </div>

      {/* Subtle glow effect behind the price */}
      <div
        className="absolute inset-0 blur-3xl opacity-20 -z-10"
        style={{
          background: `radial-gradient(circle, ${colorConfig.hex} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
