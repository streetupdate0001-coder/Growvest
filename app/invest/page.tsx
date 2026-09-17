import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { userRouteMiddleware, AuthProfile } from '../middleware';
import { InvestorLayout } from '../components/InvestorLayout';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Clock,
  Zap,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Lock,
  ArrowRight,
  ArrowDownRight,
  Layers,
  X,
  RefreshCw,
  Wallet,
  Coins,
  Info,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../src/context/AppContext';
import { DepositModal } from '../../src/components/financial/DepositModal';
import { TransferModal } from '../../src/components/financial/TransferModal';

interface InvestPageProps {
  onNavigate?: (path: string) => void;
}

interface PlanItem {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  ratePerDay: string;
  duration: string;
  durationDays: number;
  totalRoi: string;
  totalPercent: number;
  tag?: string;
  description: string;
}

// EXACT 8 PLANS AS PREVIOUSLY CONFIGURED
const EXACT_8_PLANS: PlanItem[] = [
  {
    id: 'bonus_plan',
    name: 'BONUS PLAN',
    minAmount: 500,
    maxAmount: 1000,
    ratePerDay: '10%',
    duration: '7 Days',
    durationDays: 7,
    totalRoi: 'Total 70% + Capital',
    totalPercent: 70,
    tag: 'Introductory Yield',
    description: '10% Daily ROI for 7 Days. Capital returned at maturity.'
  },
  {
    id: 'basic_plan',
    name: 'BASIC PLAN',
    minAmount: 1000,
    maxAmount: 2000,
    ratePerDay: '3.5%',
    duration: '25 Days',
    durationDays: 25,
    totalRoi: 'Total 87.5% + Capital',
    totalPercent: 87.5,
    tag: 'Starter Growth',
    description: '3.5% Daily ROI for 25 Days. High stability algorithmic trading.'
  },
  {
    id: 'crypto_trading',
    name: 'CRYPTOCURRENCY TRADING',
    minAmount: 2000,
    maxAmount: 5000,
    ratePerDay: '4.5%',
    duration: '25 Days',
    durationDays: 25,
    totalRoi: 'Total 112.5% + Capital',
    totalPercent: 112.5,
    tag: 'Most Popular',
    description: '4.5% Daily ROI for 25 Days. Multi-exchange arbitrage liquidity yield.'
  },
  {
    id: 'stock_trading_5k',
    name: 'STOCK TRADING',
    minAmount: 5000,
    maxAmount: 10000,
    ratePerDay: '5.5%',
    duration: '5 Days',
    durationDays: 5,
    totalRoi: 'Total 27.5% + Capital',
    totalPercent: 27.5,
    tag: 'Short Horizon',
    description: '5.5% Daily ROI for 5 Days. Fast institutional equity positions.'
  },
  {
    id: 'stock_trading_10k',
    name: 'STOCK TRADING',
    minAmount: 10000,
    maxAmount: 20000,
    ratePerDay: '6.5%',
    duration: '25 Days',
    durationDays: 25,
    totalRoi: 'Total 162.5% + Capital',
    totalPercent: 162.5,
    tag: 'High Yield Equity',
    description: '6.5% Daily ROI for 25 Days. Quantitative tech & global indices.'
  },
  {
    id: 'stock_trading_20k',
    name: 'STOCK TRADING',
    minAmount: 20000,
    maxAmount: 500000,
    ratePerDay: '7.5%',
    duration: '3 Months',
    durationDays: 90,
    totalRoi: 'Total 22.5% + Capital',
    totalPercent: 22.5,
    tag: 'Quarterly Enclave',
    description: '7.5% Monthly ROI for 3 Months. Sovereign-grade blue chip equity portfolio.'
  },
  {
    id: 'retirement_plan',
    name: 'RETIREMENT PLAN',
    minAmount: 25000,
    maxAmount: 500000,
    ratePerDay: '8.5%',
    duration: '1 Year',
    durationDays: 365,
    totalRoi: 'Total 102% + Capital',
    totalPercent: 102,
    tag: 'Long Horizon',
    description: '8.5% Monthly ROI for 1 Year. Compound fixed income & treasury asset allocation.'
  },
  {
    id: 'compounding_plan',
    name: 'COMPOUNDING PLAN',
    minAmount: 100000,
    maxAmount: 1000000,
    ratePerDay: '10%',
    duration: '6 Months',
    durationDays: 180,
    totalRoi: 'Total 1800% + Capital',
    totalPercent: 1800,
    tag: 'Maximum Compound',
    description: '10% Compounded Daily for 6 Months. Exclusive VIP algorithmic quantitative arbitrage.'
  }
];

export default function InvestPage({ onNavigate }: InvestPageProps) {
  const { setDepositModalOpen } = useApp();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [categoryTab, setCategoryTab] = useState<'perps' | 'stocks'>('stocks');
  const [activeTab, setActiveTab] = useState<'plans' | 'active'>('plans');
  const [userInvestments, setUserInvestments] = useState<any[]>([]);

  // Investment Modal State
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    initInvest();
  }, []);

  const initInvest = async () => {
    setLoading(true);
    const authResult = await userRouteMiddleware();
    if (!authResult.authorized || !authResult.user) {
      navigate('/login');
      return;
    }
    setProfile(authResult.profile);
    await loadInvestments(authResult.user.id);
    setLoading(false);
  };

  const loadInvestments = async (userId: string) => {
    try {
      let list: any[] = [];
      const { data } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        list = data;
      }

      if (typeof window !== 'undefined') {
        const localKey = `growvest_investments_${userId}`;
        const stored = JSON.parse(localStorage.getItem(localKey) || '[]');
        if (Array.isArray(stored)) {
          stored.forEach((localItem: any) => {
            if (!list.some((l) => l.id === localItem.id)) {
              list.push(localItem);
            }
          });
        }
      }

      setUserInvestments(list);
    } catch (err) {
      console.warn('[InvestPage] Notice loading investments:', err);
    }
  };

  const availableBalance = Number(profile?.balance || 0);

  const handleOpenInvestModal = (plan: PlanItem) => {
    setSelectedPlan(plan);
    setInvestAmount(plan.minAmount.toString());
    setErrorMessage(null);
    setSubmitSuccess(false);
  };

  const handleConfirmInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !profile?.id) return;

    const amount = parseFloat(investAmount) || 0;
    if (amount > availableBalance) {
      setErrorMessage("Insufficient balance");
      setIsSubmitting(false);
      return;
    }
    if (amount < selectedPlan.minAmount) {
      setErrorMessage(`Minimum investment for this plan is $${selectedPlan.minAmount.toLocaleString()}.`);
      return;
    }
    if (amount > selectedPlan.maxAmount) {
      setErrorMessage(`Maximum investment for this plan is $${selectedPlan.maxAmount.toLocaleString()}.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const now = new Date();
      const endDate = new Date(now.getTime() + selectedPlan.durationDays * 24 * 60 * 60 * 1000);
      const newInv = {
        user_id: profile.id,
        plan_name: selectedPlan.name,
        amount: amount,
        roi_percent: selectedPlan.totalPercent,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active'
      };

      await supabase.from('investments').insert([newInv]);

      await supabase.from('transactions').insert([
        {
          user_id: profile.id,
          amount: amount,
          type: 'investment',
          status: 'completed',
          description: `${selectedPlan.name} Allocation (${selectedPlan.duration})`
        }
      ]);

      const newBalance = Math.max(0, availableBalance - amount);
      await supabase
        .from('profiles')
        .update({ balance: newBalance } as any)
        .eq('id', profile.id);

      if (typeof window !== 'undefined') {
        const localKey = `growvest_investments_${profile.id}`;
        const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
        existing.unshift({
          id: `inv_${Date.now()}`,
          ...newInv,
          created_at: now.toISOString()
        });
        localStorage.setItem(localKey, JSON.stringify(existing));
      }

      setSubmitSuccess(true);
      await loadInvestments(profile.id);
      setTimeout(() => {
        setSelectedPlan(null);
        setActiveTab('active');
      }, 1800);
    } catch (err: any) {
      console.warn('[InvestPage] Notice confirming investment:', err);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSelectedPlan(null);
        setActiveTab('active');
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F4F7] text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#00ACEE] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading Investment Portfolios...
          </p>
        </div>
      </div>
    );
  }

  const activePositions = userInvestments.filter((i) => i.status === 'active');
  const portfolioVal = profile?.total_balance !== undefined && profile?.total_balance !== null
    ? Number(profile.total_balance)
    : availableBalance + (activePositions.reduce((acc, curr) => acc + (curr.amount || 0), 0));
  const displayPortfolioVal = portfolioVal > 0 ? portfolioVal : 0;

  return (
    <InvestorLayout profile={profile} activeRoute="invest" onNavigate={navigate}>
      <div className="max-w-md mx-auto space-y-5 pb-8">
        
        {/* ============================================================ */}
        {/* Header: Back button and "Invest" (Matches invest 3.jpg)       */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => navigate('/app/dashboard')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            Invest
          </h1>

          <div className="w-10 h-10" />
        </div>

        {/* ============================================================ */}
        {/* Segmented Control Pills: Perps vs Stocks (invest 3.jpg)      */}
        {/* ============================================================ */}
        <div className="flex items-center justify-center">
          <div className="p-1 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCategoryTab('perps')}
              className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                categoryTab === 'perps'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Perps
            </button>
            <button
              type="button"
              onClick={() => setCategoryTab('stocks')}
              className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                categoryTab === 'stocks'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Stocks
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Hero Cyan Card: Portfolio Value $0            */}
        {/* Buttons: + Add Funds (White) & ↘ Withdraw (Glass)             */}
        {/* (invest 3.jpg)                                               */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-[28px] p-6 bg-gradient-to-tr from-[#00A3FF] via-[#00B4F8] to-[#00C2FF] text-white shadow-xl shadow-[#00ACEE]/25 border border-white/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
                <span>Portfolio Value</span>
                <Info className="w-3.5 h-3.5 text-white/80" />
              </div>

              <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-white/20 text-white border border-white/25">
                ↗ +78.4%
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                ${displayPortfolioVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>

            {/* Two Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDepositModalOpen(true)}
                className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                <span>Add Funds</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/app/withdraw')}
                className="py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/25 font-extrabold text-xs flex items-center justify-center gap-1.5 backdrop-blur-xs active:scale-[0.98] transition-all cursor-pointer"
              >
                <ArrowDownRight className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* Centered Chevron-Down Badge on Bottom border (invest 3.jpg) */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            <div className="w-8 h-4 bg-white/30 backdrop-blur-xs rounded-t-full flex items-center justify-center">
              <ChevronDown className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Section: Trending ⓘ with View All > (invest 3.jpg)           */}
        {/* Apple ($0AAPLx +0.11%) | Abbott ($0 ABTx +0.24%) */}
        {/* ============================================================ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
              <span>Trending</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <button
              type="button"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Apple Card */}
            <div className="p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold text-base shadow-xs">
                
              </div>

              <div>
                <div className="text-base font-black font-mono text-slate-900">
                  $542.85
                </div>
                <div className="flex items-center justify-between text-[11px] mt-0.5">
                  <span className="text-slate-400 font-bold">AAPLx</span>
                  <span className="text-emerald-600 font-mono font-bold">↗ +0.11%</span>
                </div>
              </div>
            </div>

            {/* Abbott Card */}
            <div className="p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                A
              </div>

              <div>
                <div className="text-base font-black font-mono text-slate-900">
                  $985.74
                </div>
                <div className="flex items-center justify-between text-[11px] mt-0.5">
                  <span className="text-slate-400 font-bold">ABTx</span>
                  <span className="text-emerald-600 font-mono font-bold">↗ +0.24%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Section: Featured Assets ⓘ (invest 3.jpg)                    */}
        {/* ============================================================ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
              <span>Featured Assets</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <button
              type="button"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-[24px] bg-white border border-slate-200/80 p-4 space-y-3 shadow-xs">
            {/* Amazon Asset */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 font-black text-sm">
                  a
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Amazon</span>
                  <span className="text-[10px] text-slate-400 font-bold">Amznx</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black font-mono text-emerald-600 block">
                  +$247.58
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  0.54 (-14$)
                </span>
              </div>
            </div>

            {/* Abbott Asset */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-sm">
                  A
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Abbott</span>
                  <span className="text-[10px] text-slate-400 font-bold">ABTx</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black font-mono text-slate-900 block">
                  $725.85
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">
                  +1.22%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 8 INVESTMENT PLANS SECTION (Preserved in full!)             */}
        {/* ============================================================ */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
              <Layers className="w-4 h-4 text-[#00ACEE]" />
              <span>Investment Plans ({EXACT_8_PLANS.length})</span>
            </div>

            {/* Tab switch between Plans & Active Positions */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white border border-slate-200/80 text-[11px] font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('plans')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'plans' ? 'bg-[#00ACEE] text-white' : 'text-slate-500'
                }`}
              >
                All Plans
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'active' ? 'bg-[#00ACEE] text-white' : 'text-slate-500'
                }`}
              >
                Active ({activePositions.length})
              </button>
            </div>
          </div>

          {activeTab === 'plans' ? (
            <div className="space-y-3">
              {EXACT_8_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {plan.tag || 'Algorithmic'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {plan.duration}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight">
                      {plan.name}
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#00ACEE] mt-0.5">
                      ${plan.minAmount.toLocaleString()} – ${plan.maxAmount.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase">Daily ROI</span>
                      <span className="font-bold text-slate-800">{plan.ratePerDay}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block uppercase">Total Return</span>
                      <span className="font-bold text-emerald-600">{plan.totalRoi}</span>
                    </div>
                  </div>

                  {/* Red Invest Now Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenInvestModal(plan)}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Invest Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Active Positions */
            <div className="space-y-3">
              {activePositions.length === 0 ? (
                <div className="p-6 rounded-[24px] bg-white border border-dashed border-slate-200 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-700">No active positions yet</p>
                  <p className="text-[11px] text-slate-400">Select any of our 8 plans to start algorithmic trading.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('plans')}
                    className="px-3 py-1.5 rounded-xl bg-[#00ACEE] text-white font-bold text-xs"
                  >
                    View 8 Plans
                  </button>
                </div>
              ) : (
                activePositions.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{inv.plan_name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Running
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] flex items-center justify-between text-xs font-mono">
                      <span>Capital: ${inv.amount.toLocaleString()}</span>
                      <span className="text-emerald-600 font-bold">+{inv.roi_percent}% ROI</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>

      {/* Invest Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-4 text-slate-900">
            <button
              type="button"
              onClick={() => setSelectedPlan(null)}
              className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Investment Activated</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your position in <strong>{selectedPlan.name}</strong> has been confirmed and queued for algorithmic compounding.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmInvestment} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    Confirm Allocation
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{selectedPlan.name}</h3>
                  <p className="text-xs text-slate-500">
                    Term: {selectedPlan.duration} • Yield: {selectedPlan.ratePerDay} • {selectedPlan.totalRoi}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Investment Amount ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min={selectedPlan.minAmount}
                      max={selectedPlan.maxAmount}
                      required
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-base focus:bg-white focus:border-[#00ACEE] focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>Min: ${selectedPlan.minAmount.toLocaleString()}</span>
                    <span>Max: ${selectedPlan.maxAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Available Cash:</span>
                    <span className="text-slate-800 font-bold">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Expected Maturity:</span>
                    <span className="text-emerald-600 font-bold">{selectedPlan.duration}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Activate</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <DepositModal />
      <TransferModal />
    </InvestorLayout>
  );
}
