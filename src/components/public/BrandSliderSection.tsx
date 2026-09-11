import React, { useState, useEffect, useRef } from 'react';
import { Building2, ShieldCheck, Award, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface BrandItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  logoSvg?: React.ReactNode;
  fallbackText: string;
}

const INSTITUTIONAL_BRANDS: BrandItem[] = [
  {
    id: 'bloomberg',
    name: 'Bloomberg Professional',
    category: 'Market Feeds & Terminal Data',
    badge: 'Terminal Feed',
    fallbackText: 'Bloomberg'
  },
  {
    id: 'refinitiv',
    name: 'LSEG / Refinitiv',
    category: 'Institutional FX Pricing',
    badge: 'Real-time FIX',
    fallbackText: 'Refinitiv'
  },
  {
    id: 'fireblocks',
    name: 'Fireblocks MPC Vault',
    category: 'Cold Custody & Security',
    badge: 'MPC Protection',
    fallbackText: 'Fireblocks'
  },
  {
    id: 'chainalysis',
    name: 'Chainalysis KYT',
    category: 'AML & On-Chain Forensics',
    badge: 'AML Compliance',
    fallbackText: 'Chainalysis'
  },
  {
    id: 'swissquote',
    name: 'Swissquote Group',
    category: 'Tier-1 Liquidity Provider',
    badge: 'Swiss Liquidity',
    fallbackText: 'Swissquote'
  },
  {
    id: 'barclays',
    name: 'Barclays Corporate',
    category: 'Segregated Trust Accounts',
    badge: 'FCA Tier-1',
    fallbackText: 'Barclays'
  },
  {
    id: 'binance-custody',
    name: 'Ceffu / Institutional Custody',
    category: 'Deep Reserve Storage',
    badge: '1:1 Backing',
    fallbackText: 'Ceffu Custody'
  },
  {
    id: 'cloudflare-ent',
    name: 'Cloudflare Enterprise Armor',
    category: 'DDoS Shield & Edge Security',
    badge: 'Zero-Trust WAF',
    fallbackText: 'Cloudflare'
  }
];

export const BrandSliderSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-slide effect for the brand swiper
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % INSTITUTIONAL_BRANDS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? INSTITUTIONAL_BRANDS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % INSTITUTIONAL_BRANDS.length);
  };

  return (
    <section className="brand py-10 sm:py-14 bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
      <div className="container max-w-[960px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block">
                Liquidity & Infrastructure Partners
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Backed by Tier-1 Custodians, Terminals & Security Networks
              </h3>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous brand logo"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-xs cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next brand logo"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-xs cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swiper Container with CSS standard .swiper-wrapper and .swiper-slide */}
        <div
          className="swiper-container relative overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          ref={sliderRef}
        >
          {/* Track wrapper */}
          <div
            className="swiper-wrapper flex transition-transform duration-700 ease-out gap-4 sm:gap-6"
            style={{
              transform: `translateX(-${currentIndex * (230 + 16)}px)`
            }}
          >
            {/* Extended Brand items for seamless continuous looping */}
            {[...INSTITUTIONAL_BRANDS, ...INSTITUTIONAL_BRANDS].map((brand, idx) => (
              <div
                key={`${brand.id}-${idx}`}
                className="swiper-slide shrink-0 w-[210px] sm:w-[230px] select-none"
              >
                <div className="brand-image p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all group flex flex-col items-center justify-center text-center h-28">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
                      {brand.badge}
                    </span>
                  </div>

                  <div className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {brand.name}
                  </div>

                  <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                    {brand.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand slider indicator dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {INSTITUTIONAL_BRANDS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Slide to brand ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === dotIdx
                  ? 'w-6 bg-emerald-500'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
