import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { calculateDepositAmount } from "@/lib/stripe/client";
import { calculateCurrentPrice, isPriceWithinTolerance } from "@/lib/counter/calculator";
import { COUNTER_ID, COUNTER_CONFIG } from "@/lib/counter/constants";
import type { CounterStateRow, CheckoutResponse } from "@/types/shared";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().optional(),
  projectDescription: z.string().min(10, "Please describe your project (min 10 characters)"),
  lockedPrice: z.number().positive("Price must be positive"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, customerPhone, projectDescription, lockedPrice } =
      result.data;

    const supabase = createAdminClient();

    // Get current counter state
    const { data: counterState, error: counterError } = await supabase
      .from("counter_state")
      .select("*")
      .eq("id", COUNTER_ID)
      .single<CounterStateRow>();

    if (counterError || !counterState) {
      return NextResponse.json(
        { error: "Failed to fetch counter state", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    // Calculate current server price
    const serverPrice = counterState.is_drop_active && counterState.drop_price !== null
      ? counterState.drop_price
      : calculateCurrentPrice(counterState.last_reset_at, counterState.increment_per_second);

    // Check if price is within tolerance (±$50)
    if (!isPriceWithinTolerance(lockedPrice, serverPrice, COUNTER_CONFIG.priceTolerance)) {
      // Check if counter was reset (someone else bought)
      if (serverPrice < lockedPrice - 100) {
        return NextResponse.json(
          {
            error: "The counter was reset. Someone else bought before you. Please try again.",
            code: "COUNTER_RESET",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: `Price mismatch. Your price: $${lockedPrice.toFixed(2)}, Server price: $${serverPrice.toFixed(2)}. Please refresh.`,
          code: "PRICE_MISMATCH",
        },
        { status: 400 }
      );
    }

    // Calculate deposit
    const depositAmount = calculateDepositAmount(lockedPrice);

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        price_locked: lockedPrice,
        deposit_amount: depositAmount,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        project_description: projectDescription,
        status: "pending",
      })
      .select()
      .single();

    if (purchaseError || !purchase) {
      console.error("Purchase creation error:", purchaseError);
      return NextResponse.json(
        { error: "Failed to create purchase", code: "DB_ERROR" },
        { status: 500 }
      );
    }

    // Create Stripe Checkout session
    const { sessionId, checkoutUrl, depositAmount: finalDeposit } = await createCheckoutSession({
      purchaseId: purchase.id,
      lockedPrice,
      customerEmail,
    });

    // Update purchase with Stripe session ID
    await supabase
      .from("purchases")
      .update({ stripe_checkout_session_id: sessionId })
      .eq("id", purchase.id);

    const response: CheckoutResponse = {
      checkoutUrl,
      sessionId,
      depositAmount: finalDeposit,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
