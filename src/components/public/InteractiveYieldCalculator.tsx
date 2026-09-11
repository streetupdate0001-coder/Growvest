import React, { useState } from 'react';
import {
  TrendingUp,
  Sliders,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  PieChart,
  Calendar,
  Layers,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../services/currency';

interface StrategyOption {
  id: string;
  name: string;
  tagline: string;
  annualRate: number; // e.g. 14.8%
  risk: 'Low' | 'Moderate' | 'Growth' | 'High Yield';
  minCapital: number;
  allocation: { asset: string; percent: number; color: string }[];
  description: string;
}

const STRATEGIES: StrategyOption[] = [
  {
    id: 'conservative',
    name: 'Conservative Wealth Core',
    tagline: 'Capital preservation & fixed sovereign debt yield',
    annualRate: 10.4,
    risk: 'Low',
    minCapital: 1000,
    allocation: [
      { asset: 'Sovereign & Corporate Debt', percent: 65, color: 'bg-emerald-500' },
      { asset: 'Global Blue-Chip Equities', percent: 25, color: 'bg-teal-400' },
      { asset: 'Liquid Cash & Short Treasuries', percent: 10, color: 'bg-slate-400' }
    ],
    description: 'Designed for institutional stability. Focuses on principal security and predictable interest distribution.'
  },
  {
    id: 'balanced',
    name: 'Balanced Multi-Asset Growth',
    tagline: 'Optimal risk-adjusted global multi-asset portfolio',
    annualRate: 16.8,
    risk: 'Moderate',
    minCapital: 2500,
    allocation: [
      { asset: 'Global Equities Core', percent: 45, color: 'bg-emerald-500' },
      { asset: 'Fixed Income & Real Estate', percent: 30, color: 'bg-teal-400' },
      { asset: 'Commodities & Liquid Digital Assets', percent: 25, color: 'bg-amber-400' }
    ],
    description: 'Dynamic quarterly rebalancing across global indices, commodities, and high-liquidity digital asset pairs.'
  },
  {
    id: 'growth',
    name: 'Quantitative Alpha Strategy',
    tagline: 'High-velocity quantitative algorithmic execution',
    annualRate: 25.4,
    risk: 'Growth',
    minCapital: 5000,
    allocation: [
      { asset: 'Tech Growth Equities', percent: 40, color: 'bg-emerald-500' },
      { asset: 'Systematic Digital Assets', percent: 40, color: 'bg-indigo-400' },
      { asset: 'Derivatives & Hedging Vault', percent: 20, color: 'bg-amber-400' }
    ],
    description: 'Leverages proprietary statistical arbitrage models to capture alpha across asymmetric market momentum.'
  },
  {
    id: 'defi_yield',
    name: 'Liquid Staking & Protocol Yield',
    tagline: 'Decentralized institutional validator & staking returns',
    annualRate: 20.2,
    risk: 'High Yield',
    minCapital: 1000,
    allocation: [
      { asset: 'Tier-1 Protocol Staking (ETH/SOL)', percent: 60, color: 'bg-purple-500' },
      { asset: 'Institutional Yield Vaults', percent: 30, color: 'bg-emerald-400' },
      { asset: 'Stablecoin Liquidity Reserves', percent: 10, color: 'bg-slate-400' }
    ],
    description: 'Direct institutional validator yield generation with 100% cold-vault segregated custody.'
  }
];

export const InteractiveYieldCalculator: React.FC = () => {
  const { currentCurrency, setAuthModalOpen, setAuthModalMode } = useApp();

  const [capital, setCapital] = useState<number>(25000);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('balanced');
  const [durationMonths, setDurationMonths] = useState<number>(12);

  const selectedStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[1];

  // Mathematical Calculation
  const annualReturnRate = selectedStrategy.annualRate / 100;
  const timeInYears = durationMonths / 12;
  // Compound monthly
  const monthlyRate = annualReturnRate / 12;
  const projectedTotal = capital * Math.pow(1 + monthlyRate, durationMonths);
  const totalProfit = projectedTotal - capital;
  const profitPercentage = ((projectedTotal - capital) / capital) * 100;
  const monthlyCashflow = totalProfit / durationMonths;

  const presetAmounts = [2500, 10000, 25000, 50000, 100000, 250000];

  const handleStartPlan = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  return (
    <section
      id="public-yield-calculator"
      className="py-16 sm:py-20 bg-[#f8faf9] dark:bg-[#0a1412] border-b border-slate-200/80 dark:border-emerald-950/60 transition-colors relative overflow-hidden"
    >
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30 shadow-xs">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Yield Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simulate Your Portfolio Growth
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Estimate potential returns powered by our regulated quantitative portfolio strategies with realistic mathematical compounding.
          </p>
        </div>

        {/* Interactive Dashboard Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls Column (Capital Slider + Strategy Selector + Duration) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#11201b] border border-slate-200 dark:border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* 1. Capital Amount Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-mono uppercase text-slate-700 dark:text-slate-200">
                  Initial Investment Capital
                </label>
                <span className="text-lg sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(capital, currentCurrency)}
                </span>
              </div>

              {/* Slider Input */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={1000}
                  max={500000}
                  step={500}
                  value={capital}
                  onChange={e => setCapital(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-[#172c25] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-400">
                  <span>$1,000</span>
                  <span>$100,000</span>
                  <span>$500,000</span>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {presetAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCapital(amt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      capital === amt
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-[#162721] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1c332b] border border-transparent dark:border-emerald-900/40'
                    }`}
                  >
                    ${amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Strategy Selector */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-emerald-900/40">
              <label className="text-xs font-bold font-mono uppercase text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Select Portfolio Strategy</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-normal lowercase font-sans">
                  {selectedStrategy.risk} Risk Profile
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STRATEGIES.map(strat => {
                  const isSelected = strat.id === selectedStrategyId;
                  return (
                    <button
                      key={strat.id}
                      type="button"
                      onClick={() => setSelectedStrategyId(strat.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 shadow-xs'
                          : 'bg-slate-50 dark:bg-[#0d1a16] border-slate-200 dark:border-emerald-900/30 hover:border-slate-300 dark:hover:border-emerald-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {strat.name}
                        </span>
                        <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                          +{strat.annualRate}% p.a.
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                        {strat.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Duration Horizon Picker */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-emerald-900/40">
              <label className="text-xs font-bold font-mono uppercase text-slate-700 dark:text-slate-200">
                Investment Commitment Horizon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 12, 24].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMonths(m)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                      durationMonths === m
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-[#162721] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1c332b] border border-transparent dark:border-emerald-900/40'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Real-time Projection Card & Asset Allocation */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0e291f] via-[#091b15] to-[#04120e] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                  Projected Capital Growth
                </span>
                <h3 className="text-sm font-bold text-white">
                  {selectedStrategy.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {durationMonths} Months Compound
              </span>
            </div>

            {/* Big Projected Figure */}
            <div className="space-y-1">
              <span className="text-xs text-slate-300 font-mono">Estimated Total Maturity Value:</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight">
                {formatCurrency(projectedTotal, currentCurrency)}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{profitPercentage.toFixed(2)}% ROI
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  (+{formatCurrency(totalProfit, currentCurrency)})
                </span>
              </div>
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#071712] border border-emerald-900/40 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Est. Monthly Distribution</span>
                <span className="font-bold text-white text-sm">
                  {formatCurrency(monthlyCashflow, currentCurrency)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Indicative Annual Benchmark</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {selectedStrategy.annualRate}% p.a.
                </span>
              </div>
            </div>

            {/* Asset Allocation Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-emerald-900/50">
              <span className="text-[11px] font-mono uppercase text-slate-300 font-bold block">
                Target Portfolio Allocation
              </span>

              {/* Progress Bar Stack */}
              <div className="h-2.5 rounded-full overflow-hidden flex bg-[#0c1f18]">
                {selectedStrategy.allocation.map((alloc, idx) => (
                  <div
                    key={idx}
                    className={`${alloc.color}`}
                    style={{ width: `${alloc.percent}%` }}
                    title={`${alloc.asset}: ${alloc.percent}%`}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-[11px] text-slate-300">
                {selectedStrategy.allocation.map((alloc, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${alloc.color}`} />
                      <span className="text-slate-200">{alloc.asset}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-100">{alloc.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={handleStartPlan}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-98"
            >
              <span>Activate Portfolio Strategy</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Regulated FCA & FINRA Benchmark Models • 100% Segregated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
