import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface DropRow {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  drop_price: number;
  status: string;
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("drops")
      .select("*")
      .order("scheduled_at", { ascending: false });

    if (error) {
      return NextResponse.json({ drops: [] });
    }

    const drops = (data as DropRow[] || []).map((d) => ({
      id: d.id,
      scheduledAt: d.scheduled_at,
      durationMinutes: d.duration_minutes,
      dropPrice: d.drop_price,
      status: d.status,
    }));

    return NextResponse.json({ drops });
  } catch {
    return NextResponse.json({ drops: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("drops")
      .insert({
        scheduled_at: body.scheduledAt,
        duration_minutes: body.durationMinutes || 60,
        drop_price: body.dropPrice,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create drop:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      drop: {
        id: data.id,
        scheduledAt: data.scheduled_at,
        durationMinutes: data.duration_minutes,
        dropPrice: data.drop_price,
        status: data.status,
      },
    });
  } catch (error) {
    console.error("POST drop error:", error);
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

    if (body.scheduledAt !== undefined) {
      updateData.scheduled_at = body.scheduledAt;
    }
    if (body.durationMinutes !== undefined) {
      updateData.duration_minutes = body.durationMinutes;
    }
    if (body.dropPrice !== undefined) {
      updateData.drop_price = body.dropPrice;
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    const { error } = await supabase
      .from("drops")
      .update(updateData)
      .eq("id", body.id);

    if (error) {
      console.error("Failed to update drop:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT drop error:", error);
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
      .from("drops")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete drop:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE drop error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
