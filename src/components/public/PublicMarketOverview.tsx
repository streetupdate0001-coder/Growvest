import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, ArrowUpRight, Search } from 'lucide-react';
import { MarketAsset } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../services/currency';
import { MarketSparkline } from '../common/MarketSparkline';

export const PublicMarketOverview: React.FC = () => {
  const { currentCurrency, setAuthModalOpen, setAuthModalMode, t } = useApp();
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPublicMarkets = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch live market data from verified public CoinGecko API or internal route
      const res = await fetch(
        '/api/markets',
        { headers: { Accept: 'application/json' } }
      );

      if (!res.ok) {
        throw new Error('API unavailable');
      }

      const json = await res.json();
      const data = json.data || json;
      if (Array.isArray(data) && data.length > 0) {
        setAssets(data.slice(0, 8));
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error('Invalid format');
      }
    } catch (_err) {
      setError(t('markets.unavailable', 'Market data is temporarily unavailable.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicMarkets();
  }, []);

  const filteredAssets = assets.filter(
    a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      id="public-markets-section"
      className="py-16 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('markets.live', 'Live Market Rates')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {t('markets.sectionTitle', 'Supported Assets & Live Rates')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {t(
                'markets.sectionSubtitle',
                'Real-time price discovery from top tier liquidity providers with zero artificial markup.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {t('markets.lastUpdated', 'Last updated')}: {lastUpdated}
              </span>
            )}
            <button
              onClick={fetchPublicMarkets}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh live prices"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('markets.search', 'Search digital assets & symbols...')}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* Content State: Error / Loading / Data Table */}
        {error ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{error}</div>
            <button
              onClick={fetchPublicMarkets}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : loading && assets.length === 0 ? (
          <div className="p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-500 font-mono">Connecting to live market data streams...</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">{t('markets.asset', 'Asset')}</th>
                  <th className="py-3 px-4 sm:px-6">{t('markets.price', 'Price')}</th>
                  <th className="py-3 px-4 sm:px-6">{t('markets.change24h', '24h Change')}</th>
                  <th className="py-3 px-4 sm:px-6 text-center w-32 hidden sm:table-cell">24h Trend</th>
                  <th className="py-3 px-4 sm:px-6 hidden md:table-cell">{t('markets.volume', '24h Volume')}</th>
                  <th className="py-3 px-4 sm:px-6 hidden lg:table-cell">{t('markets.marketCap', 'Market Cap')}</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {filteredAssets.map(asset => {
                  const isPositive = (asset.price_change_percentage_24h ?? 0) >= 0;
                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Name & Symbol */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-900 dark:text-slate-100 uppercase font-mono">
                            {asset.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {asset.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 uppercase">
                              {asset.symbol}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Live Price in User Currency */}
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(asset.current_price, currentCurrency)}
                      </td>

                      {/* 24h Change */}
                      <td className="py-4 px-4 sm:px-6 font-mono">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                            isPositive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {isPositive ? '+' : ''}
                          {(asset.price_change_percentage_24h ?? 0).toFixed(2)}%
                        </span>
                      </td>

                      {/* 24h Sparkline Trend */}
                      <td className="py-3 px-3 text-center w-32 hidden sm:table-cell">
                        <div className="w-28 mx-auto h-8 overflow-hidden rounded bg-slate-50/50 dark:bg-slate-900/40 p-0.5">
                          <MarketSparkline
                            prices={asset.sparkline_in_7d?.price}
                            currentPrice={asset.current_price}
                            change24h={asset.price_change_percentage_24h}
                            currency={currentCurrency}
                            height={28}
                            width={110}
                            idPrefix={`pub-${asset.id}`}
                          />
                        </div>
                      </td>

                      {/* 24h Volume */}
                      <td className="py-4 px-4 sm:px-6 hidden md:table-cell font-mono text-slate-500 dark:text-slate-400">
                        {asset.total_volume
                          ? formatCurrency(asset.total_volume, currentCurrency)
                          : '—'}
                      </td>

                      {/* Market Cap */}
                      <td className="py-4 px-4 sm:px-6 hidden lg:table-cell font-mono text-slate-500 dark:text-slate-400">
                        {asset.market_cap
                          ? formatCurrency(asset.market_cap, currentCurrency)
                          : '—'}
                      </td>

                      {/* Trade / Access Link */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => {
                            setAuthModalMode('register');
                            setAuthModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                        >
                          <span>Trade</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
