"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import type { Locale } from "@/i18n/config";

interface ContactPageClientProps {
  lang: Locale;
}

export function ContactPageClient({ lang }: ContactPageClientProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-mono font-bold text-white mb-4">
              {t.contactTitle}
            </h1>
            <p className="text-xl text-white/60">{t.contactSubtitle}</p>
          </div>

          {isSuccess ? (
            <div className="text-center p-8 bg-price-low/10 border border-price-low/30 rounded-xl">
              <p className="text-price-low font-mono">{t.contactSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-mono text-white/70 mb-2"
                >
                  {t.contactNameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-mono text-white/70 mb-2"
                >
                  {t.contactEmailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-mono text-white/70 mb-2"
                >
                  {t.contactMessageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-white/40">{t.contactDisclaimer}</p>

              {/* Submit */}
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t.processing : t.contactSubmit}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
