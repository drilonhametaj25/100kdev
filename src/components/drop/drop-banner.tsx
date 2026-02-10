"use client";

import { useLanguage } from "@/hooks/use-language";
import { SubscribeForm } from "./subscribe-form";

export function DropBanner() {
  const { t } = useLanguage();

  return (
    <section className="w-full max-w-2xl mx-auto mt-16 p-6 bg-price-extreme/5 border border-price-extreme/20 rounded-lg">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-mono font-bold text-price-extreme">
            {t.flashDropTitle}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed">
          {t.flashDropDesc}
        </p>

        {/* Subscribe Form */}
        <div className="mt-2">
          <SubscribeForm />
        </div>
      </div>
    </section>
  );
}
