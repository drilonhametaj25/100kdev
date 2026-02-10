"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  CookiePreferences,
  DEFAULT_PREFERENCES,
  getStoredConsent,
  saveConsent,
} from "@/lib/cookies";

interface CookieConsentContextValue {
  preferences: CookiePreferences;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  updatePreferences: (prefs: Partial<CookiePreferences>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openSettings: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [showBanner, setShowBanner] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setPreferences(stored);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setIsInitialized(true);
  }, []);

  const updatePreferences = (prefs: Partial<CookiePreferences>) => {
    const newPrefs: CookiePreferences = {
      ...preferences,
      ...prefs,
      essential: true, // always true
      timestamp: Date.now(),
    };
    setPreferences(newPrefs);
    saveConsent(newPrefs);
    setShowBanner(false);
  };

  const acceptAll = () => {
    updatePreferences({ analytics: true, marketing: true });
  };

  const rejectAll = () => {
    updatePreferences({ analytics: false, marketing: false });
  };

  const openSettings = () => {
    setShowBanner(true);
  };

  // Don't render children until we've checked localStorage
  // This prevents hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <CookieConsentContext.Provider
      value={{
        preferences,
        showBanner,
        setShowBanner,
        updatePreferences,
        acceptAll,
        rejectAll,
        openSettings,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider"
    );
  }
  return context;
}
