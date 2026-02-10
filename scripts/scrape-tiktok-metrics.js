// TikTok Metrics Scraper using Puppeteer with Stealth
// This script runs in GitHub Actions to bypass Cloudflare

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

// Parse count format (e.g., "17.69K", "1.5M", "215") to number
function parseCount(value) {
  if (!value) return 0;

  const cleanValue = value.trim().toUpperCase();

  if (cleanValue.endsWith("K")) {
    return Math.round(parseFloat(cleanValue.replace("K", "")) * 1000);
  }
  if (cleanValue.endsWith("M")) {
    return Math.round(parseFloat(cleanValue.replace("M", "")) * 1000000);
  }
  if (cleanValue.endsWith("B")) {
    return Math.round(parseFloat(cleanValue.replace("B", "")) * 1000000000);
  }

  const num = parseFloat(cleanValue.replace(/,/g, ""));
  return isNaN(num) ? 0 : Math.round(num);
}

// Extract video ID from TikTok URL
function extractVideoId(url) {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

async function scrapeMetrics(videoId) {
  const url = `https://urlebird.com/video/${videoId}/`;
  console.log(`Scraping: ${url}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set realistic viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Navigate to page
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait a bit for any dynamic content
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get page content
    const content = await page.content();

    // Extract metrics using regex
    const viewsMatch = content.match(/([\d.,]+[KMB]?)\s*views/i);
    const likesMatch = content.match(/([\d.,]+[KMB]?)\s*likes/i);
    const commentsMatch = content.match(/([\d.,]+[KMB]?)\s*comments/i);
    const sharesMatch = content.match(/([\d.,]+[KMB]?)\s*shares/i);

    const metrics = {
      views: viewsMatch ? parseCount(viewsMatch[1]) : 0,
      likes: likesMatch ? parseCount(likesMatch[1]) : 0,
      comments: commentsMatch ? parseCount(commentsMatch[1]) : 0,
      shares: sharesMatch ? parseCount(sharesMatch[1]) : 0,
    };

    console.log(`Extracted metrics:`, metrics);

    return metrics;
  } finally {
    await browser.close();
  }
}

async function main() {
  const siteUrl = process.env.SITE_URL;
  const cronSecret = process.env.CRON_SECRET;

  if (!siteUrl || !cronSecret) {
    console.error("Missing SITE_URL or CRON_SECRET environment variables");
    process.exit(1);
  }

  console.log("Fetching list of social projects...");

  // Get list of projects
  const listResponse = await fetch(`${siteUrl}/api/social-projects/list`, {
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  });

  if (!listResponse.ok) {
    console.error(`Failed to get projects list: ${listResponse.status}`);
    process.exit(1);
  }

  const { projects } = await listResponse.json();
  console.log(`Found ${projects.length} projects to update`);

  if (projects.length === 0) {
    console.log("No projects to update");
    return;
  }

  let updated = 0;
  let failed = 0;

  for (const project of projects) {
    console.log(`\nProcessing project ${project.id}`);
    console.log(`TikTok URL: ${project.tiktokUrl}`);

    const videoId = extractVideoId(project.tiktokUrl);
    if (!videoId) {
      console.error("Could not extract video ID");
      failed++;
      continue;
    }

    console.log(`Video ID: ${videoId}`);

    try {
      const metrics = await scrapeMetrics(videoId);

      if (metrics.views === 0 && metrics.likes === 0) {
        console.error("Could not extract metrics");
        failed++;
        continue;
      }

      // Send metrics to API
      const updateResponse = await fetch(
        `${siteUrl}/api/admin/social/update-metrics`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cronSecret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: project.id,
            views: metrics.views,
            likes: metrics.likes,
            comments: metrics.comments,
            shares: metrics.shares,
          }),
        }
      );

      const updateResult = await updateResponse.json();
      console.log(`Update response:`, updateResult);

      if (updateResult.success) {
        console.log(`Successfully updated project ${project.id}`);
        updated++;
      } else {
        console.error(`Failed to update project ${project.id}`);
        failed++;
      }
    } catch (error) {
      console.error(`Error processing project ${project.id}:`, error.message);
      failed++;
    }

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n=========================================`);
  console.log(`Completed: ${updated} updated, ${failed} failed`);
  console.log(`=========================================`);

  if (failed > 0 && updated === 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
