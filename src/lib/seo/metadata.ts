import type { Metadata } from "next";
import { type Locale, locales } from "@/i18n/config";

export const BASE_URL = "https://www.100kdev.it";

interface PageSEO {
  titleEN: string;
  titleIT: string;
  descriptionEN: string;
  descriptionIT: string;
  path: string;
  noIndex?: boolean;
}

export function generatePageMetadata(lang: Locale, seo: PageSEO): Metadata {
  const title = lang === "it" ? seo.titleIT : seo.titleEN;
  const description = lang === "it" ? seo.descriptionIT : seo.descriptionEN;

  const alternateLanguages: Record<string, string> = {};
  locales.forEach((l) => {
    alternateLanguages[l] = `${BASE_URL}/${l}${seo.path}`;
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${lang}${seo.path}`,
      siteName: "100KDEV",
      locale: lang === "it" ? "it_IT" : "en_US",
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
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}${seo.path}`,
      languages: alternateLanguages,
    },
    robots: seo.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// Configurazioni SEO predefinite per le pagine
export const pageSEOConfigs: Record<string, PageSEO> = {
  faq: {
    titleEN: "FAQ - Frequently Asked Questions",
    titleIT: "FAQ - Domande Frequenti",
    descriptionEN:
      "Everything you need to know about 100KDEV: pricing, deposits, Flash Drop, Social Price Mode, and project process.",
    descriptionIT:
      "Tutto quello che devi sapere su 100KDEV: pricing, caparre, Flash Drop, Social Price Mode e processo progetti.",
    path: "/faq",
  },
  privacy: {
    titleEN: "Privacy Policy",
    titleIT: "Informativa Privacy",
    descriptionEN:
      "How we collect, use and protect your personal data under GDPR.",
    descriptionIT: "Come raccogliamo e proteggiamo i tuoi dati personali.",
    path: "/privacy",
  },
  terms: {
    titleEN: "Terms & Conditions",
    titleIT: "Termini e Condizioni",
    descriptionEN: "Terms governing the use of 100KDEV services.",
    descriptionIT: "Termini che regolano i servizi 100KDEV.",
    path: "/terms",
  },
  cookiePolicy: {
    titleEN: "Cookie Policy",
    titleIT: "Cookie Policy",
    descriptionEN: "How we use cookies on our website.",
    descriptionIT: "Come utilizziamo i cookie sul sito.",
    path: "/cookie-policy",
  },
  refund: {
    titleEN: "Refund Policy",
    titleIT: "Politica Rimborsi",
    descriptionEN: "When and how deposits are refundable.",
    descriptionIT: "Quando e come le caparre sono rimborsabili.",
    path: "/refund",
  },
  socialPrice: {
    titleEN: "Social Price Mode - Price by TikTok Engagement",
    titleIT: "Social Price Mode - Prezzo da Engagement TikTok",
    descriptionEN:
      "The price is determined by TikTok engagement. More views, likes, and shares = higher price.",
    descriptionIT:
      "Il prezzo e determinato dall'engagement TikTok. Piu views, likes e shares = prezzo piu alto.",
    path: "/social-price",
  },
  about: {
    titleEN: "About Drilon - Who is 100KDEV",
    titleIT: "Chi e Drilon - About 100KDEV",
    descriptionEN:
      "Meet the developer behind 100KDEV. Philosophy, experience, and approach to building software.",
    descriptionIT:
      "Scopri lo sviluppatore dietro 100KDEV. Filosofia, esperienza e approccio allo sviluppo software.",
    path: "/about",
  },
  services: {
    titleEN: "Services - What I Build",
    titleIT: "Servizi - Cosa Costruisco",
    descriptionEN:
      "Web apps, mobile apps, SaaS, e-commerce. Full-stack development services.",
    descriptionIT:
      "Web app, app mobile, SaaS, e-commerce. Servizi di sviluppo full-stack.",
    path: "/services",
  },
  pricing: {
    titleEN: "Pricing - How It Works",
    titleIT: "Pricing - Come Funziona",
    descriptionEN:
      "Understand the counter, Flash Drop, and Social Price Mode. Dynamic pricing explained.",
    descriptionIT:
      "Scopri il contatore, Flash Drop e Social Price Mode. Il pricing dinamico spiegato.",
    path: "/pricing",
  },
  contact: {
    titleEN: "Contact",
    titleIT: "Contatti",
    descriptionEN: "Get in touch for questions or collaborations.",
    descriptionIT: "Contattami per domande o collaborazioni.",
    path: "/contact",
  },
  blog: {
    titleEN: "Blog - Insights on Development and Pricing",
    titleIT: "Blog - Approfondimenti su Sviluppo e Pricing",
    descriptionEN:
      "Insights on development, pricing experiments, and tech from 100KDEV.",
    descriptionIT:
      "Approfondimenti su sviluppo, esperimenti di pricing e tech da 100KDEV.",
    path: "/blog",
  },
  checkoutSuccess: {
    titleEN: "Payment Successful",
    titleIT: "Pagamento Riuscito",
    descriptionEN: "Your deposit has been received.",
    descriptionIT: "La tua caparra e stata ricevuta.",
    path: "/checkout/success",
    noIndex: true,
  },
  checkoutCancel: {
    titleEN: "Checkout Cancelled",
    titleIT: "Checkout Annullato",
    descriptionEN: "Your checkout was cancelled.",
    descriptionIT: "Il checkout e stato annullato.",
    path: "/checkout/cancel",
    noIndex: true,
  },
};
