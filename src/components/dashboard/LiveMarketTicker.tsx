import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../services/currency';
import { MarketAsset } from '../../types';

interface TickerAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h?: number;
  low24h?: number;
  volume?: number;
  tickDirection?: 'up' | 'down' | null;
}

const DEFAULT_TICKER_ASSETS: TickerAsset[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 94850.00, change24h: 2.85, high24h: 95400, low24h: 92800 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2795.40, change24h: 1.42, high24h: 2840, low24h: 2720 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 184.60, change24h: 5.12, high24h: 189.2, low24h: 173.8 },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 648.90, change24h: -0.34, high24h: 658, low24h: 641 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 2.38, change24h: 4.88, high24h: 2.45, low24h: 2.21 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.78, change24h: -1.15, high24h: 0.82, low24h: 0.76 },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', price: 31.40, change24h: 3.65, high24h: 32.8, low24h: 29.9 },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', price: 18.25, change24h: 2.10, high24h: 18.9, low24h: 17.5 },
  { id: 'sui', symbol: 'SUI', name: 'Sui', price: 3.45, change24h: 8.74, high24h: 3.62, low24h: 3.12 },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.82, change24h: 0.94, high24h: 8.1, low24h: 7.6 }
];

export const LiveMarketTicker: React.FC = () => {
  const { currentCurrency, setActiveTab } = useApp();
  const [tickerData, setTickerData] = useState<TickerAsset[]>(DEFAULT_TICKER_ASSETS);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdateTick, setLastUpdateTick] = useState<Date>(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch real market feeds from /api/markets
  useEffect(() => {
    let isMounted = true;

    const fetchMarkets = async () => {
      try {
        const res = await fetch('/api/markets');
        if (!res.ok) return;
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          const mapped: TickerAsset[] = json.data.slice(0, 12).map((item: MarketAsset) => ({
            id: item.id,
            symbol: item.symbol.toUpperCase(),
            name: item.name,
            price: item.current_price,
            change24h: item.price_change_percentage_24h,
            high24h: item.high_24h,
            low24h: item.low_24h,
            volume: item.total_volume,
            tickDirection: null
          }));
          setTickerData(mapped);
          setLastUpdateTick(new Date());
        }
      } catch (_err) {
        // use default data on error
      }
    };

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Live Micro-Tick Simulation (Sub-second price motion with flash feedback)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setTickerData(prev => {
        if (prev.length === 0) return prev;
        // pick 1 or 2 random assets to micro-adjust price
        const randomIndex = Math.floor(Math.random() * prev.length);
        const asset = prev[randomIndex];
        const deltaPercent = (Math.random() * 0.003 - 0.0014); // ~0.15% fluctuation
        const newPrice = Math.max(0.0001, Number((asset.price * (1 + deltaPercent)).toFixed(asset.price > 10 ? 2 : 4)));
        const direction: 'up' | 'down' = newPrice >= asset.price ? 'up' : 'down';

        const updated = [...prev];
        updated[randomIndex] = {
          ...asset,
          price: newPrice,
          tickDirection: direction
        };
        return updated;
      });

      // Clear the flash highlight after 1.2s
      setTimeout(() => {
        setTickerData(current =>
          current.map(c => (c.tickDirection ? { ...c, tickDirection: null } : c))
        );
      }, 1200);
    }, 2800);

    return () => clearInterval(tickInterval);
  }, []);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAssetClick = () => {
    setActiveTab('markets');
  };

  return (
    <div
      id="live-market-ticker-bar"
      className="w-full rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors"
    >
      <div className="flex items-center justify-between">
        {/* Left Live Indicator Badge */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-r border-slate-200 dark:border-slate-800 shrink-0 select-none">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 relative" />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-700 dark:text-slate-200 hidden xs:inline">
            Live Stream
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            24/7
          </span>
        </div>

        {/* Scrolling Ticker Area */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex-1 overflow-x-auto no-scrollbar scroll-smooth py-1.5 px-2 relative"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div
            className={`flex items-center gap-2.5 sm:gap-3.5 whitespace-nowrap ${
              isPaused ? '' : 'animate-ticker-marquee'
            }`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {/* Render duplicated array for infinite seamless scrolling loop */}
            {[...tickerData, ...tickerData].map((asset, idx) => {
              const isPositive = asset.change24h >= 0;
              const isFlashingUp = asset.tickDirection === 'up';
              const isFlashingDown = asset.tickDirection === 'down';

              return (
                <button
                  key={`${asset.id}-${idx}`}
                  type="button"
                  onClick={handleAssetClick}
                  title={`View ${asset.name} in Markets`}
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 cursor-pointer shrink-0 ${
                    isFlashingUp
                      ? 'bg-emerald-500/20 border-emerald-500/50 shadow-xs shadow-emerald-500/10'
                      : isFlashingDown
                      ? 'bg-rose-500/20 border-rose-500/50 shadow-xs shadow-rose-500/10'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {/* Asset Icon & Symbol */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center text-[10px] font-black">
                      {asset.symbol.charAt(0)}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{asset.symbol}</span>
                  </div>

                  {/* Price */}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(asset.price, currentCurrency)}
                  </span>

                  {/* 24h Change Badge */}
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isPositive
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-2.5 h-2.5 stroke-[2.5]" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5 stroke-[2.5]" />
                    )}
                    <span>{isPositive ? '+' : ''}{asset.change24h?.toFixed(2)}%</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Scroll & Controls */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950/80 border-l border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => handleManualScroll('left')}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            title="Scroll Left"
            aria-label="Scroll Ticker Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsPaused(prev => !prev)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            title={isPaused ? 'Resume Auto-Scroll' : 'Pause Auto-Scroll'}
            aria-label={isPaused ? 'Play Ticker' : 'Pause Ticker'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-500" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => handleManualScroll('right')}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            title="Scroll Right"
            aria-label="Scroll Ticker Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
