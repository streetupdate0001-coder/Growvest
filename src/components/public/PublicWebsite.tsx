import React, { useEffect } from 'react';
import { PublicNavbar } from './PublicNavbar';
import { PublicHero } from './PublicHero';
import { GlobalPresenceHub } from './GlobalPresenceHub';
import { AntiScamSecurityShield } from '../security/AntiScamSecurityShield';
import { TrustAndReviewsSection } from './TrustAndReviewsSection';
import { TrustpilotReviewCard } from './TrustpilotReviewCard';
import { VerifiedSecurityPartners } from './VerifiedSecurityPartners';
import { InteractiveYieldCalculator } from './InteractiveYieldCalculator';
import { PublicMarketOverview } from './PublicMarketOverview';
import { PublicAboutSection } from './PublicAboutSection';
import { PublicHowItWorks } from './PublicHowItWorks';
import { PublicSecuritySection } from './PublicSecuritySection';
import { BankLevelSecuritySection } from './BankLevelSecuritySection';
import { PublicFaqSection } from './PublicFaqSection';
import { PublicContactSection } from './PublicContactSection';
import { TransparencySection } from './TransparencySection';
import { CertificateSection } from './CertificateSection';
import { CertificateModal } from './CertificateModal';
import { BrandSliderSection } from './BrandSliderSection';
import { TestimonialCarouselSection } from './TestimonialCarouselSection';
import { PublicFooter } from './PublicFooter';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, TrendingUp, Sliders, CheckCircle2, Lock, Star, ChevronRight, Globe2 } from 'lucide-react';

export const PublicWebsite: React.FC = () => {
  const {
    publicPage,
    setPublicPage,
    isCertificateModalOpen,
    setIsCertificateModalOpen,
    setIsScamAdviserModalOpen,
    setAuthModalOpen,
    setAuthModalMode
  } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [publicPage]);

  // Render view based on publicPage
  const renderPublicContent = () => {
    switch (publicPage) {
      case 'markets':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="py-12 bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold uppercase mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Direct Price Discovery
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  Live Global Markets & Price Feeds
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Institutional spot quotes, crypto assets, commodities, and fiat pairs aggregated with zero markups.
                </p>
              </div>
            </div>
            <PublicMarketOverview />
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-0 animate-fade-in">
            <TestimonialCarouselSection />
            <TrustAndReviewsSection />
          </div>
        );

      case 'about':
        return (
          <div className="space-y-0 animate-fade-in">
            <PublicAboutSection />
            <GlobalPresenceHub />
            <CertificateSection />
          </div>
        );

      case 'how-it-works':
        return (
          <div className="space-y-0 animate-fade-in">
            <PublicHowItWorks />
            <div className="py-12 bg-white dark:bg-slate-950 border-t border-b border-slate-200 dark:border-slate-800/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <InteractiveYieldCalculator />
              </div>
            </div>
            <BankLevelSecuritySection />
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8 py-10 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AntiScamSecurityShield />
            <BankLevelSecuritySection />
            <PublicSecuritySection />
            <VerifiedSecurityPartners />
            <TransparencySection />
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-0 animate-fade-in">
            <PublicFaqSection />
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-0 animate-fade-in">
            <PublicContactSection />
            <GlobalPresenceHub />
          </div>
        );

      case 'transparency':
        return (
          <div className="space-y-0 animate-fade-in">
            <TransparencySection />
            <GlobalPresenceHub />
            <CertificateSection />
          </div>
        );

      case 'home':
      default:
        return (
          <div className="animate-fade-in space-y-0">
            {/* 1. Sleek Hero with Institutional Ticker */}
            <PublicHero />

            {/* 2. Institutional Brand & Liquidity Swiper Slider */}
            <BrandSliderSection />

            {/* 3. Global Presence & Regulated Hubs */}
            <GlobalPresenceHub />

            {/* 4. Core Architecture Pillars */}
            <section className="py-16 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Platform Architecture
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Built for Security, Simplicity & Real Growth
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Experience segregated institutional custody and algorithmic capital strategies.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {/* Pillar 1: Markets */}
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Live Global Markets
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Real-time price discovery across cryptocurrencies, major forex pairs, commodities, and tokenized US Treasuries.
                      </p>
                    </div>
                    <button
                      onClick={() => setPublicPage('markets')}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer group-hover:translate-x-1"
                    >
                      <span>Explore Markets</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pillar 2: How It Works & Yield */}
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Sliders className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Algorithmic Portfolios
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Simulate returns and allocate into diversified investment strategies with 100% transparent benchmark models.
                      </p>
                    </div>
                    <button
                      onClick={() => setPublicPage('how-it-works')}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer group-hover:translate-x-1"
                    >
                      <span>Simulate Returns</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pillar 3: Security & Custody */}
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Anti-Scam Security Shield
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Protected by 256-bit SSL encryption, FIPS 140-2 hardware security modules, and audited proof of solvency reserves.
                      </p>
                    </div>
                    <button
                      onClick={() => setPublicPage('security')}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer group-hover:translate-x-1"
                    >
                      <span>Inspect Security Enclave</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Owl-Carousel / Testimonial Endorsements */}
            <TestimonialCarouselSection />

            {/* 6. Clean Trustpilot & ScamAdviser Trust Highlight */}
            <section className="py-14 sm:py-18 bg-[#f8faf9] dark:bg-[#0c1613] border-b border-slate-200 dark:border-slate-800/80">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <TrustpilotReviewCard />
              </div>
            </section>

            {/* 7. High-Impact Call To Action Banner */}
            <section className="py-16 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Ready to Start Building Your Multi-Asset Wealth?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
                  Open an institutional account in less than 2 minutes. Experience instant deposit processing and bank-grade custody.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    Open Institutional Account
                  </button>
                  <button
                    onClick={() => setPublicPage('about')}
                    className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all cursor-pointer"
                  >
                    Learn About Our Firm
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div id="growvest-public-site-container" className="min-h-screen flex flex-col bg-[#f8faf9] dark:bg-[#0a1412] text-slate-900 dark:text-slate-100 transition-colors">
      <PublicNavbar />
      <main className="flex-1">
        {renderPublicContent()}
      </main>
      <PublicFooter />

      {/* Global Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
      />
    </div>
  );
};
