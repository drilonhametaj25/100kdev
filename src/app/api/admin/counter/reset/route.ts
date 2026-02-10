import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { COUNTER_ID } from "@/lib/counter/constants";

export async function POST() {
  try {
    const supabase = createAdminClient();

    // Reset counter
    const { error } = await supabase
      .from("counter_state")
      .update({
        current_price: 1000.0,
        last_reset_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", COUNTER_ID);

    if (error) {
      console.error("Reset error:", error);
      return NextResponse.json(
        { error: "Failed to reset counter" },
        { status: 500 }
      );
    }

    // Log event
    await supabase.from("counter_history").insert({
      event_type: "reset",
      price_at_event: 1000,
      details: { reason: "admin_manual_reset" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
