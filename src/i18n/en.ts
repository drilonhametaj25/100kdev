import type { Translations } from "./types";

export const en: Translations = {
  // Header
  tagline: "The dev who starts at",

  // Price display
  live: "LIVE",
  flashDrop: "FLASH DROP",

  // Stats
  rate: "rate",
  lastSold: "last sold",
  perHour: "/hr",

  // Description
  description:
    "The price goes up every second. When someone buys, it resets to $1,000. You can buy {anything} — no limits, no tiers. Pay 5% deposit to lock your price.",
  anything: "anything",

  // CTA
  lockThisPrice: "Lock This Price",
  depositInfo: "5% deposit • Refundable if I decline the project • We'll discuss on a call",

  // Checkout modal
  lockYourPrice: "Lock Your Price",
  priceLockedAt: "Price locked at",
  currentPrice: "Current price",
  priceGoingUp: "(still going up while you fill the form)",
  yourName: "Your Name",
  email: "Email",
  phoneOptional: "Phone (optional)",
  describeProject: "Describe Your Project",
  projectPlaceholder: "Tell me what you want to build. The more detail, the better...",
  cancel: "Cancel",
  pay: "Pay",
  processing: "Processing...",
  depositDisclaimer:
    "Deposit is refundable only if I decline the project. We'll contact you within 24h.",
  lockedPrice: "Locked Price",
  deposit: "Deposit (5%)",

  // Validation errors
  errorNameMin: "Name must be at least 2 characters",
  errorEmailInvalid: "Please enter a valid email",
  errorProjectMin: "Please describe your project (min 10 characters)",

  // Success page
  successTitle: "Price Locked!",
  successMessage1: "Your deposit has been received. The counter has been reset to $1,000.",
  successMessage2: "I'll contact you within 24 hours to discuss your project and next steps.",
  whatHappensNext: "What happens next:",
  step1: "Check your email for confirmation",
  step2: "I'll review your project description",
  step3: "We'll schedule a call to discuss details",
  step4: "I'll send an invoice for the remaining balance",
  backToHome: "Back to Home",

  // Cancel page
  cancelTitle: "Checkout Cancelled",
  cancelMessage1: "No worries! Your checkout was cancelled and no payment was made.",
  cancelMessage2: "The price keeps going up though. Come back when you're ready!",
  cancelWarning: "Remember: the price never goes down. Lock it before it's too late.",
  tryAgain: "Try Again",

  // Flash drop
  flashDropTitle: "FLASH DROP",
  flashDropDesc:
    "Once a month, the price crashes to $100 for 15 minutes. Secret date & time. Only newsletter subscribers get notified.",
  emailPlaceholder: "your@email.com",
  subscribe: "NOTIFY ME",
  subscribed: "YOU'RE IN",

  // Gallery
  galleryTitle: "Past Projects",
  paidAt: "paid",

  // Social Price
  socialPriceLink: "Or try Social Price Mode →",

  // Footer
  brand: "100KDEV",
};
