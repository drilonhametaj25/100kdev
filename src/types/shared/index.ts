// SINGLE SOURCE OF TRUTH - Tutti i tipi del sistema 100KDEV

// ============================================
// COUNTER TYPES
// ============================================

export interface CounterState {
  id: string;
  currentPrice: number;
  lastResetAt: string;
  lastPurchasePrice: number | null;
  lastPurchaseAt: string | null;
  incrementPerSecond: number;
  isDropActive: boolean;
  dropPrice: number | null;
  updatedAt: string;
}

export interface CounterHistory {
  id: string;
  eventType: CounterEventType;
  priceAtEvent: number;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export type CounterEventType =
  | "reset"
  | "purchase"
  | "drop_start"
  | "drop_end"
  | "auto_reset";

// ============================================
// PURCHASE TYPES
// ============================================

export interface Purchase {
  id: string;
  priceLocked: number;
  depositAmount: number;
  depositPaid: boolean;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  projectDescription: string;
  status: PurchaseStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseStatus =
  | "pending"
  | "deposit_paid"
  | "accepted"
  | "rejected"
  | "refunded"
  | "completed";

// ============================================
// SOCIAL PROJECT TYPES
// ============================================

export interface SocialProject {
  id: string;
  title: string;
  description: string;
  tiktokUrl: string;
  tiktokEmbedHtml: string | null;
  floorPrice: number;
  capPrice: number;
  metrics: SocialMetrics;
  calculatedPrice: number;
  isActive: boolean;
  status: SocialProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SocialMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export type SocialProjectStatus = "live" | "sold" | "expired";

export const SOCIAL_MULTIPLIERS = {
  views: 1,
  likes: 10,
  comments: 50,
  shares: 100,
  // saves removed - we can't track them via UrLeBird
} as const;

// ============================================
// DROP TYPES
// ============================================

export interface Drop {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  dropPrice: number;
  status: DropStatus;
  notifiedAt: string | null;
  purchasedBy: string | null;
  createdAt: string;
}

export type DropStatus = "scheduled" | "active" | "completed" | "cancelled";

// ============================================
// SUBSCRIBER TYPES
// ============================================

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  confirmationToken: string;
  language: Language;
  createdAt: string;
  unsubscribedAt: string | null;
}

export type Language = "en" | "it";

// ============================================
// GALLERY TYPES
// ============================================

export interface GalleryProject {
  id: string;
  title: string;
  description: string | null;
  pricePaid: number;
  projectUrl: string | null;
  screenshotUrl: string | null;
  purchaseId: string | null;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
}

// ============================================
// COUNTER CONSTANTS
// ============================================

export const COUNTER_CONFIG = {
  startPrice: 1000,
  maxPrice: 100000,
  incrementPerSecond: 0.027778, // $100/ora
  minDeposit: 50,
  depositPercentage: 0.05,
} as const;

// ============================================
// PRICE RANGES (for color coding)
// ============================================

export const PRICE_RANGES = {
  low: { min: 1000, max: 3000, color: "green" },
  medium: { min: 3000, max: 10000, color: "blue" },
  high: { min: 10000, max: 30000, color: "amber" },
  extreme: { min: 30000, max: 100000, color: "red" },
} as const;

export type PriceRange = keyof typeof PRICE_RANGES;

export function getPriceRange(price: number): PriceRange {
  if (price < 3000) return "low";
  if (price < 10000) return "medium";
  if (price < 30000) return "high";
  return "extreme";
}

export function getPriceColor(price: number): string {
  const range = getPriceRange(price);
  return PRICE_RANGES[range].color;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export type ApiResponse<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: { message: string; code: string };
    };

export interface CounterApiResponse {
  price: number;
  lastResetAt: string;
  lastPurchasePrice: number | null;
  lastPurchaseAt: string | null;
  isDropActive: boolean;
  dropPrice: number | null;
  incrementPerSecond: number;
}

export interface CheckoutRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  projectDescription: string;
  lockedPrice: number;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  depositAmount: number;
}

// ============================================
// DATABASE ROW TYPES (snake_case from Supabase)
// ============================================

export interface CounterStateRow {
  id: string;
  current_price: number;
  last_reset_at: string;
  last_purchase_price: number | null;
  last_purchase_at: string | null;
  increment_per_second: number;
  is_drop_active: boolean;
  drop_price: number | null;
  updated_at: string;
}

export interface PurchaseRow {
  id: string;
  price_locked: number;
  deposit_amount: number;
  deposit_paid: boolean;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  project_description: string;
  status: PurchaseStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// TYPE CONVERTERS
// ============================================

export function counterStateFromRow(row: CounterStateRow): CounterState {
  return {
    id: row.id,
    currentPrice: row.current_price,
    lastResetAt: row.last_reset_at,
    lastPurchasePrice: row.last_purchase_price,
    lastPurchaseAt: row.last_purchase_at,
    incrementPerSecond: row.increment_per_second,
    isDropActive: row.is_drop_active,
    dropPrice: row.drop_price,
    updatedAt: row.updated_at,
  };
}

export function purchaseFromRow(row: PurchaseRow): Purchase {
  return {
    id: row.id,
    priceLocked: row.price_locked,
    depositAmount: row.deposit_amount,
    depositPaid: row.deposit_paid,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    projectDescription: row.project_description,
    status: row.status,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
