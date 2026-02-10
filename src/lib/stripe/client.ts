import Stripe from "stripe";

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

// Deposit calculation
export function calculateDepositAmount(price: number): number {
  const deposit = price * 0.05; // 5%
  return Math.max(deposit, 50); // Minimum $50
}
