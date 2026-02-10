import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface UpdateMetricsRequest {
  projectId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

// Price formula: (views × $1) + (likes × $10) + (comments × $50) + (shares × $100)
function calculateSocialPrice(
  views: number,
  likes: number,
  comments: number,
  shares: number,
  floorPrice: number,
  capPrice: number
): number {
  const rawPrice = views * 1 + likes * 10 + comments * 50 + shares * 100;
  return Math.min(Math.max(rawPrice, floorPrice), capPrice);
}

// POST - Update metrics for a social project
// Called by GitHub Actions after scraping UrLeBird
export async function POST(request: NextRequest) {
  // Check authorization (middleware already checks, but double-check for cron)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: UpdateMetricsRequest = await request.json();

    if (!body.projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get project to check floor/cap prices
    const { data: project, error: fetchError } = await supabase
      .from("social_projects")
      .select("floor_price, cap_price")
      .eq("id", body.projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Calculate price
    const calculatedPrice = calculateSocialPrice(
      body.views || 0,
      body.likes || 0,
      body.comments || 0,
      body.shares || 0,
      project.floor_price || 100,
      project.cap_price || 100000
    );

    // Update project
    const { error: updateError } = await supabase
      .from("social_projects")
      .update({
        views_count: body.views || 0,
        likes_count: body.likes || 0,
        comments_count: body.comments || 0,
        shares_count: body.shares || 0,
        calculated_price: calculatedPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.projectId);

    if (updateError) {
      console.error("Failed to update metrics:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log(`Updated metrics for project ${body.projectId}: views=${body.views}, likes=${body.likes}, comments=${body.comments}, shares=${body.shares}, price=${calculatedPrice}`);

    return NextResponse.json({
      success: true,
      calculatedPrice,
    });
  } catch (error) {
    console.error("Update metrics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
