"use client";

import {
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/legal-page-layout";
import { useLanguage } from "@/hooks/use-language";

export default function CookiePolicyPage() {
  const { t } = useLanguage();

  return (
    <LegalPageLayout title={t.cookiePolicyTitle}>
      <LegalSection title="">{t.cookiePolicyIntro}</LegalSection>

      <LegalSection title={t.cookieWhatAreTitle}>
        {t.cookieWhatAreText}
      </LegalSection>

      <LegalSection title={t.cookieTypesTitle}>
        <div className="space-y-6">
          <div>
            <h3 className="font-mono font-bold text-white mb-2">
              {t.cookieEssentialTitle}
            </h3>
            <p className="text-white/70">{t.cookieEssentialText}</p>
          </div>

          <div>
            <h3 className="font-mono font-bold text-white mb-2">
              {t.cookieAnalyticsTitle}
            </h3>
            <p className="text-white/70">{t.cookieAnalyticsText}</p>
          </div>

          <div>
            <h3 className="font-mono font-bold text-white mb-2">
              {t.cookieMarketingTitle}
            </h3>
            <p className="text-white/70">{t.cookieMarketingText}</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection title={t.cookieManageTitle}>
        {t.cookieManageText}
      </LegalSection>

      <LegalSection title={t.cookieUpdatesTitle}>
        {t.cookieUpdatesText}
      </LegalSection>
    </LegalPageLayout>
  );
}
