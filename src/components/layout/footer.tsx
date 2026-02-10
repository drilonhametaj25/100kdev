"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

export function Footer() {
  const { t } = useLanguage();
  const { openSettings } = useCookieConsent();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Legal links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 text-xs font-mono">
          <Link
            href="/privacy"
            className="text-white/50 hover:text-white transition-colors"
          >
            {t.footerPrivacy}
          </Link>
          <Link
            href="/cookie-policy"
            className="text-white/50 hover:text-white transition-colors"
          >
            {t.footerCookiePolicy}
          </Link>
          <Link
            href="/terms"
            className="text-white/50 hover:text-white transition-colors"
          >
            {t.footerTerms}
          </Link>
          <Link
            href="/refund"
            className="text-white/50 hover:text-white transition-colors"
          >
            {t.footerRefund}
          </Link>
          <Link
            href="/faq"
            className="text-white/50 hover:text-white transition-colors"
          >
            {t.footerFaq}
          </Link>
          <button
            onClick={openSettings}
            className="text-white/50 hover:text-white transition-colors"
          >
            {t.footerManageCookies}
          </button>
        </div>

        {/* Owner info */}
        <div className="text-center space-y-2 text-xs font-mono text-white/40">
          <p>
            {t.footerOwner}: Drilon Hametaj
          </p>
          <p>
            {t.footerVatNumber}: IT07327360488
          </p>
          <p>
            &copy; {currentYear} {t.brand}. {t.footerRights}
          </p>
        </div>
      </div>
    </footer>
  );
}
