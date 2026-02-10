import {
  CookiePreferences,
  DEFAULT_PREFERENCES,
  COOKIE_CONSENT_KEY,
} from "./types";

export function getStoredConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as CookiePreferences;
  } catch {
    return null;
  }
}

export function saveConsent(preferences: CookiePreferences): void {
  if (typeof window === "undefined") return;

  const withTimestamp = { ...preferences, timestamp: Date.now() };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(withTimestamp));
}

export function hasConsented(): boolean {
  const consent = getStoredConsent();
  return consent !== null && consent.timestamp > 0;
}

export function acceptAllCookies(): CookiePreferences {
  const prefs: CookiePreferences = {
    essential: true,
    analytics: true,
    marketing: true,
    timestamp: Date.now(),
  };
  saveConsent(prefs);
  return prefs;
}

export function rejectAllCookies(): CookiePreferences {
  const prefs: CookiePreferences = {
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
  };
  saveConsent(prefs);
  return prefs;
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
}
