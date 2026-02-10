"use client";

import {
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/legal-page-layout";
import { useLanguage } from "@/hooks/use-language";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <LegalPageLayout title={t.privacyTitle} lastUpdated={t.privacyLastUpdated}>
      <LegalSection title={t.privacyIntroTitle}>
        {t.privacyIntroText}
      </LegalSection>

      <LegalSection title={t.privacyDataControllerTitle}>
        {t.privacyDataControllerText}
      </LegalSection>

      <LegalSection title={t.privacyDataCollectedTitle}>
        {t.privacyDataCollectedText}
      </LegalSection>

      <LegalSection title={t.privacyPurposeTitle}>
        {t.privacyPurposeText}
      </LegalSection>

      <LegalSection title={t.privacyLegalBasisTitle}>
        {t.privacyLegalBasisText}
      </LegalSection>

      <LegalSection title={t.privacyDataSharingTitle}>
        {t.privacyDataSharingText}
      </LegalSection>

      <LegalSection title={t.privacyRetentionTitle}>
        {t.privacyRetentionText}
      </LegalSection>

      <LegalSection title={t.privacyRightsTitle}>
        {t.privacyRightsText}
      </LegalSection>

      <LegalSection title={t.privacyContactTitle}>
        {t.privacyContactText}
      </LegalSection>
    </LegalPageLayout>
  );
}
