import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  Play,
  Activity,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Cpu,
  Globe2,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  badge: string;
  title: string;
  subtitle: string;
  statLabel: string;
  statValue: string;
  statSub: string;
  deskLocation: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85',
    alt: 'Diverse corporate team working on laptops with Growvest wealth charts',
    badge: 'GROWVEST WEALTH TERMINAL™',
    title: 'Executive Multi-Asset Allocation',
    subtitle: 'Institutional desks deploying algorithmic capital models in real-time.',
    statLabel: '30-Day Benchmark Yield',
    statValue: '+18.42% APY',
    statSub: 'Verified Net Return',
    deskLocation: 'London & Zurich Desk 01'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=85',
    alt: 'Financial executive analyzing algorithmic charts and live yield curves',
    badge: 'QUANTITATIVE AI ENGINE',
    title: '24/7 Algorithmic Yields',
    subtitle: 'Sub-millisecond execution with automated risk parameter rebalancing.',
    statLabel: 'Execution Spread',
    statValue: '0.00% Zero-Spread',
    statSub: 'Direct OTC Liquidity',
    deskLocation: 'Frankfurt / MiCA Enclave'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85',
    alt: 'Corporate business leaders in modern boardroom reviewing Growvest reports',
    badge: 'TIER-1 CUSTODY & VAULT',
    title: 'Segregated Cold Storage',
    subtitle: 'FIPS 140-2 Level 3 hardware security modules with 100% reserve solvency.',
    statLabel: 'Institutional Custody',
    statValue: '$1.4B+ Backed',
    statSub: '100% Alpine Cold Vaults',
    deskLocation: 'Zurich Vault Gotthardstrasse'
  }
];

export const PublicHero: React.FC = () => {
  const { setAuthModalOpen, setAuthModalMode, setPublicPage } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slider every 5 seconds unless paused on hover
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleGetStarted = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const handleExploreDemo = () => {
    // Navigate directly to live dashboard preview
    if (typeof window !== 'undefined') {
      window.location.hash = '#dashboard';
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <section
      id="growvest-hero-section"
      className="w-full relative overflow-hidden bg-[#02130c] text-white border-b border-emerald-950/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Image Slider with Dark Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-35 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              transition: 'opacity 1s ease-in-out, transform 8s ease-out'
            }}
          />
        ))}

        {/* Dark Gradient Overlay for Maximum Readability (Stripe + BlackRock Aesthetics) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02140e] via-[#031c13]/95 to-[#02140e]/90 hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02140e]/95 via-[#031c13]/90 to-[#02140e] lg:hidden" />

        {/* Subtle Ambient Radial Lights */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      </div>

      {/* Hero Content Container: Max-width 1400px. Left-aligned on Desktop, Stacked Vertically with Image on Top on Mobile */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* MOBILE: IMAGE ON TOP (Order 1 on mobile, Order 2 on desktop) */}
          <div className="w-full order-1 lg:order-2 lg:col-span-6 xl:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Image Frame Card */}
              <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-[#041d14] shadow-2xl shadow-emerald-950/60 group">
                
                {/* Image Viewport */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
                  <img
                    src={activeSlideData.image}
                    alt={activeSlideData.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Subtle Gradient On Top Of Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02140e] via-[#02140e]/30 to-transparent" />

                  {/* Top Bar inside Image Card: Growvest Branding Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#02140e]/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold tracking-wider uppercase shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{activeSlideData.badge}</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 font-mono text-[10px]">
                      {activeSlideData.deskLocation}
                    </div>
                  </div>

                  {/* Floating Metric Chip Over Image */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#02140e]/90 backdrop-blur-md border border-emerald-500/30 text-xs shadow-xl">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                          {activeSlideData.statLabel}
                        </div>
                        <div className="text-lg sm:text-xl font-mono font-extrabold text-white mt-0.5 flex items-center gap-2">
                          <span className="text-emerald-400">{activeSlideData.statValue}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                          <Activity className="w-3 h-3" />
                          <span>{activeSlideData.statSub}</span>
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          Slide {currentSlide + 1} of {HERO_SLIDES.length}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Slider Controls Bar Below Card */}
                <div className="px-4 py-3 bg-[#031810] border-t border-emerald-950/80 flex items-center justify-between gap-4">
                  {/* Slide Indicators */}
                  <div className="flex items-center gap-2">
                    {HERO_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === currentSlide
                            ? 'w-8 bg-emerald-400 shadow-xs shadow-emerald-400/50'
                            : 'w-2 bg-emerald-950 hover:bg-emerald-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Slide Title */}
                  <div className="hidden sm:block text-xs font-medium text-slate-300 truncate max-w-[200px]">
                    {activeSlideData.title}
                  </div>

                  {/* Prev / Next Arrows */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrevSlide}
                      aria-label="Previous photo"
                      className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      aria-label="Next photo"
                      className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Decorative Background Accent */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 rounded-3xl blur-xl -z-10 opacity-70" />
            </div>
          </div>

          {/* DESKTOP & MOBILE: TEXT CONTENT (Order 2 on mobile, Order 1 on desktop) */}
          <div className="w-full order-2 lg:order-1 lg:col-span-6 xl:col-span-7 text-left space-y-6 sm:space-y-8">
            
            {/* Top Institutional Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Institutional Wealth Infrastructure</span>
              <span className="hidden sm:inline text-emerald-500/40">•</span>
              <span className="hidden sm:inline text-[11px] text-slate-300 font-sans font-normal">
                UK CRN #14892011 & FinCEN MSB
              </span>
            </div>

            {/* Exact Headline: "Institutional Multi-Asset Wealth & Capital Platform" */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Institutional Multi-Asset <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-400">
                Wealth & Capital Platform
              </span>
            </h1>

            {/* Exact Subtext: "Engineered with 24/7 AI tools, enterprise-grade custody, and transparent algorithmic yield solutions" */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl">
              Engineered with 24/7 AI tools, enterprise-grade custody, and transparent algorithmic yield solutions.
            </p>

            {/* 2 Buttons: "Get Started" green, "Explore Live Demo" outline */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 sm:pt-4">
              
              {/* 1. "Get Started" Green Button */}
              <button
                id="hero-btn-get-started"
                type="button"
                onClick={handleGetStarted}
                className="w-full sm:w-auto h-13 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>

              {/* 2. "Explore Live Demo" Outline Button */}
              <button
                id="hero-btn-explore-demo"
                type="button"
                onClick={handleExploreDemo}
                className="w-full sm:w-auto h-13 px-8 rounded-xl border border-white/25 hover:border-emerald-400 bg-white/5 hover:bg-emerald-500/10 text-white font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                <span>Explore Live Demo</span>
              </button>
            </div>

            {/* Fiduciary Pillars Row in BlackRock / Stripe Combined Style */}
            <div className="pt-6 sm:pt-8 border-t border-emerald-950/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left">
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Custodial Vault
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Segregated</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Zurich & UK Cold Storage</div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Spread Pricing
                </div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0.00% Zero</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Direct OTC Market Feeds</div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Compliance
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>CRN 14892011</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">UK & FinCEN Registered</div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Risk Engine
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24/7 AI Tools</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Continuous Monitoring</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
