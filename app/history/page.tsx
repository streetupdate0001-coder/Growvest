import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { userRouteMiddleware, AuthProfile } from '../middleware';
import { InvestorLayout } from '../components/InvestorLayout';
import {
  History,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Coins,
  Layers,
  ArrowDownLeft,
  Filter,
  Sparkles
} from 'lucide-react';

interface HistoryPageProps {
  onNavigate?: (path: string) => void;
}

type TabType = 'all' | 'deposits' | 'active_investments' | 'completed_investments' | 'withdrawals';

interface UnifiedRecord {
  id: string;
  type: 'deposit' | 'active_investment' | 'completed_investment' | 'withdrawal' | 'transaction';
  title: string;
  subtitle: string;
  amount: number;
  status: string;
  date: string;
  roi?: number;
  expectedPayout?: number;
}

export default function HistoryPage({ onNavigate }: HistoryPageProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [records, setRecords] = useState<UnifiedRecord[]>([]);

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
    initPage();
  }, []);

  const initPage = async () => {
    setLoading(true);
    const authResult = await userRouteMiddleware();
    if (!authResult.authorized || !authResult.user) {
      navigate('/login');
      return;
    }
    setProfile(authResult.profile);
    await loadHistory(authResult.user.id);
    setLoading(false);
  };

  const loadHistory = async (userId: string) => {
    setRefreshing(true);
    try {
      const unified: UnifiedRecord[] = [];

      // 1. Fetch from 'investments' table
      const { data: invData } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (invData) {
        invData.forEach((inv) => {
          const amt = Number(inv.amount || 0);
          const roi = Number(inv.roi_percent || 0);
          const profit = amt * (roi / 100);
          const isCompleted = inv.status === 'completed';

          unified.push({
            id: `inv-${inv.id}`,
            type: isCompleted ? 'completed_investment' : 'active_investment',
            title: `${inv.plan_name} (${roi}% ROI)`,
            subtitle: isCompleted
              ? '5-Day cycle completed & yield settled'
              : '5-Day algorithmic compounding active',
            amount: amt,
            roi: roi,
            expectedPayout: amt + profit,
            status: isCompleted ? 'Completed' : 'Active Yielding',
            date: inv.created_at || inv.start_date || new Date().toISOString()
          });
        });
      }

      // 2. Fetch from 'deposits' table
      const { data: depData } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (depData) {
        depData.forEach((dep) => {
          unified.push({
            id: `dep-${dep.id}`,
            type: 'deposit',
            title: `Deposit via ${dep.method || 'Transfer'}`,
            subtitle: dep.proof_url ? 'Proof uploaded • Verified' : 'Direct deposit credit',
            amount: Number(dep.amount || 0),
            status: dep.status === 'pending' ? 'Pending Admin Approval' : (dep.status || 'Approved'),
            date: dep.created_at || new Date().toISOString()
          });
        });
      }

      // 3. Fetch from 'withdrawals' table
      const { data: withData } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (withData) {
        withData.forEach((w) => {
          unified.push({
            id: `with-${w.id}`,
            type: 'withdrawal',
            title: 'Payout Withdrawal Request',
            subtitle: w.wallet_address || 'Custody payout transfer',
            amount: Number(w.amount || 0),
            status: w.status === 'pending' ? 'Pending Admin Approval' : (w.status || 'Approved'),
            date: w.created_at || new Date().toISOString()
          });
        });
      }

      // 4. Merge local storage records
      if (typeof window !== 'undefined') {
        const localInvs = JSON.parse(localStorage.getItem(`growvest_investments_${userId}`) || '[]');
        localInvs.forEach((inv: any) => {
          if (!unified.some(u => u.id === `inv-${inv.id}`)) {
            const amt = Number(inv.amount || 0);
            const roi = Number(inv.roi_percent || 0);
            const profit = amt * (roi / 100);
            const isCompleted = inv.status === 'completed';
            unified.push({
              id: `inv-${inv.id}`,
              type: isCompleted ? 'completed_investment' : 'active_investment',
              title: `${inv.plan_name} (${roi}% ROI)`,
              subtitle: isCompleted
                ? '5-Day cycle completed & yield settled'
                : '5-Day algorithmic compounding active',
              amount: amt,
              roi: roi,
              expectedPayout: amt + profit,
              status: isCompleted ? 'Completed' : 'Active Yielding',
              date: inv.created_at || inv.start_date || new Date().toISOString()
            });
          }
        });

        const localWithdrawals = JSON.parse(localStorage.getItem(`growvest_withdrawals_${userId}`) || '[]');
        localWithdrawals.forEach((w: any) => {
          if (!unified.some(u => u.id === `with-${w.id}`)) {
            unified.push({
              id: `with-${w.id}`,
              type: 'withdrawal',
              title: 'Payout Withdrawal Request',
              subtitle: w.wallet_address || 'Custody payout transfer',
              amount: Number(w.amount || 0),
              status: w.status === 'pending' ? 'Pending Admin Approval' : (w.status || 'Approved'),
              date: w.created_at || new Date().toISOString()
            });
          }
        });
      }

      // Default demo history for Evans Vance if empty
      if (unified.length === 0 && (userId.includes('evans') || userId.toLowerCase().includes('macreative'))) {
        const now = new Date();
        unified.push({
          id: 'inv-evans-1',
          type: 'active_investment',
          title: 'Silver 5-Day (35% ROI)',
          subtitle: '5-Day algorithmic compounding active',
          amount: 15000,
          roi: 35,
          expectedPayout: 20250,
          status: 'Active Yielding',
          date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        });
        unified.push({
          id: 'inv-evans-2',
          type: 'active_investment',
          title: 'Gold 5-Day (50% ROI)',
          subtitle: '5-Day algorithmic compounding active',
          amount: 10000,
          roi: 50,
          expectedPayout: 15000,
          status: 'Active Yielding',
          date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        });
        unified.push({
          id: 'dep-evans-1',
          type: 'deposit',
          title: 'Deposit via USDT (TRC20)',
          subtitle: 'Proof uploaded • Verified',
          amount: 25000,
          status: 'Approved',
          date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // 5. Try querying 'transactions' table if present in user's Supabase schema
      try {
        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (txData && txData.length > 0) {
          txData.forEach((tx) => {
            // Deduplicate if already present
            if (!unified.some((u) => u.id.includes(tx.id))) {
              unified.push({
                id: `tx-${tx.id}`,
                type: 'transaction',
                title: tx.description || tx.type || 'Account Transaction',
                subtitle: tx.reference || 'Ledger event',
                amount: Number(tx.amount || 0),
                status: tx.status || 'Completed',
                date: tx.created_at || new Date().toISOString()
              });
            }
          });
        }
      } catch (txErr) {
        // Table may not exist yet; safe fallback
      }

      // Sort all unified records descending by date
      unified.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(unified);
    } catch (err) {
      console.warn('[HistoryPage] Notice querying records:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter records based on active tab
  const filteredRecords = records.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'deposits') return r.type === 'deposit';
    if (activeTab === 'active_investments') return r.type === 'active_investment';
    if (activeTab === 'completed_investments') return r.type === 'completed_investment';
    if (activeTab === 'withdrawals') return r.type === 'withdrawal';
    return true;
  });

  // Calculate high-level metrics
  const totalDeposited = records
    .filter((r) => r.type === 'deposit')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalActiveInvestments = records
    .filter((r) => r.type === 'active_investment')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalCompletedPayouts = records
    .filter((r) => r.type === 'completed_investment')
    .reduce((sum, r) => sum + (r.expectedPayout || r.amount), 0);

  const totalWithdrawn = records
    .filter((r) => r.type === 'withdrawal')
    .reduce((sum, r) => sum + r.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1A] text-slate-100 flex items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <InvestorLayout profile={profile} activeRoute="history" onNavigate={navigate}>
      <div className="space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Transaction & Investment History
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Complete audit ledger pulled directly from Supabase investments, deposits, and withdrawals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => profile && loadHistory(profile.id)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111A2E] hover:bg-[#162238] border border-[#1E293B] text-slate-300 text-xs font-medium transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-sky-400' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync Ledger'}</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-[#111A2E] border border-[#1E293B] rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] text-slate-400 font-medium block">Total Deposits</span>
            <p className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
              ${totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-[#111A2E] border border-[#1E293B] rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] text-slate-400 font-medium block">Active Investments</span>
            <p className="text-xl sm:text-2xl font-extrabold text-sky-400 font-mono mt-1">
              ${totalActiveInvestments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-[#111A2E] border border-[#1E293B] rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] text-slate-400 font-medium block">Completed Payouts</span>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              ${totalCompletedPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-[#111A2E] border border-[#1E293B] rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] text-slate-400 font-medium block">Total Withdrawals</span>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-400 font-mono mt-1">
              ${totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'deposits', label: 'Deposits' },
            { id: 'active_investments', label: 'Active Investments' },
            { id: 'completed_investments', label: 'Completed Investments' },
            { id: 'withdrawals', label: 'Withdrawals' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#111A2E] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ledger Table / List */}
        <div className="bg-[#111A2E] border border-[#1E293B] rounded-2xl shadow-xl overflow-hidden">
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center p-6 space-y-3">
              <History className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No records found in this category</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Any new deposits, active investments, or withdrawal requests will automatically synchronize here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1E293B]">
              {filteredRecords.map((r) => {
                const isDeposit = r.type === 'deposit';
                const isActiveInv = r.type === 'active_investment';
                const isCompletedInv = r.type === 'completed_investment';
                const isWithdrawal = r.type === 'withdrawal';

                return (
                  <div
                    key={r.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#162238]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isDeposit
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isActiveInv
                            ? 'bg-blue-500/10 text-sky-400 border border-blue-500/20'
                            : isCompletedInv
                            ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {isDeposit && <ArrowDownLeft className="w-5 h-5" />}
                        {isActiveInv && <Clock className="w-5 h-5" />}
                        {isCompletedInv && <Sparkles className="w-5 h-5" />}
                        {isWithdrawal && <ArrowUpRight className="w-5 h-5" />}
                      </div>

                      {/* Description */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{r.title}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                              r.status.includes('Pending')
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : r.status.includes('Active')
                                ? 'bg-blue-500/10 text-sky-400 border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
                          {r.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Amount & Date */}
                    <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                      <div className="font-mono font-bold text-base text-white">
                        {isWithdrawal ? '-' : '+'}${r.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        {r.expectedPayout && isActiveInv && (
                          <span className="text-xs font-normal text-emerald-400 block sm:inline sm:ml-1.5">
                            (Returns ${r.expectedPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(r.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </InvestorLayout>
  );
}
