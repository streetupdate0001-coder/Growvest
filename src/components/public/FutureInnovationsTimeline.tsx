import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Globe,
  CreditCard,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Radio,
  Calendar,
  Lock,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RoadmapMilestone {
  id: string;
  quarter: string;
  year: string;
  title: string;
  category: string;
  status: 'Auditing' | 'In Development' | 'Prototype Phase' | 'Planned';
  statusColor: string;
  completionPercentage: number;
  icon: React.ReactNode;
  summary: string;
  keySpecs: string[];
  investorImpact: string;
  partnerOrAuditor: string;
}

export const FutureInnovationsTimeline: React.FC = () => {
  const { setAuthModalOpen, setAuthModalMode } = useApp();
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('q4-2026');

  const milestones: RoadmapMilestone[] = [
    {
      id: 'q4-2026',
      quarter: 'Q4',
      year: '2026',
      title: 'AI-Driven Liquidity & Volatility Shield',
      category: 'Algorithmic Optimization',
      status: 'Auditing',
      statusColor: 'bg-emerald-500 text-slate-950 font-bold',
      completionPercentage: 88,
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      summary:
        'Sub-millisecond machine learning algorithms that automatically balance capital between green bond yields, gold arbitrage, and stable asset pools to maximize net return while immunizing against market drawdown.',
      keySpecs: [
        'Real-time automated spread capture across 14 Tier-1 liquidity venues',
        'Zero-slippage risk hedging protocol',
        'Smart contract audit currently in final review by top security firms',
        'Estimated +2.8% to +4.2% annualized efficiency increase'
      ],
      investorImpact: 'Higher baseline daily yields with automated downside capital insulation.',
      partnerOrAuditor: 'ConsenSys Diligence & OpenZeppelin Auditing'
    },
    {
      id: 'q1-2027',
      quarter: 'Q1',
      year: '2027',
      title: 'Tokenized Green Energy Infrastructure Notes',
      category: 'ESG Real-World Assets (RWA)',
      status: 'In Development',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      completionPercentage: 65,
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      summary:
        'Institutional fractional access to revenue-generating solar arrays, hydro turbines, and net-zero AI data centers across Western Europe with weekly cryptographic proof-of-production.',
      keySpecs: [
        '100% physically backed by audited European green energy infrastructure',
        'Direct revenue pass-through to investor accounts',
        'Carbon credit offset certificates issued to every account holder',
        'Targeted 14.8% to 18.5% fixed annual coupon distributions'
      ],
      investorImpact: 'Direct exposure to resilient real-world energy cashflows with green ESG validation.',
      partnerOrAuditor: 'European Green Energy Consortium & UK Registry'
    },
    {
      id: 'q2-2027',
      quarter: 'Q2',
      year: '2027',
      title: 'Growvest Sovereign Multi-Sig Key Vault',
      category: 'Institutional Security',
      status: 'Prototype Phase',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      completionPercentage: 42,
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      summary:
        'Proprietary biometric physical keycard and mobile enclave pairing, enabling institutional and high-net-worth clients to co-authorize high-value disbursements with multi-party threshold signatures (TSS).',
      keySpecs: [
        'FIPS 140-3 Level 4 hardware architecture with EAL6+ secure element',
        'Near-field biometric fingerprint authentication on physical keycards',
        'Zero seed phrase vulnerability via distributed Shamir Secret Sharing',
        'Multi-user corporate approval matrix for family offices and treasury funds'
      ],
      investorImpact: 'Bank-vault grade self-custody reassurance without operational friction.',
      partnerOrAuditor: 'FIPS Testing Lab & Ledger Enterprise Partner'
    },
    {
      id: 'q3-2027',
      quarter: 'Q3',
      year: '2027',
      title: 'Instant SEPA & Private Global Visa/Mastercard Off-Ramp',
      category: 'Global Payment Rails',
      status: 'Planned',
      statusColor: 'bg-neutral-800 text-neutral-300',
      completionPercentage: 20,
      icon: <CreditCard className="w-5 h-5 text-amber-400" />,
      summary:
        'Seamless integration between your Growvest yield engine and global payment terminals. Spend daily generated returns globally in EUR, USD, or GBP with 0% foreign transaction fees and real-time cash back.',
      keySpecs: [
        'Direct settlement from active yield balances with zero conversion lag',
        'SEPA Instant bank transfer support with under 5-second completion',
        'Physical metal cards with concierge benefits for Tier-2+ capital tiers',
        'Worldwide contactless acceptance at over 90M merchants'
      ],
      investorImpact: 'Frictionless liquidity allowing your capital yields to fund daily lifestyle in real time.',
      partnerOrAuditor: 'Principal Visa/Mastercard European Issuing Bank'
    }
  ];

  const selectedMilestone =
    milestones.find(m => m.id === selectedMilestoneId) || milestones[0];

  return (
    <section
      id="future-innovations-timeline"
      className="py-16 sm:py-24 bg-[#0a1512] text-slate-100 relative overflow-hidden border-b border-emerald-950/60"
    >
      {/* Glow Effects */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-emerald-950/80 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>INNOVATION ROADMAP • 2026 - 2027</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Future Innovations & Strategic Vision
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We engineer with a multi-year horizon. Explore our upcoming institutional capabilities designed to continually compound efficiency, security, and global liquidity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#11201b] border border-emerald-500/20 text-xs font-mono flex items-center gap-3 shadow-md">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-emerald-300 font-semibold">Active R&D Cycle: Phase 4.2</span>
            </div>
          </div>
        </div>

        {/* Timeline Quarter Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m, index) => {
            const isSelected = m.id === selectedMilestoneId;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMilestoneId(m.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between space-y-4 shadow-lg ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#103326] to-[#0a1f18] border-emerald-400 shadow-xl shadow-emerald-500/15 scale-[1.02]'
                    : 'bg-[#11201b] hover:bg-[#152721] border-emerald-900/40 hover:border-emerald-700/60'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {m.quarter} {m.year}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${m.statusColor}`}>
                      {m.status}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#091512] border border-emerald-900/40">
                        {m.icon}
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                        {m.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                      {m.title}
                    </h3>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-emerald-950/80">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Engineering Progress</span>
                    <span className="text-emerald-400 font-bold">{m.completionPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#091512] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${m.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Milestone Deep-Dive Showcase */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-r from-[#0d2a1f] via-[#091a14] to-[#0d2a1f] border border-emerald-500/30 shadow-2xl text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Detailed Specs & Architecture */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-mono font-bold text-xs">
                  Target Launch: {selectedMilestone.quarter} {selectedMilestone.year}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#0a1713]/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                  Category: {selectedMilestone.category}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  Status: <strong className="text-emerald-400">{selectedMilestone.status}</strong>
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedMilestone.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {selectedMilestone.summary}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Technical Architecture & Audited Benchmarks:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMilestone.keySpecs.map((spec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#091713] border border-emerald-900/40 flex items-start gap-2.5 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investor Impact & Audit Partners */}
              <div className="p-4 rounded-2xl bg-[#071611] border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono text-slate-400">Client Benefit: </span>
                  <span className="text-white font-semibold">{selectedMilestone.investorImpact}</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 shrink-0">
                  🛡️ {selectedMilestone.partnerOrAuditor}
                </div>
              </div>
            </div>

            {/* Right Col: VIP Access & Notification Registration */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#091713] border border-emerald-900/40 text-center space-y-5 shadow-lg">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  Get Priority Early Beta Access
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Registered account holders receive automatic first-round whitelist allocation upon testnet deployment.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Register for Early Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-[10px] font-mono text-slate-400">
                  Zero commitment • Included with all Growvest accounts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
