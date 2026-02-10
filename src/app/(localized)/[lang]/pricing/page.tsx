import type { Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { generatePageMetadata, pageSEOConfigs } from "@/lib/seo/metadata";
import { PricingPageClient } from "./pricing-client";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return generatePageMetadata(lang as Locale, pageSEOConfigs.pricing);
}

export default async function PricingPage({ params }: Props) {
  const { lang } = await params;
  return <PricingPageClient lang={lang as Locale} />;
}
