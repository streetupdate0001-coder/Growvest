import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { userRouteMiddleware, AuthProfile } from '../middleware';
import { InvestorLayout } from '../components/InvestorLayout';
import {
  ArrowLeft,
  Info,
  ChevronRight,
  Sparkles,
  Gift,
  ExternalLink,
  CheckCircle2,
  Zap,
  Tag,
  CreditCard
} from 'lucide-react';
import { TransferModal } from '../../src/components/financial/TransferModal';

interface PointsPageProps {
  onNavigate?: (path: string) => void;
}

export default function PointsPage({ onNavigate }: PointsPageProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AuthProfile | null>(null);

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
    initPoints();
  }, []);

  const initPoints = async () => {
    setLoading(true);
    const authResult = await userRouteMiddleware();
    if (!authResult.authorized || !authResult.user) {
      navigate('/login');
      return;
    }
    setProfile(authResult.profile);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#00ACEE] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading Rewards & Points...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InvestorLayout profile={profile} activeRoute="points" onNavigate={navigate}>
      <div className="max-w-md mx-auto space-y-5 pb-8">
        
        {/* ============================================================ */}
        {/* Header: Back button, "Points"                                */}
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
            Points
          </h1>

          <div className="w-10 h-10" />
        </div>

        {/* ============================================================ */}
        {/* Dark Hero Card: Cashback Balance $2541 RP (invest 4.jpg)     */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-[28px] p-6 bg-[#0F141C] text-white shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span>Cashback Balance</span>
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-cyan-300 border border-cyan-400/30">
              Gold Tier
            </span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
              $2541 RP
            </h2>
          </div>

          {/* Progress Bar: Filled cyan, then striped unearned portion */}
          <div className="space-y-2 pt-1">
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-[#00ACEE] rounded-l-full" style={{ width: '65%' }} />
              <div className="h-full bg-slate-700/60 rounded-r-full flex items-center justify-around" style={{ width: '35%' }}>
                <span className="w-1 h-full bg-slate-600/40 transform -skew-x-12" />
                <span className="w-1 h-full bg-slate-600/40 transform -skew-x-12" />
                <span className="w-1 h-full bg-slate-600/40 transform -skew-x-12" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Buy a Gold or Emerald Subscription to start Earning Cashback
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Section: Redeem Points ⓘ (invest 4.jpg)                       */}
        {/* ============================================================ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
              <span>Redeem Points</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <button
              type="button"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Airalo eSIM Worldwide (Peach / Orange) */}
            <div className="p-4 rounded-[24px] bg-[#FCECE5] border border-[#F8D8C9] space-y-4 flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-white shadow-xs flex items-center justify-center text-orange-500 font-extrabold text-sm">
                  🌐
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">
                    Airalo eSIM Worldwide
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Global Data Roaming</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-mono font-bold text-slate-800">From 6.47</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-orange-600 shadow-2xs">
                  Redeem
                </span>
              </div>
            </div>

            {/* Card 2: Discord Nitro subscription (Indigo / Blue) */}
            <div className="p-4 rounded-[24px] bg-[#E8EEFD] border border-[#D5E1FC] space-y-4 flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-[#5865F2] text-white shadow-xs flex items-center justify-center font-extrabold text-xs">
                  🎮
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">
                    Discord Nitro subscription
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Premium Perk Pass</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-mono font-bold text-slate-800">From 7.98</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#5865F2] shadow-2xs">
                  Redeem
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Section: Transactions ⓘ (invest 4.jpg)                       */}
        {/* ============================================================ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
              <span>Transactions</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <button
              type="button"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-[24px] bg-white border border-slate-200/80 p-4 space-y-3 shadow-xs">
            {/* Item: Cirro Card Spend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#00ACEE]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Cirro Card Spend
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    4 March • 41:25
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-600 block">
                  +5.74 PTS
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Earned
                </span>
              </div>
            </div>

            {/* Additional Reward Item */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Welcome Tier Bonus
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    1 March • 09:15
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-600 block">
                  +250.00 PTS
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Credited
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <TransferModal />
    </InvestorLayout>
  );
}
