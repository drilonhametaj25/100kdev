"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getTranslations, type Language, type Translations, type TranslationKey } from "@/i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Estrae la lingua dalla path
function getLanguageFromPath(pathname: string): Language {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment === "it") return "it";
  return "en";
}

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLang?: Language;
}

export function LanguageProvider({ children, initialLang }: LanguageProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Determina la lingua dalla path o dall'initialLang
  const langFromPath = getLanguageFromPath(pathname);
  const [language, setLanguageState] = useState<Language>(initialLang || langFromPath);

  // Sincronizza con la path quando cambia
  useEffect(() => {
    const pathLang = getLanguageFromPath(pathname);
    if (pathLang !== language) {
      setLanguageState(pathLang);
    }
  }, [pathname, language]);

  const setLanguage = useCallback(
    (lang: Language) => {
      if (lang === language) return;

      setLanguageState(lang);

      // Naviga alla nuova path con la lingua aggiornata
      const currentPath = pathname;
      const segments = currentPath.split("/").filter(Boolean);

      // Rimuovi il prefisso lingua esistente se presente
      if (segments[0] === "en" || segments[0] === "it") {
        segments.shift();
      }

      // Costruisci la nuova path
      const newPath = `/${lang}${segments.length > 0 ? "/" + segments.join("/") : ""}`;
      router.push(newPath);
    },
    [language, pathname, router]
  );

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Utility hook for getting a single translation
export function useTranslation(key: TranslationKey): string {
  const { t } = useLanguage();
  return t[key];
}
