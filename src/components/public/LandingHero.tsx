import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Lock,
  Globe2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MarketAsset } from '../../types';
import { formatCurrency } from '../../services/currency';

export const LandingHero: React.FC = () => {
  const { setActiveTab, setAuthModalOpen, setAuthModalMode, currentCurrency, t } = useApp();
  const { isAuthenticated } = useAuth();

  const [marketTicker, setMarketTicker] = useState<MarketAsset[]>([]);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [marketError, setMarketError] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchTicker() {
      try {
        setLoadingMarkets(true);
        const res = await fetch('/api/markets');
        if (!res.ok) throw new Error('API unavailable');
        const json = await res.json();
        if (mounted && json.data) {
          setMarketTicker(json.data.slice(0, 5));
          setMarketError(false);
        }
      } catch (_e) {
        if (mounted) setMarketError(true);
      } finally {
        if (mounted) setLoadingMarkets(false);
      }
    }
    fetchTicker();
    const interval = setInterval(fetchTicker, 45000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="growvest-landing-hero" className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>INSTITUTIONAL GRADE DIGITAL ASSET INFRASTRUCTURE</span>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight sm:leading-tight">
            {t('hero.title', 'Next-Generation Financial Technology for Global Portfolios')}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t(
              'hero.subtitle',
              'Track digital assets, manage institutional-grade portfolios, and access transparent market intelligence on an ultra-secure international platform.'
            )}
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {isAuthenticated ? (
              <button
                id="btn-hero-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Enter Financial Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  id="btn-hero-open-account"
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{t('hero.ctaPrimary', 'Open Account')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-hero-explore-markets"
                  onClick={() => setActiveTab('markets')}
                  className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>{t('hero.ctaSecondary', 'Explore Live Markets')}</span>
                </button>
              </>
            )}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-sans">
            {t('hero.disclaimer', 'Digital asset investments involve significant market risk. Past performance does not guarantee future results.')}
          </div>
        </div>

        {/* Live Market Ticker Row */}
        <div className="mt-12 lg:mt-14">
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Real-Time Market Benchmark</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
                Live Feed
              </span>
            </div>

            {loadingMarkets ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 animate-pulse">
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/60 p-3" />
                ))}
              </div>
            ) : marketError ? (
              <div className="py-4 text-center text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Market data temporarily unavailable. Displaying cached exchange benchmarks.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {marketTicker.map(coin => {
                  const isPositive = (coin.price_change_percentage_24h || 0) >= 0;
                  return (
                    <div
                      key={coin.id}
                      onClick={() => setActiveTab('markets')}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase font-mono">
                          {coin.symbol}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-semibold ${
                            isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {(coin.price_change_percentage_24h || 0).toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                        {formatCurrency(coin.current_price, currentCurrency)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
