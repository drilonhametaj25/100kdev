import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET - List all active social projects with their TikTok URLs
// Protected by CRON_SECRET for GitHub Actions
export async function GET(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    const { data: projects, error } = await supabase
      .from("social_projects")
      .select("id, tiktok_url, floor_price, cap_price")
      .eq("is_active", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      projects: (projects || []).map((p) => ({
        id: p.id,
        tiktokUrl: p.tiktok_url,
        floorPrice: p.floor_price,
        capPrice: p.cap_price,
      })),
    });
  } catch (error) {
    console.error("List social projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
