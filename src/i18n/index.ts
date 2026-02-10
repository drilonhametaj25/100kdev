import { en } from "./en";
import { it } from "./it";
import type { Language, Translations } from "./types";

export const translations: Record<Language, Translations> = {
  en,
  it,
};

export function getTranslations(language: Language): Translations {
  return translations[language];
}

export type { Language, Translations, TranslationKey } from "./types";
export {
  locales,
  defaultLocale,
  localeNames,
  BASE_URL,
  getAlternateUrls,
  isValidLocale,
  type Locale,
} from "./config";
