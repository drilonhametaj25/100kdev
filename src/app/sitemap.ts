import { MetadataRoute } from "next";

const BASE_URL = "https://www.100kdev.it";
const locales = ["en", "it"] as const;

// Pagine statiche pubbliche
const staticPages = [
  { path: "", changeFrequency: "daily" as const, priority: 1.0 },
  { path: "/faq", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/social-price", changeFrequency: "daily" as const, priority: 0.9 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/services", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/pricing", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/cookie-policy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/refund", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Genera entry per ogni pagina in ogni lingua
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${page.path}`,
            it: `${BASE_URL}/it${page.path}`,
          },
        },
      });
    }
  }

  return entries;
}
