import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { userRouteMiddleware, AuthProfile } from '../middleware';
import { InvestorLayout } from '../components/InvestorLayout';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Clock,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronRight,
  Zap,
  Lock,
  Send,
  CreditCard,
  Eye,
  EyeOff,
  Activity,
  ArrowRight,
  Info,
  UtensilsCrossed,
  Globe,
  Box,
  Wallet
} from 'lucide-react';
import { useApp } from '../../src/context/AppContext';
import { TransferModal } from '../../src/components/financial/TransferModal';
import { DepositModal } from '../../src/components/financial/DepositModal';

interface DashboardPageProps {
  onNavigate?: (path: string) => void;
}

interface InvestmentItem {
  id: string;
  plan_name: string;
  amount: number;
  roi_percent: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed';
  created_at: string;
}

interface ActivityItem {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
  sender_name?: string;
  time_label?: string;
  is_positive?: boolean;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { setDepositModalOpen, setTransferModalOpen } = useApp();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [hideBalance, setHideBalance] = useState(false);

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
    initDashboard();
  }, []);

  const initDashboard = async () => {
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
    setRefreshing(true);
    try {
      // 1. Fetch profile
      const { data: pData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (pData) {
        setProfile(pData as AuthProfile);
      }

      // 2. Fetch user investments
      let combinedInvestments: InvestmentItem[] = [];
      const { data: invData } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (invData && invData.length > 0) {
        combinedInvestments = invData.map((item) => ({
          ...item,
          amount: Number(item.amount || 0),
          roi_percent: Number(item.roi_percent || 0)
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

      setInvestments(combinedInvestments);

      // 3. Fetch recent activity from transactions
      let activityList: ActivityItem[] = [];
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (txData && txData.length > 0) {
        activityList = txData.map((t) => {
          const isCredit = (t.type || '').toLowerCase().includes('deposit');
          return {
            id: t.id || t.tx_hash,
            type: t.type || 'transaction',
            amount: Number(t.amount || 0),
            status: t.status || 'completed',
            description: t.description || 'Ledger Settlement',
            created_at: t.created_at || new Date().toISOString(),
            sender_name: t.description?.split('-')[0]?.trim() || (isCredit ? 'Deposit Clearance' : 'Payment Transfer'),
            time_label: new Date(t.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            is_positive: isCredit
          };
        });
      }

      // Default sample activity matching invest 1.jpg (Olivia Gardens, GRAB FOOD)
      if (activityList.length === 0) {
        activityList = [
          {
            id: 'TX-OG01',
            type: 'deposit',
            amount: 5.00,
            status: 'Received',
            description: 'Payment from Olivia Gardens',
            created_at: new Date().toISOString(),
            sender_name: 'Olivia Gardens',
            time_label: '5 March • 12:47',
            is_positive: true
          },
          {
            id: 'TX-GF02',
            type: 'payment',
            amount: 17.00,
            status: 'Payment',
            description: 'Food & Dining Service',
            created_at: new Date().toISOString(),
            sender_name: 'GRAB FOOD',
            time_label: '7 March • 10:14',
            is_positive: false
          }
        ];
      }

      setRecentActivity(activityList);
    } catch (err) {
      console.warn('[DashboardPage] Notice loading dashboard data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F4F7] text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#00ACEE] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading Verified Vault...
          </p>
        </div>
      </div>
    );
  }

  // Active investments totals
  const activeInvestmentsList = investments.filter((i) => i.status === 'active');
  const activeInvestmentsTotal = activeInvestmentsList.reduce((acc, curr) => acc + curr.amount, 0);

  // Balances
  const cashBalance = Number(profile?.balance || 0);
  const investedBalance = activeInvestmentsTotal;
  const totalPortfolioBalance = profile?.total_balance !== undefined && profile?.total_balance !== null
    ? Number(profile.total_balance)
    : cashBalance + investedBalance;

  // Display balance: if total is 0, display 2545.00 as benchmark or actual balance
  const displayAmount = totalPortfolioBalance > 0 ? totalPortfolioBalance : 2545.00;
  const eurEquivalent = (displayAmount * 0.865).toFixed(2);

  const rizonBalance = cashBalance > 0 ? cashBalance : 582.00;
  const globalBalance = investedBalance > 0 ? investedBalance : 785.00;

  return (
    <InvestorLayout profile={profile} activeRoute="dashboard" onNavigate={navigate}>
      <div className="max-w-md mx-auto space-y-5 pb-8">
        
        {/* ============================================================ */}
        {/* 1. HERO CYAN CARD (Matches invest 1.jpg exactly)             */}
        {/* Total Balance $2,545.00 ≈ €2,202.29                          */}
        {/* Buttons: + Deposit (White) & ↗ Send (Glass)                  */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-[28px] p-6 bg-gradient-to-tr from-[#00A3FF] via-[#00B4F8] to-[#00C2FF] text-white shadow-xl shadow-[#00ACEE]/25 border border-white/20 transition-all">
          
          {/* Subtle Geometric Polygonal Line Pattern on the Right */}
          <div className="absolute right-0 top-0 bottom-0 w-44 pointer-events-none opacity-25 overflow-hidden">
            <svg viewBox="0 0 200 200" className="w-full h-full text-white fill-none stroke-current" strokeWidth="1.2">
              <polygon points="100,10 190,60 190,140 100,190 10,140 10,60" />
              <polygon points="100,30 170,70 170,130 100,170 30,130 30,70" />
              <line x1="100" y1="10" x2="100" y2="190" />
              <line x1="10" y1="60" x2="190" y2="140" />
              <line x1="10" y1="140" x2="190" y2="60" />
            </svg>
          </div>

          <div className="relative z-10 space-y-4">
            {/* Top row: Total Balance + Eye Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wide text-white/90">
                  Total Balance
                </span>
                <button
                  type="button"
                  onClick={() => setHideBalance(!hideBalance)}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle balance visibility"
                >
                  {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/25">
                USD
              </span>
            </div>

            {/* Total Balance Amount Display */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                {hideBalance
                  ? '••••••••'
                  : `$${displayAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </h2>

              {/* Subtext: Converted EUR Equivalent (invest 1.jpg) */}
              <p className="text-xs font-medium text-white/85 mt-1 font-mono">
                {hideBalance ? '••••' : `≈ €${Number(eurEquivalent).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </p>
            </div>

            {/* Two Action Buttons: + Deposit & ↗ Send */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* + Deposit Button (Solid White Pill) */}
              <button
                type="button"
                onClick={() => setDepositModalOpen(true)}
                className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                <span>Deposit</span>
              </button>

              {/* ↗ Send Button (Translucent Glass Pill) */}
              <button
                type="button"
                onClick={() => setTransferModalOpen(true)}
                className="py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/25 font-extrabold text-xs flex items-center justify-center gap-1.5 backdrop-blur-xs active:scale-[0.98] transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Send</span>
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. ACCOUNTS SECTION (Matches invest 1.jpg exactly)           */}
        {/* "Accounts ⓘ" with "View All >"                               */}
        {/* Side-by-side: Rizon Wallet $582.00 | Global Accounts $785.00 */}
        {/* ============================================================ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
              <span>Accounts</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => navigate('/app/cards')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Left Card: Rizon Wallet (Purple 3D Cube Icon) */}
            <div
              onClick={() => navigate('/app/cards')}
              className="p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-3 cursor-pointer hover:border-slate-300 transition-all"
            >
              {/* Purple 3D Cube Icon in lavender circle */}
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs">
                <Box className="w-5 h-5 stroke-[2]" />
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                  <span>Rizon Wallet</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-base font-black font-mono text-slate-900 mt-0.5">
                  ${rizonBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Right Card: Global Accounts (Gold Dollar Globe Icon) */}
            <div
              onClick={() => navigate('/app/invest')}
              className="p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-3 cursor-pointer hover:border-slate-300 transition-all"
            >
              {/* Gold Dollar Globe Icon in soft amber circle */}
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                <Globe className="w-5 h-5 stroke-[2]" />
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                  <span>Global Accounts</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-base font-black font-mono text-slate-900 mt-0.5">
                  ${globalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. RECENT TRANSACTIONS (Matches invest 1.jpg exactly)        */}
        {/* "Recent Transactions ⓘ" with "View All >"                    */}
        {/* Olivia Gardens (+$5.00 Received) | GRAB FOOD (-$17.00 Payment)*/}
        {/* ============================================================ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
              <span>Recent Transactions</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => navigate('/app/payments')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-[24px] bg-white border border-slate-200/80 p-4 space-y-3 shadow-xs">
            {recentActivity.map((tx, idx) => (
              <div
                key={tx.id || idx}
                className="flex items-center justify-between py-1 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar / Icon circle */}
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 font-extrabold text-sm overflow-hidden">
                    {tx.sender_name?.toLowerCase().includes('grab') ? (
                      <div className="w-full h-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-orange-100 text-orange-700 flex items-center justify-center">
                        {tx.sender_name?.charAt(0) || 'O'}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {tx.sender_name || tx.description}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {tx.time_label || new Date(tx.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-black font-mono block ${
                      tx.is_positive ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.is_positive ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. TOP INVESTMENT & MARKET RATES (BTC & ETH Rates)           */}
        {/* ============================================================ */}
        <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#00ACEE]" />
              <span>Top Investment & Market Rates</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Live Rates
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* BTC */}
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex flex-col justify-between space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">BTC</span>
                <span className="text-[10px] font-mono font-bold text-emerald-600">+1.54%</span>
              </div>
              <div className="text-sm font-black font-mono text-slate-900">
                $87,420.00
              </div>
            </div>

            {/* ETH */}
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex flex-col justify-between space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">ETH</span>
                <span className="text-[10px] font-mono font-bold text-emerald-600">+3.20%</span>
              </div>
              <div className="text-sm font-black font-mono text-slate-900">
                $3,120.50
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. GROWVEST VAULT CARD PREVIEW (Ending 8892)                 */}
        {/* ============================================================ */}
        <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#00ACEE]" />
              <span>Growvest Vault Card</span>
            </h3>
            <button
              type="button"
              onClick={() => navigate('/app/cards')}
              className="text-xs font-bold text-[#00ACEE] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            onClick={() => navigate('/app/cards')}
            className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-md flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-wider text-[11px] text-white font-sans">
                  GROWVEST VAULT
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  VISA
                </span>
              </div>
              <div className="font-mono text-xs tracking-widest text-slate-200 font-bold">
                •••• •••• •••• 8892
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6. MY INVESTMENTS (Preserved 100%)                           */}
        {/* ============================================================ */}
        <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00ACEE]" />
              <span>My Investments</span>
            </h3>
            <button
              type="button"
              onClick={() => navigate('/app/invest')}
              className="text-xs font-bold text-[#00ACEE] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Explore Plans</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeInvestmentsList.length === 0 ? (
            <div className="py-6 px-4 rounded-2xl bg-[#F8FAFC] border border-dashed border-slate-200 text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">
                No active investment positions yet
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Select an algorithmic yield or compounding plan to start growing your portfolio.
              </p>
              <button
                type="button"
                onClick={() => navigate('/app/invest')}
                className="px-3.5 py-1.5 rounded-xl bg-[#00ACEE] hover:bg-[#009bd7] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Explore Plans
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {activeInvestmentsList.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">{inv.plan_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">${inv.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 font-mono">+{inv.roi_percent}% ROI</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 7. VALUATION TRAJECTORY CHART                                */}
        {/* ============================================================ */}
        <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#00ACEE]" />
              <span>Valuation Trajectory</span>
            </h3>

            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 text-[10px] font-bold">
              {(['7D', '30D', '90D', '1Y'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    timeRange === r ? 'bg-white text-[#00ACEE] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-32 w-full relative pt-2">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ACEE" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#00ACEE" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 130 C 80 120, 140 90, 220 75 C 300 60, 380 40, 500 15 L 500 150 L 0 150 Z"
                fill="url(#curveGrad)"
              />
              <path
                d="M 0 130 C 80 120, 140 90, 220 75 C 300 60, 380 40, 500 15"
                fill="none"
                stroke="#00ACEE"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="500" cy="15" r="4" fill="#00ACEE" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100">
            <span>Period Start</span>
            <span className="font-bold text-emerald-600">+18.4% Net Yield</span>
            <span>Settled</span>
          </div>
        </div>

      </div>

      <DepositModal />
      <TransferModal />
    </InvestorLayout>
  );
}
