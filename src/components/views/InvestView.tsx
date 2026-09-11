import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Clock,
  DollarSign,
  AlertCircle,
  X,
  Plus,
  Coins,
  ArrowUpRight,
  ArrowDown,
  Layers,
  Check,
  Info,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';

export interface InvestmentPlanItem {
  id: string;
  name: string;
  badge: string;
  minAmount: number;
  maxAmount: number;
  dailyRate: number; // Stated yield percentage
  durationDays: number;
  durationLabel: string;
  payoutSchedule: 'daily' | 'term';
  profitPeriodLabel: string;
  totalPercent: number; // e.g. 70 means 70% + Capital
  theme: 'periwinkle' | 'lavender';
  category: string;
  status?: 'active' | 'inactive';
}

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
}

export const INVESTMENT_PLANS: InvestmentPlanItem[] = [
  {
    id: 'plan_bonus',
    name: 'Bonus Plan',
    badge: 'BONUS PLAN',
    minAmount: 500,
    maxAmount: 1000,
    dailyRate: 10.0,
    durationDays: 7,
    durationLabel: '7 Days',
    payoutSchedule: 'daily',
    profitPeriodLabel: 'Profit for 7 Days',
    totalPercent: 70,
    theme: 'periwinkle',
    category: 'Starter Alpha',
    status: 'active'
  },
  {
    id: 'plan_basic',
    name: 'Basic Plan',
    badge: 'BASIC PLAN',
    minAmount: 1000,
    maxAmount: 2000,
    dailyRate: 3.5,
    durationDays: 25,
    durationLabel: '25 Days',
    payoutSchedule: 'daily',
    profitPeriodLabel: 'Profit for 25 Days',
    totalPercent: 87.5,
    theme: 'lavender',
    category: 'Core Yield',
    status: 'active'
  },
  {
    id: 'plan_nft',
    name: 'NFT Trading',
    badge: 'NFT TRADING',
    minAmount: 2000,
    maxAmount: 5000,
    dailyRate: 4.5,
    durationDays: 25,
    durationLabel: '25 Days',
    payoutSchedule: 'daily',
    profitPeriodLabel: 'Profit for 25 Days',
    totalPercent: 112.5,
    theme: 'periwinkle',
    category: 'Digital Collectibles',
    status: 'active'
  },
  {
    id: 'plan_crypto',
    name: 'Cryptocurrency Trading',
    badge: 'CRYPTOCURRENCY TRADING',
    minAmount: 5000,
    maxAmount: 10000,
    dailyRate: 5.5,
    durationDays: 5,
    durationLabel: '5 Days',
    payoutSchedule: 'daily',
    profitPeriodLabel: 'Profit for 5 Days',
    totalPercent: 27.5,
    theme: 'lavender',
    category: 'Digital Assets',
    status: 'active'
  },
  {
    id: 'plan_stock',
    name: 'Stock Trading',
    badge: 'STOCK TRADING',
    minAmount: 10000,
    maxAmount: 20000,
    dailyRate: 6.5,
    durationDays: 25,
    durationLabel: '25 Days',
    payoutSchedule: 'term',
    profitPeriodLabel: 'Profit for 25 Days',
    totalPercent: 162.5,
    theme: 'periwinkle',
    category: 'Equities & ETFs',
    status: 'active'
  },
  {
    id: 'plan_gold',
    name: 'Gold Plan',
    badge: 'GOLD PLAN',
    minAmount: 20000,
    maxAmount: 500000,
    dailyRate: 7.5,
    durationDays: 90,
    durationLabel: '3 Months',
    payoutSchedule: 'term',
    profitPeriodLabel: 'Profit for 3 Months',
    totalPercent: 675,
    theme: 'lavender',
    category: 'Precious Metals',
    status: 'active'
  },
  {
    id: 'plan_retirement',
    name: 'Retirement Plan',
    badge: 'RETIREMENT PLAN',
    minAmount: 25000,
    maxAmount: 500000,
    dailyRate: 8.5,
    durationDays: 365,
    durationLabel: '1 Year',
    payoutSchedule: 'term',
    profitPeriodLabel: 'Profit for 1 Year',
    totalPercent: 1020,
    theme: 'periwinkle',
    category: 'Long-term Wealth',
    status: 'active'
  },
  {
    id: 'plan_housing',
    name: 'Housing Plan',
    badge: 'HOUSING PLAN',
    minAmount: 100000,
    maxAmount: 1000000,
    dailyRate: 10.0,
    durationDays: 180,
    durationLabel: '6 Months',
    payoutSchedule: 'term',
    profitPeriodLabel: 'Profit for 6 Months',
    totalPercent: 1800,
    theme: 'lavender',
    category: 'Real Estate & Infrastructure',
    status: 'active'
  }
];

export const InvestView: React.FC = () => {
  const { currentCurrency, setDepositModalOpen, addNotification, setActiveTab } = useApp();
  const { wallet, invest, userInvestments, transactions, user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlanItem | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    plan: InvestmentPlanItem | null;
    amount: number;
  }>({
    open: false,
    plan: null,
    amount: 0
  });

  const [activeSubTab, setActiveSubTab] = useState<'plans' | 'active'>('plans');
  const [historySearch, setHistorySearch] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);

  const availableBalance = wallet?.availableBalanceUsd ?? 0;

  // Arrange plans in sequence from smallest to biggest investment amount
  const sortedPlans = useMemo(() => {
    return [...INVESTMENT_PLANS].sort((a, b) => a.minAmount - b.minAmount);
  }, []);

  // Dynamically generated interest records strictly for user active investments (no fake/demo history)
  const interestHistoryRecords = useMemo(() => {
    // Only derive records from real active user investments
    const userGenerated = (userInvestments || []).map((inv, idx) => {
      const plan = INVESTMENT_PLANS.find(p => p.id === inv.planId) || INVESTMENT_PLANS[0];
      const yieldAmt = Math.round((inv.amountUsd * plan.dailyRate) / 100) || Math.round(inv.amountUsd * 0.05);
      const invDate = new Date(inv.startDate);
      const formattedDate = `${invDate.getDate()} ${invDate.toLocaleString('default', { month: 'short' })} ${invDate.getFullYear()} ${invDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      return {
        id: `user_inv_${inv.id}_${idx}`,
        amount: yieldAmt,
        currency: currentCurrency || 'USD',
        planName: plan.badge,
        date: formattedDate,
        timestamp: inv.startDate
      };
    });

    const combined = [...userGenerated];

    if (!historySearch.trim()) return combined;
    const query = historySearch.toLowerCase();
    return combined.filter(item =>
      item.planName.toLowerCase().includes(query) ||
      item.amount.toString().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  }, [userInvestments, currentCurrency, historySearch]);

  // Toast Notification System
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toISOString()
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4200);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleOpenInvestModal = (plan: InvestmentPlanItem) => {
    if (plan.status === 'inactive') {
      showToast('Plan Inactive', `${plan.name} is currently inactive and not accepting new deposits.`, 'warning');
      return;
    }
    setSelectedPlan(plan);
    setInvestAmount(plan.minAmount.toString());
    setErrorMsg(null);
  };

  const handleCloseInvestModal = () => {
    setSelectedPlan(null);
    setInvestAmount('');
    setErrorMsg(null);
  };

  const numericAmount = parseFloat(investAmount) || 0;
  const isAmountValid =
    selectedPlan &&
    numericAmount >= selectedPlan.minAmount &&
    numericAmount <= selectedPlan.maxAmount;
  const hasEnoughFunds = availableBalance >= numericAmount;

  const calculatedDailyProfit = selectedPlan
    ? (numericAmount * selectedPlan.dailyRate) / 100
    : 0;
  const calculatedTotalProfit = selectedPlan
    ? (numericAmount * selectedPlan.totalPercent) / 100
    : 0;
  const calculatedTotalReturn = numericAmount + calculatedTotalProfit;

  const handleConfirmInvestment = async () => {
    if (!selectedPlan) return;

    if (isNaN(numericAmount) || numericAmount < selectedPlan.minAmount) {
      setErrorMsg(`Minimum investment for this plan is $${selectedPlan.minAmount.toLocaleString()}`);
      return;
    }

    if (numericAmount > selectedPlan.maxAmount) {
      setErrorMsg(`Maximum investment for this plan is $${selectedPlan.maxAmount.toLocaleString()}`);
      return;
    }

    if (numericAmount > availableBalance) {
      setErrorMsg(`Insufficient available balance. You have $${availableBalance.toLocaleString()} available.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const planTermLabel = selectedPlan.payoutSchedule === 'daily'
        ? `${selectedPlan.dailyRate}% Daily`
        : `${selectedPlan.dailyRate}% (${selectedPlan.durationLabel})`;
      const res = await invest(selectedPlan.id, numericAmount, `${selectedPlan.badge} (${planTermLabel})`);

      if (res.success) {
        // Trigger instant toast notification
        showToast(
          'Investment Successful!',
          `Successfully allocated ${formatCurrency(numericAmount, currentCurrency)} to ${selectedPlan.badge}.`,
          'success'
        );

        addNotification({
          type: 'account',
          title: `✅ Investment Activated: ${selectedPlan.badge}`,
          message: selectedPlan.payoutSchedule === 'daily'
            ? `Your investment of ${formatCurrency(numericAmount, currentCurrency)} in ${selectedPlan.name} is now active. Daily profit of ${selectedPlan.dailyRate}% will accrue every 24 hours.`
            : `Your investment of ${formatCurrency(numericAmount, currentCurrency)} in ${selectedPlan.name} is now active for the ${selectedPlan.durationLabel} term. Capital is 100% guaranteed.`,
          linkTab: 'invest'
        });

        const completedPlan = selectedPlan;
        const investedAmt = numericAmount;

        handleCloseInvestModal();
        setSuccessModal({
          open: true,
          plan: completedPlan,
          amount: investedAmt
        });
      } else {
        setErrorMsg(res.error || 'Failed to process investment.');
        showToast('Investment Failed', res.error || 'Could not process investment.', 'warning');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      showToast('Error', err.message || 'An unexpected error occurred.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md sm:max-w-xl lg:max-w-3xl mx-auto space-y-5 pb-16 text-slate-900 dark:text-white relative">
      {/* Toast Notification Floating Container */}
      <div className="fixed top-4 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3 text-left ${
                toast.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/30 text-white shadow-emerald-950/30'
                  : toast.type === 'warning'
                  ? 'bg-amber-950/90 border-amber-500/30 text-white shadow-amber-950/30'
                  : 'bg-slate-900/90 border-slate-700 text-white shadow-slate-950/30'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : toast.type === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                ) : (
                  <Info className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold">{toast.title}</h4>
                <p className="text-[11px] opacity-90 leading-tight pt-0.5">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-white/60 hover:text-white p-0.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. Header with exact title from uploaded pictures */}
      <div className="text-center pt-2 space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Investment Plan
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose a tailored wealth growth strategy with guaranteed capital protection
        </p>
      </div>

      {/* Available Balance Pill / Status Bar */}
      <div className="flex items-center justify-between p-3.5 px-4 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available Balance:</span>
          <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
            {formatCurrency(availableBalance, currentCurrency)}
          </span>
        </div>

        <button
          onClick={() => setDepositModalOpen(true)}
          className="text-xs font-bold text-[#ff4d38] hover:text-[#e03a27] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Funds</span>
        </button>
      </div>

      {/* Sub tabs: All Plans vs Active History */}
      <div className="flex rounded-2xl bg-slate-200/60 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/5">
        <button
          onClick={() => setActiveSubTab('plans')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'plans'
              ? 'bg-white dark:bg-[#1e1e24] text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Investment Plans ({INVESTMENT_PLANS.length})
        </button>
        <button
          onClick={() => setActiveSubTab('active')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'active'
              ? 'bg-white dark:bg-[#1e1e24] text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#4cb07a]" />
          <span>Active Position History ({interestHistoryRecords.length})</span>
        </button>
      </div>

      {/* 2. Active Positions / Transaction History View */}
      {activeSubTab === 'active' ? (
        <div className="space-y-4">
          {/* Header matching the uploaded screenshot */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Transaction
            </h2>
            <button
              type="button"
              onClick={() => setShowSearchInput(prev => !prev)}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Search transactions"
            >
              <Search className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Search Bar if toggled */}
          {showSearchInput && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search plan name, amount, or date..."
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-[#161c28] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
              {historySearch && (
                <button
                  onClick={() => setHistorySearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          )}

          {/* Transaction Cards List matching the uploaded image */}
          <div className="space-y-3">
            {interestHistoryRecords.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
                No transactions found.
              </div>
            ) : (
              interestHistoryRecords.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#f0f7fe] dark:bg-[#151c27] border border-[#e2effc] dark:border-[#202a3a] flex items-center justify-between gap-3 shadow-xs hover:border-[#cbdef4] transition-all"
                >
                  {/* Left: Green Squircle with Downward Arrow */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#4cb07a] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                    </div>

                    {/* Center text */}
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight uppercase truncate">
                        {item.amount.toLocaleString()} {item.currency} Interest From {item.planName}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-400 font-medium pt-0.5">
                        {item.date}
                      </div>
                    </div>
                  </div>

                  {/* Right side amount */}
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#4cb07a] dark:text-[#52ba82]">
                      +{item.amount.toLocaleString()} {item.currency}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* The 8 Plans arranged in sequence from smallest to biggest */
        <div className="space-y-4 sm:space-y-5">
          {sortedPlans.map(plan => {
            const isLavender = plan.theme === 'lavender';
            const isInactive = plan.status === 'inactive';
            const rateFormatted = `${plan.dailyRate}% (${plan.durationLabel})`;

            return (
              <motion.div
                key={plan.id}
                whileHover={isInactive ? {} : { y: -2 }}
                transition={{ duration: 0.18 }}
                className={`relative pt-5 pb-5 px-5 sm:px-6 rounded-[28px] border transition-all shadow-sm ${
                  isInactive ? 'opacity-75 grayscale-[20%]' : ''
                } ${
                  isLavender
                    ? 'bg-[#f4e2f5] dark:bg-[#251728] border-[#e8cbe9] dark:border-[#422649] text-slate-900 dark:text-slate-100'
                    : 'bg-[#e4ebf8] dark:bg-[#161a28] border-[#d2def3] dark:border-[#27304b] text-slate-900 dark:text-slate-100'
                }`}
              >
                {/* Floating Centered Pill Header */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  <span className="inline-block px-4 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-xs bg-[#e2ecf5] dark:bg-[#252b3e] text-slate-700 dark:text-slate-200 border border-slate-300/60 dark:border-white/10 whitespace-nowrap">
                    {plan.badge}
                  </span>
                  {isInactive && (
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left info column */}
                  <div className="space-y-1.5 text-left">
                    {/* Line 1: Range | Rate */}
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <span>${plan.minAmount.toLocaleString()} – ${plan.maxAmount.toLocaleString()}</span>
                      <span className="text-slate-400 font-normal">|</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{rateFormatted}</span>
                    </div>

                    {/* Line 2: Profit Period Label */}
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {plan.profitPeriodLabel}
                    </div>

                    {/* Line 3: Capital will back: ✓ */}
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <span>Capital will back:</span>
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1 font-mono">
                        ({plan.durationLabel})
                      </span>
                    </div>

                    {/* Line 4: Total XX% + Capital */}
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Total {plan.totalPercent}% + Capital
                    </div>
                  </div>

                  {/* Right: Invest Now / Inactive Button */}
                  <div className="flex sm:flex-col items-center justify-end">
                    {isInactive ? (
                      <button
                        type="button"
                        id={`btn-invest-${plan.id}`}
                        disabled
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-400 dark:bg-slate-700 text-white/90 font-bold text-xs sm:text-sm shadow-none cursor-not-allowed text-center min-w-[125px] opacity-80"
                      >
                        Inactive
                      </button>
                    ) : (
                      <button
                        type="button"
                        id={`btn-invest-${plan.id}`}
                        onClick={() => handleOpenInvestModal(plan)}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#d83c18] hover:bg-[#c23312] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-900/20 transition-all cursor-pointer text-center min-w-[125px]"
                      >
                        Invest Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 4. Interactive Investment Modal Sheet */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#d83c18]/10 text-[#d83c18] border border-[#d83c18]/20">
                    {selectedPlan.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedPlan.payoutSchedule === 'daily'
                      ? `${selectedPlan.dailyRate}% Daily`
                      : `${selectedPlan.dailyRate}% (${selectedPlan.durationLabel})`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCloseInvestModal}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Plan Specs Highlight */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Investment Range:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    ${selectedPlan.minAmount.toLocaleString()} – ${selectedPlan.maxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>{selectedPlan.payoutSchedule === 'daily' ? 'Daily Profit Rate:' : 'Return Yield:'}</span>
                  <span className="font-bold text-emerald-500 font-mono">
                    +{selectedPlan.dailyRate}% {selectedPlan.payoutSchedule === 'daily' ? 'every 24h' : `(${selectedPlan.durationLabel})`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Duration / Period:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {selectedPlan.durationLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Capital Guarantee:</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 100% Back at Maturity
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Total Expected ROI:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {selectedPlan.totalPercent}% + Principal
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Amount to Invest (USD)
                  </label>
                  <span className="text-slate-400">
                    Available: <strong className="text-slate-900 dark:text-white font-mono">{formatCurrency(availableBalance, currentCurrency)}</strong>
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    min={selectedPlan.minAmount}
                    max={selectedPlan.maxAmount}
                    value={investAmount}
                    onChange={e => {
                      setInvestAmount(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder={`Min $${selectedPlan.minAmount.toLocaleString()}`}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-[#d83c18] focus:ring-1 focus:ring-[#d83c18] text-slate-900 dark:text-white font-mono font-bold text-base outline-none transition-all"
                  />
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setInvestAmount(selectedPlan.minAmount.toString())}
                    className="py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    Min (${selectedPlan.minAmount.toLocaleString()})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const val = Math.min(
                        selectedPlan.maxAmount,
                        Math.max(selectedPlan.minAmount, Math.round(selectedPlan.minAmount * 1.5))
                      );
                      setInvestAmount(val.toString());
                    }}
                    className="py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const mid = Math.round((selectedPlan.minAmount + selectedPlan.maxAmount) / 2);
                      setInvestAmount(mid.toString());
                    }}
                    className="py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const maxPossible = Math.min(selectedPlan.maxAmount, availableBalance);
                      setInvestAmount(maxPossible > 0 ? maxPossible.toString() : selectedPlan.minAmount.toString());
                    }}
                    className="py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Real-Time Calculations Box */}
              {numericAmount > 0 && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                  {selectedPlan.payoutSchedule === 'daily' ? (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Daily Profit:</span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(calculatedDailyProfit, currentCurrency)} / day
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Plan Yield ({selectedPlan.durationLabel}):</span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(calculatedTotalProfit, currentCurrency)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Net Profit:</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(calculatedTotalProfit, currentCurrency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20">
                    <span className="font-bold">Total Payout (Principal + Profit):</span>
                    <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatCurrency(calculatedTotalReturn, currentCurrency)}
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Insufficient balance warning & Quick Deposit Button */}
              {numericAmount > availableBalance && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs space-y-2">
                  <p className="font-medium">
                    You need {formatCurrency(numericAmount - availableBalance, currentCurrency)} more to fund this plan.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseInvestModal();
                      setDepositModalOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Deposit Funds Now</span>
                  </button>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseInvestModal}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmInvestment}
                  disabled={isSubmitting || !isAmountValid || !hasEnoughFunds}
                  className="flex-1 py-3 rounded-2xl bg-[#d83c18] hover:bg-[#c23312] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition-all shadow-md shadow-rose-900/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <span>Confirm & Invest</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Success Confirmation Dialog */}
      <AnimatePresence>
        {successModal.open && successModal.plan && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Investment Successful!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your <strong className="text-slate-800 dark:text-slate-200">{successModal.plan.badge}</strong> position has been established.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 text-xs space-y-1.5 text-left font-mono">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Amount Invested:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(successModal.amount, currentCurrency)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Plan Duration:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{successModal.plan.durationLabel}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Expected Return:</span>
                  <span className="font-bold text-emerald-500">
                    {successModal.plan.payoutSchedule === 'daily'
                      ? `+${successModal.plan.dailyRate}% Daily`
                      : `+${successModal.plan.dailyRate}% (${successModal.plan.durationLabel})`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Capital Return:</span>
                  <span className="font-bold text-emerald-500">100% Guaranteed</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSuccessModal({ open: false, plan: null, amount: 0 });
                  setActiveSubTab('active');
                }}
                className="w-full py-3 rounded-2xl bg-[#d83c18] hover:bg-[#c23312] text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
              >
                View Active Investments
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
