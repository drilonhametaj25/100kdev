import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

interface SocialProjectInput {
  id?: string;
  title: string;
  description: string;
  tiktokUrl: string;
  tiktokEmbedHtml?: string;
  floorPrice?: number;
  capPrice?: number;
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  savesCount?: number;
  expiresAt?: string | null;
  durationHours?: number;
}

// GET - List all social projects (including inactive)
export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("social_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin social projects fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch projects", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json({ projects: data });
  } catch (error) {
    console.error("Admin social projects API error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// POST - Create a new social project
export async function POST(request: NextRequest) {
  try {
    const body: SocialProjectInput = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.tiktokUrl) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, tiktokUrl" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Calculate expires_at: use provided value, or calculate from durationHours, or default to 48h
    const durationMs = (body.durationHours ?? 48) * 60 * 60 * 1000;
    const expiresAt = body.expiresAt || new Date(Date.now() + durationMs).toISOString();

    const { data, error } = await supabase
      .from("social_projects")
      .insert({
        title: body.title,
        description: body.description,
        tiktok_url: body.tiktokUrl,
        tiktok_embed_html: body.tiktokEmbedHtml || null,
        floor_price: body.floorPrice ?? 500,
        cap_price: body.capPrice ?? 50000,
        views_count: body.viewsCount ?? 0,
        likes_count: body.likesCount ?? 0,
        comments_count: body.commentsCount ?? 0,
        shares_count: body.sharesCount ?? 0,
        saves_count: body.savesCount ?? 0,
        is_active: true,
        status: "live",
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error("Create social project error:", error);
      return NextResponse.json(
        { error: "Failed to create project", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error) {
    console.error("Create social project API error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing social project
export async function PUT(request: NextRequest) {
  try {
    const body: SocialProjectInput = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing project id" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.tiktokUrl !== undefined) updateData.tiktok_url = body.tiktokUrl;
    if (body.tiktokEmbedHtml !== undefined) updateData.tiktok_embed_html = body.tiktokEmbedHtml;
    if (body.floorPrice !== undefined) updateData.floor_price = body.floorPrice;
    if (body.capPrice !== undefined) updateData.cap_price = body.capPrice;
    if (body.viewsCount !== undefined) updateData.views_count = body.viewsCount;
    if (body.likesCount !== undefined) updateData.likes_count = body.likesCount;
    if (body.commentsCount !== undefined) updateData.comments_count = body.commentsCount;
    if (body.sharesCount !== undefined) updateData.shares_count = body.sharesCount;
    if (body.savesCount !== undefined) updateData.saves_count = body.savesCount;
    if (body.expiresAt !== undefined) updateData.expires_at = body.expiresAt;
    if (body.durationHours !== undefined) {
      updateData.expires_at = new Date(Date.now() + body.durationHours * 60 * 60 * 1000).toISOString();
    }

    const { data, error } = await supabase
      .from("social_projects")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Update social project error:", error);
      return NextResponse.json(
        { error: "Failed to update project", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: data });
  } catch (error) {
    console.error("Update social project API error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a social project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing project id" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("social_projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete social project error:", error);
      return NextResponse.json(
        { error: "Failed to delete project", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete social project API error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
