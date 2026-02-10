"use client";

import { LanguageProvider } from "@/hooks/use-language";
import { CookieConsentProvider } from "@/hooks/use-cookie-consent";
import { CookieBanner } from "@/components/cookie/cookie-banner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        {children}
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
