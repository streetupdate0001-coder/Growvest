export type LanguageCode =
  | 'en' // English
  | 'fr' // French
  | 'es' // Spanish
  | 'pt' // Portuguese
  | 'de' // German
  | 'it' // Italian
  | 'nl' // Dutch
  | 'pl' // Polish
  | 'ro' // Romanian
  | 'cs' // Czech
  | 'sk' // Slovak
  | 'hu' // Hungarian
  | 'el' // Greek
  | 'bg' // Bulgarian
  | 'hr' // Croatian
  | 'sr' // Serbian
  | 'uk' // Ukrainian
  | 'ru' // Russian
  | 'tr' // Turkish
  | 'ar' // Arabic (RTL)
  | 'he' // Hebrew (RTL)
  | 'fa' // Persian (RTL)
  | 'ur' // Urdu (RTL)
  | 'hi' // Hindi
  | 'bn' // Bengali
  | 'pa' // Punjabi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'id' // Indonesian
  | 'ms' // Malay
  | 'vi' // Vietnamese
  | 'th' // Thai
  | 'zh' // Chinese Simplified
  | 'zh-TW' // Chinese Traditional
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'sw' // Swahili
  | 'am' // Amharic
  | 'zu' // Zulu
  | 'af'; // Afrikaans

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  popular?: boolean;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'CHF' | 'JPY';

export type UserVerificationStatus = 'unverified' | 'pending' | 'verified' | 'tier2_verified';
export type UserAccountRole = 'user' | 'admin';
export type UserAccountStatus = 'active' | 'suspended' | 'pending';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  country: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  avatarUrl?: string;
  role: UserAccountRole;
  accountStatus: UserAccountStatus;
  verificationStatus: UserVerificationStatus;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorRecoveryCodes?: string[];
  createdAt: string;
  lastLoginAt?: string;
  timezone: string;
  preferredLanguage: LanguageCode;
  preferredCurrency: CurrencyCode;
  marketingConsent: boolean;
  antiPhishingPhrase?: string;
  // Assignment, Classification & Advisory
  assignedAccountManager?: string;
  assignedTier?: string;
  assignedPlanId?: string;
  assignedPlanTitle?: string;
  assignedTrader?: string;
  tradingPermissions?: string[];
  adminNotes?: string;
  balance?: number;
}

export interface UserWallet {
  totalValueUsd: number;
  availableBalanceUsd: number;
  investedBalanceUsd: number;
  pendingBalanceUsd: number;
  pnlPercentage24h?: number;
  lastUpdated: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'yield' | 'bonus' | 'fee' | 'transfer';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'rejected';

export interface Transaction {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  amountUsd: number;
  status: TransactionStatus;
  timestamp: string;
  reference: string;
  destinationOrSource: string;
  method: string;
  feeUsd: number;
  notes?: string;
  metadata?: Record<string, any>;
  proofUrl?: string;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image?: string;
  market_cap_rank?: number;
  high_24h?: number;
  low_24h?: number;
  total_volume?: number;
  market_cap?: number;
  sparkline_in_7d?: {
    price: number[];
  };
  last_updated?: string;
}

export type NotificationType = 'security' | 'account' | 'transaction' | 'verification' | 'market' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  isDemo?: boolean;
  linkTab?: string;
}

export interface InvestmentPlan {
  id: string;
  title: string;
  strategyType: 'conservative' | 'balanced' | 'growth' | 'defi_yield';
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Speculative';
  durationMonths: number;
  minAmountUsd: number;
  maxAmountUsd: number;
  managementFeePercent: number;
  description: string;
  assetComposition: { asset: string; percentage: number }[];
  historicalBenchmark3Yr: string;
  isDemoPlan: boolean;
  terms: string;
  status?: 'active' | 'inactive' | 'paused';
  expectedRoiPercent?: number;
  lockPeriodDays?: number;
  isPopular?: boolean;
}

export interface UserInvestmentPosition {
  id: string;
  userId: string;
  planId: string;
  planTitle: string;
  amountUsd: number;
  startDate: string;
  maturityDate: string;
  status: 'active' | 'pending' | 'matured' | 'cancelled';
  riskLevel: string;
  accruedYieldUsd: number;
  durationMonths: number;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  ipAddress?: string;
  location?: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface LoginHistoryItem {
  id: string;
  timestamp: string;
  ip: string;
  device: string;
  location: string;
  status: 'success' | 'failed' | '2fa_required';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'account' | 'deposit' | 'withdrawal' | 'security' | 'verification' | 'technical';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdated: string;
  messages: {
    id: string;
    sender: 'user' | 'agent' | 'system';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  action: string;
  target: string;
  targetId?: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  result: 'success' | 'warning' | 'error';
}

export interface AdminSystemStats {
  registeredUsers: number;
  verifiedUsers: number;
  pendingVerifications: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  activeInvestments: number;
  totalTransactionsCount: number;
  totalVolumeUsd: number;
  totalDepositsVolumeUsd: number;
}

export type SiteMediaCategory = 'banner' | 'logo' | 'announcement' | 'document' | 'picture' | 'hero';
export type SiteMediaPlacement = 'home_hero' | 'announcement_banner' | 'security_badge' | 'regulatory_doc' | 'market_header' | 'general';

export interface SiteMediaItem {
  id: string;
  title: string;
  category: SiteMediaCategory;
  urlOrDataUrl: string;
  description: string;
  placement: SiteMediaPlacement;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  fileSize?: string;
  linkUrl?: string;
}

export interface KYCSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  documentType: 'passport' | 'national_id' | 'drivers_license' | 'proof_of_address';
  documentNumber: string;
  issuingCountry: string;
  frontDocumentUrl?: string;
  backDocumentUrl?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface CompanyDepositWallet {
  id: string;
  name: string;
  asset: string;
  symbol: string;
  network: string;
  address: string;
  qrCodeUrl?: string;
  minDepositUsd: number;
  processingTime?: string;
  feeDescription?: string;
  instructions?: string;
  isActive: boolean;
  isPopular?: boolean;
}

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TourStep {
  id: string;
  targetSelector: string;
  fallbackSelector?: string;
  title: string;
  badge: string;
  description: string;
  tip?: string;
  placement?: TourPlacement;
  requiredTab?: string;
  actionText?: string;
  actionType?: 'navigate_tab' | 'open_ai' | 'open_deposit' | 'open_currency' | 'open_lang';
  targetTab?: string;
}
