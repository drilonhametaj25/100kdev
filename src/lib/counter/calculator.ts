import { COUNTER_CONFIG, PRICE_THRESHOLDS, PRICE_COLORS, type PriceColorKey } from "./constants";

/**
 * Calculate the current price based on time elapsed since last reset
 */
export function calculateCurrentPrice(
  lastResetAt: Date | string,
  incrementPerSecond: number = COUNTER_CONFIG.incrementPerSecond
): number {
  const resetTime = typeof lastResetAt === "string" ? new Date(lastResetAt) : lastResetAt;
  const now = Date.now();
  const secondsElapsed = (now - resetTime.getTime()) / 1000;

  const price = COUNTER_CONFIG.startPrice + secondsElapsed * incrementPerSecond;

  // Cap at max price
  return Math.min(price, COUNTER_CONFIG.maxPrice);
}

/**
 * Calculate the deposit amount for a given price
 */
export function calculateDeposit(price: number): number {
  const deposit = price * COUNTER_CONFIG.depositPercentage;
  return Math.max(deposit, COUNTER_CONFIG.minDeposit);
}

/**
 * Get the price range key for a given price
 */
export function getPriceRangeKey(price: number): PriceColorKey {
  if (price < PRICE_THRESHOLDS.low) return "low";
  if (price < PRICE_THRESHOLDS.medium) return "medium";
  if (price < PRICE_THRESHOLDS.high) return "high";
  return "extreme";
}

/**
 * Get the color configuration for a given price
 */
export function getPriceColor(price: number) {
  const key = getPriceRangeKey(price);
  return PRICE_COLORS[key];
}

/**
 * Check if a locked price is within acceptable tolerance of server price
 */
export function isPriceWithinTolerance(
  lockedPrice: number,
  serverPrice: number,
  tolerance: number = COUNTER_CONFIG.priceTolerance
): boolean {
  return Math.abs(lockedPrice - serverPrice) <= tolerance;
}

/**
 * Check if the counter has been reset (price dropped significantly)
 */
export function hasCounterReset(previousPrice: number, currentPrice: number): boolean {
  // If current price is near start price and previous was much higher
  return (
    currentPrice < COUNTER_CONFIG.startPrice + 100 &&
    previousPrice > COUNTER_CONFIG.startPrice + 500
  );
}

/**
 * Calculate time until the counter reaches a target price
 */
export function timeUntilPrice(
  currentPrice: number,
  targetPrice: number,
  incrementPerSecond: number = COUNTER_CONFIG.incrementPerSecond
): number {
  if (targetPrice <= currentPrice) return 0;
  if (targetPrice > COUNTER_CONFIG.maxPrice) {
    targetPrice = COUNTER_CONFIG.maxPrice;
  }

  const priceDifference = targetPrice - currentPrice;
  const secondsNeeded = priceDifference / incrementPerSecond;

  return secondsNeeded * 1000; // Return milliseconds
}

/**
 * Calculate when the counter will reach max price and auto-reset
 */
export function timeUntilMaxPrice(
  lastResetAt: Date | string,
  incrementPerSecond: number = COUNTER_CONFIG.incrementPerSecond
): number {
  const currentPrice = calculateCurrentPrice(lastResetAt, incrementPerSecond);
  return timeUntilPrice(currentPrice, COUNTER_CONFIG.maxPrice, incrementPerSecond);
}
