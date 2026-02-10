import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { scrapeTikTokVideo, TikTokMetrics } from "@/lib/tiktok/scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // Allow up to 30 seconds for scraping

// Price formula: (views × $1) + (likes × $10) + (comments × $50) + (shares × $100)
// Note: saves removed since we can't track them
function calculateSocialPrice(
  metrics: TikTokMetrics,
  floorPrice: number,
  capPrice: number
): number {
  const rawPrice =
    metrics.views * 1 +
    metrics.likes * 10 +
    metrics.comments * 50 +
    metrics.shares * 100;

  // Apply floor and cap
  return Math.min(Math.max(rawPrice, floorPrice), capPrice);
}

interface FetchMetricsRequest {
  projectId: string;
}

// POST - Fetch metrics for a single project
export async function POST(request: NextRequest) {
  try {
    const body: FetchMetricsRequest = await request.json();

    if (!body.projectId) {
      return NextResponse.json(
        { error: "Missing projectId" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get the project with floor and cap prices
    const { data: project, error: fetchError } = await supabase
      .from("social_projects")
      .select("id, tiktok_url, tiktok_embed_html, floor_price, cap_price")
      .eq("id", body.projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Scrape TikTok
    console.log(`Scraping TikTok metrics for project ${project.id}: ${project.tiktok_url}`);
    const result = await scrapeTikTokVideo(project.tiktok_url);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to scrape TikTok", success: false },
        { status: 500 }
      );
    }

    // Update project with new metrics and calculated price
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (result.metrics) {
      updateData.views_count = result.metrics.views;
      updateData.likes_count = result.metrics.likes;
      updateData.comments_count = result.metrics.comments;
      updateData.shares_count = result.metrics.shares;
      updateData.saves_count = result.metrics.saves;

      // Calculate and update price
      const calculatedPrice = calculateSocialPrice(
        result.metrics,
        project.floor_price || 100,
        project.cap_price || 100000
      );
      updateData.calculated_price = calculatedPrice;
    }

    // Update embed HTML if we got a new one
    if (result.embedHtml && !project.tiktok_embed_html) {
      updateData.tiktok_embed_html = result.embedHtml;
    }

    const { error: updateError } = await supabase
      .from("social_projects")
      .update(updateData)
      .eq("id", project.id);

    if (updateError) {
      console.error("Failed to update project metrics:", updateError);
      return NextResponse.json(
        { error: "Failed to update project", success: false },
        { status: 500 }
      );
    }

    console.log(`Updated metrics for project ${project.id}:`, result.metrics);

    return NextResponse.json({
      success: true,
      metrics: result.metrics,
      embedHtml: result.embedHtml,
    });
  } catch (error) {
    console.error("Fetch metrics API error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// GET - Fetch metrics for all active projects (for cron job)
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // Get all active projects with floor and cap prices
    const { data: projects, error: fetchError } = await supabase
      .from("social_projects")
      .select("id, tiktok_url, tiktok_embed_html, floor_price, cap_price")
      .eq("is_active", true);

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 500 }
      );
    }

    const results: Array<{
      projectId: string;
      success: boolean;
      metrics?: unknown;
      error?: string;
    }> = [];

    // Process each project
    for (const project of projects || []) {
      console.log(`Scraping TikTok metrics for project ${project.id}: ${project.tiktok_url}`);

      try {
        const result = await scrapeTikTokVideo(project.tiktok_url);

        if (result.success && result.metrics) {
          // Calculate price
          const calculatedPrice = calculateSocialPrice(
            result.metrics,
            project.floor_price || 100,
            project.cap_price || 100000
          );

          const updateData: Record<string, unknown> = {
            views_count: result.metrics.views,
            likes_count: result.metrics.likes,
            comments_count: result.metrics.comments,
            shares_count: result.metrics.shares,
            saves_count: result.metrics.saves,
            calculated_price: calculatedPrice,
            updated_at: new Date().toISOString(),
          };

          if (result.embedHtml && !project.tiktok_embed_html) {
            updateData.tiktok_embed_html = result.embedHtml;
          }

          await supabase
            .from("social_projects")
            .update(updateData)
            .eq("id", project.id);

          results.push({
            projectId: project.id,
            success: true,
            metrics: result.metrics,
          });
        } else {
          results.push({
            projectId: project.id,
            success: false,
            error: result.error,
          });
        }
      } catch (error) {
        results.push({
          projectId: project.id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      // Add a small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const successCount = results.filter((r) => r.success).length;
    console.log(`Refreshed ${successCount}/${projects?.length || 0} projects`);

    return NextResponse.json({
      success: true,
      total: projects?.length || 0,
      updated: successCount,
      results,
    });
  } catch (error) {
    console.error("Cron fetch metrics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
