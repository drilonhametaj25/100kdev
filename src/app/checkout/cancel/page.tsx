import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Cancel icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-mono font-bold text-white">
          Checkout Cancelled
        </h1>

        {/* Message */}
        <div className="space-y-4 text-white/70">
          <p>
            No worries! Your checkout was cancelled and no payment was made.
          </p>
          <p>
            The price keeps going up though. Come back when you&apos;re ready!
          </p>
        </div>

        {/* Warning box */}
        <div className="p-4 bg-price-high/10 rounded-lg border border-price-high/30">
          <p className="text-sm font-mono text-price-high">
            Remember: the price never goes down. Lock it before it&apos;s too late.
          </p>
        </div>

        {/* Back button */}
        <Link href="/">
          <Button variant="primary">Try Again</Button>
        </Link>
      </div>
    </main>
  );
}
