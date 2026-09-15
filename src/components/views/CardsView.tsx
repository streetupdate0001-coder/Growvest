import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  BarChart3,
  Snowflake,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ArrowDownLeft,
  SlidersHorizontal,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';

export const CardsView: React.FC = () => {
  const { currentCurrency, setDepositModalOpen, setActiveTab, t } = useApp();
  const { user, wallet } = useAuth();

  const [isFrozen, setIsFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSpendingFilter, setActiveSpendingFilter] = useState<'All' | 'Money' | 'Crypto'>('All');
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const cardNumber = showCardNumber ? '4532 •••• •••• 8892' : '•••• •••• •••• 8892';
  const expiryDate = '09/29';
  const cvv = showCardNumber ? '742' : '•••';

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText('4532 8921 7843 8892');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const spendingAmount = wallet ? (wallet.totalValueUsd > 0 ? Math.min(wallet.totalValueUsd * 0.05, 344.20) : 0.00) : 0.00;
  const spendingDays = [
    { day: 'Sun', value: spendingAmount > 0 ? 120 : 0, active: false },
    { day: 'Mon', value: spendingAmount > 0 ? 210 : 0, active: false },
    { day: 'Tue', value: spendingAmount > 0 ? 180 : 0, active: false },
    { day: 'Wed', value: spendingAmount > 0 ? 290 : 0, active: false },
    { day: 'Thu', value: spendingAmount, active: true },
    { day: 'Fri', value: spendingAmount > 0 ? 240 : 0, active: false },
    { day: 'Sat', value: spendingAmount > 0 ? 190 : 0, active: false }
  ];

  return (
    <div id="growvest-cards-view" className="max-w-md mx-auto space-y-6 pb-8 text-white">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>My Cards</span>
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDepositModalOpen(true)}
            aria-label="Scan QR Code or Top Up"
            className="w-10 h-10 rounded-full bg-[#18181c] border border-white/10 hover:border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            aria-label="View Card Analytics"
            className="w-10 h-10 rounded-full bg-[#18181c] border border-white/10 hover:border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Holographic Obsidian Vault Card (Exact Sample Finish) */}
      <div className="relative group">
        <div className="relative w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 overflow-hidden bg-gradient-to-tr from-[#121215] via-[#1c1c22] to-[#25252e] border border-white/15 shadow-2xl flex flex-col justify-between transition-all duration-300">
          {/* Subtle cosmic marble texture overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-rose-500/10 to-transparent pointer-events-none" />
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          {/* Top Card Row */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white font-sans">
                GROWVEST
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                VAULT
              </span>
            </div>

            {/* Contactless Wave Icon */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 16.5a5 5 0 0 1 0-9" strokeLinecap="round" />
                <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Middle Card: EMV Gold Chip & Card Number */}
          <div className="relative z-10 space-y-3">
            {/* EMV Chip */}
            <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 border border-amber-300/60 shadow-inner flex items-center justify-center">
              <div className="w-full h-[1px] bg-amber-600/40" />
            </div>

            <div className="flex items-center justify-between">
              <div className="font-mono text-base sm:text-lg tracking-widest text-white/95 font-semibold">
                {cardNumber}
              </div>
              <button
                type="button"
                onClick={handleCopyCardNumber}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Copy card number"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Card Row: Cardholder & VISA Logo */}
          <div className="flex items-end justify-between relative z-10 pt-2">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">
                Card Holder
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-white uppercase">
                {user ? `${user.firstName} ${user.lastName}` : 'ARTHUR STERLING'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">
                  Expires
                </span>
                <span className="text-xs font-mono font-semibold text-white">
                  {expiryDate}
                </span>
              </div>

              {/* VISA Logo */}
              <div className="text-white font-black italic tracking-tighter text-xl sm:text-2xl pr-1">
                VISA
              </div>
            </div>
          </div>
        </div>

        {/* Card Dots Indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <button
            type="button"
            onClick={() => setActiveCardIndex(0)}
            className={`h-1.5 rounded-full transition-all ${
              activeCardIndex === 0 ? 'w-5 bg-white' : 'w-1.5 bg-white/20'
            }`}
          />
          <button
            type="button"
            onClick={() => setActiveCardIndex(1)}
            className={`h-1.5 rounded-full transition-all ${
              activeCardIndex === 1 ? 'w-5 bg-white' : 'w-1.5 bg-white/20'
            }`}
          />
        </div>
      </div>

      {/* Card Action Controls (Freeze, Replace, Top Up) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setIsFrozen(!isFrozen)}
          className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
            isFrozen
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              : 'bg-[#151518] hover:bg-[#1c1c22] border-white/10 text-slate-200'
          }`}
        >
          <Snowflake className="w-4 h-4 text-slate-300" />
          <span>{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowCardNumber(!showCardNumber)}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#151518] hover:bg-[#1c1c22] border border-white/10 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-300" />
          <span>{showCardNumber ? 'Hide PIN' : 'Details'}</span>
        </button>

        <button
          type="button"
          onClick={() => setDepositModalOpen(true)}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#151518] hover:bg-[#1c1c22] border border-white/10 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowUpRight className="w-4 h-4 text-slate-300" />
          <span>Top Up</span>
        </button>
      </div>

      {/* Todays Spending / Daily Ledger Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#121216] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block">
              Todays Spending
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight mt-0.5">
              ${spendingAmount.toFixed(1)}
            </div>
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#1c1c22] border border-white/10 text-xs">
            {(['All', 'Money', 'Crypto'] as const).map(filter => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveSpendingFilter(filter)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeSpendingFilter === filter
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Glowing Spline Curve Spending Chart (Exact Sample Match) */}
        <div className="h-32 sm:h-36 w-full pt-4 relative flex flex-col justify-end">
          <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spendingSplineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ff4d4d" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Glowing Spline Curve */}
            <path
              d="M 0,90 C 80,95 120,80 180,92 C 240,105 290,40 357,35 C 410,32 450,75 500,60"
              fill="none"
              stroke="#ff4d4d"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Spline Area Fill */}
            <path
              d="M 0,90 C 80,95 120,80 180,92 C 240,105 290,40 357,35 C 410,32 450,75 500,60 L 500,120 L 0,120 Z"
              fill="url(#spendingSplineGrad)"
            />

            {/* Active Thursday Highlight Node with Ring Pulse */}
            <circle cx="357" cy="35" r="5" fill="#ff4d4d" />
            <circle cx="357" cy="35" r="10" fill="#ff4d4d" opacity="0.4" className="animate-ping" />
          </svg>

          {/* Days Row with active Thu highlighted */}
          <div className="grid grid-cols-7 text-center text-[11px] font-mono text-slate-400 pt-3 border-t border-white/5">
            {spendingDays.map(item => (
              <span
                key={item.day}
                className={
                  item.active
                    ? 'text-white font-bold px-1 py-0.5 rounded-md bg-white/10'
                    : 'text-slate-500'
                }
              >
                {item.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Spending Breakdown & Expense Dual Bento Tiles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('portfolio')}
          className="p-4 rounded-3xl bg-[#121216] border border-white/10 hover:border-white/20 transition-all cursor-pointer space-y-3"
        >
          <span className="text-[11px] text-slate-400 font-medium block">
            Spending Breakdown
          </span>
          <div className="text-lg font-bold text-white">
            Money
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fiat Assets</span>
            <span className="font-mono text-white font-semibold">68%</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('markets')}
          className="p-4 rounded-3xl bg-[#121216] border border-white/10 hover:border-white/20 transition-all cursor-pointer space-y-3"
        >
          <span className="text-[11px] text-slate-400 font-medium block">
            Expense
          </span>
          <div className="text-lg font-bold text-white">
            Crypto
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Digital Assets</span>
            <span className="font-mono text-white font-semibold">32%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
