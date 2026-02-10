"use client";

import { useState } from "react";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookieBanner() {
  const {
    showBanner,
    setShowBanner,
    acceptAll,
    rejectAll,
    updatePreferences,
    preferences,
  } = useCookieConsent();
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [tempPrefs, setTempPrefs] = useState({
    analytics: preferences.analytics,
    marketing: preferences.marketing,
  });

  if (!showBanner) return null;

  const handleSave = () => {
    updatePreferences(tempPrefs);
    setShowDetails(false);
  };

  const handleCustomize = () => {
    setTempPrefs({
      analytics: preferences.analytics,
      marketing: preferences.marketing,
    });
    setShowDetails(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        {!showDetails ? (
          // Simple banner
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left flex-1">
              <h3 className="font-mono text-sm font-bold text-white mb-1">
                {t.cookieBannerTitle}
              </h3>
              <p className="text-xs text-white/60">
                {t.cookieBannerDescription}{" "}
                <Link
                  href="/cookie-policy"
                  className="underline hover:text-white transition-colors"
                >
                  {t.footerCookiePolicy}
                </Link>
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCustomize}
                className="text-xs"
              >
                {t.cookieCustomize}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={rejectAll}
                className="text-xs"
              >
                {t.cookieRejectAll}
              </Button>
              <Button size="sm" onClick={acceptAll} className="text-xs">
                {t.cookieAcceptAll}
              </Button>
            </div>
          </div>
        ) : (
          // Cookie details
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-bold text-white">
                {t.cookieCustomize}
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white/50 hover:text-white text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Essential cookies - always enabled */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex-1">
                <p className="font-mono text-sm text-white">
                  {t.cookieEssential}
                </p>
                <p className="text-xs text-white/50">{t.cookieEssentialDesc}</p>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className="w-6 h-6 accent-white cursor-not-allowed opacity-50"
              />
            </div>

            {/* Analytics cookies */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex-1">
                <p className="font-mono text-sm text-white">
                  {t.cookieAnalytics}
                </p>
                <p className="text-xs text-white/50">{t.cookieAnalyticsDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={tempPrefs.analytics}
                onChange={(e) =>
                  setTempPrefs({ ...tempPrefs, analytics: e.target.checked })
                }
                className="w-6 h-6 accent-white cursor-pointer"
              />
            </div>

            {/* Marketing cookies */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex-1">
                <p className="font-mono text-sm text-white">
                  {t.cookieMarketing}
                </p>
                <p className="text-xs text-white/50">{t.cookieMarketingDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={tempPrefs.marketing}
                onChange={(e) =>
                  setTempPrefs({ ...tempPrefs, marketing: e.target.checked })
                }
                className="w-6 h-6 accent-white cursor-pointer"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
                className="text-xs"
              >
                {t.cancel}
              </Button>
              <Button size="sm" onClick={handleSave} className="text-xs">
                {t.cookieSavePreferences}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
