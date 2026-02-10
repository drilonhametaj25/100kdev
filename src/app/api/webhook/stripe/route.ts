import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { COUNTER_ID } from "@/lib/counter/constants";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const purchaseId = session.metadata?.purchaseId;
        const lockedPrice = parseFloat(session.metadata?.lockedPrice || "0");

        if (!purchaseId) {
          console.error("No purchaseId in session metadata");
          return NextResponse.json({ error: "Missing purchaseId" }, { status: 400 });
        }

        console.log(`Processing completed checkout for purchase ${purchaseId}`);

        // Update purchase status
        const { error: updateError } = await supabase
          .from("purchases")
          .update({
            deposit_paid: true,
            status: "deposit_paid",
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq("id", purchaseId);

        if (updateError) {
          console.error("Failed to update purchase:", updateError);
          return NextResponse.json({ error: "Failed to update purchase" }, { status: 500 });
        }

        // Log purchase event in counter_history
        await supabase.from("counter_history").insert({
          event_type: "purchase",
          price_at_event: lockedPrice,
          details: {
            purchase_id: purchaseId,
            session_id: session.id,
            payment_intent: session.payment_intent,
            customer_email: session.customer_email,
          },
        });

        // Reset counter
        const { error: resetError } = await supabase
          .from("counter_state")
          .update({
            current_price: 1000.0,
            last_reset_at: new Date().toISOString(),
            last_purchase_price: lockedPrice,
            last_purchase_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", COUNTER_ID);

        if (resetError) {
          console.error("Failed to reset counter:", resetError);
        }

        console.log(`Counter reset after purchase at $${lockedPrice}`);

        // TODO: Send notification email to admin
        // await sendAdminNotification(purchaseId, session);

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const purchaseId = session.metadata?.purchaseId;

        if (purchaseId) {
          // Mark purchase as expired/cancelled
          await supabase
            .from("purchases")
            .update({ status: "rejected", admin_notes: "Checkout session expired" })
            .eq("id", purchaseId);

          console.log(`Checkout session expired for purchase ${purchaseId}`);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        if (paymentIntentId) {
          // Find purchase by payment intent and mark as refunded
          const { data: purchase } = await supabase
            .from("purchases")
            .select("id")
            .eq("stripe_payment_intent_id", paymentIntentId)
            .single();

          if (purchase) {
            await supabase
              .from("purchases")
              .update({ status: "refunded" })
              .eq("id", purchase.id);

            console.log(`Purchase ${purchase.id} marked as refunded`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
