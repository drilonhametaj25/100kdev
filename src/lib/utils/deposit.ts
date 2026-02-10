// Deposit calculation - can be used on both client and server
export function calculateDepositAmount(price: number): number {
  const deposit = price * 0.05; // 5%
  return Math.max(deposit, 50); // Minimum $50
}
