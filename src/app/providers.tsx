"use client";

import { LanguageProvider } from "@/hooks/use-language";
import { CookieConsentProvider } from "@/hooks/use-cookie-consent";
import { CookieBanner } from "@/components/cookie/cookie-banner";
import type { Language } from "@/i18n";

interface ProvidersProps {
  children: React.ReactNode;
  initialLang?: Language;
}

export function Providers({ children, initialLang }: ProvidersProps) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <CookieConsentProvider>
        {children}
        <CookieBanner />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
