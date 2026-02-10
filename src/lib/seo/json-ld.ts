import { type Locale } from "@/i18n/config";

const BASE_URL = "https://www.100kdev.it";

// Organization Schema - da usare nel layout root
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "100KDEV",
    alternateName: "100K DEV",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    founder: {
      "@type": "Person",
      name: "Drilon Hametaj",
      email: "info@drilonhametaj.it",
    },
    sameAs: ["https://www.tiktok.com/@100kdev"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@drilonhametaj.it",
      contactType: "customer service",
      availableLanguage: ["English", "Italian"],
    },
  };
}

// Person Schema - per pagina About
export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#drilon`,
    name: "Drilon Hametaj",
    jobTitle: "Full-Stack Developer",
    worksFor: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
    },
    email: "info@drilonhametaj.it",
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Mobile Development",
    ],
  };
}

// FAQPage Schema
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// BreadcrumbList Schema
export function getBreadcrumbSchema(
  lang: Locale,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}/${lang}${item.path}`,
    })),
  };
}

// Service Schema - per pagina Services
export function getServiceSchema(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Software Development",
    provider: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${BASE_URL}/${lang}`,
      serviceType: "Online",
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        price: "1000",
        description:
          lang === "it"
            ? "Prezzo iniziale, aumenta ogni secondo"
            : "Starting price, increases every second",
      },
    },
  };
}

// BlogPosting Schema - per articoli blog
export function getBlogPostSchema(
  lang: Locale,
  post: {
    title: string;
    description: string;
    slug: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/${lang}/blog/${post.slug}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/#drilon`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
    },
    inLanguage: lang,
    ...(post.image && {
      image: {
        "@type": "ImageObject",
        url: post.image,
      },
    }),
  };
}

// WebSite Schema - per sitelinks search
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "100KDEV",
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
    },
    inLanguage: ["en", "it"],
  };
}
