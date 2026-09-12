import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { userRouteMiddleware, AuthProfile } from '../middleware';
import { InvestorLayout } from '../components/InvestorLayout';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Layers,
  Calendar,
  ChevronRight,
  Zap,
  Lock,
  Send,
  CreditCard,
  Eye,
  EyeOff,
  Bell,
  Activity,
  ArrowRight
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
      // 1. Fetch latest profile from Supabase
      const { data: pData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (pData) {
        setProfile(pData as AuthProfile);
      }

      // 2. Fetch user's investments from Supabase
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

      // 3. Fetch recent activity from transactions table
      let activityList: ActivityItem[] = [];
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (txData && txData.length > 0) {
        activityList = txData.map((t) => ({
          id: t.id || t.tx_hash,
          type: t.type || 'transaction',
          amount: Number(t.amount || 0),
          status: t.status || 'completed',
          description: t.description || 'Ledger Settlement',
          created_at: t.created_at || new Date().toISOString()
        }));
      }

      // Fallback sample activity if fresh account
      if (activityList.length === 0) {
        const now = new Date();
        activityList = [
          {
            id: 'TX-88921001',
            type: 'deposit',
            amount: 25000,
            status: 'completed',
            description: 'Institutional Wire Deposit',
            created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'TX-88921002',
            type: 'investment',
            amount: 15000,
            status: 'completed',
            description: 'Silver 5-Day Yield Position',
            created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
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
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading Client Vault...
          </p>
        </div>
      </div>
    );
  }

  // Active investments totals
  const activeInvestmentsList = investments.filter((i) => i.status === 'active');
  const activeInvestmentsTotal = activeInvestmentsList.reduce((acc, curr) => acc + curr.amount, 0);

  // Cash and Invested balances
  const cashBalance = Number(profile?.balance || 0);
  const investedBalance = activeInvestmentsTotal;
  const totalPortfolioBalance = profile?.total_balance !== undefined && profile?.total_balance !== null
    ? Number(profile.total_balance)
    : cashBalance + investedBalance;

  // Header Greeting: "Hello, Evans"
  const rawName = profile?.full_name || profile?.email?.split('@')[0] || 'Evans';
  const displayGreetingName = rawName.toLowerCase().includes('evans') ? 'Evans' : rawName.split(' ')[0];

  return (
    <InvestorLayout profile={profile} activeRoute="dashboard" onNavigate={navigate}>
      <div className="max-w-xl sm:max-w-2xl lg:max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-12">
        
        {/* ============================================================ */}
        {/* 1. HEADER: "Hello, Evans" & "Verified Client Vault"          */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-blue-500/20 border-2 border-white">
              {displayGreetingName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                Hello, {displayGreetingName}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500">
                  Verified Client Vault
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => profile && loadData(profile.id)}
              disabled={refreshing}
              aria-label="Refresh Dashboard Data"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/payments')}
              aria-label="Notifications & Activity"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-xs relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. CARD: "TOTAL PORTFOLIO BALANCE $0.00"                     */}
        {/*    with "Cash: $0.00 Invested: $0.00"                        */}
        {/*    3 Buttons: + Deposit, Send, Withdraw                      */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#0066FF] via-[#0080FF] to-[#00BEF2] text-white shadow-xl shadow-blue-600/20 border border-blue-400/30 transition-all">
          {/* Cosmic gloss background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Top row: Label & Eye Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-blue-100/90 font-mono">
                  TOTAL PORTFOLIO BALANCE
                </span>
                <button
                  type="button"
                  onClick={() => setHideBalance(!hideBalance)}
                  className="text-blue-200 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle balance visibility"
                >
                  {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white backdrop-blur-xs border border-white/20">
                USD Vault
              </span>
            </div>

            {/* Total Balance Big Display */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-mono text-white drop-shadow-xs">
                {hideBalance
                  ? '••••••••'
                  : `$${totalPortfolioBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </h2>

              {/* Sub-balances: Cash & Invested */}
              <div className="flex items-center gap-4 text-xs font-medium text-blue-100 mt-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="opacity-80">Cash:</span>
                  <span className="font-bold text-white">
                    {hideBalance ? '••••' : `$${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/40" />
                <div className="flex items-center gap-1.5">
                  <span className="opacity-80">Invested:</span>
                  <span className="font-bold text-white">
                    {hideBalance ? '••••' : `$${investedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Buttons: + Deposit, Send, Withdraw */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {/* + Deposit Button */}
              <button
                type="button"
                onClick={() => setDepositModalOpen(true)}
                className="py-2.5 px-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>+ Deposit</span>
              </button>

              {/* Send Button (Opens 3-Step Send Flow) */}
              <button
                type="button"
                onClick={() => setTransferModalOpen(true)}
                className="py-2.5 px-2 rounded-xl bg-blue-700/60 hover:bg-blue-700/80 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>

              {/* Withdraw Button */}
              <button
                type="button"
                onClick={() => navigate('/app/withdraw')}
                className="py-2.5 px-2 rounded-xl bg-blue-700/60 hover:bg-blue-700/80 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. SECTION: "Top Investment & Market Rates"                   */}
        {/*    BTC $87,420.00 +1.54% and ETH $3,120.50 +3.2%            */}
        {/* ============================================================ */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Top Investment & Market Rates</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400 font-mono">
              Live Rates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* BTC Card */}
            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold text-base font-serif">
                  ₿
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Bitcoin (BTC)</span>
                  <span className="text-[11px] text-slate-500">Benchmark Asset</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-slate-900 font-mono block">
                  $87,420.00
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 font-mono">
                  +1.54%
                </span>
              </div>
            </div>

            {/* ETH Card */}
            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-base">
                  Ξ
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Ethereum (ETH)</span>
                  <span className="text-[11px] text-slate-500">Smart Liquidity</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-slate-900 font-mono block">
                  $3,120.50
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 font-mono">
                  +3.20%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. SECTION: "Growvest Vault Card"                            */}
        {/* ============================================================ */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Growvest Vault Card</span>
            </h3>
            <button
              type="button"
              onClick={() => navigate('/app/cards')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Card</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sleek Vault Card Preview Banner */}
          <div
            onClick={() => navigate('/app/cards')}
            className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/60 shadow-md flex items-center justify-between cursor-pointer group hover:scale-[1.005] transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-xs uppercase text-slate-200">
                  GROWVEST VAULT
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  VISA
                </span>
              </div>
              <div className="font-mono text-sm tracking-widest text-white font-bold pt-1">
                •••• •••• •••• 8892
              </div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">
                {profile?.full_name || 'EVANS CREATIVE HUB'}
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
              <div className="text-[11px] text-slate-400 font-mono">
                Exp: 09/29
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. SECTION: "My Investments"                                 */}
        {/*    with "No active investment positions yet"                 */}
        {/*    and "Explore Plans" button                                */}
        {/* ============================================================ */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>My Investments</span>
            </h3>
            <button
              type="button"
              onClick={() => navigate('/app/invest')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Plans</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeInvestmentsList.length === 0 ? (
            /* Empty State exactly as requested */
            <div className="py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  No active investment positions yet
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xs mx-auto">
                  Select an algorithmic 5-day yield or compounding plan to start growing your portfolio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/app/invest')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Explore Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Populated Active Positions */
            <div className="space-y-2.5">
              {activeInvestmentsList.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {inv.plan_name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Allocation: ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 block font-mono">
                      +{inv.roi_percent}% ROI
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Active 5-Day
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 6. SECTION: "Recent Activity"                                */}
        {/* ============================================================ */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Recent Activity</span>
            </h3>
            <button
              type="button"
              onClick={() => navigate('/app/payments')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 font-medium">
              No recent activity recorded.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivity.map((tx) => {
                const isDeposit = tx.type.toLowerCase().includes('deposit');
                const isWithdraw = tx.type.toLowerCase().includes('withdraw');
                return (
                  <div key={tx.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isDeposit
                            ? 'bg-emerald-50 text-emerald-600'
                            : isWithdraw
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {isDeposit && <ArrowDownLeft className="w-4 h-4" />}
                        {isWithdraw && <ArrowUpRight className="w-4 h-4" />}
                        {!isDeposit && !isWithdraw && <Layers className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {tx.description || tx.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-black font-mono block ${
                          isDeposit ? 'text-emerald-600' : isWithdraw ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        {isDeposit ? '+' : isWithdraw ? '-' : ''}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 capitalize">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 7. SECTION: "Valuation Trajectory" Chart                     */}
        {/* ============================================================ */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Valuation Trajectory
              </h3>
            </div>

            {/* Timeframe selector: 7D, 30D, 90D, 1Y */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100">
              {(['7D', '30D', '90D', '1Y'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    timeRange === range
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic SVG Valuation Curve */}
          <div className="h-40 w-full relative pt-2">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 130 C 80 120, 140 90, 220 75 C 300 60, 380 40, 500 15 L 500 150 L 0 150 Z"
                fill="url(#curveGradient)"
              />
              <path
                d="M 0 130 C 80 120, 140 90, 220 75 C 300 60, 380 40, 500 15"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="500" cy="15" r="4" fill="#2563eb" className="animate-ping" />
              <circle cx="500" cy="15" r="4" fill="#2563eb" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
            <span>Period Start</span>
            <span className="font-bold text-emerald-600">+18.4% Cumulative Net Yield</span>
            <span>Current Settlement</span>
          </div>
        </div>

      </div>

      {/* Global Modals for Deposit & Send */}
      <DepositModal />
      <TransferModal />
    </InvestorLayout>
  );
}
