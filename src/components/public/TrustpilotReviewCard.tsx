import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquarePlus,
  Building2,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GrowvestDatabase, DbReviewRecord } from '../../services/db';

const FEATURED_TESTIMONIALS: DbReviewRecord[] = [
  {
    id: 'tp-1',
    author: 'Marcus Sterling',
    location: 'London, United Kingdom',
    role: 'Private Wealth Client',
    rating: 5,
    date: '2 days ago',
    title: 'Flawless institutional execution & immediate withdrawal clearing',
    content:
      'I have been allocating across the Balanced Multi-Asset strategy for 8 months. Withdrawals in both GBP SEPA and BTC are processed within minutes. The 1:1 reserve transparency and segregated custody give complete peace of mind.',
    verified: true,
    category: 'withdrawals',
    helpfulCount: 52
  },
  {
    id: 'tp-2',
    author: 'Dr. Elena Rostova',
    location: 'Zurich, Switzerland',
    role: 'Family Office Allocator',
    rating: 5,
    date: '4 days ago',
    title: 'Top-tier European compliance and bank-grade cold storage',
    content:
      'Verified their corporate registration and cold-storage architecture before deploying capital. The cryptographic audit trail, multi-sig hardware security, and live yield calculator match institutional standards perfectly.',
    verified: true,
    category: 'security',
    helpfulCount: 44
  },
  {
    id: 'tp-3',
    author: 'David K. Campbell',
    location: 'Singapore',
    role: 'High Net Worth Investor',
    rating: 5,
    date: '1 week ago',
    title: 'Transparent yield with zero hidden fees',
    content:
      'The quantitative yield returns have consistently met quarterly benchmarks. Deposited via crypto and received zero inbound fees. The customer support team on live chat and Telegram responded in under 2 minutes.',
    verified: true,
    category: 'yield',
    helpfulCount: 31
  },
  {
    id: 'tp-4',
    author: 'Jean-Luc Moreau',
    location: 'Paris, France',
    role: 'Quantitative Trader',
    rating: 5,
    date: '2 weeks ago',
    title: 'Real-time market feeds & intuitive multi-asset dashboard',
    content:
      'Clean interface without clutter. The live market sparklines, multi-currency switching (EUR/USD/GBP), and instant proof-of-payment upload make managing deposits effortless.',
    verified: true,
    category: 'support',
    helpfulCount: 26
  }
];

export const TrustpilotReviewCard: React.FC = () => {
  const { setPublicPage, setAuthModalOpen, setAuthModalMode } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('greeneza_reviews_helpful');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const currentReview = FEATURED_TESTIMONIALS[currentIndex];
  const isVoted = helpfulMap[currentReview.id];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? FEATURED_TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === FEATURED_TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const handleToggleHelpful = (id: string) => {
    setHelpfulMap(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('greeneza_reviews_helpful', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div
      id="trustpilot-review-card-component"
      className="w-full rounded-3xl bg-white dark:bg-[#11201b] border border-slate-200 dark:border-emerald-900/40 shadow-xl overflow-hidden transition-all"
    >
      {/* Top Trustpilot Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0d2a1f] via-[#081c15] to-[#0d2a1f] text-white border-b border-emerald-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Trustpilot Icon & Brand */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00b67a] text-white font-bold text-sm tracking-wide shadow-sm">
              <Star className="w-4 h-4 fill-white" />
              <span>Trustpilot</span>
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-emerald-300 uppercase">
                VERIFIED EXCELLENCE
              </div>
              <div className="text-[11px] text-slate-300">Independent Client Audit</div>
            </div>
          </div>

          {/* 5-Star Visual + Score */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <div
                  key={star}
                  className="w-6 h-6 bg-[#00b67a] rounded flex items-center justify-center text-white"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                </div>
              ))}
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-black text-white">4.9</span>
              <span className="text-xs text-slate-300">/ 5.0</span>
            </div>
            <span className="text-xs text-slate-300 ml-1 hidden md:inline">
              (3,420+ Reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Testimonial Body */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Client Review {currentIndex + 1} of {FEATURED_TESTIMONIALS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous review"
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#162721] hover:bg-slate-200 dark:hover:bg-[#1c332b] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-transparent dark:border-emerald-900/40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next review"
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#162721] hover:bg-slate-200 dark:hover:bg-[#1c332b] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-transparent dark:border-emerald-900/40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Testimonial Details */}
        <div className="space-y-3">
          {/* Star Rating for Current Review */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  className="w-4 h-4 fill-[#00b67a] text-[#00b67a]"
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Account</span>
            </span>
          </div>

          {/* Headline */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            "{currentReview.title}"
          </h3>

          {/* Quote Text */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
            "{currentReview.content}"
          </p>
        </div>

        {/* Reviewer Bio & Action Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {currentReview.author}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {currentReview.role} • {currentReview.location} ({currentReview.date})
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleHelpful(currentReview.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                isVoted
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-[#162721] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-emerald-900/40'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Helpful ({currentReview.helpfulCount + (isVoted ? 1 : 0)})</span>
            </button>

            <button
              onClick={() => setPublicPage('reviews')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              View All 3,420+ Reviews →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
