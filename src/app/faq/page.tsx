"use client";

import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { useLanguage } from "@/hooks/use-language";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="border-b border-white/10 pb-4">
      <h3 className="font-mono font-bold text-white mb-2">{question}</h3>
      <p className="text-white/70 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}

interface FAQSectionProps {
  title: string;
  children: React.ReactNode;
}

function FAQSection({ title, children }: FAQSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-mono font-bold text-white border-l-2 border-white/30 pl-4">
        {title}
      </h2>
      <div className="space-y-4 pl-4">{children}</div>
    </section>
  );
}

export default function FAQPage() {
  const { t } = useLanguage();

  return (
    <LegalPageLayout title={t.faqTitle}>
      <FAQSection title={t.faqPricingTitle}>
        <FAQItem question={t.faqPricingQ1} answer={t.faqPricingA1} />
        <FAQItem question={t.faqPricingQ2} answer={t.faqPricingA2} />
        <FAQItem question={t.faqPricingQ3} answer={t.faqPricingA3} />
      </FAQSection>

      <FAQSection title={t.faqDepositTitle}>
        <FAQItem question={t.faqDepositQ1} answer={t.faqDepositA1} />
        <FAQItem question={t.faqDepositQ2} answer={t.faqDepositA2} />
      </FAQSection>

      <FAQSection title={t.faqFlashDropTitle}>
        <FAQItem question={t.faqFlashDropQ1} answer={t.faqFlashDropA1} />
        <FAQItem question={t.faqFlashDropQ2} answer={t.faqFlashDropA2} />
      </FAQSection>

      <FAQSection title={t.faqSocialPriceTitle}>
        <FAQItem question={t.faqSocialPriceQ1} answer={t.faqSocialPriceA1} />
      </FAQSection>

      <FAQSection title={t.faqProcessTitle}>
        <FAQItem question={t.faqProcessQ1} answer={t.faqProcessA1} />
        <FAQItem question={t.faqProcessQ2} answer={t.faqProcessA2} />
      </FAQSection>
    </LegalPageLayout>
  );
}
