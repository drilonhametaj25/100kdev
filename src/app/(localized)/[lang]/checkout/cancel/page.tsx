"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export default function CheckoutCancelPage() {
  const { t, language } = useLanguage();

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
            aria-label="Cancelled"
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
          {t.cancelTitle}
        </h1>

        {/* Message */}
        <div className="space-y-4 text-white/70">
          <p>{t.cancelMessage1}</p>
          <p>{t.cancelMessage2}</p>
        </div>

        {/* Warning box */}
        <div className="p-4 bg-price-high/10 rounded-lg border border-price-high/30">
          <p className="text-sm font-mono text-price-high">
            {t.cancelWarning}
          </p>
        </div>

        {/* Back button */}
        <Link href={`/${language}`}>
          <Button variant="primary">{t.tryAgain}</Button>
        </Link>
      </div>
    </main>
  );
}
