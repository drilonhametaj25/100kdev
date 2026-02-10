"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { getTranslations, type Language, type Translations, type TranslationKey } from "@/i18n";

const LANGUAGE_COOKIE = "100kdev-lang";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "en";
  return browserLang.toLowerCase().startsWith("it") ? "it" : "en";
}

function getStoredLanguage(): Language | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === LANGUAGE_COOKIE) {
      return value === "it" ? "it" : "en";
    }
  }
  return null;
}

function setStoredLanguage(lang: Language) {
  if (typeof document === "undefined") return;

  // Set cookie for 1 year
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${LANGUAGE_COOKIE}=${lang};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const stored = getStoredLanguage();
    const detected = stored || detectBrowserLanguage();
    setLanguageState(detected);
    setIsInitialized(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
  }, []);

  const t = getTranslations(language);

  // Don't render until initialized to prevent hydration mismatch
  if (!isInitialized) {
    return null;
  }

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
