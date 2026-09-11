import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Clock,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Coins,
  Shield,
  Bot,
  Activity,
  Layers,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface NexusAdminOverviewProps {
  onNavigateTab: (tab: any) => void;
}

export const NexusAdminOverview: React.FC<NexusAdminOverviewProps> = ({ onNavigateTab }) => {
  const { allUsers, transactions, kycSubmissions, companyDepositWallets, investmentPlans, getAdminStats } = useAuth();
  const { addNotification } = useApp();

  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [activeScrubber, setActiveScrubber] = useState<string>('20-25');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(3);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const stats = getAdminStats();
  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
  const pendingKycCount = kycSubmissions.filter(k => k.status === 'pending').length;

  // Chart data points matching the wave
  const chartPoints = [
    { x: 30, y: 155, label: '1-5', btc: '5.12 BTC', val: '$288,400.00', pct: '+1.8%' },
    { x: 100, y: 120, label: '5-10', btc: '5.30 BTC', val: '$297,200.00', pct: '+2.1%' },
    { x: 170, y: 160, label: '10-15', btc: '5.18 BTC', val: '$291,000.00', pct: '+0.9%' },
    { x: 240, y: 135, label: '15-20', btc: '5.45 BTC', val: '$305,800.00', pct: '+3.2%' },
    { x: 310, y: 85, label: '20-25', btc: '5.74 BTC', val: '$322,500.32', pct: '+2.5%' },
    { x: 380, y: 140, label: '25-30', btc: '5.62 BTC', val: '$318,100.00', pct: '+1.9%' },
    { x: 450, y: 130, label: '30+', btc: '5.70 BTC', val: '$321,900.00', pct: '+2.2%' },
  ];

  const handleNotifyMe = () => {
    setShowNotificationToast(true);
    addNotification({
      type: 'system',
      title: 'Institutional Signals Activated',
      message: 'Real-time AI algorithmic signals and price alerts configured for your device.'
    });
    setTimeout(() => setShowNotificationToast(false), 3500);
  };

  return (
    <div className="space-y-4 text-slate-100 font-sans">
      {/* ROW 1: 3 TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Trades / Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="p-4 sm:p-5 rounded-3xl bg-[#13151b] border border-white/5 hover:border-white/15 transition-all shadow-xl flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium tracking-wide">Total Trades</span>
            <button className="text-slate-500 hover:text-slate-300 p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2.5 mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              1,240
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>+1.5%</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Active client accounts: {allUsers.length}</span>
            <span className="text-emerald-400 group-hover:underline">View users →</span>
          </div>
        </div>

        {/* Card 2: Volume Outputs */}
        <div
          onClick={() => onNavigateTab('transactions')}
          className="p-4 sm:p-5 rounded-3xl bg-[#13151b] border border-white/5 hover:border-white/15 transition-all shadow-xl flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium tracking-wide">Volume Outputs</span>
            <button className="text-slate-500 hover:text-slate-300 p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2.5 mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              $1.2M
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-semibold text-xs">
              <TrendingDown className="w-3 h-3" />
              <span>-1.42%</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Pending Payouts: {pendingWithdrawals.length}</span>
            <span className="text-rose-400 group-hover:underline">Manage ledger →</span>
          </div>
        </div>

        {/* Card 3: Total Transactions */}
        <div
          onClick={() => onNavigateTab('deposits')}
          className="p-4 sm:p-5 rounded-3xl bg-[#13151b] border border-white/5 hover:border-white/15 transition-all shadow-xl flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium tracking-wide">Total Transactions</span>
            <button className="text-slate-500 hover:text-slate-300 p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2.5 mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              3,450
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>+1.5%</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Pending Inflows: {pendingDeposits.length}</span>
            <span className="text-emerald-400 group-hover:underline">Approve deposits →</span>
          </div>
        </div>
      </div>

      {/* ROW 2: MAIN CHART CARD + HERO BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Chart: Portfolio Analytics (8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-[#13151b] border border-white/5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Header row */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium">Total Assets</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1.5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-200">
                  Portfolio Analytics
                </h2>
                <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                    {isBalanceHidden ? '••••••••' : '$491,012'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-xs border border-emerald-500/25">
                    2.5%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-xs border border-emerald-500/25">
                    $2520
                  </span>
                  <button
                    onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={isBalanceHidden ? 'Show numbers' : 'Hide numbers'}
                  >
                    {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Timeframe Dropdown / Pill */}
              <div className="flex items-center gap-1 bg-[#1c1f28] p-1 rounded-2xl border border-white/5 self-start sm:self-auto">
                {(['1D', '1W', '1M', '1Y'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTimeframe === tf
                        ? 'bg-[#282c38] text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Glowing Wave SVG Chart */}
          <div className="my-6 relative h-48 sm:h-56 w-full">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 text-[10px] text-slate-400 font-mono">
              <div className="border-b border-white/10 w-full flex justify-end pr-1">500K</div>
              <div className="border-b border-white/10 w-full flex justify-end pr-1">450K</div>
              <div className="border-b border-white/10 w-full flex justify-end pr-1">400K</div>
            </div>

            {/* Vertical grid dashed lines */}
            <div className="absolute inset-0 grid grid-cols-5 pointer-events-none opacity-10">
              <div className="border-r border-dashed border-white" />
              <div className="border-r border-dashed border-white" />
              <div className="border-r border-dashed border-white" />
              <div className="border-r border-dashed border-white" />
              <div className="border-r border-dashed border-white" />
            </div>

            {/* SVG Wave */}
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 480 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Area fill */}
              <path
                d="M 30,155 Q 65,140 100,120 T 170,160 T 240,135 T 310,85 T 380,140 T 450,130 L 450,200 L 30,200 Z"
                fill="url(#chartGradient)"
              />

              {/* Spline Path */}
              <path
                d="M 30,155 Q 65,140 100,120 T 170,160 T 240,135 T 310,85 T 380,140 T 450,130"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                filter="url(#glow)"
              />

              {/* Active Marker Point */}
              <circle
                cx={chartPoints[hoveredPoint ?? 4].x}
                cy={chartPoints[hoveredPoint ?? 4].y}
                r="5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="3"
                className="animate-pulse"
              />

              {/* Dotted Vertical Guide Line */}
              <line
                x1={chartPoints[hoveredPoint ?? 4].x}
                y1={chartPoints[hoveredPoint ?? 4].y}
                x2={chartPoints[hoveredPoint ?? 4].x}
                y2="200"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />
            </svg>

            {/* Interactive Tooltip Card positioned at the peak */}
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 sm:left-[55%] sm:-translate-x-1/2 bg-[#1b1f2b]/95 border border-emerald-500/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md text-left z-10 transition-all pointer-events-none"
            >
              <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400">
                <span>Balance</span>
                <span className="font-mono text-slate-500">Jan 18, 2026</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-white mt-0.5">
                <span>{chartPoints[hoveredPoint ?? 4].btc}</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                  {chartPoints[hoveredPoint ?? 4].pct}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {chartPoints[hoveredPoint ?? 4].val}
              </div>
            </div>
          </div>

          {/* Timeline Range Scrubber Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400 font-medium overflow-x-auto">
            {(['1-5', '10-15', '15-20', '20-25', '25-30'] as const).map((range, idx) => (
              <button
                key={range}
                onClick={() => {
                  setActiveScrubber(range);
                  setHoveredPoint(idx);
                }}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  activeScrubber === range
                    ? 'bg-white/10 text-white font-bold'
                    : 'hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Card: Switch to Algorithmic Trading (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-[#16222f] via-[#101924] to-[#0c121a] border border-white/10 p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          {/* Sparkle decorative element */}
          <div className="absolute top-4 right-4 text-emerald-400/80">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              Switch to<br />Algorithmic Trading
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-xs">
              Set up trading bots and earn while you sleep with institutional quantitative strategies.
            </p>

            <button
              onClick={() => onNavigateTab('plans')}
              className="mt-4 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              View Offers
            </button>
          </div>

          {/* 3D Realistic Gold Coins Graphic */}
          <div className="relative mt-6 flex justify-end items-end h-36">
            <div className="relative w-full h-full flex items-center justify-end pr-2">
              {/* Ethereum Silver/Gold Coin */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 shadow-2xl transform -rotate-12 translate-x-3 translate-y-2 border-2 border-amber-300/60 flex items-center justify-center text-slate-950 font-black text-xl">
                <div className="w-full h-full rounded-full border border-amber-700/40 flex items-center justify-center bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-inner">
                  <span className="drop-shadow-md text-amber-950 font-extrabold text-2xl">Ξ</span>
                </div>
              </div>

              {/* Bitcoin Gold Giant Coin */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 via-amber-400 to-yellow-600 p-1.5 shadow-2xl z-10 border-2 border-yellow-200/80 flex items-center justify-center text-slate-950 font-black">
                <div className="w-full h-full rounded-full border-2 border-amber-800/40 flex items-center justify-center bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-inner">
                  <span className="drop-shadow-lg text-amber-950 font-black text-3xl">₿</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: THREE LOWER ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Card 1: KuCoin / Token Bar Chart (4 cols) */}
        <div
          onClick={() => onNavigateTab('wallets')}
          className="md:col-span-4 p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl flex flex-col justify-between cursor-pointer hover:border-white/10 transition-all"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
                KC
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Kucoin</h4>
                <p className="text-[10px] text-slate-400">Token</p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-sm text-white font-sans">$45,250</div>
              <div className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                <span>+5.2%</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          {/* 3D Vertical Bar Chart */}
          <div className="my-6 grid grid-cols-4 gap-3 items-end h-28 px-2">
            {/* Dec */}
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-gradient-to-t from-slate-800 to-slate-700 rounded-lg h-[55%] border-t border-white/20 shadow-md" />
              <span className="text-[10px] text-slate-400 font-medium">Dec</span>
            </div>

            {/* Jan */}
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-gradient-to-t from-slate-800 to-slate-700 rounded-lg h-[35%] border-t border-white/20 shadow-md" />
              <span className="text-[10px] text-slate-400 font-medium">Jan</span>
            </div>

            {/* Feb (Green Glow Highlight) */}
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-gradient-to-t from-emerald-900 via-emerald-700 to-emerald-500 rounded-lg h-[85%] border-t border-emerald-300 shadow-lg shadow-emerald-500/30" />
              <span className="text-[10px] text-emerald-400 font-bold">Feb</span>
            </div>

            {/* Mar (Red Glow Highlight) */}
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-gradient-to-t from-rose-950 via-rose-800 to-rose-600 rounded-lg h-[45%] border-t border-rose-400 shadow-lg shadow-rose-500/20" />
              <span className="text-[10px] text-rose-400 font-medium">Mar</span>
            </div>
          </div>

          {/* Footer metrics */}
          <div className="grid grid-cols-4 gap-1 pt-2 border-t border-white/5 text-[10px] text-center text-slate-400 font-mono">
            <div>$12,000</div>
            <div>$5,000</div>
            <div className="text-emerald-400 font-bold">+$15,000</div>
            <div className="text-rose-400">-$8,000</div>
          </div>
        </div>

        {/* Card 2: Assets Allocation Orbital Ring (4 cols) */}
        <div
          onClick={() => onNavigateTab('wallets')}
          className="md:col-span-4 p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl flex flex-col justify-between cursor-pointer hover:border-white/10 transition-all"
        >
          {/* Header */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <div className="w-2 h-2 rounded-full border-2 border-emerald-400" />
              <span>Assets Allocation</span>
            </div>
            <button className="text-slate-500 hover:text-slate-300">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Glowing Orbital Ring with Crypto Badges */}
          <div className="relative my-4 flex items-center justify-center h-36">
            {/* Outer Segmented Orbital Glow Ring */}
            <div className="w-32 h-32 rounded-full border-4 border-amber-500/80 border-t-purple-500 border-l-cyan-500 border-b-emerald-500 shadow-2xl flex items-center justify-center relative animate-spin-slow">
              {/* Floating Crypto Token Icons on Perimeter */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center border-2 border-[#13151b] shadow-md">
                ₿
              </div>
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-[#13151b] shadow-md">
                Ξ
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center border-2 border-[#13151b] shadow-md">
                ₮
              </div>
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-bold text-[9px] flex items-center justify-center border-2 border-[#13151b] shadow-md">
                Ð
              </div>
            </div>

            {/* Inner Center Info */}
            <div className="absolute text-center z-10">
              <span className="text-[10px] text-slate-400 font-medium">Total Balance</span>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                $709,876.81
              </div>
              <span className="px-2 py-0.2 rounded-full bg-white/10 text-[9px] text-slate-300 font-mono">
                +4 Assets
              </span>
            </div>
          </div>

          <div className="text-[11px] text-center text-slate-400 font-mono pt-1">
            Custody Wallets: {companyDepositWallets.length} active cold storages
          </div>
        </div>

        {/* Card 3: ETH/USD Multi-Line Graph (4 cols) */}
        <div
          onClick={() => onNavigateTab('transactions')}
          className="md:col-span-4 p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl flex flex-col justify-between cursor-pointer hover:border-white/10 transition-all"
        >
          {/* Header & Legend */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white">ETH/USD</h4>
              <button className="text-slate-500 hover:text-slate-300">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-400">Buy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="text-slate-400">Sell</span>
              </div>
            </div>
          </div>

          {/* Dual Line Chart */}
          <div className="my-3 relative h-28 w-full">
            {/* Price Grid */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 text-[9px] text-slate-400 font-mono">
              <div className="border-b border-white/10 w-full">40</div>
              <div className="border-b border-white/10 w-full">30</div>
              <div className="border-b border-white/10 w-full">20</div>
              <div className="border-b border-white/10 w-full">10</div>
              <div className="border-b border-white/10 w-full">0</div>
            </div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
              {/* Buy Line (Blue/Green) */}
              <path
                d="M 10,75 Q 40,70 70,55 T 130,48 T 190,30"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              {/* Sell Line (Red/Yellow) */}
              <path
                d="M 10,80 Q 40,75 70,60 T 130,68 T 190,65"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Weekday Axis */}
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono px-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Footer Metrics */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400">
            <div>
              <span className="text-slate-500">Total Market Cap: </span>
              <span className="font-bold text-white font-mono">B659.2</span>
            </div>
            <div className="font-mono text-slate-500">
              20% users • Jan 5th- Jan 12
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
