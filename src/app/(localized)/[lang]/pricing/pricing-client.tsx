"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import type { Locale } from "@/i18n/config";

interface PricingPageClientProps {
  lang: Locale;
}

export function PricingPageClient({ lang }: PricingPageClientProps) {
  const { t, language } = useLanguage();

  const steps = [t.pricingStep1, t.pricingStep2, t.pricingStep3, t.pricingStep4];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-mono font-bold text-white mb-4">
              {t.pricingTitle}
            </h1>
            <p className="text-xl text-white/60">{t.pricingSubtitle}</p>
          </div>

          {/* Counter Model */}
          <section className="mb-12">
            <h2 className="text-2xl font-mono font-bold text-white mb-6 border-l-2 border-white/30 pl-4">
              {t.pricingHowTitle}
            </h2>
            <div className="space-y-4 pl-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-price-low/20 text-price-low flex items-center justify-center font-mono font-bold">
                    {index + 1}
                  </span>
                  <p className="text-white/80 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Flash Drop */}
          <section className="mb-12 p-6 bg-price-drop/10 border border-price-drop/30 rounded-xl">
            <h2 className="text-xl font-mono font-bold text-price-drop mb-3">
              {t.pricingFlashDropTitle}
            </h2>
            <p className="text-white/70">{t.pricingFlashDropText}</p>
          </section>

          {/* Social Price */}
          <section className="mb-12 p-6 bg-price-social/10 border border-price-social/30 rounded-xl">
            <h2 className="text-xl font-mono font-bold text-price-social mb-3">
              {t.pricingSocialTitle}
            </h2>
            <p className="text-white/70 mb-4">{t.pricingSocialText}</p>
            <Link
              href={`/${language}/social-price`}
              className="text-price-social hover:underline font-mono text-sm"
            >
              {t.socialPriceLink}
            </Link>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Link href={`/${language}`}>
              <Button size="lg">{t.lockThisPrice}</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
