// TikTok Video Scraper via UrLeBird
// Uses UrLeBird.com as intermediary to get metrics
// Compatible with Vercel serverless (no curl dependency)

export interface TikTokMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  author?: string;
  description?: string;
}

export interface ScrapeResult {
  success: boolean;
  metrics?: TikTokMetrics;
  embedHtml?: string;
  error?: string;
}

// User-Agent rotation to avoid Cloudflare blocks
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Parse count format (e.g., "17.69K", "1.5M", "215") to number
 */
function parseCount(value: string): number {
  if (!value) return 0;

  const cleanValue = value.trim().toUpperCase();

  // Handle K (thousands)
  if (cleanValue.endsWith("K")) {
    const num = parseFloat(cleanValue.replace("K", ""));
    return Math.round(num * 1000);
  }

  // Handle M (millions)
  if (cleanValue.endsWith("M")) {
    const num = parseFloat(cleanValue.replace("M", ""));
    return Math.round(num * 1000000);
  }

  // Handle B (billions)
  if (cleanValue.endsWith("B")) {
    const num = parseFloat(cleanValue.replace("B", ""));
    return Math.round(num * 1000000000);
  }

  // Handle plain numbers (may have commas or dots as thousand separators)
  const plainNum = parseFloat(cleanValue.replace(/,/g, ""));
  return isNaN(plainNum) ? 0 : Math.round(plainNum);
}

/**
 * Extract video ID from TikTok URL
 * Supports formats:
 * - https://www.tiktok.com/@user/video/1234567890
 * - https://vm.tiktok.com/ABC123/
 * - https://tiktok.com/@user/video/1234567890
 */
export function extractVideoId(url: string): string | null {
  // Standard format: /video/1234567890
  const videoMatch = url.match(/\/video\/(\d+)/);
  if (videoMatch) {
    return videoMatch[1];
  }

  // Short URL format - would need to follow redirect
  if (url.includes("vm.tiktok.com")) {
    return null; // Need to resolve short URL first
  }

  return null;
}

/**
 * Scrape TikTok video metrics via UrLeBird
 * Uses native fetch compatible with Vercel serverless
 */
export async function scrapeTikTokVideo(url: string): Promise<ScrapeResult> {
  try {
    // Normalize URL and extract video ID
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    const videoId = extractVideoId(normalizedUrl);

    if (!videoId) {
      return {
        success: false,
        error: "Could not extract video ID from URL",
      };
    }

    // Fetch from UrLeBird instead of TikTok directly
    const urlebirdUrl = `https://urlebird.com/video/${videoId}/`;

    console.log(`Fetching metrics from UrLeBird: ${urlebirdUrl}`);

    // Use native fetch with browser-like headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let html: string;
    try {
      const response = await fetch(urlebirdUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": getRandomUserAgent(),
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Cloudflare block
        if (response.status === 403 || response.status === 503) {
          console.error(`Cloudflare blocked: HTTP ${response.status}`);
          return {
            success: false,
            error: "Cloudflare blocked - retry via GitHub Actions cron",
          };
        }
        return {
          success: false,
          error: `HTTP ${response.status}`,
        };
      }

      html = await response.text();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
        };
      }
      console.error("Fetch error:", fetchError);
      return {
        success: false,
        error: "Failed to fetch from UrLeBird",
      };
    }

    if (!html || html.length < 1000) {
      return {
        success: false,
        error: "Empty or invalid response from UrLeBird",
      };
    }

    // Extract metrics from UrLeBird HTML
    // Format: "17.69K views", "215 likes", "18 comments", "108 shares"
    const viewsMatch = html.match(/([0-9.,]+[KMB]?)\s*views/i);
    const likesMatch = html.match(/([0-9.,]+[KMB]?)\s*likes/i);
    const commentsMatch = html.match(/([0-9.,]+[KMB]?)\s*comments/i);
    const sharesMatch = html.match(/([0-9.,]+[KMB]?)\s*shares/i);

    if (!viewsMatch && !likesMatch) {
      console.error("Could not extract metrics from UrLeBird HTML");
      // Try to get embed HTML as fallback
      const embedResult = await fetchOEmbed(normalizedUrl);
      return {
        success: false,
        error: "Could not extract metrics from UrLeBird. Video may not exist or page structure changed.",
        embedHtml: embedResult?.html,
      };
    }

    const metrics: TikTokMetrics = {
      views: viewsMatch ? parseCount(viewsMatch[1]) : 0,
      likes: likesMatch ? parseCount(likesMatch[1]) : 0,
      comments: commentsMatch ? parseCount(commentsMatch[1]) : 0,
      shares: sharesMatch ? parseCount(sharesMatch[1]) : 0,
      saves: 0, // UrLeBird doesn't show saves
    };

    console.log("Extracted metrics from UrLeBird:", metrics);

    // Also get embed HTML from TikTok oEmbed
    const embedResult = await fetchOEmbed(normalizedUrl);

    return {
      success: true,
      metrics,
      embedHtml: embedResult?.html,
    };
  } catch (error) {
    console.error("UrLeBird scrape error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetch oEmbed data for embed HTML from TikTok
 */
async function fetchOEmbed(url: string): Promise<{ html: string } | null> {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl);

    if (!response.ok) return null;

    const data = await response.json();
    return { html: data.html };
  } catch {
    return null;
  }
}
