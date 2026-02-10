import type { Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { generatePageMetadata, pageSEOConfigs } from "@/lib/seo/metadata";
import { ServicesPageClient } from "./services-client";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return generatePageMetadata(lang as Locale, pageSEOConfigs.services);
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  return <ServicesPageClient lang={lang as Locale} />;
}
