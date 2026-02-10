import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch counts in parallel
    const [purchasesResult, pendingResult, subscribersResult] = await Promise.all([
      supabase.from("purchases").select("price_locked", { count: "exact" }),
      supabase.from("purchases").select("*", { count: "exact" }).eq("status", "deposit_paid"),
      supabase.from("subscribers").select("*", { count: "exact" }).eq("confirmed", true),
    ]);

    const totalPurchases = purchasesResult.count || 0;
    const pendingPurchases = pendingResult.count || 0;
    const subscriberCount = subscribersResult.count || 0;

    // Calculate total revenue
    let totalRevenue = 0;
    if (purchasesResult.data) {
      totalRevenue = purchasesResult.data.reduce(
        (sum, p) => sum + (p.price_locked || 0),
        0
      );
    }

    return NextResponse.json({
      totalPurchases,
      pendingPurchases,
      totalRevenue,
      subscriberCount,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
