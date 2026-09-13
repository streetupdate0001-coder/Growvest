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
  ChevronRight,
  ArrowLeft,
  Plus,
  Info,
  UtensilsCrossed
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
      <div className="min-h-screen bg-[#F2F4F7] text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#00ACEE] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading Vault Cards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InvestorLayout profile={profile} activeRoute="cards" onNavigate={navigate}>
      <div className="max-w-md mx-auto space-y-5 pb-8">
        
        {/* ============================================================ */}
        {/* Header: Back button, Title "Cards", "+" button (invest 2.jpg) */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => navigate('/app/dashboard')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            Cards
          </h1>

          <button
            type="button"
            onClick={() => alert('New physical or virtual card requisition form')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* REALISTIC CARD POCKET WALLET (Matches invest 2.jpg exactly)  */}
        {/* Dark pocket (#14161B) with 3 stacked cards peeking out       */}
        {/* Cyan card ($4,74.00), Silver ($3,74.00), Coral ($4,58.00)   */}
        {/* Front flap: Total Balance $11,545.00                         */}
        {/* ============================================================ */}
        <div className="relative pt-12">
          {/* Card 1: Back Coral Card Peeking */}
          <div className="absolute top-0 left-6 right-6 h-28 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 p-4 shadow-md text-white flex justify-between items-start opacity-90 transform -rotate-1">
            <span className="font-extrabold text-xs tracking-wider">Cirro</span>
            <span className="font-mono text-xs font-bold">$4,58.00</span>
          </div>

          {/* Card 2: Middle Silver/Chrome Card Peeking */}
          <div className="absolute top-4 left-4 right-4 h-28 rounded-2xl bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 p-4 shadow-md text-slate-900 flex justify-between items-start opacity-95">
            <span className="font-extrabold text-xs tracking-wider">Cirro</span>
            <span className="font-mono text-xs font-bold">$3,74.00</span>
          </div>

          {/* Card 3: Top Vibrant Cyan Card Peeking */}
          <div className="absolute top-8 left-2 right-2 h-28 rounded-2xl bg-gradient-to-r from-[#00A3FF] to-[#00C2FF] p-4 shadow-md text-white flex justify-between items-start">
            <span className="font-extrabold text-xs tracking-wider">Cirro</span>
            <span className="font-mono text-xs font-bold">$4,74.00</span>
          </div>

          {/* Dark Pocket Front Flap */}
          <div className="relative z-10 mt-16 rounded-[28px] bg-[#14161B] border border-slate-800 p-6 shadow-2xl text-white space-y-3">
            {/* Curved stitched notch at the top */}
            <div className="w-16 h-1 bg-slate-700/80 rounded-full mx-auto -mt-2 mb-3" />

            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Total Balance</span>
              <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                $11,545.00
              </h2>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Card Holder: {cardHolderName}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 text-[10px]">
                3 Active Cards
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Simplify Your Payments Banner (Tap & Pay with Apple Wallet)  */}
        {/* ============================================================ */}
        <div className="p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-extrabold text-slate-900">Simplify Your Payments</h4>
            <p className="text-[11px] text-slate-400">Tap and pay with Apple Wallet</p>
          </div>

          {/* Apple Wallet Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-black text-white flex items-center gap-1.5 text-xs font-semibold shadow-xs">
            <span className="text-base leading-none"></span>
            <span className="text-[11px] font-bold">Wallet</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Section: Card Transactions ⓘ (invest 2.jpg)                  */}
        {/* ============================================================ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
              <span>Card Transactions</span>
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
            {/* GRAB FOOD */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-sm">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">GRAB FOOD</span>
                  <span className="text-[10px] text-slate-400 font-mono">7 March • 10:14</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black font-mono text-rose-600 block">-$17.00</span>
                <span className="text-[10px] text-slate-400">Payment</span>
              </div>
            </div>

            {/* Olivia Gardens */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center font-bold text-sm">
                  O
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Olivia Gardens</span>
                  <span className="text-[10px] text-slate-400 font-mono">5 March • 12:47</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black font-mono text-emerald-600 block">+$5.00</span>
                <span className="text-[10px] text-slate-400">Received</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE GROWVEST VAULT CARD (Ending 8892)                */}
        {/* Retains: Freeze, Details, Top Up, Spending ($344.20)         */}
        {/* ============================================================ */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900">Card Controls</span>
            <span className="text-[10px] font-mono font-bold text-emerald-600">Visa Platinum</span>
          </div>

          <div className="relative group">
            <div
              className={`relative w-full aspect-[1.586/1] rounded-3xl p-6 overflow-hidden bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#334155] border border-slate-700/60 shadow-xl flex flex-col justify-between transition-all duration-300 ${
                isFrozen ? 'opacity-75 saturate-50' : ''
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-wider text-white font-sans">
                    GROWVEST
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    VAULT
                  </span>
                </div>

                <span className="text-white font-black italic tracking-tighter text-lg">
                  VISA
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 border border-amber-300/80 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-amber-600/50" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-mono text-base tracking-widest text-white font-bold">
                    {cardNumber}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCardNumber}
                    className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between relative z-10 pt-2 border-t border-slate-700/40">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">
                    Card Holder
                  </span>
                  <span className="text-xs font-extrabold tracking-wide text-white uppercase">
                    {cardHolderName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">
                    Expires
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    09/29
                  </span>
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

          {/* Action Buttons */}
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
              <Snowflake className="w-4 h-4 text-[#00ACEE]" />
              <span>{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCardNumber(!showCardNumber)}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-[#00ACEE]" />
              <span>{showCardNumber ? 'Hide Details' : 'Details'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <ArrowUpRight className="w-4 h-4 text-[#00ACEE]" />
              <span>Top Up</span>
            </button>
          </div>

          {/* Today's Spending ($344.20) */}
          <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                  Daily Spending
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                  $344.20
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Today: Thu
              </span>
            </div>

            {/* Spending Bar Graph */}
            <div className="h-28 pt-2 flex items-end justify-between gap-2 border-b border-slate-100 pb-3">
              {spendingDays.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full relative flex items-end justify-center h-20">
                    <div
                      style={{ height: bar.height }}
                      className={`w-full max-w-[24px] rounded-lg transition-all ${
                        bar.active
                          ? 'bg-[#00ACEE] shadow-md shadow-[#00ACEE]/30'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${bar.active ? 'text-[#00ACEE]' : 'text-slate-400'}`}>
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>

            {/* Spending Breakdown: Money 68%, Crypto 32% */}
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Spending Breakdown</span>
                <span className="text-slate-400 font-mono">100% Cleared</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="h-full bg-[#00ACEE] rounded-l-full" style={{ width: '68%' }} />
                <div className="h-full bg-sky-300 rounded-r-full" style={{ width: '32%' }} />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ACEE]" />
                    <span className="text-xs font-semibold text-slate-700">Money</span>
                  </div>
                  <span className="text-xs font-black font-mono text-slate-900">68%</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-300" />
                    <span className="text-xs font-semibold text-slate-700">Crypto</span>
                  </div>
                  <span className="text-xs font-black font-mono text-slate-900">32%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <TransferModal />
    </InvestorLayout>
  );
}
