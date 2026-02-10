import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-price-low/20 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-price-low"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-mono font-bold text-white">
          Price Locked!
        </h1>

        {/* Message */}
        <div className="space-y-4 text-white/70">
          <p>
            Your deposit has been received. The counter has been reset to $1,000.
          </p>
          <p>
            I&apos;ll contact you within 24 hours to discuss your project and next steps.
          </p>
        </div>

        {/* Details box */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-left">
          <h3 className="text-sm font-mono text-white/50 mb-2">What happens next:</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-price-low">1.</span>
              <span>Check your email for confirmation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-price-low">2.</span>
              <span>I&apos;ll review your project description</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-price-low">3.</span>
              <span>We&apos;ll schedule a call to discuss details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-price-low">4.</span>
              <span>I&apos;ll send an invoice for the remaining balance</span>
            </li>
          </ul>
        </div>

        {/* Back button */}
        <Link href="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    </main>
  );
}
