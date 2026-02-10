import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface GalleryRow {
  id: string;
  title: string;
  description: string | null;
  price_paid: number;
  project_url: string | null;
  screenshot_url: string | null;
  display_order: number;
  is_visible: boolean;
}

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

    const projects = (data as GalleryRow[] || []).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      pricePaid: p.price_paid,
      projectUrl: p.project_url,
      screenshotUrl: p.screenshot_url,
      displayOrder: p.display_order,
      isVisible: p.is_visible,
    }));

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    // Get max display order
    const { data: maxOrderData } = await supabase
      .from("gallery_projects")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrderData?.display_order || 0) + 1;

    const { data, error } = await supabase
      .from("gallery_projects")
      .insert({
        title: body.title,
        description: body.description || null,
        price_paid: body.pricePaid || 0,
        project_url: body.projectUrl || null,
        screenshot_url: body.screenshotUrl || null,
        display_order: body.displayOrder || nextOrder,
        is_visible: body.isVisible ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create gallery project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      project: {
        id: data.id,
        title: data.title,
        description: data.description,
        pricePaid: data.price_paid,
        projectUrl: data.project_url,
        screenshotUrl: data.screenshot_url,
        displayOrder: data.display_order,
        isVisible: data.is_visible,
      },
    });
  } catch (error) {
    console.error("POST gallery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) {
      updateData.title = body.title;
    }
    if (body.description !== undefined) {
      updateData.description = body.description;
    }
    if (body.pricePaid !== undefined) {
      updateData.price_paid = body.pricePaid;
    }
    if (body.projectUrl !== undefined) {
      updateData.project_url = body.projectUrl;
    }
    if (body.screenshotUrl !== undefined) {
      updateData.screenshot_url = body.screenshotUrl;
    }
    if (body.displayOrder !== undefined) {
      updateData.display_order = body.displayOrder;
    }
    if (body.isVisible !== undefined) {
      updateData.is_visible = body.isVisible;
    }

    const { error } = await supabase
      .from("gallery_projects")
      .update(updateData)
      .eq("id", body.id);

    if (error) {
      console.error("Failed to update gallery project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT gallery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("gallery_projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete gallery project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE gallery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
