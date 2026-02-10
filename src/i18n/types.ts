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
  footerVatNumber: string;
  footerOwner: string;
  footerPrivacy: string;
  footerCookiePolicy: string;
  footerTerms: string;
  footerRefund: string;
  footerFaq: string;
  footerRights: string;
  footerManageCookies: string;

  // Cookie Banner
  cookieBannerTitle: string;
  cookieBannerDescription: string;
  cookieAcceptAll: string;
  cookieRejectAll: string;
  cookieCustomize: string;
  cookieEssential: string;
  cookieEssentialDesc: string;
  cookieAnalytics: string;
  cookieAnalyticsDesc: string;
  cookieMarketing: string;
  cookieMarketingDesc: string;
  cookieSavePreferences: string;

  // Privacy Policy
  privacyTitle: string;
  privacyLastUpdated: string;
  privacyIntroTitle: string;
  privacyIntroText: string;
  privacyDataControllerTitle: string;
  privacyDataControllerText: string;
  privacyDataCollectedTitle: string;
  privacyDataCollectedText: string;
  privacyPurposeTitle: string;
  privacyPurposeText: string;
  privacyLegalBasisTitle: string;
  privacyLegalBasisText: string;
  privacyDataSharingTitle: string;
  privacyDataSharingText: string;
  privacyRetentionTitle: string;
  privacyRetentionText: string;
  privacyRightsTitle: string;
  privacyRightsText: string;
  privacyContactTitle: string;
  privacyContactText: string;

  // Cookie Policy
  cookiePolicyTitle: string;
  cookiePolicyIntro: string;
  cookieWhatAreTitle: string;
  cookieWhatAreText: string;
  cookieTypesTitle: string;
  cookieEssentialTitle: string;
  cookieEssentialText: string;
  cookieAnalyticsTitle: string;
  cookieAnalyticsText: string;
  cookieMarketingTitle: string;
  cookieMarketingText: string;
  cookieManageTitle: string;
  cookieManageText: string;
  cookieUpdatesTitle: string;
  cookieUpdatesText: string;

  // Terms and Conditions
  termsTitle: string;
  termsLastUpdated: string;
  termsIntroTitle: string;
  termsIntroText: string;
  termsServiceTitle: string;
  termsServiceText: string;
  termsPricingTitle: string;
  termsPricingText: string;
  termsDepositTitle: string;
  termsDepositText: string;
  termsFlashDropTitle: string;
  termsFlashDropText: string;
  termsSocialPriceTitle: string;
  termsSocialPriceText: string;
  termsPaymentTitle: string;
  termsPaymentText: string;
  termsProjectTitle: string;
  termsProjectText: string;
  termsIntellectualPropertyTitle: string;
  termsIntellectualPropertyText: string;
  termsLimitationTitle: string;
  termsLimitationText: string;
  termsTerminationTitle: string;
  termsTerminationText: string;
  termsGoverningLawTitle: string;
  termsGoverningLawText: string;
  termsContactTitle: string;
  termsContactText: string;

  // Refund Policy
  refundTitle: string;
  refundLastUpdated: string;
  refundIntroTitle: string;
  refundIntroText: string;
  refundDepositTitle: string;
  refundDepositText: string;
  refundRefundableTitle: string;
  refundRefundableText: string;
  refundNonRefundableTitle: string;
  refundNonRefundableText: string;
  refundProcessTitle: string;
  refundProcessText: string;
  refundTimelineTitle: string;
  refundTimelineText: string;
  refundConsumerRightsTitle: string;
  refundConsumerRightsText: string;
  refundContactTitle: string;
  refundContactText: string;

  // FAQ
  faqTitle: string;
  faqPricingTitle: string;
  faqPricingQ1: string;
  faqPricingA1: string;
  faqPricingQ2: string;
  faqPricingA2: string;
  faqPricingQ3: string;
  faqPricingA3: string;
  faqDepositTitle: string;
  faqDepositQ1: string;
  faqDepositA1: string;
  faqDepositQ2: string;
  faqDepositA2: string;
  faqFlashDropTitle: string;
  faqFlashDropQ1: string;
  faqFlashDropA1: string;
  faqFlashDropQ2: string;
  faqFlashDropA2: string;
  faqSocialPriceTitle: string;
  faqSocialPriceQ1: string;
  faqSocialPriceA1: string;
  faqProcessTitle: string;
  faqProcessQ1: string;
  faqProcessA1: string;
  faqProcessQ2: string;
  faqProcessA2: string;
}

export type TranslationKey = keyof Translations;
