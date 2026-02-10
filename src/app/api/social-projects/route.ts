import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface SocialProjectRow {
  id: string;
  title: string;
  description: string;
  tiktok_url: string;
  tiktok_embed_html: string | null;
  floor_price: number;
  cap_price: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  calculated_price: number;
  status: string;
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("social_projects")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Social projects fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch projects", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    const projects = (data as SocialProjectRow[]).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tiktokUrl: p.tiktok_url,
      tiktokEmbedHtml: p.tiktok_embed_html,
      metrics: {
        views: p.views_count,
        likes: p.likes_count,
        comments: p.comments_count,
        shares: p.shares_count,
        saves: p.saves_count,
      },
      calculatedPrice: p.calculated_price,
      floorPrice: p.floor_price,
      capPrice: p.cap_price,
      status: p.status,
    }));

    return NextResponse.json(
      { projects },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Social projects API error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
