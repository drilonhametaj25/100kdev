import type { Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { generatePageMetadata, pageSEOConfigs } from "@/lib/seo/metadata";
import { AboutPageClient } from "./about-client";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return generatePageMetadata(lang as Locale, pageSEOConfigs.about);
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  return <AboutPageClient lang={lang as Locale} />;
}
