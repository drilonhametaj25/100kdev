import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    interface DropRow {
      id: string;
      scheduled_at: string;
      duration_minutes: number;
      drop_price: number;
      status: string;
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
