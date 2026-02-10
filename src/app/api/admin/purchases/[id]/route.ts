import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    // Handle action field from frontend (accept/reject buttons)
    if (body.action !== undefined) {
      updateData.status = body.action === "accept" ? "accepted" : "rejected";
    }

    if (body.adminNotes !== undefined) {
      updateData.admin_notes = body.adminNotes;
    }

    const { error } = await supabase
      .from("purchases")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Failed to update purchase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("PATCH purchase error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
