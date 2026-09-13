import React, { useState } from 'react';
import { AuthProfile } from '../middleware';
import { supabase } from '../../src/lib/supabase';
import {
  Home,
  TrendingUp,
  CreditCard,
  QrCode,
  Send,
  MoreHorizontal,
  LogOut,
  ShieldCheck,
  Sparkles,
  Layers,
  Award,
  Plus,
  ArrowUpRight,
  ChevronRight,
  User,
  History,
  Info
} from 'lucide-react';
import { TradeKeypadModal } from './TradeKeypadModal';

export type InvestorNavRoute =
  | 'dashboard'
  | 'cards'
  | 'payments'
  | 'invest'
  | 'plans'
  | 'points'
  | 'more'
  | 'withdraw'
  | 'history';

interface InvestorLayoutProps {
  profile: AuthProfile | null;
  activeRoute: InvestorNavRoute;
  onNavigate?: (path: string) => void;
  children: React.ReactNode;
}

export function InvestorLayout({
  profile,
  activeRoute,
  onNavigate,
  children
}: InvestorLayoutProps) {
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = (path: string) => {
    setIsUserMenuOpen(false);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isAdmin = profile?.role === 'admin';
  const userName = profile?.full_name || 'Jenny Wilson';
  const userHandle = profile?.email
    ? `@${profile.email.split('@')[0]}`
    : '@jenny';

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-slate-900 font-sans selection:bg-[#00ACEE] selection:text-white flex flex-col antialiased">
      {/* Top Header - Matches the sleek light iOS bar from invest 1.jpg */}
      <header className="sticky top-0 z-40 bg-[#F2F4F7]/95 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Left: User Profile Avatar & Name + Handle (Screen 1) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00ACEE] to-sky-300 text-white font-black flex items-center justify-center text-sm shadow-sm ring-2 ring-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                    {userName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {userHandle}
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/80 p-1.5 rounded-full border border-slate-200/80 shadow-xs">
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeRoute === 'dashboard'
                  ? 'bg-[#00ACEE] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/invest')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeRoute === 'invest'
                  ? 'bg-[#00ACEE] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Invest
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/invest?tab=plans')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeRoute === 'plans'
                  ? 'bg-[#00ACEE] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plans (8)
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/points')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeRoute === 'points'
                  ? 'bg-[#00ACEE] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Points
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/cards')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeRoute === 'cards'
                  ? 'bg-[#00ACEE] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/payments')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeRoute === 'payments'
                  ? 'bg-[#00ACEE] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ledger
            </button>
          </nav>

          {/* Right: Two round soft-grey icon buttons (Screen 1: Card & QR Transfer) */}
          <div className="flex items-center gap-2">
            {/* Card Icon Button */}
            <button
              type="button"
              onClick={() => navigate('/app/cards')}
              title="Cards"
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-xs cursor-pointer transition-colors"
            >
              <CreditCard className="w-4 h-4" />
            </button>

            {/* QR Scan / Transfer Icon Button */}
            <button
              type="button"
              onClick={() => setIsTradeModalOpen(true)}
              title="Quick Trade / Scan"
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-xs cursor-pointer transition-colors"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin</span>
              </button>
            )}
          </div>

        </div>

        {/* User Quick Dropdown Menu */}
        {isUserMenuOpen && (
          <div className="absolute top-full left-4 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 space-y-1 z-50">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900">{userName}</p>
              <p className="text-[11px] text-slate-400">{profile?.email || 'Verified Client'}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/app/cards')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Vault Cards (Ending 8892)</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/payments')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
            >
              <Send className="w-4 h-4 text-blue-600" />
              <span>Audit Activity Ledger</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/points')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Points & Cashback</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/more')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
              <span>Settings & Profile</span>
            </button>
            <div className="pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container Area */}
      <main className="flex-1 w-full px-4 sm:px-6 py-4 pb-28">
        {children}
      </main>

      {/* ============================================================ */}
      {/* FLOATING BOTTOM DOCKED BAR (Screens 1, 3, 4)                 */}
      {/* 5 elements: Home, Invest, Floating Cyan Action, Plans, Points */}
      {/* ============================================================ */}
      <nav className="fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-md mx-auto relative pointer-events-auto">
          
          <div className="bg-white/95 backdrop-blur-2xl rounded-full border border-slate-200/90 px-3 py-2 shadow-xl shadow-slate-300/40 flex items-center justify-between">
            
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                activeRoute === 'dashboard' ? 'text-[#00ACEE]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Home</span>
            </button>

            {/* 2. Invest */}
            <button
              type="button"
              onClick={() => navigate('/app/invest')}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                activeRoute === 'invest' ? 'text-[#00ACEE]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Invest</span>
            </button>

            {/* 3. Center Prominent Floating Cyan Button (Cirro swirl logo) */}
            <div className="flex-1 flex items-center justify-center -mt-6">
              <button
                type="button"
                onClick={() => setIsTradeModalOpen(true)}
                title="Quick Trade Keypad"
                className="w-13 h-13 rounded-full bg-[#00ACEE] hover:bg-[#009bd7] text-white shadow-lg shadow-[#00ACEE]/40 flex items-center justify-center transform active:scale-95 transition-all ring-4 ring-[#F2F4F7] cursor-pointer"
              >
                {/* Cirro circular loop swirl icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </button>
            </div>

            {/* 4. Plans */}
            <button
              type="button"
              onClick={() => navigate('/app/invest')}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                activeRoute === 'plans' ? 'text-[#00ACEE]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Plans</span>
            </button>

            {/* 5. Points */}
            <button
              type="button"
              onClick={() => navigate('/app/points')}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                activeRoute === 'points' ? 'text-[#00ACEE]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Points</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Quick Trade / Open Short Keypad Modal (Screens 5 & 6) */}
      <TradeKeypadModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        availableBalance={Number(profile?.balance || 145485.00)}
        onSuccessRedirect={() => navigate('/app/invest')}
      />
    </div>
  );
}
