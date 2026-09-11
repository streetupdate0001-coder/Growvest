import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Heart,
  Target,
  CheckCircle2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Compass,
  Zap,
  BookOpen,
  ChevronRight,
  Award,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Image assets generated for inspiring futures
import familyFutureImg from '../../assets/images/wealth_freedom_family_1787482890124.jpg';
import entrepreneurImg from '../../assets/images/future_growth_journey_1787482906271.jpg';
import retirementImg from '../../assets/images/peaceful_future_life_1787482918264.jpg';

interface StoryItem {
  id: string;
  name: string;
  location: string;
  role: string;
  tag: string;
  headline: string;
  quote: string;
  summary: string;
  milestoneReached: string;
  timeframe: string;
  growthMetric: string;
  image: string;
  financialTips: string[];
}

export const InspiringFutureStories: React.FC = () => {
  const { setAuthModalOpen, setAuthModalMode, setPublicPage } = useApp();
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [selectedTipCategory, setSelectedTipCategory] = useState<'compounding' | 'hedging' | 'retirement' | 'mindset'>('compounding');

  const inspiringStories: StoryItem[] = [
    {
      id: 'family-future',
      name: 'The Henderson Family',
      location: 'Edinburgh, UK',
      role: 'Family Legacy Allocators',
      tag: 'Generational Wealth',
      headline: 'Securing Our Children’s Higher Education & Debt-Free Home',
      quote:
        '“We used to worry about inflation eroding our hard-earned savings in traditional bank accounts. Switching to Growvest’s balanced compounding model gave our family predictable growth and total financial peace.”',
      summary:
        'Starting with an initial capital allocation of $18,500, Mark and Sarah automated monthly reinvestments across the Multi-Asset Green Yield portfolio. Over 36 months of disciplined compounding, their portfolio grew sufficiently to guarantee their twin daughters’ university fund while purchasing a scenic countryside retreat.',
      milestoneReached: '100% Debt-Free Education Fund & Family Home Downpayment',
      timeframe: '36 Months of Disciplined Growth',
      growthMetric: '+29.4% Annualized Return',
      image: familyFutureImg,
      financialTips: [
        'Automate small, consistent monthly top-ups rather than timing volatile market peaks.',
        'Choose 1:1 segregated custody to ensure family savings are never exposed to algorithmic lending.',
        'Reinvest yield during early accumulation years to maximize exponential compound curves.'
      ]
    },
    {
      id: 'early-retirement',
      name: 'David & Clara Zhao',
      location: 'Zurich, Switzerland',
      role: 'Early Retirees & Coastal Explorers',
      tag: 'Financial Independence',
      headline: 'Retiring 7 Years Ahead of Schedule with Reliable Monthly Passive Cashflow',
      quote:
        '“True wealth is not just a high net worth number—it is having the freedom to wake up every morning and decide exactly how you spend your day without financial anxiety.”',
      summary:
        'After 22 years in high-stress corporate roles, David and Clara restructured their retirement capital. By allocating to Growvest’s Fixed-Yield and Infrastructure Notes, they now generate over $5,200 in monthly automated payouts straight to their European bank account, completely funding their oceanfront living.',
      milestoneReached: 'Full Financial Independence & $5,200/mo Predictable Cashflow',
      timeframe: 'Achieved in 4 Years',
      growthMetric: 'Zero Principal Drawdown',
      image: retirementImg,
      financialTips: [
        'Replace speculative trading with audited asset-backed yield instruments.',
        'Establish a multi-currency withdrawal strategy (EUR/USD/GBP) to eliminate foreign exchange risk.',
        'Maintain a 6-month liquid cash cushion alongside long-term yield contracts.'
      ]
    },
    {
      id: 'entrepreneur-growth',
      name: 'Sofia Al-Mansoor',
      location: 'Dubai & London',
      role: 'Eco-Tech Founder & Angel Investor',
      tag: 'Business & Future Impact',
      headline: 'Hedging Business Reserves to Fuel Sustainable Ventures',
      quote:
        '“Growvest allowed our enterprise to put idle working capital to work safely. The daily yield now covers our baseline software overhead and lets us back young clean-tech founders.”',
      summary:
        'As an ambitious tech entrepreneur, Sofia needed institutional-grade liquidity without exposing company treasury to market flash crashes. Using Growvest’s diversified commodities and algorithmic arbitrage vaults, she turned idle revenue into an evergreen innovation fund.',
      milestoneReached: 'Business Operating Costs 100% Funded by Passive Yield',
      timeframe: '24 Months Active Compounding',
      growthMetric: '2.4x Working Treasury',
      image: entrepreneurImg,
      financialTips: [
        'Diversify business reserves across non-correlated asset classes (Green energy, commodities, digital assets).',
        'Leverage instant blockchain and SEPA settlement to maintain immediate operational liquidity.',
        'Align capital with sustainable global infrastructure for ethical and resilient returns.'
      ]
    }
  ];

  const currentStory = inspiringStories[activeStoryIndex];

  const helpfulGuides = [
    {
      id: 'compounding',
      title: 'The Power of Compound Yield',
      subtitle: 'The 8th Wonder of Wealth Creation',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      content:
        'When your daily or weekly investment yields are automatically reinvested, you earn yield on your yield. Over 3 to 5 years, this exponential curve frequently outpaces linear savings by 300% to 500%.',
      actionableRule: 'Rule of 72: Divide 72 by your annual yield percentage to determine the exact years needed to double your initial capital.'
    },
    {
      id: 'hedging',
      title: 'Inflation & Currency Protection',
      subtitle: 'Preserving Real Purchasing Power',
      icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
      content:
        'Holding fiat cash in traditional savings accounts guarantees real loss against 4-8% true living inflation. By holding multi-asset positions backed by real green commodities and gold, your balance expands in tandem with global prices.',
      actionableRule: 'Action: Allocate at least 30% of reserves to hard asset-backed yield notes with multi-currency settlement.'
    },
    {
      id: 'retirement',
      title: 'Designing Your Passive Income Rail',
      subtitle: 'From Working for Money to Money Working for You',
      icon: <Compass className="w-5 h-5 text-cyan-400" />,
      content:
        'Transitioning to financial independence requires consistent, non-volatile cash distribution. Growvest allows users to schedule automated weekly or monthly withdrawals to any SEPA/SWIFT bank account with 0% withdrawal fees.',
      actionableRule: 'Benchmark: Aim for monthly yield payouts that cover 1.5x your baseline essential living expenditures.'
    },
    {
      id: 'mindset',
      title: 'Long-Term Vision & Discipline',
      subtitle: 'Overcoming Short-Term Market Noise',
      icon: <Target className="w-5 h-5 text-emerald-400" />,
      content:
        'The most successful wealth builders avoid impulsive emotional trades during headlines. They deploy capital systematically into verified, audited strategies and let time and institutional math execute the heavy lifting.',
      actionableRule: 'Golden Habit: Check your long-term plan quarterly rather than reacting to daily hourly price noise.'
    }
  ];

  return (
    <section
      id="inspiring-future-stories-section"
      className="py-16 sm:py-24 bg-[#0a1512] text-slate-100 relative overflow-hidden border-b border-emerald-950/60"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>REAL STORIES • INSPIRING FUTURES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Build Your Best Possible Future
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real people, real families, and real entrepreneurs who transformed disciplined compounding and bank-grade yield into financial freedom, peace of mind, and lasting security.
          </p>
        </div>

        {/* Story Navigator Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {inspiringStories.map((story, idx) => {
            const isActive = idx === activeStoryIndex;
            return (
              <button
                key={story.id}
                onClick={() => setActiveStoryIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold scale-[1.02]'
                    : 'bg-[#11201b] hover:bg-[#162a24] text-slate-300 border border-emerald-900/40'
                }`}
              >
                <span>{story.name}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950 font-bold'
                      : 'bg-[#091512] text-slate-400'
                  }`}
                >
                  {story.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Story Interactive Showcase Card */}
        <div className="bg-[#11201b] border border-emerald-900/40 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column: Authentic Generated Picture */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[460px] overflow-hidden group">
              <img
                src={currentStory.image}
                alt={currentStory.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1512] via-[#0a1512]/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#11201b]" />

              {/* Float Badge on Image */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#091512]/90 backdrop-blur-md border border-emerald-900/50 text-white">
                <div>
                  <div className="text-xs font-bold">{currentStory.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {currentStory.role} • {currentStory.location}
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentStory.growthMetric}
                </span>
              </div>
            </div>

            {/* Right Column: Inspiring Journey & Educational Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-4">
                {/* Milestone & Timeframe Pill */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{currentStory.milestoneReached}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ⏱ {currentStory.timeframe}
                  </span>
                </div>

                {/* Main Headline */}
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {currentStory.headline}
                </h3>

                {/* Quote Box */}
                <div className="p-4 rounded-2xl bg-[#0a1713] border border-emerald-900/40 text-slate-200 text-xs sm:text-sm italic leading-relaxed">
                  {currentStory.quote}
                </div>

                {/* Summary Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentStory.summary}
                </p>

                {/* Practical Lessons from this Journey */}
                <div className="pt-2 space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Key Lessons for Your Future:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentStory.financialTips.map((tip, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-[#0b1b16] border border-emerald-900/30 flex items-start gap-2 text-xs text-slate-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <span>Start Your Own Wealth Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Capital Protection & Segregation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Helpful Information: 4 Strategic Pillars to Build Your Future */}
        <div className="space-y-6">
          <div className="text-left max-w-2xl">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              HELPFUL WEALTH-BUILDING BLUEPRINT
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">
              4 Principles to Engineer Your Best Possible Future
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Practical, actionable knowledge designed to transition you from unpredictable volatility to systematic compounding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {helpfulGuides.map(guide => (
              <div
                key={guide.id}
                className="p-5 rounded-2xl bg-[#11201b] hover:bg-[#152721] border border-emerald-900/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 group text-left shadow-lg"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    {guide.icon}
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {guide.title}
                    </h4>
                    <div className="text-xs text-slate-400 font-medium">
                      {guide.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {guide.content}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#091512] border border-emerald-900/40 text-[11px] font-mono text-emerald-400">
                  <span className="font-bold text-slate-300">Takeaway: </span>
                  {guide.actionableRule}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouraging Institutional Call to Action Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0d2e21] via-[#091d16] to-[#0d2e21] border border-emerald-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Design Your Financial Freedom?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join over 3,420+ verified clients who have taken control of their financial destiny with secure, high-yield multi-asset allocation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setAuthModalMode('register');
                setAuthModalOpen(true);
              }}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xl shadow-emerald-500/20 cursor-pointer"
            >
              Open Your Account Today
            </button>
            <button
              onClick={() => setPublicPage('calculator')}
              className="px-6 py-3 rounded-xl bg-[#11201b] hover:bg-[#162a24] text-white font-semibold text-xs sm:text-sm border border-emerald-900/40 transition-colors cursor-pointer"
            >
              Calculate Your Future Returns
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
