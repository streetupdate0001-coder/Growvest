import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { userRouteMiddleware, AuthProfile } from '../middleware';
import { InvestorLayout } from '../components/InvestorLayout';
import {
  CreditCard,
  Snowflake,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  Copy,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Wallet,
  PieChart,
  QrCode,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { TransferModal } from '../../src/components/financial/TransferModal';

interface CardsPageProps {
  onNavigate?: (path: string) => void;
}

export default function CardsPage({ onNavigate }: CardsPageProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [spendingFilter, setSpendingFilter] = useState<'All' | 'Money' | 'Crypto'>('All');

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
    initCards();
  }, []);

  const initCards = async () => {
    setLoading(true);
    const authResult = await userRouteMiddleware();
    if (!authResult.authorized || !authResult.user) {
      navigate('/login');
      return;
    }
    setProfile(authResult.profile);
    setLoading(false);
  };

  const cardNumber = showCardNumber ? '4532 8921 7843 8892' : '•••• •••• •••• 8892';
  const cardHolderName = profile?.full_name || 'EVANS CREATIVE HUB';

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText('4532 8921 7843 8892');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const spendingDays = [
    { day: 'Sun', value: 120, height: '35%' },
    { day: 'Mon', value: 210, height: '60%' },
    { day: 'Tue', value: 180, height: '52%' },
    { day: 'Wed', value: 290, height: '84%' },
    { day: 'Thu', value: 344.2, height: '100%', active: true },
    { day: 'Fri', value: 240, height: '70%' },
    { day: 'Sat', value: 190, height: '55%' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading Growvest Vault Cards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InvestorLayout profile={profile} activeRoute="cards" onNavigate={navigate}>
      <div className="max-w-md mx-auto space-y-6 pb-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Growvest Vault Card
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-currency institutional Visa debit enclave
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
        </div>

        {/* Holographic Obsidian Visa Card (Ending 8892, EVANS CREATIVE HUB) */}
        <div className="relative group">
          <div
            className={`relative w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 overflow-hidden bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#334155] border border-slate-700/60 shadow-xl flex flex-col justify-between transition-all duration-300 ${
              isFrozen ? 'opacity-75 saturate-50' : ''
            }`}
          >
            {/* Glossy overlay reflection */}
            <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-sky-300 to-transparent pointer-events-none" />
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />

            {/* Top Card Row: Brand & Contactless */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white font-sans">
                  GROWVEST
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  VAULT
                </span>
              </div>

              {/* Contactless Wave Icon */}
              <div className="flex items-center text-slate-300">
                <svg className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.5 16.5a5 5 0 0 1 0-9" strokeLinecap="round" />
                  <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                  <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Middle Card: Gold EMV Chip & Card Number */}
            <div className="relative z-10 space-y-2.5">
              {/* EMV Chip */}
              <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 border border-amber-300/80 shadow-sm flex items-center justify-center">
                <div className="w-full h-[1px] bg-amber-600/50" />
              </div>

              <div className="flex items-center justify-between">
                <div className="font-mono text-base sm:text-lg tracking-widest text-white font-bold">
                  {cardNumber}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCardNumber}
                  className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                  title="Copy card number"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bottom Card Row: Card Holder & VISA */}
            <div className="flex items-end justify-between relative z-10 pt-2 border-t border-slate-700/40">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">
                  Card Holder
                </span>
                <span className="text-xs sm:text-sm font-extrabold tracking-wide text-white uppercase">
                  {cardHolderName}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">
                    Expires
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    09/29
                  </span>
                </div>

                {/* VISA Logo */}
                <div className="text-white font-black italic tracking-tighter text-xl sm:text-2xl pr-1">
                  VISA
                </div>
              </div>
            </div>
          </div>

          {isFrozen && (
            <div className="absolute inset-0 backdrop-blur-xs bg-slate-950/40 rounded-3xl flex items-center justify-center z-20">
              <span className="px-4 py-1.5 rounded-full bg-slate-900/90 text-sky-400 border border-sky-500/40 font-bold text-xs flex items-center gap-2">
                <Snowflake className="w-4 h-4" />
                Card Temporarily Frozen
              </span>
            </div>
          )}
        </div>

        {/* Card Action Buttons (Freeze, Details, Top Up) */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setIsFrozen(!isFrozen)}
            className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isFrozen
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Snowflake className="w-4 h-4 text-blue-600" />
            <span>{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCardNumber(!showCardNumber)}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>{showCardNumber ? 'Hide Details' : 'Details'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
            <span>Top Up</span>
          </button>
        </div>

        {/* Today's Spending Section ($344.2 with graph) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                Daily Spending
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-0.5">
                $344.20
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Today: Thu
            </span>
          </div>

          {/* Spending Bar Graph */}
          <div className="h-32 pt-4 flex items-end justify-between gap-2 border-b border-slate-100 pb-3">
            {spendingDays.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full relative flex items-end justify-center h-24">
                  <div
                    style={{ height: bar.height }}
                    className={`w-full max-w-[28px] rounded-lg transition-all ${
                      bar.active
                        ? 'bg-blue-600 shadow-md shadow-blue-600/30'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  />
                </div>
                <span className={`text-[11px] font-bold ${bar.active ? 'text-blue-600' : 'text-slate-400'}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          {/* Spending Breakdown: Money 68%, Crypto 32% */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Spending Breakdown</span>
              <span className="text-slate-400 font-mono">100% Cleared</span>
            </div>

            {/* Split Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
              <div className="h-full bg-blue-600 rounded-l-full" style={{ width: '68%' }} />
              <div className="h-full bg-sky-400 rounded-r-full" style={{ width: '32%' }} />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-xs font-semibold text-slate-700">Money</span>
                </div>
                <span className="text-xs font-black font-mono text-slate-900">68%</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-xs font-semibold text-slate-700">Crypto</span>
                </div>
                <span className="text-xs font-black font-mono text-slate-900">32%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Enclave Notice */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="text-xs text-slate-600 leading-tight">
            Protected by Visa 3-D Secure 2.0 & Segregated Client Asset Custody.
          </div>
        </div>
      </div>
      <TransferModal />
    </InvestorLayout>
  );
}
