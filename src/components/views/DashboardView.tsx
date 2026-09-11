import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'motion/react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  ShieldCheck,
  Activity,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Layers,
  Percent,
  Coins
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';
import { MarketAsset } from '../../types';
import { supabase } from '../../lib/supabase';

// Refined animation variants with fluid spring dynamics
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
};

const cardItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.99
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 26,
      stiffness: 280,
      mass: 0.75
    }
  }
};

const carouselContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.03
    }
  }
};

const carouselItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 10,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 250
    }
  }
};

export const DashboardView: React.FC = () => {
  const {
    setActiveTab,
    setDepositModalOpen,
    setWithdrawModalOpen,
    setTransferModalOpen,
    currentCurrency
  } = useApp();
  const { user, wallet, transactions, userInvestments, isLoading } = useAuth();

  const [hideBalances, setHideBalances] = useState(false);
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [topCoins, setTopCoins] = useState<MarketAsset[]>([]);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [liveProfileBalance, setLiveProfileBalance] = useState<number | null>(null);
  const [liveDbInvestments, setLiveDbInvestments] = useState<any[] | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Direct Supabase data loader for profiles.balance & investments table
  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    async function loadSupabaseDashboard() {
      try {
        // Fetch profiles.balance
        const { data: profileData } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();

        if (isMounted && profileData && profileData.balance !== undefined) {
          setLiveProfileBalance(Number(profileData.balance));
        }

        // Fetch investments table
        const { data: investmentsData } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (isMounted && investmentsData) {
          setLiveDbInvestments(investmentsData);
        }
      } catch (err) {
        console.warn('[DashboardView] Supabase direct query notice:', err);
      }
    }

    loadSupabaseDashboard();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/markets');
        if (res.ok) {
          const json = await res.json();
          if (mounted && json.data && json.data.length > 0) {
            setTopCoins(json.data.slice(0, 6));
          }
        }
      } catch (_e) {
        // Handled silently
      } finally {
        if (mounted) setLoadingMarkets(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Default fallback market assets if offline or loading
  const defaultAssets = [
    { symbol: 'BTC', name: 'Bitcoin', priceUsd: 87420, change24h: 3.42, sparkline: [82, 83, 85, 84, 86, 87.4] },
    { symbol: 'ETH', name: 'Ethereum', priceUsd: 3120.5, change24h: 5.18, sparkline: [2900, 2980, 3020, 3050, 3120] },
    { symbol: 'SOL', name: 'Solana', priceUsd: 194.8, change24h: 8.64, sparkline: [175, 180, 182, 189, 194.8] },
    { symbol: 'USDT', name: 'Tether USD', priceUsd: 1.00, change24h: 0.02, sparkline: [1, 1, 1, 1, 1] }
  ];

  const displayAssets = topCoins.length > 0 ? topCoins : defaultAssets;

  const availVal = liveProfileBalance !== null ? liveProfileBalance : (wallet?.availableBalanceUsd ?? 0.00);
  const investVal = liveDbInvestments !== null
    ? liveDbInvestments.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0)
    : (wallet?.investedBalanceUsd ?? 0.00);
  const totalVal = availVal + investVal;
  const pnlPercent = wallet?.pnlPercentage24h !== undefined && wallet?.pnlPercentage24h !== 0 ? wallet.pnlPercentage24h : 0.0;

  const userTransactions = transactions || [];

  const effectiveInvestments = (liveDbInvestments && liveDbInvestments.length > 0)
    ? liveDbInvestments.map((inv: any) => ({
        id: inv.id,
        planTitle: inv.plan_name || 'Growvest Portfolio Strategy',
        amountUsd: Number(inv.amount || 0),
        accruedYieldUsd: Number(inv.profit || 0),
        startDate: inv.created_at || new Date().toISOString(),
        status: inv.status || 'active'
      }))
    : (userInvestments || []);

  if (isLoading && !user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-spin">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-100">Loading Client Dashboard...</p>
          <p className="text-xs text-slate-400">Syncing encrypted balances and vault records</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      id="growvest-dashboard-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-md sm:max-w-xl lg:max-w-4xl mx-auto space-y-4 sm:space-y-5 pb-8 text-slate-900 dark:text-white"
    >
      {/* 1. Sleek Top Client Header */}
      <motion.div variants={cardItemVariants} className="flex items-center justify-between pt-1 px-1">
        <div className="flex items-center gap-3">
          {/* Circular User Avatar with Green Active Indicator */}
          <div
            className="relative cursor-pointer group"
            onClick={() => setActiveTab('profile')}
            title="View Profile & Settings"
          >
            <div className="w-11 h-11 rounded-full bg-[#16161c] border border-white/15 flex items-center justify-center font-bold text-sm text-white overflow-hidden shadow-md group-hover:border-emerald-500/50 transition-colors">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-sans font-bold text-emerald-400">
                  {user?.firstName?.charAt(0) || 'A'}
                </span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#09090b]" />
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5 leading-tight">
              <span className="text-slate-900 dark:text-slate-100 font-extrabold">
                Hello, <span className="text-emerald-600 dark:text-emerald-400 font-black">{user?.firstName ? user.firstName : 'Client'}</span>
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <span>{user?.accountStatus === 'pending' ? 'Verification In Review' : 'Verified Client Vault'}</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{currentTime}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Security / Vault Status Badge */}
        <div
          onClick={() => setActiveTab('security')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold cursor-pointer hover:bg-emerald-500/15 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Protected</span>
          <span className="sm:hidden">Secure</span>
        </div>
      </motion.div>

      {/* 2. Total Balance Hero Card (Ultra Sleek Obsidian Glass Card) */}
      <motion.div
        variants={cardItemVariants}
        className="p-5 sm:p-6 rounded-[28px] bg-[#121216]/95 border border-white/[0.08] shadow-2xl space-y-4 backdrop-blur-xl relative overflow-hidden"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-rose-500/10 via-emerald-500/5 to-transparent rounded-full pointer-events-none blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Portfolio Balance
            </span>
          </div>

          <button
            type="button"
            onClick={() => setHideBalances(!hideBalances)}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
            title={hideBalances ? 'Show balance' : 'Hide balance'}
          >
            {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Big Bold Balance Display with 24h PnL Indicator */}
        <div className="relative z-10 flex items-baseline gap-3 flex-wrap">
          <div className="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight text-white">
            {hideBalances ? '••••••••' : formatCurrency(totalVal, currentCurrency)}
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <span>↑</span>
            <span>+{pnlPercent.toFixed(1)}%</span>
          </span>
        </div>

        {/* Sub-balances breakdown: Cash vs Crypto */}
        <div className="relative z-10 flex items-center gap-4 text-xs font-medium text-slate-400 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Cash: <strong className="text-white font-semibold">{hideBalances ? '••••' : formatCurrency(availVal, currentCurrency)}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff4d38]" />
            <span>Invested: <strong className="text-white font-semibold">{hideBalances ? '••••' : formatCurrency(investVal, currentCurrency)}</strong></span>
          </div>
        </div>

        {/* 3 Core Quick Action Buttons */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
          {/* Deposit Button */}
          <button
            type="button"
            id="dashboard-btn-add-funds"
            onClick={() => setDepositModalOpen(true)}
            className="flex items-center justify-center gap-1.5 py-3 px-2 sm:px-4 rounded-2xl bg-gradient-to-r from-[#ff4d38] to-[#ff5d42] hover:from-[#ff3a22] hover:to-[#ff4d38] text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Deposit</span>
          </button>

          {/* Send / Transfer Button */}
          <button
            type="button"
            id="dashboard-btn-send"
            onClick={() => setTransferModalOpen(true)}
            className="flex items-center justify-center gap-1.5 py-3 px-2 sm:px-4 rounded-2xl bg-[#1a1a20] hover:bg-[#22222a] text-white font-semibold text-xs sm:text-sm border border-white/10 active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            <Send className="w-3.5 h-3.5 text-slate-300" />
            <span>Send</span>
          </button>

          {/* Withdraw Button */}
          <button
            type="button"
            id="dashboard-btn-withdraw"
            onClick={() => setWithdrawModalOpen(true)}
            className="flex items-center justify-center gap-1.5 py-3 px-2 sm:px-4 rounded-2xl bg-[#1a1a20] hover:bg-[#22222a] text-white font-semibold text-xs sm:text-sm border border-white/10 active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            <ArrowUpRight className="w-4 h-4 text-slate-300" />
            <span>Withdraw</span>
          </button>
        </div>
      </motion.div>

      {/* 3. Live Crypto & Global Markets (Interactive Horizontal Carousel) */}
      <motion.div variants={cardItemVariants} className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Top Investment & Market Rates</span>
          </h2>
          <button
            type="button"
            onClick={() => setActiveTab('invest')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>View Plans</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <motion.div
          variants={carouselContainerVariants}
          className="flex gap-3 overflow-x-auto pb-1 scrollbar-none snap-x"
        >
          {displayAssets.map((asset, index) => {
            const isPositive = (asset.change24h ?? 0) >= 0;
            const priceFormatted = formatCurrency(asset.priceUsd ?? 0, currentCurrency);

            return (
              <motion.div
                key={asset.symbol || index}
                variants={carouselItemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('invest')}
                className="shrink-0 w-[145px] sm:w-[160px] p-3.5 rounded-[22px] bg-[#121216] border border-white/[0.08] hover:border-emerald-500/30 shadow-md transition-all cursor-pointer snap-start space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="text-white font-bold">{asset.symbol}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[65px]">
                    {asset.name}
                  </span>
                </div>

                <div className="text-base sm:text-lg font-extrabold font-mono text-white tracking-tight truncate">
                  {priceFormatted}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className={`font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? '↑ +' : '↓ '}{Math.abs(asset.change24h ?? 0).toFixed(1)}%
                  </span>
                  {/* Mini Sparkline Curve */}
                  <svg className="w-11 h-3" viewBox="0 0 50 15">
                    <path
                      d={isPositive ? 'M 0,12 Q 15,10 25,4 T 50,2' : 'M 0,3 Q 15,6 25,11 T 50,13'}
                      fill="none"
                      stroke={isPositive ? '#34d399' : '#f43f5e'}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* 4. Vault Card Banner (Instant Virtual & Physical Card Access) */}
      <motion.div
        variants={cardItemVariants}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setActiveTab('cards')}
        className="p-3.5 sm:p-4 rounded-[24px] bg-gradient-to-r from-[#17171d]/90 via-[#15151a]/95 to-[#121216] border border-white/10 hover:border-white/20 shadow-lg flex items-center justify-between transition-all cursor-pointer group text-white backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          {/* 3D Hologram Debit Card Teaser */}
          <div className="w-11 h-7 rounded-md bg-gradient-to-tr from-[#2a2a35] via-[#3a3a48] to-[#1e1e24] border border-white/25 shadow-md flex items-center justify-between px-1.5 shrink-0">
            <span className="w-2 h-1.5 rounded-xs bg-amber-400 inline-block" />
            <span className="text-[7px] font-black italic tracking-tighter text-white/90">VISA</span>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Growvest Vault Card
            </h3>
            <p className="text-[11px] text-slate-400">
              Spend cash and crypto worldwide with 0% FX fees
            </p>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-all shrink-0">
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </motion.div>

      {/* 5. Investment History Section */}
      <motion.div
        variants={cardItemVariants}
        className="p-5 sm:p-6 rounded-[28px] bg-[#121216]/95 border border-white/[0.08] shadow-2xl space-y-4 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                My Investments
              </h2>
              <p className="text-[11px] text-slate-400">
                Active positions and portfolio performance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('invest')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore Plans</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {(!effectiveInvestments || effectiveInvestments.length === 0) ? (
          <div className="py-6 text-center space-y-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              No active investment positions yet
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Start earning daily yields with guaranteed capital protection.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('invest')}
              className="mt-2 px-4 py-2 rounded-xl bg-[#d83c18] hover:bg-[#c23312] text-white text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Choose an Investment Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {effectiveInvestments.slice(0, 6).map(pos => {
              const yieldAmount = pos.accruedYieldUsd || 0;
              const returnPercentage = pos.amountUsd > 0
                ? ((yieldAmount / pos.amountUsd) * 100)
                : 0;
              const formattedYield = formatCurrency(yieldAmount, currentCurrency);
              const formattedInvested = formatCurrency(pos.amountUsd, currentCurrency);
              const startDateFormatted = new Date(pos.startDate).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={pos.id}
                  onClick={() => setActiveTab('invest')}
                  className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-500/20 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                          {pos.planTitle}
                        </h4>
                        <span className="text-[10px] text-slate-400 block truncate">
                          Started {startDateFormatted}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status Tag */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        {pos.status || 'Active'}
                      </span>

                      {/* Return percentage badge */}
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                        <span>↑ +{returnPercentage.toFixed(1)}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Financial metrics subline */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Capital Invested</span>
                      <span className="font-mono font-bold text-white">
                        {formattedInvested}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">Accrued Profit</span>
                      <span className="font-mono font-extrabold text-emerald-400">
                        +{formattedYield}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* 6. Real Client Recent Activity Section */}
      <motion.div
        variants={cardItemVariants}
        className="p-5 sm:p-6 rounded-[28px] bg-[#121216]/95 border border-white/[0.08] shadow-2xl space-y-3 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white">
            Recent Activity
          </h2>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            See All
          </button>
        </div>

        {userTransactions.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-400">
              <Clock className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              No recent transactions recorded
            </p>
            <button
              onClick={() => setDepositModalOpen(true)}
              className="text-xs font-bold text-emerald-400 hover:underline pt-1 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Deposit funds to get started</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {userTransactions.slice(0, 5).map(tx => {
              const isPos = tx.type === 'deposit' || tx.type === 'transfer_in';
              const typeTitle = tx.type === 'deposit'
                ? 'Deposit Received'
                : tx.type === 'withdrawal'
                ? 'Withdrawal Payout'
                : tx.type === 'transfer'
                ? 'Transfer Sent'
                : tx.type === 'card_purchase'
                ? 'Card Payment'
                : 'Account Transaction';
              const dateSubtitle = new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
              const amountFormatted = `${isPos ? '+' : '-'}${formatCurrency(tx.amountUsd, currentCurrency)}`;

              return (
                <div
                  key={tx.id}
                  onClick={() => setActiveTab('activity')}
                  className="py-3 flex items-center justify-between hover:bg-white/[0.04] px-1.5 rounded-2xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#18181c] border border-white/10 flex items-center justify-center text-slate-300 font-bold shrink-0">
                      {isPos ? (
                        <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-rose-400" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        {typeTitle}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {dateSubtitle} • <span className="capitalize">{tx.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono font-bold text-xs sm:text-sm ${
                        isPos ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {amountFormatted}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* 6. Valuation Trajectory Chart */}
      <motion.div
        variants={cardItemVariants}
        className="p-5 sm:p-6 rounded-[28px] bg-[#121216]/95 border border-white/[0.08] shadow-2xl space-y-3 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ff4d38]" />
              <span>Valuation Trajectory</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Live portfolio growth curve
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#18181c] border border-white/10 text-xs font-mono">
            {(['7D', '30D', '90D', '1Y'] as const).map(tFrame => (
              <button
                key={tFrame}
                type="button"
                onClick={() => setTimeRange(tFrame)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                  timeRange === tFrame
                    ? 'bg-[#ff4d38] text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tFrame}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Glowing Red Performance Wave */}
        <div className="h-32 sm:h-36 w-full pt-2 relative flex flex-col justify-end">
          <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="redDashCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff4d38" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ff4d38" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path
              d="M 0,95 C 90,90 140,70 200,80 C 260,90 320,35 400,28 C 450,18 480,22 500,8"
              fill="none"
              stroke="#ff4d38"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 0,95 C 90,90 140,70 200,80 C 260,90 320,35 400,28 C 450,18 480,22 500,8 L 500,120 L 0,120 Z"
              fill="url(#redDashCurveGrad)"
            />
            <circle cx="500" cy="8" r="4" fill="#ff4d38" />
            <circle cx="500" cy="8" r="8" fill="#ff4d38" opacity="0.4" className="animate-ping" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
};


