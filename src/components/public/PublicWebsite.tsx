import React, { useEffect } from 'react';
import { PublicNavbar } from './PublicNavbar';
import { PublicHero } from './PublicHero';
import { BrandSliderSection } from './BrandSliderSection';
import { SecuritySimplicityGrowthSection } from './SecuritySimplicityGrowthSection';
import { RegulatedInfrastructureSection } from './RegulatedInfrastructureSection';
import { InstitutionalTrustSection } from './InstitutionalTrustSection';
import { GlobalPresenceHub } from './GlobalPresenceHub';
import { AntiScamSecurityShield } from '../security/AntiScamSecurityShield';
import { TrustAndReviewsSection } from './TrustAndReviewsSection';
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
import { PublicFooter } from './PublicFooter';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, TrendingUp, Lock, Sparkles } from 'lucide-react';

export const PublicWebsite: React.FC = () => {
  const {
    publicPage,
    setPublicPage,
    isCertificateModalOpen,
    setIsCertificateModalOpen,
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
            <div className="py-12 bg-slate-100 dark:bg-[#031911] border-b border-slate-200 dark:border-emerald-950/70">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold uppercase mb-3 border border-emerald-500/20">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Direct Price Discovery</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  Live Global Markets & Price Feeds
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
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
            <InstitutionalTrustSection />
            <TrustAndReviewsSection />
          </div>
        );

      case 'about':
        return (
          <div className="space-y-0 animate-fade-in">
            <PublicAboutSection />
            <RegulatedInfrastructureSection />
            <CertificateSection />
          </div>
        );

      case 'how-it-works':
        return (
          <div className="space-y-0 animate-fade-in">
            <PublicHowItWorks />
            <div className="py-12 bg-white dark:bg-[#03150e] border-t border-b border-slate-200 dark:border-emerald-950/70">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                <InteractiveYieldCalculator />
              </div>
            </div>
            <BankLevelSecuritySection />
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8 py-10 animate-fade-in max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
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
            <RegulatedInfrastructureSection />
          </div>
        );

      case 'transparency':
        return (
          <div className="space-y-0 animate-fade-in">
            <TransparencySection />
            <RegulatedInfrastructureSection />
            <CertificateSection />
          </div>
        );

      case 'home':
      default:
        return (
          <div className="animate-fade-in space-y-0">
            {/* 1. HERO SECTION: Full-Width with 3-photo image slider, dark gradient overlay, Stripe/BlackRock layout */}
            <PublicHero />

            {/* Institutional Brand & Liquidity Tier-1 Feed Slider */}
            <BrandSliderSection />

            {/* 2. SECTION: "Built for Security, Simplicity & Real Growth" with 3 cards */}
            <SecuritySimplicityGrowthSection />

            {/* 3. SECTION: "Regulated Infrastructure Across London, Europe, Zurich & New York" */}
            <RegulatedInfrastructureSection />

            {/* 4. SECTION: "Institutional Trust in Action" with testimonials */}
            <InstitutionalTrustSection />

            {/* 5. Institutional Call to Action Banner (BlackRock + Stripe Aesthetic) */}
            <section className="py-20 bg-[#02140e] text-white relative overflow-hidden border-t border-emerald-950/80">
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next-Generation Wealth OS</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
                  Deploy Capital with Institutional Confidence on Growvest
                </h2>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Open an institutional account in under 2 minutes. Experience segregated Swiss vault custody, 24/7 AI risk management, and zero-spread market execution.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="w-full sm:w-auto h-13 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98]"
                  >
                    <span>Open Institutional Account</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => setPublicPage('about')}
                    className="w-full sm:w-auto h-13 px-8 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-white font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center"
                  >
                    <span>Review Fiduciary Mandate</span>
                  </button>
                </div>

                <div className="pt-6 text-xs text-slate-400 font-mono flex flex-wrap items-center justify-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>UK CRN #14892011</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>FinCEN MSB #31000289141088</span>
                  </span>
                  <span>•</span>
                  <span>Same-Day Uncapped Settlement</span>
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div id="growvest-public-site-container" className="min-h-screen flex flex-col bg-white dark:bg-[#020e09] text-slate-900 dark:text-slate-100 transition-colors">
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
