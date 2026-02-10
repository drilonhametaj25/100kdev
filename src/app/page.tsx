"use client";

import { useState } from "react";
import { PriceDisplay } from "@/components/counter/price-display";
import { CounterStats } from "@/components/counter/counter-stats";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/checkout/checkout-modal";
import { DropBanner } from "@/components/drop/drop-banner";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";

export default function HomePage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { t } = useLanguage();

  // Replace {anything} placeholder with styled text
  const descParts = t.description.split("{anything}");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12 max-w-4xl mx-auto text-center">
        {/* Tagline */}
        <div className="space-y-2">
          <p className="text-lg md:text-xl font-mono text-white/50 tracking-wider uppercase">
            {t.tagline}
          </p>
        </div>

        {/* Price Display */}
        <PriceDisplay />

        {/* Stats */}
        <CounterStats />

        {/* Description */}
        <div className="max-w-xl space-y-4 text-white/60">
          <p className="text-sm md:text-base leading-relaxed">
            {descParts[0]}
            <span className="text-white">{t.anything}</span>
            {descParts[1]}
          </p>
        </div>

        {/* CTA Button */}
        <Button size="lg" className="mt-4" onClick={() => setIsCheckoutOpen(true)}>
          {t.lockThisPrice}
        </Button>

        {/* Secondary info */}
        <p className="text-xs font-mono text-white/30 mt-8">
          {t.depositInfo}
        </p>

        {/* Social Price Link */}
        <Link
          href="/social-price"
          className="text-sm font-mono text-price-social/70 hover:text-price-social transition-colors"
        >
          {t.socialPriceLink}
        </Link>

        {/* Flash Drop Banner */}
        <DropBanner />
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="text-xs font-mono text-white/20 tracking-widest">
          {t.brand}
        </span>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </main>
  );
}
