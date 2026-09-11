import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Sparkles, TrendingUp, Calendar, ArrowRight, Check, DollarSign, RefreshCw, Copy } from 'lucide-react';
import { formatCurrency } from '../../services/currency';

interface CycleCalculatorWidgetProps {
  currentCurrency: string;
  availableBalance: number;
  onApplyAmount?: (amount: number) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const CycleCalculatorWidget: React.FC<CycleCalculatorWidgetProps> = ({
  currentCurrency,
  availableBalance,
  onApplyAmount,
  onShowToast
}) => {
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [dailyRatePercent, setDailyRatePercent] = useState<number>(5.5);
  const [cycleDays] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations for 5-Day Cycle
  const dailyProfit = (calcAmount * dailyRatePercent) / 100;
  const totalCycleProfit = dailyProfit * cycleDays;
  const totalReturn = calcAmount + totalCycleProfit;
  const totalRoiPercent = (dailyRatePercent * cycleDays);

  const presets = [500, 1000, 2500, 5000, 10000];

  const handleCopy = () => {
    const text = `5-Day Investment Projection:
Principal: $${calcAmount.toLocaleString()}
Daily Yield (${dailyRatePercent}%): $${dailyProfit.toFixed(2)}/day
5-Day Net Profit: $${totalCycleProfit.toFixed(2)} (${totalRoiPercent.toFixed(1)}%)
Total Maturity Payout: $${totalReturn.toFixed(2)}`;

    navigator.clipboard?.writeText?.(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onShowToast) {
      onShowToast('Projection Copied', '5-Day cycle yield breakdown copied to clipboard.', 'info');
    }
  };

  return (
    <div
      id="five-day-cycle-calculator"
      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>5-Day Cycle Profit Calculator</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 uppercase tracking-wider">
                5-Day Term
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulate dynamic daily yield and total principal return across a 5-day cycle
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Projection</span>
            </>
          )}
        </button>
      </div>

      {/* Input & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Investment Amount Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Investment Capital (USD)</span>
            <span className="text-slate-400 font-normal">
              Balance: <strong className="text-slate-800 dark:text-slate-200 font-mono">{formatCurrency(availableBalance, currentCurrency)}</strong>
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              $
            </span>
            <input
              type="number"
              min={100}
              max={1000000}
              step={100}
              value={calcAmount || ''}
              onChange={e => setCalcAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="Enter amount (e.g. 1000)"
              className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono font-bold text-sm outline-none transition-all"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {presets.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setCalcAmount(amt)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  calcAmount === amt
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                ${amt.toLocaleString()}
              </button>
            ))}
            {availableBalance > 0 && (
              <button
                type="button"
                onClick={() => setCalcAmount(Math.floor(availableBalance))}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                Max Balance
              </button>
            )}
          </div>
        </div>

        {/* Daily Yield Rate Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Daily Profit Rate</span>
            <span className="text-emerald-500 font-bold font-mono text-xs">
              {dailyRatePercent}% / day ({totalRoiPercent.toFixed(1)}% total 5-day return)
            </span>
          </div>

          <div className="pt-2">
            <input
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={dailyRatePercent}
              onChange={e => setDailyRatePercent(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>1.0%</span>
              <span>5.5% (Default)</span>
              <span>10.0%</span>
              <span>15.0%</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Lockup Duration:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" /> 5 Days Fixed Cycle
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Projected Return Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
            Daily Accrual (24h)
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(dailyProfit, currentCurrency)}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            {dailyRatePercent}% every 24 hours
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium block">
            5-Day Net Profit
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(totalCycleProfit, currentCurrency)}
          </div>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block font-mono">
            {totalRoiPercent.toFixed(1)}% total ROI
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#d83c18]/10 border border-[#d83c18]/20 space-y-1">
          <span className="text-[11px] text-[#d83c18] dark:text-rose-300 font-medium block">
            Total Maturity Payout
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-[#d83c18] dark:text-rose-400">
            {formatCurrency(totalReturn, currentCurrency)}
          </div>
          <span className="text-[10px] text-slate-400 block">
            100% Principal + Net Profit
          </span>
        </div>
      </div>

      {/* 5-Day Milestone Progress Timeline */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            5-Day Cycle Accrual Timeline
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Full Maturity at Day 5
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 text-center">
          {[1, 2, 3, 4, 5].map(day => {
            const dayProfit = dailyProfit * day;
            const isLast = day === 5;
            return (
              <div
                key={day}
                className={`p-2 rounded-xl border transition-all ${
                  isLast
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'bg-white dark:bg-white/5 border-slate-200/80 dark:border-white/5 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Day {day}
                </div>
                <div className="text-xs font-black font-mono pt-0.5">
                  +{formatCurrency(dayProfit, currentCurrency)}
                </div>
                <div className="text-[9px] text-slate-400 pt-0.5">
                  {isLast ? 'Maturity' : `${(day * 20)}%`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      {onApplyAmount && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => onApplyAmount(calcAmount)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Amount to Plan (${calcAmount.toLocaleString()})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
