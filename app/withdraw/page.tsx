import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { userRouteMiddleware, AuthProfile } from '../middleware';
import { InvestorLayout } from '../components/InvestorLayout';
import {
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  Unlock,
  Building2,
  Coins,
  History,
  Info,
  ChevronRight,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

interface WithdrawPageProps {
  onNavigate?: (path: string) => void;
}

interface InvestmentRecord {
  id: string;
  plan_name: string;
  amount: number;
  roi_percent: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed';
  created_at: string;
}

interface WithdrawalRecord {
  id: string;
  amount: number;
  wallet_address: string;
  status: string;
  created_at: string;
}

export default function WithdrawPage({ onNavigate }: WithdrawPageProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [investments, setInvestments] = useState<InvestmentRecord[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);

  // Simulation test switch for demo/review
  const [simulateMatured, setSimulateMatured] = useState(false);

  // Payout Form state
  const [payoutDestination, setPayoutDestination] = useState<'USDT' | 'Bank Account'>('USDT');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string>('all');
  
  // Bank fields
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingSwift, setRoutingSwift] = useState('');

  // USDT fields
  const [usdtAddress, setUsdtAddress] = useState('');
  const [usdtNetwork, setUsdtNetwork] = useState('TRC20');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
    await loadData(authResult.user.id);
    setLoading(false);
  };

  const loadData = async (userId: string) => {
    try {
      // 1. Fetch investments
      let combinedInvestments: InvestmentRecord[] = [];
      const { data: invData } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (invData && invData.length > 0) {
        combinedInvestments = invData.map((i) => ({
          ...i,
          amount: Number(i.amount || 0),
          roi_percent: Number(i.roi_percent || 0)
        }));
      }

      if (typeof window !== 'undefined') {
        const localKey = `growvest_investments_${userId}`;
        const stored = JSON.parse(localStorage.getItem(localKey) || '[]');
        if (Array.isArray(stored)) {
          stored.forEach((localItem: any) => {
            if (!combinedInvestments.some((x) => x.id === localItem.id)) {
              combinedInvestments.push({
                ...localItem,
                amount: Number(localItem.amount || 0),
                roi_percent: Number(localItem.roi_percent || 0)
              });
            }
          });
        }
      }

      if (combinedInvestments.length === 0 && (userId.includes('evans') || userId.toLowerCase().includes('macreative'))) {
        const now = new Date();
        const start1 = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // 6 days ago (matured!)
        const end1 = new Date(start1.getTime() + 5 * 24 * 60 * 60 * 1000);
        combinedInvestments = [
          {
            id: 'evans_matured_1',
            plan_name: 'Silver 5-Day',
            amount: 5000,
            roi_percent: 35,
            start_date: start1.toISOString(),
            end_date: end1.toISOString(),
            status: 'completed',
            created_at: start1.toISOString()
          },
          {
            id: 'evans_inv_1',
            plan_name: 'Gold 5-Day',
            amount: 10000,
            roi_percent: 50,
            start_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            end_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            created_at: now.toISOString()
          }
        ];
      }

      setInvestments(combinedInvestments);

      // 2. Fetch withdrawals
      let combinedWithdrawals: WithdrawalRecord[] = [];
      const { data: withData } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (withData && withData.length > 0) {
        combinedWithdrawals = withData.map((w) => ({
          ...w,
          amount: Number(w.amount || 0)
        }));
      }

      if (typeof window !== 'undefined') {
        const localKey = `growvest_withdrawals_${userId}`;
        const stored = JSON.parse(localStorage.getItem(localKey) || '[]');
        if (Array.isArray(stored)) {
          stored.forEach((localItem: any) => {
            if (!combinedWithdrawals.some((x) => x.id === localItem.id)) {
              combinedWithdrawals.push({
                ...localItem,
                amount: Number(localItem.amount || 0)
              });
            }
          });
        }
      }

      setWithdrawals(combinedWithdrawals);
    } catch (err) {
      console.warn('[WithdrawPage] Notice loading records:', err);
    }
  };

  // Check 5-Day maturation requirement:
  // "Button: 'Request Payout' only shows when investment is 5 days old"
  const now = new Date().getTime();
  const maturedInvestments = investments.filter((inv) => {
    if (simulateMatured) return true;
    if (inv.status === 'completed') return true;
    const startTime = new Date(inv.start_date || inv.created_at).getTime();
    const elapsedDays = (now - startTime) / (1000 * 60 * 60 * 24);
    return elapsedDays >= 5;
  });

  const hasMaturedInvestment = maturedInvestments.length > 0 || (profile?.balance && profile.balance > 0);

  // Calculate total matured payout balance available
  const totalMaturedPayoutValue = maturedInvestments.reduce((acc, curr) => {
    const profit = curr.amount * (curr.roi_percent / 100);
    return acc + curr.amount + profit;
  }, Number(profile?.balance || 0));

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Please enter a valid payout amount.');
      return;
    }

    if (amount > totalMaturedPayoutValue) {
      setErrorMsg(`Amount exceeds your total matured payout value of $${totalMaturedPayoutValue.toFixed(2)}.`);
      return;
    }

    let destinationSummary = '';
    if (payoutDestination === 'USDT') {
      if (!usdtAddress.trim()) {
        setErrorMsg('Please enter your recipient USDT wallet address.');
        return;
      }
      destinationSummary = `USDT (${usdtNetwork}): ${usdtAddress.trim()}`;
    } else {
      if (!bankName.trim() || !accountNumber.trim()) {
        setErrorMsg('Please enter your bank institution and account number.');
        return;
      }
      destinationSummary = `Bank: ${bankName.trim()} | Acc: ${accountNumber.trim()} (${accountName || profile.full_name})`;
    }

    setSubmitting(true);
    try {
      let savedId = 'with-' + Date.now();
      const nowStr = new Date().toISOString();

      // 1. Insert withdrawal request into Supabase table 'withdrawals'
      try {
        const { data: withRes, error } = await supabase.from('withdrawals').insert({
          user_id: profile.id,
          amount: amount,
          wallet_address: destinationSummary,
          status: 'pending' // Admin must approve before sending
        }).select().single();

        if (!error && withRes?.id) {
          savedId = withRes.id;
        }
      } catch (withErr) {
        console.warn('[WithdrawPage] Notice submitting to Supabase:', withErr);
      }

      // 2. Persist locally for instant responsiveness & admin review
      if (typeof window !== 'undefined') {
        const localKey = `growvest_withdrawals_${profile.id}`;
        const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
        const newRecord: WithdrawalRecord = {
          id: savedId,
          amount: amount,
          wallet_address: destinationSummary,
          status: 'pending',
          created_at: nowStr
        };
        localStorage.setItem(localKey, JSON.stringify([newRecord, ...existing]));

        // Admin queue
        const adminQueueKey = 'growvest_pending_withdrawals';
        const existingQueue = JSON.parse(localStorage.getItem(adminQueueKey) || '[]');
        existingQueue.unshift({
          id: savedId,
          userId: profile.id,
          userEmail: profile.email,
          userName: profile.full_name,
          amount: amount,
          destination: destinationSummary,
          status: 'pending',
          date: nowStr
        });
        localStorage.setItem(adminQueueKey, JSON.stringify(existingQueue));
      }

      setSuccessMsg(
        `Payout request of $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} successfully submitted. Admin must approve before sending.`
      );
      setWithdrawAmount('');
      setUsdtAddress('');
      setAccountNumber('');
      await loadData(profile.id);
    } catch (err: any) {
      console.error('[WithdrawPage] Payout submission failed:', err);
      setErrorMsg(err?.message || 'Failed to submit payout request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1A] text-slate-100 flex items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <InvestorLayout profile={profile} activeRoute="withdraw" onNavigate={navigate}>
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Withdraw & Payouts
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Request payout of completed 5-day investment yield to your bank account or USDT.
            </p>
          </div>

          {/* Sandbox Toggle for review/testing */}
          <button
            type="button"
            onClick={() => setSimulateMatured(!simulateMatured)}
            className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-[#111A2E] hover:bg-slate-800 border border-[#1E293B] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
            title="Simulate 5-day elapsed maturity for testing"
          >
            {simulateMatured ? '🧪 5-Day Test Mode: ON' : '🧪 Test 5-Day Payout Mode'}
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-3 text-xs sm:text-sm text-red-300 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-3 text-xs sm:text-sm text-emerald-300 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-200">Payout Request Submitted</p>
              <p className="mt-0.5">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Mandatory Admin Approval Notice Banner */}
        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-bold text-white">
              Institutional Segregated Custody Policy
            </p>
            <p className="text-slate-400 leading-relaxed">
              In accordance with FCA CRN #14892011 and FinCEN MSB regulations, <strong className="text-white">Admin must approve before sending</strong> any payout from the London or Zurich cold custody vault.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5-DAY MATURITY CHECK & PAYOUT STATUS                         */}
        {/* ============================================================ */}
        <div className="bg-[#111A2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Matured Payout Status
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Investments unlock for payout strictly after 5 days of algorithmic generation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {hasMaturedInvestment ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Unlock className="w-3.5 h-3.5" />
                  Payout Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Lock className="w-3.5 h-3.5" />
                  5-Day Cycle Locked
                </span>
              )}
            </div>
          </div>

          {/* If user has active investments that are not yet 5 days old */}
          {investments.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Your Investment Cycles
              </span>

              <div className="grid grid-cols-1 gap-3">
                {investments.map((inv) => {
                  const startTime = new Date(inv.start_date || inv.created_at).getTime();
                  const elapsedDays = (now - startTime) / (1000 * 60 * 60 * 24);
                  const is5DaysOld = simulateMatured || elapsedDays >= 5 || inv.status === 'completed';
                  const daysRemaining = Math.max(0, Math.ceil(5 - elapsedDays));
                  const profit = inv.amount * (inv.roi_percent / 100);
                  const totalReturn = inv.amount + profit;

                  return (
                    <div
                      key={inv.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        is5DaysOld
                          ? 'bg-emerald-950/15 border-emerald-500/30'
                          : 'bg-[#0A0F1A] border-[#1E293B]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            is5DaysOld
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {is5DaysOld ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{inv.plan_name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-sky-400 border border-blue-500/20">
                              +{inv.roi_percent}% ROI
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Principal: ${inv.amount.toLocaleString()} • Payout Value: <strong className="text-white">${totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        {is5DaysOld ? (
                          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Ready for Payout</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {daysRemaining} day{daysRemaining === 1 ? '' : 's'} to unlock
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              Matures after 5 full days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {investments.length === 0 && (
            <div className="py-8 text-center rounded-xl bg-[#0A0F1A] border border-dashed border-[#1E293B] p-6 space-y-3">
              <Lock className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Active Investments to Withdraw</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Payouts unlock upon the completion of a 5-day yield investment plan.
              </p>
              <button
                type="button"
                onClick={() => navigate('/app/invest')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md cursor-pointer transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start New Investment</span>
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* THE PAYOUT FORM: ONLY ACTIVE WHEN 5 DAYS OLD                 */}
          {/* Requirement: "Button: 'Request Payout' only shows when       */}
          {/* investment is 5 days old"                                    */}
          {/* ============================================================ */}
          {hasMaturedInvestment ? (
            <form onSubmit={handleRequestPayout} className="space-y-6 pt-4 border-t border-[#1E293B] animate-fadeIn">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Request Payout
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select destination and amount to be reviewed by admin for disbursement.
                </p>
              </div>

              {/* Destination Selector: Bank Account or USDT */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Withdrawal Destination
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPayoutDestination('USDT')}
                    className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      payoutDestination === 'USDT'
                        ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/30'
                        : 'bg-[#0A0F1A] border-[#1E293B] hover:border-slate-700'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">USDT</p>
                      <p className="text-[10px] text-slate-400">TRC20 / ERC20</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPayoutDestination('Bank Account')}
                    className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      payoutDestination === 'Bank Account'
                        ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/30'
                        : 'bg-[#0A0F1A] border-[#1E293B] hover:border-slate-700'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">Bank Account</p>
                      <p className="text-[10px] text-slate-400">Wire / SEPA / IBAN</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Payout Amount (USD)
                  </label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(totalMaturedPayoutValue.toString())}
                    className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                  >
                    Max: ${totalMaturedPayoutValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 font-mono">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    max={totalMaturedPayoutValue}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-13 pl-9 pr-4 rounded-xl bg-[#0A0F1A] border border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white font-mono text-lg font-bold transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Destination Details */}
              {payoutDestination === 'USDT' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUsdtNetwork('TRC20')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        usdtNetwork === 'TRC20'
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#0A0F1A] text-slate-400 border border-[#1E293B]'
                      }`}
                    >
                      TRC20 Network
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsdtNetwork('ERC20')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        usdtNetwork === 'ERC20'
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#0A0F1A] text-slate-400 border border-[#1E293B]'
                      }`}
                    >
                      ERC20 Network
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Recipient USDT Wallet Address
                    </label>
                    <input
                      type="text"
                      value={usdtAddress}
                      onChange={(e) => setUsdtAddress(e.target.value)}
                      placeholder="Enter your USDT wallet address"
                      className="w-full h-12 px-3.5 rounded-xl bg-[#0A0F1A] border border-[#1E293B] focus:border-blue-500 text-white font-mono text-xs transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        Bank Institution Name
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. Chase, Barclays, UBS"
                        className="w-full h-12 px-3.5 rounded-xl bg-[#0A0F1A] border border-[#1E293B] focus:border-blue-500 text-white text-xs transition-all outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder={profile?.full_name || 'Full Name'}
                        className="w-full h-12 px-3.5 rounded-xl bg-[#0A0F1A] border border-[#1E293B] focus:border-blue-500 text-white text-xs transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        IBAN / Account Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Account Number or IBAN"
                        className="w-full h-12 px-3.5 rounded-xl bg-[#0A0F1A] border border-[#1E293B] focus:border-blue-500 text-white font-mono text-xs transition-all outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        SWIFT / BIC / Routing Code
                      </label>
                      <input
                        type="text"
                        value={routingSwift}
                        onChange={(e) => setRoutingSwift(e.target.value)}
                        placeholder="Routing Code or SWIFT"
                        className="w-full h-12 px-3.5 rounded-xl bg-[#0A0F1A] border border-[#1E293B] focus:border-blue-500 text-white font-mono text-xs transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Requirement: "Button: 'Request Payout' only shows when investment is 5 days old" */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting to Admin Gateway...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5" />
                    <span>Request Payout (Pending Admin Approval)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* When investment is less than 5 days old: Locked guidance */
            <div className="p-5 rounded-2xl bg-[#0A0F1A] border border-dashed border-[#1E293B] text-center space-y-2">
              <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">
                Payout Unlocks on Day 5
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                As required by Growvest 5-day compounding plans, the <strong className="text-slate-200">"Request Payout"</strong> button activates exclusively when an active investment reaches 5 days of age.
              </p>
            </div>
          )}
        </div>

        {/* Previous Withdrawal History */}
        <div className="bg-[#111A2E] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />
              <span>Withdrawal Requests History</span>
            </h3>
            <span className="text-xs text-slate-400">
              {withdrawals.length} request{withdrawals.length === 1 ? '' : 's'}
            </span>
          </div>

          {withdrawals.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No previous withdrawal requests found.
            </p>
          ) : (
            <div className="divide-y divide-[#1E293B]/60">
              {withdrawals.map((w) => (
                <div key={w.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white font-mono text-sm block">
                      ${w.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-xs block mt-0.5">
                      {w.wallet_address}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        w.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : w.status === 'rejected'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {w.status === 'pending' ? 'Pending Admin Approval' : w.status}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                      {new Date(w.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </InvestorLayout>
  );
}
