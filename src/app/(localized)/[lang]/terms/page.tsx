"use client";

import {
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/legal-page-layout";
import { useLanguage } from "@/hooks/use-language";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <LegalPageLayout title={t.termsTitle} lastUpdated={t.termsLastUpdated}>
      <LegalSection title={t.termsIntroTitle}>{t.termsIntroText}</LegalSection>

      <LegalSection title={t.termsServiceTitle}>
        {t.termsServiceText}
      </LegalSection>

      <LegalSection title={t.termsPricingTitle}>
        {t.termsPricingText}
      </LegalSection>

      <LegalSection title={t.termsDepositTitle}>
        {t.termsDepositText}
      </LegalSection>

      <LegalSection title={t.termsFlashDropTitle}>
        {t.termsFlashDropText}
      </LegalSection>

      <LegalSection title={t.termsSocialPriceTitle}>
        {t.termsSocialPriceText}
      </LegalSection>

      <LegalSection title={t.termsPaymentTitle}>
        {t.termsPaymentText}
      </LegalSection>

      <LegalSection title={t.termsProjectTitle}>
        {t.termsProjectText}
      </LegalSection>

      <LegalSection title={t.termsIntellectualPropertyTitle}>
        {t.termsIntellectualPropertyText}
      </LegalSection>

      <LegalSection title={t.termsLimitationTitle}>
        {t.termsLimitationText}
      </LegalSection>

      <LegalSection title={t.termsTerminationTitle}>
        {t.termsTerminationText}
      </LegalSection>

      <LegalSection title={t.termsGoverningLawTitle}>
        {t.termsGoverningLawText}
      </LegalSection>

      <LegalSection title={t.termsContactTitle}>
        {t.termsContactText}
      </LegalSection>
    </LegalPageLayout>
  );
}
