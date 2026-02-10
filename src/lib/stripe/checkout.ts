import { stripe, calculateDepositAmount } from "./client";
import { formatPrice } from "@/lib/utils/format";

interface CreateCheckoutSessionParams {
  purchaseId: string;
  lockedPrice: number;
  customerEmail: string;
}

export async function createCheckoutSession({
  purchaseId,
  lockedPrice,
  customerEmail,
}: CreateCheckoutSessionParams) {
  const depositAmount = calculateDepositAmount(lockedPrice);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "100KDEV - Project Deposit",
            description: `Non-refundable deposit for project at ${formatPrice(lockedPrice)}. We'll discuss details on a call.`,
          },
          unit_amount: Math.round(depositAmount * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      purchaseId,
      lockedPrice: lockedPrice.toString(),
      depositAmount: depositAmount.toString(),
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url!,
    depositAmount,
  };
}

export async function refundDeposit(paymentIntentId: string, reason?: string) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    reason: "requested_by_customer",
    metadata: {
      reason: reason || "Admin rejected project",
    },
  });

  return refund;
}
