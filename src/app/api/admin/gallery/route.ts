import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("gallery_projects")
      .select("*")
      .order("display_order", { ascending: false });

    if (error) {
      return NextResponse.json({ projects: [] });
    }

    interface GalleryRow {
      id: string;
      title: string;
      description: string | null;
      price_paid: number;
      is_visible: boolean;
    }

    const projects = (data as GalleryRow[] || []).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      pricePaid: p.price_paid,
      isVisible: p.is_visible,
    }));

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}
