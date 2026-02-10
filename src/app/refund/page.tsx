"use client";

import {
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/legal-page-layout";
import { useLanguage } from "@/hooks/use-language";

export default function RefundPage() {
  const { t } = useLanguage();

  return (
    <LegalPageLayout title={t.refundTitle} lastUpdated={t.refundLastUpdated}>
      <LegalSection title={t.refundIntroTitle}>{t.refundIntroText}</LegalSection>

      <LegalSection title={t.refundDepositTitle}>
        {t.refundDepositText}
      </LegalSection>

      <LegalSection title={t.refundRefundableTitle}>
        {t.refundRefundableText}
      </LegalSection>

      <LegalSection title={t.refundNonRefundableTitle}>
        {t.refundNonRefundableText}
      </LegalSection>

      <LegalSection title={t.refundProcessTitle}>
        {t.refundProcessText}
      </LegalSection>

      <LegalSection title={t.refundTimelineTitle}>
        {t.refundTimelineText}
      </LegalSection>

      <LegalSection title={t.refundConsumerRightsTitle}>
        {t.refundConsumerRightsText}
      </LegalSection>

      <LegalSection title={t.refundContactTitle}>
        {t.refundContactText}
      </LegalSection>
    </LegalPageLayout>
  );
}
