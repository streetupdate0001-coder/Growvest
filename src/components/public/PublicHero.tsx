import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Lock,
  Zap,
  Globe2,
  CheckCircle2,
  ChevronRight,
  Star,
  Activity,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicHero: React.FC = () => {
  const { setAuthModalOpen, setAuthModalMode, setPublicPage, setIsScamAdviserModalOpen, t } = useApp();

  const handleCreateAccount = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const handleExploreMarkets = () => {
    setPublicPage('markets');
  };

  return (
    <div className="flex flex-col w-full">
      <section
        id="growvest-public-hero"
        className="relative overflow-hidden py-16 sm:py-24 lg:py-28 border-b border-slate-200 dark:border-emerald-950/60 bg-gradient-to-b from-[#f0fbf6] via-[#f8faf9] to-[#edf7f2] dark:from-[#091512] dark:via-[#0c1c17] dark:to-[#0a1412] transition-colors"
      >
        {/* Background ambient accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 right-0 w-[550px] h-[550px] bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-96 h-96 bg-teal-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] max-w-4xl mx-auto">
            {t('hero.title', 'Sovereign Multi-Asset Capital & Algorithmic Yields')}
          </h1>

          {/* Crisp Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {t(
              'hero.subtitle',
              'Segregated 100% cold vault custody in London and Zurich. Zero-spread execution, automated yield strategies, and FCA / FinCEN registered compliance.'
            )}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              id="hero-btn-create-account"
              onClick={handleCreateAccount}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer active:scale-98"
            >
              <span>{t('hero.ctaPrimary', 'Open Institutional Account')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-explore-markets"
              onClick={handleExploreMarkets}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-white dark:bg-[#11201b] hover:bg-slate-50 dark:hover:bg-[#162a24] text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-emerald-900/50 shadow-xs transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Explore Live Markets</span>
            </button>
          </div>

          {/* Institutional Trust & Compliance Metrics */}
          <div className="pt-8 border-t border-slate-200/80 dark:border-emerald-950/80 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800">
              <div className="font-mono font-bold text-slate-900 dark:text-white text-sm sm:text-base">100% Segregated</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Zurich & UK Cold Vaults</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800">
              <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">0.00% Zero-Spread</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Direct OTC Execution</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800">
              <div className="font-mono font-bold text-slate-900 dark:text-white text-sm sm:text-base">UK Reg #14892011</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Companies House / MLR</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800">
              <div className="font-mono font-bold text-slate-900 dark:text-white text-sm sm:text-base">FinCEN MSB Registered</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">US Treasury #31000289141088</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
