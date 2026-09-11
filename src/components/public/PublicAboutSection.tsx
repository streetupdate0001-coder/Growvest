import React from 'react';
import {
  Shield,
  Layers,
  Scale,
  CheckCircle2,
  ArrowRight,
  Award,
  Lock,
  Building,
  Linkedin,
  FileCheck2,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_CERTIFICATE_DATA } from '../../services/certificateGenerator';

export const PublicAboutSection: React.FC = () => {
  const { setAuthModalOpen, setAuthModalMode, setIsCertificateModalOpen, t } = useApp();

  const founders = [
    {
      name: 'Julian Vance, CFA',
      role: 'Co-Founder & Chief Executive Officer',
      bio: 'Former Managing Director of Quantitative Capital at Barclays Investment Bank. 18+ years leading algorithmic trading, fixed income liquidity desks, and digital asset custody frameworks.',
      credentials: 'CFA Institute • MSc Financial Mathematics (Imperial College London)',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      location: 'London, UK'
    },
    {
      name: 'Dr. Henrik Lindqvist, PhD',
      role: 'Co-Founder & Chief Technology Officer',
      bio: 'Pioneer in applied cryptography and multi-party computation (MPC) protocols. Previously senior infrastructure architect at Swiss Financial Market infrastructure providers.',
      credentials: 'PhD Distributed Systems (ETH Zurich) • Postdoc Cryptography',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      location: 'Zurich, Switzerland'
    },
    {
      name: 'Claire Chen, MBA',
      role: 'Co-Founder & Chief Investment Officer',
      bio: 'Over 15 years in alternative asset management, macro alpha generation, and institutional treasury structuring across Wall Street and European financial centers.',
      credentials: 'MBA (Wharton School) • BSc Economics (London School of Economics)',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      location: 'New York, USA'
    }
  ];

  const complianceTeam = [
    {
      name: 'Eleanor Sterling, LL.M.',
      role: 'Chief Compliance Officer & MLRO',
      focus: 'FCA & FINRA Regulatory Supervision',
      bio: 'Ex-Financial Conduct Authority (FCA) Senior Enforcement Counsel and former Chief Regulatory Officer at top-tier UK clearing brokers. Expert in cross-border AML/CFT and MiFID II compliance.',
      credentials: 'Barrister-at-Law • LL.M. International Financial Regulation (Cambridge)',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      badge: 'FCA Oversight'
    },
    {
      name: 'Marcus Thorne, JD',
      role: 'Head of US Regulatory Affairs & Legal Counsel',
      focus: 'FINRA & SEC Compliance Architecture',
      bio: '20 years guiding US Broker-Dealer and Investment Advisor regulatory filings, FINRA audits, and institutional digital asset market structure legal enforcement.',
      credentials: 'Juris Doctor (Columbia Law) • FINRA Series 7, 24 & 14 Licensed',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      badge: 'FINRA Compliance'
    },
    {
      name: 'Dr. Beatrix Meier, PhD',
      role: 'Director of Risk Modeling & Audit',
      focus: 'Quantitative Risk & Solvency Proofs',
      bio: 'Specialist in dynamic solvency risk simulation, value-at-risk (VaR) mathematical controls, and independent cryptographic proof-of-reserves validation.',
      credentials: 'PhD Risk Economics (University of Zurich) • Financial Risk Manager (FRM)',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      badge: 'Solvency & Reserves'
    }
  ];

  const pillars = [
    {
      icon: Layers,
      title: t('about.pillar1.title', 'Segregated Account Architecture'),
      desc: t(
        'about.pillar1.desc',
        'Client digital and fiat balances are held in segregated, bankruptcy-remote custody accounts never commingled with operational funds.'
      ),
      highlight: '100% 1:1 Backed'
    },
    {
      icon: Shield,
      title: t('about.pillar2.title', 'Hardware-Backed Security'),
      desc: t(
        'about.pillar2.desc',
        'Multi-signature cold storage, HSM cryptographic enclaves, and strict role-based access govern all financial flows.'
      ),
      highlight: 'FIPS 140-2 Level 3'
    },
    {
      icon: Scale,
      title: t('about.pillar3.title', 'Global Regulatory Alignment'),
      desc: t(
        'about.pillar3.desc',
        'Continuous compliance with international AML/CFT directives, FCA regulatory supervision, FINRA frameworks, and verified identity standards.'
      ),
      highlight: 'FCA & FINRA Standards'
    }
  ];

  return (
    <section
      id="public-about-section"
      className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>About Growvest Leadership & Governance</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
            Institutional Pedigree, Proven Leadership & Regulatory Rigor
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Growvest was founded by veteran investment bankers, applied cryptographers, and regulatory compliance leaders with a single mission: to deliver transparent, institutional-grade digital asset infrastructure with realistic, audited return models.
          </p>
        </div>

        {/* Founders & Executive Leadership Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Executive Leadership
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                Founders & Strategy Committee
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              London • Zurich • New York Executive Committee
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((founder, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={founder.photo}
                      alt={founder.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 font-mono text-[11px]">
                        {founder.location}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                        {founder.name}
                      </h4>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {founder.role}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {founder.bio}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                  <div className="pt-3 flex items-start gap-1.5 text-[11px] text-slate-500 font-mono">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{founder.credentials}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory & Compliance Team Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                FCA & FINRA Supervised
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                Compliance & Legal Governance Team
              </h3>
            </div>
            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Inspect Official Entity Registration</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {complianceTeam.map((officer, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={officer.photo}
                      alt={officer.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
                        {officer.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                        {officer.name}
                      </h4>
                      <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {officer.role}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Focus: {officer.focus}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {officer.bio}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                  <div className="pt-3 flex items-start gap-1.5 text-[11px] text-slate-500 font-mono">
                    <FileCheck2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{officer.credentials}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Core Structural Pillars */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
            Platform Security & Governance Framework
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {pillar.highlight}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {pillar.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Institutional Commitment Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Lock className="w-4 h-4" />
              <span>REGISTERED LEGAL ENTITY #{OFFICIAL_CERTIFICATE_DATA.registrationNumber}</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white font-mono">
              Institutional Account Custody & Direct Treasury Access
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              For corporate treasuries, investment funds, and accredited investors requiring dedicated cold vault allocation, realistic backtested models, and multi-signatory governance.
            </p>
          </div>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setAuthModalOpen(true);
            }}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <span>Open Institutional Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

