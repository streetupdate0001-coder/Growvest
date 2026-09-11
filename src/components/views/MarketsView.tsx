import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  RefreshCw,
  ArrowUpRight,
  Star,
  Activity,
  AlertCircle,
  Filter,
  Sparkles,
  TrendingDown,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarketAsset } from '../../types';
import { formatCurrency } from '../../services/currency';
import { MarketSparkline } from '../common/MarketSparkline';
import { SortableHeader, SortDirection } from '../common/SortableHeader';

type MarketSortField = 'rank' | 'name' | 'price' | 'change24h' | 'volume' | 'market_cap';

export const MarketsView: React.FC = () => {
  const { currentCurrency, setActiveTab, setDepositModalOpen } = useApp();

  const [markets, setMarkets] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'layer1' | 'defi' | 'stables'>('all');
  const [favorites, setFavorites] = useState<string[]>(['bitcoin', 'ethereum']);

  const [sortField, setSortField] = useState<MarketSortField>('market_cap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: string) => {
    const target = field as MarketSortField;
    if (sortField === target) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(target);
      setSortDirection(target === 'name' || target === 'rank' ? 'asc' : 'desc');
    }
  };

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/markets');
      if (!res.ok) throw new Error('Could not retrieve live price feeds.');
      const json = await res.json();
      if (json.data) {
        setMarkets(json.data);
      }
    } catch (err: any) {
      setError(err.message || 'Market data temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredAndSortedMarkets = useMemo(() => {
    const filtered = markets.filter(m => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'layer1') {
        return ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'cardano', 'avalanche-2', 'polkadot'].includes(m.id);
      }
      if (selectedCategory === 'stables') {
        return ['tether', 'usd-coin'].includes(m.id);
      }
      if (selectedCategory === 'defi') {
        return ['chainlink', 'uniswap', 'aave'].includes(m.id);
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'rank':
          comparison = (a.market_cap_rank ?? 9999) - (b.market_cap_rank ?? 9999);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = (a.current_price ?? 0) - (b.current_price ?? 0);
          break;
        case 'change24h':
          comparison = (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0);
          break;
        case 'volume':
          comparison = (a.total_volume ?? 0) - (b.total_volume ?? 0);
          break;
        case 'market_cap':
          comparison = (a.market_cap ?? 0) - (b.market_cap ?? 0);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [markets, searchQuery, selectedCategory, sortField, sortDirection]);

  const topAssets = markets.slice(0, 4);

  return (
    <div id="growvest-markets-view" className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-2xl transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
              Live Digital Asset Discovery
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-200 border border-white/10">
              Live WebSocket Benchmark
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time market capitalizations, 24-hour price trend sparklines, and liquidity depth.
          </p>
        </div>

        <button
          onClick={fetchMarkets}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c1c22] hover:bg-[#25252e] text-slate-200 text-xs font-mono font-medium border border-white/10 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Top Assets 24-Hour Trend Highlights */}
      {topAssets.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Top Market Assets • 24h Trends</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Interactive Sparklines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topAssets.map((asset) => {
              const isPos = (asset.price_change_percentage_24h || 0) >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => setDepositModalOpen(true)}
                  className="p-5 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs hover:border-white/20 transition-all group cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {asset.image ? (
                        <img
                          src={asset.image}
                          alt={asset.name}
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center font-mono font-bold text-xs border border-white/10">
                          {asset.symbol.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white transition-colors">
                          {asset.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isPos
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {(asset.price_change_percentage_24h || 0).toFixed(2)}%
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-lg font-extrabold font-mono text-slate-900 dark:text-white">
                      {formatCurrency(asset.current_price, currentCurrency)}
                    </div>
                  </div>

                  {/* Mini Sparkline Chart */}
                  <div className="pt-1">
                    <div className="h-10 w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-black/30 p-1 border border-slate-100 dark:border-white/5">
                      <MarketSparkline
                        prices={asset.sparkline_in_7d?.price}
                        currentPrice={asset.current_price}
                        change24h={asset.price_change_percentage_24h}
                        currency={currentCurrency}
                        height={32}
                        width="100%"
                        idPrefix={`card-${asset.id}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs transition-colors">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by asset name or ticker (e.g. BTC, ETH)..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'layer1', label: 'Layer-1s' },
            { id: 'defi', label: 'DeFi' },
            { id: 'stables', label: 'Stablecoins' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id as any)}
              className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-white/20 text-white font-bold border border-white/20'
                  : 'bg-slate-100 dark:bg-[#1c1c22] text-slate-600 dark:text-slate-400 hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchMarkets} className="underline hover:text-rose-300 font-mono">
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Markets Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-mono text-slate-400 text-[11px]">
            Sorted by <span className="font-bold text-white capitalize">{sortField.replace('_', ' ')}</span> ({sortDirection === 'asc' ? 'Ascending ↑' : 'Descending ↓'})
          </span>
          {(sortField !== 'market_cap' || sortDirection !== 'desc') && (
            <button
              onClick={() => {
                setSortField('market_cap');
                setSortDirection('desc');
              }}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sort</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121216] shadow-xs dark:shadow-2xl transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4 w-10">Fav</th>
                <SortableHeader
                  label="# Asset"
                  field="name"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="left"
                />
                <SortableHeader
                  label="Price"
                  field="price"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label="24h Change"
                  field="change24h"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <th className="py-3.5 px-4 text-center w-36">24h Trend</th>
                <SortableHeader
                  label="24h Volume"
                  field="volume"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                  className="hidden md:table-cell"
                />
                <SortableHeader
                  label="Market Cap"
                  field="market_cap"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                  className="hidden lg:table-cell"
                />
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {loading && markets.length === 0 ? (
                [1, 2, 3, 4, 5, 6].map(n => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan={8} className="py-4 px-4">
                      <div className="h-6 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : filteredAndSortedMarkets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No digital assets found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredAndSortedMarkets.map((coin, idx) => {
                  const isFav = favorites.includes(coin.id);
                  const isPos = (coin.price_change_percentage_24h || 0) >= 0;
                  return (
                    <tr
                      key={coin.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <button
                          onClick={e => toggleFavorite(coin.id, e)}
                          className="text-slate-300 dark:text-slate-600 hover:text-amber-400 transition-colors p-1"
                          aria-label="Toggle favorite"
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-400 dark:text-slate-500 text-[11px] w-4">{coin.market_cap_rank ?? idx + 1}</span>
                          {coin.image ? (
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                              {coin.symbol.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {coin.name}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(coin.current_price, currentCurrency)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-semibold">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded ${
                            isPos ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isPos ? '+' : ''}
                          {(coin.price_change_percentage_24h || 0).toFixed(2)}%
                        </span>
                      </td>

                      {/* 24-Hour Recharts Mini Sparkline Column */}
                      <td className="py-2 px-3 text-center w-36">
                        <div className="w-32 mx-auto h-9 overflow-hidden rounded bg-slate-50/50 dark:bg-slate-950/30 p-0.5">
                          <MarketSparkline
                            prices={coin.sparkline_in_7d?.price}
                            currentPrice={coin.current_price}
                            change24h={coin.price_change_percentage_24h}
                            currency={currentCurrency}
                            height={32}
                            width={120}
                            idPrefix={`row-${coin.id}`}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300 hidden md:table-cell">
                        {formatCurrency(coin.total_volume || 0, currentCurrency)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300 hidden lg:table-cell">
                        {formatCurrency(coin.market_cap || 0, currentCurrency)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setDepositModalOpen(true)}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-semibold font-mono transition-all cursor-pointer"
                        >
                          Trade / Fund
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

