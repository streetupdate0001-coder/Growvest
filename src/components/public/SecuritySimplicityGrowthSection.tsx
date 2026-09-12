import React from 'react';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  Lock,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Server,
  Key,
  BarChart3,
  Globe2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SecuritySimplicityGrowthSection: React.FC = () => {
  const { setPublicPage, setAuthModalOpen, setAuthModalMode } = useApp();

  const handleOpenAccount = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  return (
    <section
      id="security-simplicity-growth-section"
      className="py-16 sm:py-24 bg-white dark:bg-[#03150e] text-slate-900 dark:text-white border-b border-slate-200 dark:border-emerald-950/70 transition-colors"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12 sm:space-y-16">
        
        {/* Section Header: Left-aligned with BlackRock / Stripe Fiduciary Styling */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Architectural Pillars</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Built for Security, Simplicity & Real Growth
            </h2>
            
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Fusing institutional balance-sheet rigor with modern financial velocity. Every asset is cryptographically backed and autonomously protected.
            </p>
          </div>

          <button
            onClick={handleOpenAccount}
            className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white dark:text-slate-950 dark:bg-emerald-500 dark:hover:bg-emerald-400 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Start Building Wealth</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Security */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-[#062017] border border-slate-200 dark:border-emerald-900/40 hover:border-emerald-500/50 dark:hover:border-emerald-500/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              
              {/* Top Row: Icon & Tag */}
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  Tier-1 Custody
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Institutional Security
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Segregated cold vault storage in Zurich and London. Backed by FIPS 140-2 Level 3 hardware security modules, multi-party computation (MPC), and real-time cryptographic proof-of-reserves.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-emerald-950/80 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Segregated Zurich Cold Vaults</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>256-Bit SSL/TLS 1.3 Encryption & Zero-Trust</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Monthly Independent Solvency Attestations</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setPublicPage('security')}
              className="mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer group-hover:translate-x-1"
            >
              <span>Explore Security Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Simplicity */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-[#062017] border border-slate-200 dark:border-emerald-900/40 hover:border-emerald-500/50 dark:hover:border-emerald-500/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              
              {/* Top Row: Icon & Tag */}
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                  <Cpu className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  Algorithmic Simplicity
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Seamless Capital Deployment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  24/7 AI-assisted portfolio rebalancing, zero-spread execution, and frictionless deposit gateways across SEPA, SWIFT, and digital stablecoins without hidden fees.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-emerald-950/80 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Automated Daily Accrual & Rebalancing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant Fiat & Blockchain Clearing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Unified Portfolio Dashboard & Biometrics</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setPublicPage('how-it-works')}
              className="mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer group-hover:translate-x-1"
            >
              <span>View How Algorithmic Yield Works</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Real Growth */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-[#062017] border border-slate-200 dark:border-emerald-900/40 hover:border-emerald-500/50 dark:hover:border-emerald-500/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              
              {/* Top Row: Icon & Tag */}
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  Transparent Alpha
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Real Compound Growth
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Access institutional yield benchmarks spanning sovereign yields, market-neutral liquidity provision, and spot arbitrage with full historical transparency and zero lockup friction.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-emerald-950/80 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Market-Neutral Yield Generating Strategies</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>0.00% Spread Execution via OTC Liquidity</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Same-Day Uncapped Withdrawal Liquidity</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setPublicPage('markets')}
              className="mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer group-hover:translate-x-1"
            >
              <span>Explore Market Performance Feeds</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
