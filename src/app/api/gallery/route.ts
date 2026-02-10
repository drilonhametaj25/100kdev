import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface GalleryProjectRow {
  id: string;
  title: string;
  description: string | null;
  price_paid: number;
  project_url: string | null;
  screenshot_url: string | null;
  created_at: string;
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gallery_projects")
      .select("id, title, description, price_paid, project_url, screenshot_url, created_at")
      .eq("is_visible", true)
      .order("display_order", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gallery fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch gallery", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    const projects = (data as GalleryProjectRow[]).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      pricePaid: p.price_paid,
      projectUrl: p.project_url,
      screenshotUrl: p.screenshot_url,
      createdAt: p.created_at,
    }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
