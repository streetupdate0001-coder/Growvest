import { supabase } from '../lib/supabase';

/**
 * GROWVEST Persistent Storage & Database Manager
 * Handles local and browser database persistence for all user transactions,
 * portfolio models, deposits, withdrawals, KYC submissions, and client reviews.
 * Also synchronizes records seamlessly with Supabase backend tables.
 */

export interface DbUserRecord {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
  kycStatus: 'unverified' | 'pending' | 'verified';
  createdAt: string;
  balance: number;
  currency: string;
}

export interface DbTransactionRecord {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'yield';
  asset: string;
  amount: number;
  amountUsd: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  txHash?: string;
  proofImageUrl?: string;
}

export interface DbReviewRecord {
  id: string;
  author: string;
  location: string;
  role: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  category: 'all' | 'withdrawals' | 'yield' | 'security' | 'support';
  helpfulCount: number;
}

const DB_KEYS = {
  USERS: 'greeneza_db_users',
  TRANSACTIONS: 'greeneza_db_transactions',
  REVIEWS: 'greeneza_client_reviews',
  KYC: 'greeneza_db_kyc',
  AUDIT_LOGS: 'greeneza_db_audit_logs',
  SETTINGS: 'greeneza_db_settings'
} as const;

export class GrowvestDatabase {
  private static safeGet<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[GrowvestDB] Error reading key ${key}:`, e);
      return defaultValue;
    }
  }

  private static safeSet<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[GrowvestDB] Error writing key ${key}:`, e);
      return false;
    }
  }

  // Transactions
  static getTransactions(): DbTransactionRecord[] {
    return this.safeGet<DbTransactionRecord[]>(DB_KEYS.TRANSACTIONS, []);
  }

  static saveTransaction(tx: DbTransactionRecord): boolean {
    const list = this.getTransactions();
    const existingIndex = list.findIndex(item => item.id === tx.id);
    if (existingIndex >= 0) {
      list[existingIndex] = tx;
    } else {
      list.unshift(tx);
    }
    const saved = this.safeSet(DB_KEYS.TRANSACTIONS, list);

    // Asynchronously replicate to Supabase for cloud persistence
    if (tx.userId && tx.userId !== 'usr_guest') {
      (async () => {
        try {
          if (tx.type === 'deposit') {
            await supabase.from('deposits').upsert({
              id: tx.id.length > 30 ? tx.id : undefined,
              user_id: tx.userId,
              amount: tx.amountUsd || tx.amount,
              method: tx.asset,
              status: tx.status === 'completed' ? 'approved' : tx.status === 'failed' ? 'rejected' : 'pending',
              proof_url: tx.proofImageUrl || ''
            });
          } else if (tx.type === 'withdrawal') {
            await supabase.from('withdrawals').upsert({
              id: tx.id.length > 30 ? tx.id : undefined,
              user_id: tx.userId,
              amount: tx.amountUsd || tx.amount,
              wallet_address: tx.txHash || 'Standard Withdrawal Address',
              status: tx.status === 'completed' ? 'approved' : tx.status === 'failed' ? 'rejected' : 'pending'
            });
          }
        } catch (_e) {
          // Fallback gracefully
        }
      })();
    }

    return saved;
  }

  // Reviews
  static getReviews(): DbReviewRecord[] {
    return this.safeGet<DbReviewRecord[]>(DB_KEYS.REVIEWS, []);
  }

  static saveReview(review: DbReviewRecord): boolean {
    const list = this.getReviews();
    const existingIndex = list.findIndex(item => item.id === review.id);
    if (existingIndex >= 0) {
      list[existingIndex] = review;
    } else {
      list.unshift(review);
    }
    return this.safeSet(DB_KEYS.REVIEWS, list);
  }

  // Audit Logs
  static logEvent(action: string, details: Record<string, any> = {}): void {
    const logs = this.safeGet<any[]>(DB_KEYS.AUDIT_LOGS, []);
    logs.unshift({
      id: `log_${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString()
    });
    // Keep last 100 logs
    this.safeSet(DB_KEYS.AUDIT_LOGS, logs.slice(0, 100));
  }

  // Export full DB backup JSON
  static exportDatabaseDump(): string {
    const dump = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      transactions: this.getTransactions(),
      reviews: this.getReviews(),
      auditLogs: this.safeGet(DB_KEYS.AUDIT_LOGS, [])
    };
    return JSON.stringify(dump, null, 2);
  }
}
