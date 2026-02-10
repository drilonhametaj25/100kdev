import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PurchaseRow {
  id: string;
  price_locked: number;
  deposit_amount: number;
  customer_name: string;
  customer_email: string;
  project_description: string;
  status: string;
  created_at: string;
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Purchases fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch purchases" },
        { status: 500 }
      );
    }

    const purchases = (data as PurchaseRow[]).map((p) => ({
      id: p.id,
      priceLocked: p.price_locked,
      depositAmount: p.deposit_amount,
      customerName: p.customer_name,
      customerEmail: p.customer_email,
      projectDescription: p.project_description,
      status: p.status,
      createdAt: p.created_at,
    }));

    return NextResponse.json(
      { purchases },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Purchases API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
