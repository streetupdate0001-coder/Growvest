import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface DbProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  created_at: string;
}

export interface DbDeposit {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  proof_url?: string;
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export interface DbWithdrawal {
  id: string;
  user_id: string;
  amount: number;
  wallet_address: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export interface DbInvestment {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  roi_percent: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed';
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

class SupabaseService {
  // --------------------------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------------------------

  async signUp(email: string, password: string, fullName: string = ''): Promise<{ user: SupabaseUser | null; session: Session | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName
          }
        }
      });

      if (error) throw error;

      // Automatically create or verify row in 'profiles' table with same ID
      if (data.user) {
        await this.ensureProfile(data.user.id, data.user.email || email, fullName);
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      console.error('[Supabase] SignUp Error:', err);
      return { user: null, session: null, error: err };
    }
  }

  async signInWithPassword(email: string, password: string): Promise<{ user: SupabaseUser | null; session: Session | null; profile: DbProfile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      let profile: DbProfile | null = null;
      if (data.user) {
        profile = await this.ensureProfile(data.user.id, data.user.email || email, data.user.user_metadata?.full_name || '');
      }

      return { user: data.user, session: data.session, profile, error: null };
    } catch (err: any) {
      console.error('[Supabase] SignIn Error:', err);
      return { user: null, session: null, profile: null, error: err };
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('[Supabase] SignOut Error:', err);
      return { error: err };
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch (err) {
      console.error('[Supabase] GetCurrentSession Error:', err);
      return null;
    }
  }

  async getCurrentUser(): Promise<SupabaseUser | null> {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch (err) {
      console.error('[Supabase] GetCurrentUser Error:', err);
      return null;
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  // --------------------------------------------------------------------------
  // PROFILES
  // --------------------------------------------------------------------------

  async ensureProfile(userId: string, email: string, fullName: string = ''): Promise<DbProfile | null> {
    try {
      // 1. Check if profile already exists
      const { data: existing, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (existing) {
        return {
          ...existing,
          balance: Number(existing.balance || 0)
        };
      }

      // 2. Insert new profile
      const isAdminEmail = email.toLowerCase() === 'admin@growvest.com';
      const newProfile = {
        id: userId,
        email,
        full_name: fullName || email.split('@')[0],
        role: isAdminEmail ? 'admin' : 'user',
        balance: 0.00
      };

      const { data: inserted, error: insertErr } = await supabase
        .from('profiles')
        .upsert(newProfile)
        .select()
        .single();

      if (insertErr) {
        console.warn('[Supabase] Profile upsert warning:', insertErr.message);
        return {
          ...newProfile,
          created_at: new Date().toISOString()
        } as DbProfile;
      }

      return {
        ...inserted,
        balance: Number(inserted.balance || 0)
      };
    } catch (err) {
      console.error('[Supabase] ensureProfile Exception:', err);
      return null;
    }
  }

  async getProfile(userId: string): Promise<DbProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return {
        ...data,
        balance: Number(data.balance || 0)
      };
    } catch (err: any) {
      console.error('[Supabase] getProfile Error:', err);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<DbProfile>): Promise<{ success: boolean; data?: DbProfile; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return {
        success: true,
        data: {
          ...data,
          balance: Number(data.balance || 0)
        }
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  }

  async getAllProfiles(): Promise<DbProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(p => ({
        ...p,
        balance: Number(p.balance || 0)
      }));
    } catch (err: any) {
      console.error('[Supabase] getAllProfiles Error:', err);
      return [];
    }
  }

  // --------------------------------------------------------------------------
  // DEPOSITS
  // --------------------------------------------------------------------------

  async getUserDeposits(userId: string): Promise<DbDeposit[]> {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(d => ({ ...d, amount: Number(d.amount) }));
    } catch (err: any) {
      console.error('[Supabase] getUserDeposits Error:', err);
      return [];
    }
  }

  async getAllDeposits(): Promise<DbDeposit[]> {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(d => ({ ...d, amount: Number(d.amount) }));
    } catch (err: any) {
      console.error('[Supabase] getAllDeposits Error:', err);
      return [];
    }
  }

  async createDeposit(userId: string, amount: number, method: string, proofUrl: string = ''): Promise<{ success: boolean; data?: DbDeposit; error?: string }> {
    try {
      if (amount <= 0) {
        return { success: false, error: 'Deposit amount must be greater than zero.' };
      }

      const { data, error } = await supabase
        .from('deposits')
        .insert({
          user_id: userId,
          amount,
          method,
          status: 'pending',
          proof_url: proofUrl || ''
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: { ...data, amount: Number(data.amount) } };
    } catch (err: any) {
      console.error('[Supabase] createDeposit Error:', err);
      return { success: false, error: err.message || 'Failed to submit deposit request.' };
    }
  }

  async approveDeposit(depositId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Try atomic RPC function first
      const { data: rpcData, error: rpcError } = await supabase.rpc('approve_deposit', {
        deposit_id: depositId
      });

      if (!rpcError && rpcData?.success) {
        return { success: true };
      }

      // 2. Fallback if RPC is not yet created in Supabase SQL Editor
      console.warn('[Supabase] approve_deposit RPC fallback trigger:', rpcError?.message);

      const { data: deposit, error: fetchErr } = await supabase
        .from('deposits')
        .select('*')
        .eq('id', depositId)
        .single();

      if (fetchErr || !deposit) throw fetchErr || new Error('Deposit not found');
      if (deposit.status !== 'pending') throw new Error(`Deposit already processed (${deposit.status})`);

      // Update deposit status
      const { error: updateDepositErr } = await supabase
        .from('deposits')
        .update({ status: 'approved' })
        .eq('id', depositId);

      if (updateDepositErr) throw updateDepositErr;

      // Increment profile balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', deposit.user_id)
        .single();

      const currentBal = Number(profile?.balance || 0);
      const newBal = currentBal + Number(deposit.amount);

      await supabase
        .from('profiles')
        .update({ balance: newBal })
        .eq('id', deposit.user_id);

      return { success: true };
    } catch (err: any) {
      console.error('[Supabase] approveDeposit Error:', err);
      return { success: false, error: err.message || 'Failed to approve deposit.' };
    }
  }

  async rejectDeposit(depositId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('reject_deposit', {
        deposit_id: depositId
      });

      if (!rpcError && rpcData?.success) {
        return { success: true };
      }

      // Fallback
      const { error } = await supabase
        .from('deposits')
        .update({ status: 'rejected' })
        .eq('id', depositId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('[Supabase] rejectDeposit Error:', err);
      return { success: false, error: err.message || 'Failed to reject deposit.' };
    }
  }

  // --------------------------------------------------------------------------
  // WITHDRAWALS
  // --------------------------------------------------------------------------

  async getUserWithdrawals(userId: string): Promise<DbWithdrawal[]> {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(w => ({ ...w, amount: Number(w.amount) }));
    } catch (err: any) {
      console.error('[Supabase] getUserWithdrawals Error:', err);
      return [];
    }
  }

  async getAllWithdrawals(): Promise<DbWithdrawal[]> {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(w => ({ ...w, amount: Number(w.amount) }));
    } catch (err: any) {
      console.error('[Supabase] getAllWithdrawals Error:', err);
      return [];
    }
  }

  async createWithdrawal(userId: string, amount: number, walletAddress: string): Promise<{ success: boolean; data?: DbWithdrawal; error?: string }> {
    try {
      if (amount <= 0) {
        return { success: false, error: 'Withdrawal amount must be greater than zero.' };
      }
      if (!walletAddress.trim()) {
        return { success: false, error: 'Recipient wallet address is required.' };
      }

      // Verify user has sufficient balance before submitting
      const profile = await this.getProfile(userId);
      if (!profile || profile.balance < amount) {
        return { success: false, error: `Insufficient balance. Your available balance is $${profile?.balance.toFixed(2) || '0.00'}` };
      }

      const { data, error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: userId,
          amount,
          wallet_address: walletAddress.trim(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: { ...data, amount: Number(data.amount) } };
    } catch (err: any) {
      console.error('[Supabase] createWithdrawal Error:', err);
      return { success: false, error: err.message || 'Failed to submit withdrawal request.' };
    }
  }

  async approveWithdrawal(withdrawalId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Try atomic RPC function first
      const { data: rpcData, error: rpcError } = await supabase.rpc('approve_withdrawal', {
        withdrawal_id: withdrawalId
      });

      if (!rpcError && rpcData?.success) {
        return { success: true };
      }

      // 2. Fallback
      console.warn('[Supabase] approve_withdrawal RPC fallback trigger:', rpcError?.message);

      const { data: withdrawal, error: fetchErr } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('id', withdrawalId)
        .single();

      if (fetchErr || !withdrawal) throw fetchErr || new Error('Withdrawal not found');
      if (withdrawal.status !== 'pending') throw new Error(`Withdrawal already processed (${withdrawal.status})`);

      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', withdrawal.user_id)
        .single();

      const currentBal = Number(profile?.balance || 0);
      const reqAmount = Number(withdrawal.amount);

      if (currentBal < reqAmount) {
        throw new Error(`Insufficient user balance ($${currentBal.toFixed(2)}) for withdrawal ($${reqAmount.toFixed(2)})`);
      }

      // Update withdrawal status
      const { error: updateWithdrawalErr } = await supabase
        .from('withdrawals')
        .update({ status: 'approved' })
        .eq('id', withdrawalId);

      if (updateWithdrawalErr) throw updateWithdrawalErr;

      // Decrement profile balance
      await supabase
        .from('profiles')
        .update({ balance: currentBal - reqAmount })
        .eq('id', withdrawal.user_id);

      return { success: true };
    } catch (err: any) {
      console.error('[Supabase] approveWithdrawal Error:', err);
      return { success: false, error: err.message || 'Failed to approve withdrawal.' };
    }
  }

  async rejectWithdrawal(withdrawalId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('reject_withdrawal', {
        withdrawal_id: withdrawalId
      });

      if (!rpcError && rpcData?.success) {
        return { success: true };
      }

      const { error } = await supabase
        .from('withdrawals')
        .update({ status: 'rejected' })
        .eq('id', withdrawalId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('[Supabase] rejectWithdrawal Error:', err);
      return { success: false, error: err.message || 'Failed to reject withdrawal.' };
    }
  }

  // --------------------------------------------------------------------------
  // INVESTMENTS
  // --------------------------------------------------------------------------

  async getUserInvestments(userId: string): Promise<DbInvestment[]> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(i => ({
        ...i,
        amount: Number(i.amount),
        roi_percent: Number(i.roi_percent)
      }));
    } catch (err: any) {
      console.error('[Supabase] getUserInvestments Error:', err);
      return [];
    }
  }

  async getAllInvestments(): Promise<DbInvestment[]> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(i => ({
        ...i,
        amount: Number(i.amount),
        roi_percent: Number(i.roi_percent)
      }));
    } catch (err: any) {
      console.error('[Supabase] getAllInvestments Error:', err);
      return [];
    }
  }

  async createInvestment(
    userId: string,
    planName: string,
    amount: number,
    roiPercent: number,
    durationDays: number
  ): Promise<{ success: boolean; data?: DbInvestment; error?: string }> {
    try {
      if (amount <= 0) {
        return { success: false, error: 'Investment amount must be greater than zero.' };
      }

      const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      // 1. Try atomic RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('create_investment', {
        p_plan_name: planName,
        p_amount: amount,
        p_roi_percent: roiPercent,
        p_end_date: endDate
      });

      if (!rpcError && rpcData?.success) {
        return {
          success: true,
          data: {
            id: rpcData.investment_id,
            user_id: userId,
            plan_name: planName,
            amount,
            roi_percent: roiPercent,
            start_date: new Date().toISOString(),
            end_date: endDate,
            status: 'active',
            created_at: new Date().toISOString()
          }
        };
      }

      // 2. Fallback if RPC not loaded
      console.warn('[Supabase] create_investment RPC fallback trigger:', rpcError?.message);

      const profile = await this.getProfile(userId);
      if (!profile || profile.balance < amount) {
        return { success: false, error: `Insufficient balance. Available: $${profile?.balance.toFixed(2) || '0.00'}, Required: $${amount.toFixed(2)}` };
      }

      // Deduct balance
      await supabase
        .from('profiles')
        .update({ balance: profile.balance - amount })
        .eq('id', userId);

      // Insert investment
      const { data, error } = await supabase
        .from('investments')
        .insert({
          user_id: userId,
          plan_name: planName,
          amount,
          roi_percent: roiPercent,
          start_date: new Date().toISOString(),
          end_date: endDate,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: { ...data, amount: Number(data.amount), roi_percent: Number(data.roi_percent) } };
    } catch (err: any) {
      console.error('[Supabase] createInvestment Error:', err);
      return { success: false, error: err.message || 'Failed to allocate investment.' };
    }
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;
