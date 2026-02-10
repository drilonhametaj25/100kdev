import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, type Locale, BASE_URL, getAlternateUrls } from "@/i18n";
import { Providers } from "../../providers";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/seo/json-ld";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/json-ld";
import "../../globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const isItalian = lang === "it";

  const title = isItalian
    ? "100KDEV - Lo sviluppatore che parte da $1.000"
    : "100KDEV - The dev who starts at $1,000";

  const description = isItalian
    ? "Uno sviluppatore con un modello di pricing non convenzionale. Il contatore parte da $1.000 e sale ogni secondo. Blocca il tuo prezzo ora."
    : "A developer with an unconventional pricing model. The counter starts at $1,000 and goes up every second. Lock your price now.";

  const alternateLanguages = getAlternateUrls("");

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: "%s | 100KDEV",
      default: title,
    },
    description,
    keywords: [
      "developer",
      "freelance",
      "pricing",
      "counter",
      "100kdev",
      "web development",
      "full stack",
    ],
    authors: [{ name: "Drilon Hametaj" }],
    creator: "Drilon Hametaj",
    openGraph: {
      title,
      description: isItalian
        ? "Blocca il tuo prezzo prima che salga."
        : "Lock your price before it goes up.",
      url: `${BASE_URL}/${lang}`,
      siteName: "100KDEV",
      locale: isItalian ? "it_IT" : "en_US",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "100KDEV",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: isItalian
        ? "Blocca il tuo prezzo prima che salga."
        : "Lock your price before it goes up.",
      images: [`${BASE_URL}/og-image.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: alternateLanguages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    manifest: "/site.webmanifest",
  };
}

export default async function LocalizedLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  return (
    <html lang={lang} className={jetbrainsMono.variable}>
      <head>
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
      </head>
      <body className="antialiased">
        <Providers initialLang={lang as Locale}>
          <div className="grain-overlay" />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
