export const locales = ["en", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
};

export const BASE_URL = "https://www.100kdev.it";

// Mapping per hreflang
export function getAlternateUrls(path: string = ""): Record<Locale, string> {
  return {
    en: `${BASE_URL}/en${path}`,
    it: `${BASE_URL}/it${path}`,
  };
}

// Check se una stringa è una locale valida
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
