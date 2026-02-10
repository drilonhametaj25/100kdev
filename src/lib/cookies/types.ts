export interface CookiePreferences {
  essential: boolean; // always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
};

export const COOKIE_CONSENT_KEY = "100kdev-cookie-consent";
