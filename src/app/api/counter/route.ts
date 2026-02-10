import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateCurrentPrice } from "@/lib/counter/calculator";
import { COUNTER_ID } from "@/lib/counter/constants";
import type { CounterApiResponse, CounterStateRow } from "@/types/shared";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("counter_state")
      .select("*")
      .eq("id", COUNTER_ID)
      .single<CounterStateRow>();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch counter state", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Counter state not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    // Calculate current price
    let price: number;
    if (data.is_drop_active && data.drop_price !== null) {
      // During flash drop, use fixed drop price
      price = data.drop_price;
    } else {
      // Normal mode: calculate based on time elapsed
      price = calculateCurrentPrice(data.last_reset_at, data.increment_per_second);
    }

    const response: CounterApiResponse = {
      price: Math.round(price * 100) / 100, // Round to 2 decimals
      lastResetAt: data.last_reset_at,
      lastPurchasePrice: data.last_purchase_price,
      lastPurchaseAt: data.last_purchase_at,
      isDropActive: data.is_drop_active,
      dropPrice: data.drop_price,
      incrementPerSecond: data.increment_per_second,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
