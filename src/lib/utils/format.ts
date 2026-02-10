/**
 * Format a number as USD currency
 * Example: 1234.56 -> "$1,234.56"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format price for display with separate parts
 * Returns { dollars: "1,234", cents: "56", symbol: "$" }
 */
export function formatPriceParts(price: number): {
  symbol: string;
  dollars: string;
  cents: string;
} {
  const formatted = formatPrice(price);
  const match = formatted.match(/^\$([0-9,]+)\.(\d{2})$/);

  if (match) {
    return {
      symbol: "$",
      dollars: match[1],
      cents: match[2],
    };
  }

  // Fallback
  const [dollars, cents] = price.toFixed(2).split(".");
  return {
    symbol: "$",
    dollars: Number(dollars).toLocaleString("en-US"),
    cents: cents,
  };
}

/**
 * Format a date as relative time
 * Example: "2 minutes ago", "just now"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin === 1) return "1 minute ago";
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour === 1) return "1 hour ago";
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay === 1) return "yesterday";
  return `${diffDay} days ago`;
}

/**
 * Format a date as ISO string without milliseconds
 */
export function formatISODate(date: Date): string {
  return date.toISOString().split(".")[0] + "Z";
}

/**
 * Format duration in seconds to human readable
 * Example: 3665 -> "1h 1m 5s"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Format a number with K/M suffix for compact display
 * Example: 1500 -> "1.5K", 1500000 -> "1.5M"
 */
export function formatCompact(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}
