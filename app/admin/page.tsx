import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { adminRouteMiddleware, AuthProfile } from '../middleware';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  DollarSign,
  UserCheck,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Edit2,
  Check,
  X,
  Lock,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  FileCheck,
  Clock,
  AlertCircle
} from 'lucide-react';

interface AdminPageProps {
  onNavigate?: (path: string) => void;
}

interface PendingDeposit {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  method: string;
  proofFileName?: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface PendingWithdrawal {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  destination: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [currentAdminProfile, setCurrentAdminProfile] = useState<AuthProfile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active admin section
  const [activeTab, setActiveTab] = useState<'users' | 'deposits' | 'withdrawals'>('users');

  // Users data from Supabase 'profiles' table
  const [profiles, setProfiles] = useState<AuthProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Pending items queues
  const [deposits, setDeposits] = useState<PendingDeposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<PendingWithdrawal[]>([]);

  // Inline editing balance state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingBalanceValue, setEditingBalanceValue] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new Event('popstate'));
      if (window.location.pathname !== path && !window.location.hash.includes(path.replace('/', ''))) {
        window.location.hash = '#' + path.replace('/', '');
      }
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    setLoading(true);
    setAuthError(null);

    const result = await adminRouteMiddleware();

    if (!result.authorized) {
      setAuthorized(false);
      setAuthError(result.errorMessage || 'Executive access restricted.');
      setLoading(false);
      return;
    }

    setAuthorized(true);
    setCurrentAdminProfile(result.profile);
    await loadAllData();
    setLoading(false);
  };

  const loadAllData = async () => {
    setRefreshing(true);
    await Promise.all([loadProfiles(), loadQueues()]);
    setRefreshing(false);
  };

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setProfiles(data as AuthProfile[]);
      } else {
        // Fallback default profiles for testing
        const sampleProfiles: AuthProfile[] = [
          {
            id: 'evans-growvest-uuid-001',
            email: 'macreativehub1@gmail.com',
            full_name: 'Evans Vance',
            role: 'user',
            balance: 14500.00,
            total_balance: 39500.00
          },
          {
            id: 'admin-growvest-uuid-001',
            email: 'admin@growvest.com',
            full_name: 'System Administrator',
            role: 'admin',
            balance: 100000.00,
            total_balance: 100000.00
          },
          {
            id: 'usr-client-002',
            email: 'sarah.jenkins@institutional.com',
            full_name: 'Sarah Jenkins',
            role: 'user',
            balance: 28500.00,
            total_balance: 45000.00
          }
        ];
        setProfiles(sampleProfiles);
      }
    } catch (err) {
      console.warn('[AdminPage] Profiles load notice:', err);
    }
  };

  const loadQueues = async () => {
    try {
      // 1. Deposits
      let depList: PendingDeposit[] = [];
      const { data: supaDeps } = await supabase
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (supaDeps && supaDeps.length > 0) {
        depList = supaDeps.map((d) => ({
          id: d.id,
          userId: d.user_id,
          userEmail: d.user_email || 'client@growvest.com',
          userName: d.user_name || 'Growvest Investor',
          amount: Number(d.amount || 0),
          method: d.method || 'Bank Transfer',
          proofFileName: d.proof_url || 'Payment_Proof.png',
          status: d.status || 'pending',
          date: d.created_at || new Date().toISOString()
        }));
      }

      if (typeof window !== 'undefined') {
        const storedDeps = JSON.parse(localStorage.getItem('growvest_pending_deposits') || '[]');
        storedDeps.forEach((sd: PendingDeposit) => {
          if (!depList.some((x) => x.id === sd.id)) {
            depList.unshift(sd);
          }
        });
      }

      // If empty, add a default demo pending deposit
      if (depList.length === 0) {
        depList = [
          {
            id: 'dep_sample_01',
            userId: 'evans-growvest-uuid-001',
            userEmail: 'macreativehub1@gmail.com',
            userName: 'Evans Vance',
            amount: 5000,
            method: 'USDT (TRC20)',
            proofFileName: 'Tx_Proof_83921.png',
            status: 'pending',
            date: new Date(Date.now() - 3600000 * 3).toISOString()
          }
        ];
      }
      setDeposits(depList);

      // 2. Withdrawals
      let withList: PendingWithdrawal[] = [];
      const { data: supaWith } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });

      if (supaWith && supaWith.length > 0) {
        withList = supaWith.map((w) => ({
          id: w.id,
          userId: w.user_id,
          userEmail: w.user_email || 'investor@growvest.com',
          userName: w.user_name || 'Client',
          amount: Number(w.amount || 0),
          destination: w.wallet_address || 'USDT TRC20 Wallet',
          status: w.status || 'pending',
          date: w.created_at || new Date().toISOString()
        }));
      }

      if (typeof window !== 'undefined') {
        const storedWith = JSON.parse(localStorage.getItem('growvest_pending_withdrawals') || '[]');
        storedWith.forEach((sw: PendingWithdrawal) => {
          if (!withList.some((x) => x.id === sw.id)) {
            withList.unshift(sw);
          }
        });
      }

      if (withList.length === 0) {
        withList = [
          {
            id: 'with_sample_01',
            userId: 'evans-growvest-uuid-001',
            userEmail: 'macreativehub1@gmail.com',
            userName: 'Evans Vance',
            amount: 6750.00,
            destination: 'USDT (TRC20): TX9zG...kL83p',
            status: 'pending',
            date: new Date(Date.now() - 3600000 * 5).toISOString()
          }
        ];
      }
      setWithdrawals(withList);
    } catch (qErr) {
      console.warn('[AdminPage] Queue load notice:', qErr);
    }
  };

  const handleToggleRole = async (targetUser: AuthProfile) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', targetUser.id);

      setProfiles((prev) =>
        prev.map((p) => (p.id === targetUser.id ? { ...p, role: newRole } : p))
      );

      setActionSuccess(`Role updated to ${newRole.toUpperCase()} for ${targetUser.email}`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(`Failed to update role: ${err.message}`);
      setTimeout(() => setActionError(null), 4000);
    }
  };

  const handleSaveBalance = async (userId: string) => {
    const num = parseFloat(editingBalanceValue);
    if (isNaN(num) || num < 0) {
      setActionError('Please enter a valid non-negative balance.');
      setTimeout(() => setActionError(null), 3000);
      return;
    }

    try {
      await supabase
        .from('profiles')
        .update({ balance: num, total_balance: num })
        .eq('id', userId);

      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, balance: num, total_balance: num } : p))
      );

      // Also update local storage if current user is edited
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('growvest_auth_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.id === userId) {
              parsed.balanceUsd = num;
              parsed.totalPortfolioUsd = num;
              localStorage.setItem('growvest_auth_user', JSON.stringify(parsed));
            }
          } catch (_e) {}
        }
      }

      setEditingUserId(null);
      setActionSuccess('Portfolio balance successfully updated in Supabase.');
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(`Failed to update balance: ${err.message}`);
      setTimeout(() => setActionError(null), 4000);
    }
  };

  // 1-Click Approve Deposit -> Credits User's Balance
  const handleApproveDeposit = async (dep: PendingDeposit) => {
    try {
      // 1. Mark deposit as approved in Supabase
      try {
        await supabase.from('deposits').update({ status: 'approved' }).eq('id', dep.id);
      } catch (_e) {}

      // 2. Credit the user's balance
      const targetUser = profiles.find((p) => p.id === dep.userId);
      const newBal = (Number(targetUser?.balance) || 0) + dep.amount;
      const newTotal = (Number(targetUser?.total_balance) || 0) + dep.amount;

      try {
        await supabase
          .from('profiles')
          .update({ balance: newBal, total_balance: newTotal })
          .eq('id', dep.userId);
      } catch (_e) {}

      // Update profiles local state
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === dep.userId ? { ...p, balance: newBal, total_balance: newTotal } : p
        )
      );

      // Update deposits state
      setDeposits((prev) =>
        prev.map((d) => (d.id === dep.id ? { ...d, status: 'approved' } : d))
      );

      // Update local storage queues
      if (typeof window !== 'undefined') {
        const key = 'growvest_pending_deposits';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.map((d: any) =>
          d.id === dep.id ? { ...d, status: 'approved' } : d
        );
        localStorage.setItem(key, JSON.stringify(updated));

        // Update user session if matching
        const stored = localStorage.getItem('growvest_auth_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.id === dep.userId) {
              parsed.balanceUsd = newBal;
              parsed.totalPortfolioUsd = newTotal;
              localStorage.setItem('growvest_auth_user', JSON.stringify(parsed));
            }
          } catch (_e) {}
        }
      }

      setActionSuccess(`Deposit of $${dep.amount.toLocaleString()} approved! Credited to user account.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setActionError(`Failed to approve deposit: ${err.message}`);
      setTimeout(() => setActionError(null), 4000);
    }
  };

  const handleRejectDeposit = (depId: string) => {
    setDeposits((prev) =>
      prev.map((d) => (d.id === depId ? { ...d, status: 'rejected' } : d))
    );
    if (typeof window !== 'undefined') {
      const key = 'growvest_pending_deposits';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.map((d: any) =>
        d.id === depId ? { ...d, status: 'rejected' } : d
      );
      localStorage.setItem(key, JSON.stringify(updated));
    }
    setActionSuccess('Deposit rejected and flagged.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // 1-Click Approve Withdrawal (Payout)
  const handleApproveWithdrawal = async (w: PendingWithdrawal) => {
    try {
      try {
        await supabase.from('withdrawals').update({ status: 'approved' }).eq('id', w.id);
      } catch (_e) {}

      setWithdrawals((prev) =>
        prev.map((item) => (item.id === w.id ? { ...item, status: 'approved' } : item))
      );

      if (typeof window !== 'undefined') {
        const key = 'growvest_pending_withdrawals';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.map((item: any) =>
          item.id === w.id ? { ...item, status: 'approved' } : item
        );
        localStorage.setItem(key, JSON.stringify(updated));
      }

      setActionSuccess(`Withdrawal payout of $${w.amount.toLocaleString()} approved and authorized for release.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setActionError(`Failed to approve payout: ${err.message}`);
      setTimeout(() => setActionError(null), 4000);
    }
  };

  const handleRejectWithdrawal = (wId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === wId ? { ...w, status: 'rejected' } : w))
    );
    if (typeof window !== 'undefined') {
      const key = 'growvest_pending_withdrawals';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.map((w: any) =>
        w.id === wId ? { ...w, status: 'rejected' } : w
      );
      localStorage.setItem(key, JSON.stringify(updated));
    }
    setActionSuccess('Withdrawal request rejected.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('growvest_auth_user');
    }
    navigate('/login');
  };

  // FILTERED PROFILES
  const filteredProfiles = profiles.filter((p) => {
    const matchesQuery =
      (p.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' ? true : p.role === roleFilter;

    return matchesQuery && matchesRole;
  });

  // STATS
  const totalBalance = profiles.reduce((acc, p) => acc + (Number(p.balance) || 0), 0);
  const totalAdmins = profiles.filter((p) => p.role === 'admin').length;
  const totalUsers = profiles.filter((p) => p.role === 'user').length;
  const pendingDepositsCount = deposits.filter((d) => d.status === 'pending').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
            Verifying Executive Credentials via Middleware...
          </p>
        </div>
      </div>
    );
  }

  // ACCESS RESTRICTED SCREEN
  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Executive Access Restricted
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {authError || "You must possess an active account with role = 'admin' in the profiles table to access this terminal."}
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-left text-xs font-mono space-y-1">
            <div className="text-slate-500">Middleware Policy Check:</div>
            <div className="text-amber-400 font-semibold">• Required Role: &apos;admin&apos;</div>
            <div className="text-slate-300">• Destination: /app/admin</div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Return to Client Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign in with Administrative Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHORIZED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Admin Navigation */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-tight">Growvest Admin Terminal</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-wide">
                  role: admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Connected as {currentAdminProfile?.email || 'Administrator'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Client Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-400 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Alerts */}
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Total Profiles</span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {profiles.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Users in Supabase DB</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Total Balances</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Combined portfolio holdings</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Deposit Approvals</span>
              <ArrowDownLeft className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {pendingDepositsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Pending admin confirmation</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Payout Requests</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">
              {pendingWithdrawalsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Pending admin payout approval</p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts Directory ({profiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deposits')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'deposits'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit Approvals</span>
            {pendingDepositsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-400 text-slate-950 font-extrabold">
                {pendingDepositsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('withdrawals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdrawal Approvals</span>
            {pendingWithdrawalsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-300 text-slate-950 font-extrabold">
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: User Management Section */}
        {activeTab === 'users' && (
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            {/* Header & Controls */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  User Profiles & Accounts Directory
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct query from Supabase <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">public.profiles</code> table
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search user, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors w-48 sm:w-60"
                  />
                </div>

                <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                  {(['all', 'user', 'admin'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setRoleFilter(role)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer uppercase ${
                        roleFilter === role
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={loadAllData}
                  disabled={refreshing}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
                  title="Reload Profiles from Supabase"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">User / Full Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Balance ($ USD)</th>
                    <th className="py-3.5 px-4">Total Portfolio ($)</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No profiles found matching the current search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProfiles.map((user) => {
                      const isEditing = editingUserId === user.id;
                      const isAdmin = user.role === 'admin';

                      return (
                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="font-semibold text-white">
                              {user.full_name || 'Unnamed Investor'}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              ID: {user.id.substring(0, 10)}...
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                            {user.email}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                isAdmin
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-medium">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editingBalanceValue}
                                  onChange={(e) => setEditingBalanceValue(e.target.value)}
                                  className="w-24 bg-slate-950 border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-white outline-none font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveBalance(user.id)}
                                  className="p-1 bg-emerald-500 text-slate-950 rounded hover:bg-emerald-400 transition-colors"
                                  title="Save Balance"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingUserId(null)}
                                  className="p-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors"
                                  title="Cancel"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400 font-mono">
                                  ${(Number(user.balance) || 0).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingUserId(user.id);
                                    setEditingBalanceValue(String(user.balance || 0));
                                  }}
                                  className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                                  title="Edit balance in Supabase"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-sky-400 font-mono font-medium">
                            ${(Number(user.total_balance || user.balance) || 0).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>

                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleRole(user)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                                isAdmin
                                  ? 'bg-amber-950/40 text-amber-300 border border-amber-800/50 hover:bg-amber-900/50'
                                  : 'bg-purple-950/40 text-purple-300 border border-purple-800/50 hover:bg-purple-900/50'
                              }`}
                            >
                              {isAdmin ? 'Demote to User' : 'Promote to Admin'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Showing {filteredProfiles.length} of {profiles.length} total records</span>
              <span>Real-time Supabase Database synchronization</span>
            </div>
          </section>
        )}

        {/* TAB 2: Deposit Approvals */}
        {activeTab === 'deposits' && (
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Institutional Deposit Approvals
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Confirm receipt of Bank wire or USDT transfer and credit user investment balance.
                </p>
              </div>
              <button
                type="button"
                onClick={loadAllData}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Investor</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Proof of Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {deposits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No deposits currently in queue.
                      </td>
                    </tr>
                  ) : (
                    deposits.map((dep) => (
                      <tr key={dep.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-semibold text-white">{dep.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{dep.userEmail}</div>
                        </td>

                        <td className="py-3.5 px-4 text-emerald-400 font-mono font-bold text-sm">
                          ${dep.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {dep.method}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-mono bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded">
                            <FileCheck className="w-3 h-3" />
                            {dep.proofFileName || 'Receipt.png'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              dep.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : dep.status === 'rejected'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {dep.status === 'pending' ? 'Pending Approval' : dep.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          {dep.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleApproveDeposit(dep)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                              >
                                Approve & Credit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectDeposit(dep.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800/50 text-red-300 text-xs transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: Withdrawal Approvals */}
        {activeTab === 'withdrawals' && (
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Withdrawal & Payout Authorizations
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review and authorize institutional payouts for matured 5-day investment yields.
                </p>
              </div>
              <button
                type="button"
                onClick={loadAllData}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Investor</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Destination Details</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No pending payout requests in queue.
                      </td>
                    </tr>
                  ) : (
                    withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-semibold text-white">{w.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{w.userEmail}</div>
                        </td>

                        <td className="py-3.5 px-4 text-amber-400 font-mono font-bold text-sm">
                          ${w.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] max-w-xs truncate">
                          {w.destination}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              w.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : w.status === 'rejected'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {w.status === 'pending' ? 'Pending Approval' : w.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          {w.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleApproveWithdrawal(w)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                              >
                                Authorize & Payout
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectWithdrawal(w.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800/50 text-red-300 text-xs transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

    </div>
  );
}
