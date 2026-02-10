export type Language = "en" | "it";

export interface Translations {
  // Header
  tagline: string;

  // Price display
  live: string;
  flashDrop: string;

  // Stats
  rate: string;
  lastSold: string;
  perHour: string;

  // Description
  description: string;
  anything: string;

  // CTA
  lockThisPrice: string;
  depositInfo: string;

  // Checkout modal
  lockYourPrice: string;
  priceLockedAt: string;
  currentPrice: string;
  priceGoingUp: string;
  yourName: string;
  email: string;
  phoneOptional: string;
  describeProject: string;
  projectPlaceholder: string;
  cancel: string;
  pay: string;
  processing: string;
  depositDisclaimer: string;
  lockedPrice: string;
  deposit: string;

  // Validation errors
  errorNameMin: string;
  errorEmailInvalid: string;
  errorProjectMin: string;

  // Success page
  successTitle: string;
  successMessage1: string;
  successMessage2: string;
  whatHappensNext: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  backToHome: string;

  // Cancel page
  cancelTitle: string;
  cancelMessage1: string;
  cancelMessage2: string;
  cancelWarning: string;
  tryAgain: string;

  // Flash drop
  flashDropTitle: string;
  flashDropDesc: string;
  emailPlaceholder: string;
  subscribe: string;
  subscribed: string;

  // Gallery
  galleryTitle: string;
  paidAt: string;

  // Social Price
  socialPriceLink: string;

  // Footer
  brand: string;
}

export type TranslationKey = keyof Translations;
