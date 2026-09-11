import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, Quote, Award, Sparkles, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TestimonialData {
  id: string;
  name: string;
  designation: string;
  avatarUrl: string;
  rating: number;
  reviewText: string;
  verifiedBadge: string;
  location: string;
  yieldStrategy: string;
}

const TESTIMONIALS_DATA: TestimonialData[] = [
  {
    id: 't-1',
    name: 'Alexander Sterling',
    designation: 'Managing Director / Vance Capital Partners',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    reviewText:
      'The multi-asset execution speed and instantaneous SEPA/crypto clearing have transformed our liquidity management. Having segregated custody alongside verifiable proof-of-reserves gives our committee absolute confidence.',
    verifiedBadge: 'Verified Tier-1 Allocator',
    location: 'London, UK',
    yieldStrategy: 'Balanced Multi-Asset Yield'
  },
  {
    id: 't-2',
    name: 'Dr. Elena Rostova',
    designation: 'Chief Investment Officer / Aethelgard Family Office',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    reviewText:
      'We conducted exhaustive due diligence on their UK Companies House status, cold-storage architecture, and independent ScamAdviser 89/100 score. GROWVEST represents the gold standard of transparent fintech governance.',
    verifiedBadge: 'Corporate Due Diligence Passed',
    location: 'Zurich, Switzerland',
    yieldStrategy: 'Conservative Sovereign Bond Strategy'
  },
  {
    id: 't-3',
    name: 'David K. Campbell',
    designation: 'Principal Partner / Campbell Private Wealth',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    reviewText:
      'Zero deposit friction, transparent benchmark yields, and round-the-clock priority compliance assistance. Their automated daily yield accrual and biometric passkey login make portfolio monitoring effortless.',
    verifiedBadge: 'Verified High Net Worth Client',
    location: 'Singapore',
    yieldStrategy: 'Quantitative Alpha Strategy'
  },
  {
    id: 't-4',
    name: 'Jean-Luc Moreau',
    designation: 'Head of Trading / Merovingian Asset Management',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    reviewText:
      'The real-time market data feeds, sparkline visualizations, and multi-currency account balances provide unmatched operational clarity. All withdrawals cleared seamlessly without delays or hidden fees.',
    verifiedBadge: 'Verified Institutional Trader',
    location: 'Paris, France',
    yieldStrategy: 'Global Macro Currency Basket'
  }
];

export const TestimonialCarouselSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { setPublicPage, setAuthModalOpen, setAuthModalMode } = useApp();

  // 8000ms Autoplay loop matching Owl Carousel specifications
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const activeItem = TESTIMONIALS_DATA[currentSlide];

  return (
    <section className="testimonials-section py-16 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80">
      <div className="container max-w-[960px] mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Client Endorsements</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Trust in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Real feedback from accredited family offices, private wealth investors, and institutional allocators.
          </p>
        </div>

        {/* Carousel Container (Theme Carousel / Owl Carousel 2 structure) */}
        <div
          className="theme_carousel owl-carousel relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Slide Card */}
          <div className="testimonial-single p-6 sm:p-10 rounded-3xl bg-[#fbfdfc] dark:bg-[#0d1a16] border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all">
            {/* Subtle watermark quote icon */}
            <Quote className="absolute right-6 top-6 w-20 h-20 text-emerald-500/10 dark:text-emerald-500/15 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Review Content */}
              <div className="testimonial-single-content md:col-span-8 space-y-4">
                {/* Reviewer Meta & Badges */}
                <div className="reviewer space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="name text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {activeItem.name}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {activeItem.verifiedBadge}
                    </span>
                  </div>
                  <div className="dasegnation text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {activeItem.designation} • <span className="text-slate-600 dark:text-slate-400">{activeItem.location}</span>
                  </div>
                </div>

                {/* Rating Stars List */}
                <div className="review">
                  <ul className="flex items-center gap-1" aria-label={`${activeItem.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, starIdx) => (
                      <li key={starIdx}>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Testimonial Description */}
                <div className="testimonial-description">
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{activeItem.reviewText}"
                  </p>
                </div>

                {/* Strategy Tag */}
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Allocated in: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{activeItem.yieldStrategy}</strong></span>
                </div>
              </div>

              {/* Profile Image */}
              <div className="testimonial-single-image md:col-span-4 flex flex-col items-center md:items-end justify-center">
                <div className="relative">
                  <img
                    src={activeItem.avatarUrl}
                    alt={activeItem.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-md"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-emerald-500 text-white shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            {/* Pagination dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx
                      ? 'w-8 bg-emerald-500'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous review"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next review"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* View all reviews CTA button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setPublicPage('reviews')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Read All 140+ Verified Client Reviews & Trust Metrics</span>
          </button>
        </div>
      </div>
    </section>
  );
};
