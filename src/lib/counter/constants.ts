// Counter configuration constants
export const COUNTER_ID = "00000000-0000-0000-0000-000000000001";

export const COUNTER_CONFIG = {
  // Starting price when counter resets
  startPrice: 1000,

  // Maximum price before auto-reset
  maxPrice: 100000,

  // Price increment per second ($100/hour = $0.027778/second)
  incrementPerSecond: 0.027778,

  // Minimum deposit amount
  minDeposit: 50,

  // Deposit percentage (5%)
  depositPercentage: 0.05,

  // Sync interval with server (ms)
  syncInterval: 5000,

  // Price tolerance for checkout validation ($50)
  priceTolerance: 50,
} as const;

// Price range thresholds for color coding
export const PRICE_THRESHOLDS = {
  low: 3000, // $1k-$3k = green
  medium: 10000, // $3k-$10k = blue
  high: 30000, // $10k-$30k = amber
  // $30k+ = red
} as const;

// Colors for each price range
export const PRICE_COLORS = {
  low: {
    name: "green",
    hex: "#22c55e",
    tailwind: "text-price-low",
    glow: "glow-green",
  },
  medium: {
    name: "blue",
    hex: "#3b82f6",
    tailwind: "text-price-medium",
    glow: "glow-blue",
  },
  high: {
    name: "amber",
    hex: "#f59e0b",
    tailwind: "text-price-high",
    glow: "glow-amber",
  },
  extreme: {
    name: "red",
    hex: "#ef4444",
    tailwind: "text-price-extreme",
    glow: "glow-red",
  },
  social: {
    name: "purple",
    hex: "#a855f7",
    tailwind: "text-price-social",
    glow: "glow-purple",
  },
} as const;

export type PriceColorKey = keyof typeof PRICE_COLORS;
