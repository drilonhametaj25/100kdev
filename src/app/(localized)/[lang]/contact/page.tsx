import type { Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { generatePageMetadata, pageSEOConfigs } from "@/lib/seo/metadata";
import { ContactPageClient } from "./contact-client";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return generatePageMetadata(lang as Locale, pageSEOConfigs.contact);
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  return <ContactPageClient lang={lang as Locale} />;
}
