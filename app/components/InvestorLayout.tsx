import React from 'react';
import { AuthProfile } from '../middleware';
import { supabase } from '../../src/lib/supabase';
import {
  TrendingUp,
  Home,
  CreditCard,
  Send,
  MoreHorizontal,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  Clock,
  Layers
} from 'lucide-react';

export type InvestorNavRoute = 'dashboard' | 'cards' | 'payments' | 'invest' | 'more' | 'withdraw' | 'history';

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isAdmin = profile?.role === 'admin';
  const userName = profile?.full_name || profile?.email?.split('@')[0] || 'Evans';

  // 1. BOTTOM NAV: Home, Cards, Payments, Invest, More
  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      path: '/app/dashboard',
      icon: Home
    },
    {
      id: 'cards',
      label: 'Cards',
      path: '/app/cards',
      icon: CreditCard
    },
    {
      id: 'payments',
      label: 'Payments',
      path: '/app/payments',
      icon: Send
    },
    {
      id: 'invest',
      label: 'Invest',
      path: '/app/invest',
      icon: TrendingUp
    },
    {
      id: 'more',
      label: 'More',
      path: '/app/more',
      icon: MoreHorizontal
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col antialiased">
      {/* Top Header - Clean Light Theme */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand & Greeting */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-[2px] shadow-md shadow-blue-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                    GROWVEST
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                    Verified Client Vault
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Hello, <span className="text-slate-900 font-semibold">{userName}</span>
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Admin Console</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-medium transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 md:pb-12">
        {children}
      </main>

      {/* Mobile-First Sticky Bottom Navigation Bar: Home, Cards, Payments, Invest, More */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 px-3 py-2 shadow-lg shadow-slate-300/30">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-blue-600 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center mb-0.5 transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
