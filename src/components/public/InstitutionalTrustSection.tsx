import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Quote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Award,
  Sparkles,
  Building,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  institution: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
  metricLabel: string;
  metricValue: string;
  verifiedBadge: string;
}

const INSTITUTIONAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Alexander Sterling',
    role: 'Managing Director',
    institution: 'Vance Capital Partners',
    location: 'London, United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote:
      'The multi-asset execution speed and instantaneous clearing have transformed our corporate treasury management. Having segregated Zurich cold custody alongside real-time verifiable proof-of-reserves gives our investment committee absolute fiduciary certainty.',
    metricLabel: 'Capital Allocated',
    metricValue: '$42.5M USD',
    verifiedBadge: 'Verified Tier-1 Allocator'
  },
  {
    id: 't-2',
    name: 'Dr. Elena Rostova',
    role: 'Chief Investment Officer',
    institution: 'Aethelgard Family Office',
    location: 'Zurich, Switzerland',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote:
      'We conducted exhaustive institutional due diligence on Growvest’s UK Companies House registration, cryptographic cold-storage architecture, and independent audit attestations. Growvest represents the benchmark for modern fiduciary fintech governance.',
    metricLabel: 'Annualized Alpha',
    metricValue: '+17.8% Net',
    verifiedBadge: 'Due Diligence Passed'
  },
  {
    id: 't-3',
    name: 'Arthur Pendelton, CFA',
    role: 'Head of Corporate Treasury',
    institution: 'Meridian Global Logistics',
    location: 'New York, United States',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote:
      'Consolidating corporate cash management, algorithmic yields, and multi-currency liquidity into a single audited platform has reduced our treasury drag by over 140 basis points annually. All withdrawals clear with zero friction.',
    metricLabel: 'Treasury Drag Reduction',
    metricValue: '-142 bps',
    verifiedBadge: 'Corporate Client'
  }
];

export const InstitutionalTrustSection: React.FC = () => {
  const { setIsScamAdviserModalOpen, setPublicPage } = useApp();

  return (
    <section
      id="institutional-trust-section"
      className="py-16 sm:py-24 bg-white dark:bg-[#03150e] text-slate-900 dark:text-white border-b border-slate-200 dark:border-emerald-950/70 transition-colors"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Fiduciary Track Record</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Institutional Trust in Action
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Trusted by family offices, digital asset funds, and corporate treasuries globally for audited solvency and automated performance.
            </p>
          </div>

          {/* Trust Score Badges Strip (Trustpilot & ScamAdviser) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Trustpilot Pill */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#062017] border border-slate-200 dark:border-emerald-900/40 text-xs shadow-xs">
              <div className="flex items-center gap-0.5 text-[#00b67a]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#00b67a] text-[#00b67a]" />
                ))}
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">
                4.9 / 5.0
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                (3,420+ Reviews)
              </span>
            </div>

            {/* ScamAdviser Pill */}
            <button
              onClick={() => setIsScamAdviserModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ScamAdviser: 89/100 (95% Safe)</span>
            </button>
          </div>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {INSTITUTIONAL_TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-[#062017] border border-slate-200 dark:border-emerald-900/40 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 relative group"
            >
              <div className="space-y-5">
                
                {/* Rating & Verified Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    <UserCheck className="w-3 h-3 text-emerald-500" />
                    <span>{item.verifiedBadge}</span>
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed italic font-normal">
                  "{item.quote}"
                </p>

                {/* Key Metric Box */}
                <div className="p-3 rounded-2xl bg-white dark:bg-[#02130c] border border-slate-200/80 dark:border-emerald-950/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">{item.metricLabel}:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    {item.metricValue}
                  </span>
                </div>
              </div>

              {/* Author Info Footer */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-emerald-950/80 flex items-center gap-3.5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40 shrink-0"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {item.role}, {item.institution}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    {item.location}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="p-6 rounded-3xl bg-slate-900 dark:bg-[#020e09] text-white border border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              Audited by Independent Third-Party Security Firms & Cryptographic Oracles
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-400 font-semibold">
            <span>$1.4B+ Processed</span>
            <span>•</span>
            <span>99.99% Uptime</span>
            <span>•</span>
            <span>Zero Security Breaches</span>
          </div>
        </div>

      </div>
    </section>
  );
};
