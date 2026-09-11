import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  Layers,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';

export const AnalyticsView: React.FC = () => {
  const { setActiveTab, currentCurrency } = useApp();
  const { wallet } = useAuth();

  const [timeframe, setTimeframe] = useState<'This Week' | 'Month' | 'Year'>('This Week');
  const [category, setCategory] = useState<'Money' | 'Crypto' | 'All'>('Money');

  const barData = [
    { day: 'Sun', height: 45, active: false },
    { day: 'Mon', height: 75, active: false },
    { day: 'Tue', height: 60, active: false },
    { day: 'Wed', height: 95, active: true },
    { day: 'Thu', height: 50, active: false },
    { day: 'Fri', height: 65, active: false },
    { day: 'Sat', height: 40, active: false }
  ];

  return (
    <div id="growvest-analytics-view" className="max-w-md mx-auto space-y-6 pb-8 text-white">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 text-white hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          aria-label="Search transactions"
          className="w-10 h-10 rounded-full bg-[#18181c] border border-white/10 hover:border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Category Dropdown & Timeframe Switcher */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#151518] border border-white/10 text-xs font-semibold text-white hover:bg-[#1c1c22] transition-colors"
          >
            <span>{category}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#151518] border border-white/10 text-xs">
          {(['This Week', 'Month', 'Year'] as const).map(tf => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metric & Vertical Bar Chart */}
      <div className="p-6 rounded-3xl bg-[#121216] border border-white/10 space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Spent</span>
            <div className="text-3xl font-extrabold font-mono text-white tracking-tight mt-0.5">
              $213,00
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-mono font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>10.40%</span>
          </div>
        </div>

        {/* Vertical Glowing Bar Columns */}
        <div className="h-44 flex items-end justify-between gap-2.5 pt-4">
          {barData.map(col => (
            <div key={col.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-full bg-[#1c1c22] rounded-2xl h-full flex flex-col justify-end p-1 relative overflow-hidden">
                <div
                  style={{ height: `${col.height}%` }}
                  className={`w-full rounded-xl transition-all duration-500 ${
                    col.active
                      ? 'bg-gradient-to-t from-[#ff4d4d] to-[#ff6b6b] shadow-[0_0_15px_rgba(255,77,77,0.5)]'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-mono ${
                  col.active ? 'text-white font-bold' : 'text-slate-500'
                }`}
              >
                {col.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Micro-Visualizer Bento (Heatmap Matrix & Net Cashflow Equalizer) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Heatmap Matrix Mini Widget */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#121216] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Income</span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center">
              ▲ 20%
            </span>
          </div>
          <div className="text-xl font-extrabold font-mono text-white">$220</div>

          {/* Matrix Heatmap Grid */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[0.2, 0.4, 0.9, 0.2, 0.1, 0.3, 0.8, 1.0, 0.7, 0.4, 0.1, 0.2, 0.5, 0.3, 0.2].map(
              (val, i) => (
                <div
                  key={i}
                  style={{ opacity: val }}
                  className={`h-2.5 rounded-sm ${
                    val > 0.6 ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              )
            )}
          </div>
        </div>

        {/* Net Cashflow with Equalizer */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#121216] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Net Cashflow</span>
            <span className="text-[10px] font-mono text-rose-400 font-semibold flex items-center">
              ▼ 0%
            </span>
          </div>
          <div className="text-xl font-extrabold font-mono text-white">-$739</div>

          {/* Equalizer Frequency Bars */}
          <div className="flex items-end justify-between gap-1 h-7 pt-1">
            {[40, 70, 100, 50, 80, 60, 90, 45].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className="w-1.5 rounded-full bg-white/25 hover:bg-white transition-all"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Overview & Sankey Asset Flow Diagram */}
      <div className="p-6 rounded-3xl bg-[#121216] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Overview</span>
            <span className="text-xs text-slate-500">Total Assets</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            $345,67
          </div>
        </div>

        {/* Sankey Flow Diagram */}
        <div className="pt-2 relative">
          <div className="flex items-center justify-between relative z-10">
            {/* Source Nodes */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1c1c22] border border-white/10 text-[10px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>ETH 463.43</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1c1c22] border border-white/10 text-[10px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>USD</span>
              </div>
            </div>

            {/* Central Node (EURO) in Coral Accent */}
            <div className="px-3.5 py-2 rounded-2xl bg-gradient-to-b from-[#ff4d4d] to-[#cc2929] text-white shadow-lg text-center space-y-0.5">
              <div className="text-[9px] font-mono uppercase tracking-wider font-bold">EURO</div>
              <div className="text-xs font-mono font-bold">€3452</div>
            </div>

            {/* Target Nodes */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1c1c22] border border-white/10 text-[10px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>YEN</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1c1c22] border border-white/10 text-[10px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>¥3452</span>
              </div>
            </div>
          </div>

          {/* SVG Flow Connecting Curves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 300 80">
            <path d="M 60,20 C 120,20 120,40 150,40" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 60,60 C 120,60 120,40 150,40" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 150,40 C 180,40 180,20 240,20" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 150,40 C 180,40 180,60 240,60" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
};
