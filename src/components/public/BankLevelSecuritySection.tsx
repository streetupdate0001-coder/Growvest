import React from 'react';
import {
  Lock,
  ShieldCheck,
  Key,
  Server,
  Fingerprint,
  Eye,
  FileCheck,
  Award,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BankLevelSecuritySection: React.FC = () => {
  const { setAuthModalOpen, setAuthModalMode, setIsCertificateModalOpen } = useApp();

  const securityPillars = [
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: '256-Bit AES & TLS 1.3 Encryption',
      badge: 'BANK-GRADE',
      description:
        'All client sessions, network requests, and database records are encrypted in transit and at rest with military-grade AES-256-GCM algorithms.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'Segregated Cold Multi-Sig Vaults',
      badge: 'FIPS 140-2 LEVEL 3',
      description:
        '98%+ of digital asset reserves are held offline in air-gapped geographical cold storage, requiring multi-party cryptographic threshold signatures.'
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      title: 'Zero-Trust Transaction Enclave',
      badge: 'REAL-TIME WATCHDOG',
      description:
        'Every internal withdrawal and ledger mutation undergoes real-time behavioral anomaly scoring and institutional overseer validation.'
    },
    {
      icon: <Key className="w-6 h-6 text-emerald-400" />,
      title: 'Hardware 2FA & Biometric Defense',
      badge: 'MANDATORY ON WITHDRAWALS',
      description:
        'Time-based one-time password (TOTP) and cryptographic session key invalidation protect against credential-stuffing and session hijacking.'
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: 'FCA & FINRA Regulatory Protocol',
      badge: 'CERTIFIED COMPLIANCE',
      description:
        'Full operational adherence to international KYC/AML directives, audited by independent compliance officers under strict European standards.'
    },
    {
      icon: <FileCheck className="w-6 h-6 text-emerald-400" />,
      title: '1:1 Solvency & Proof of Reserves',
      badge: 'MERKLE TREE VERIFIED',
      description:
        'Transparent asset backing ensuring client deposits are never rehypothecated, loaned out, or exposed to algorithmic counterparty insolvency.'
    }
  ];

  return (
    <section
      id="bank-level-security-section"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 overflow-hidden border-t border-b border-slate-900"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold tracking-wide">
            <Lock className="w-3.5 h-3.5" />
            <span>BANK-LEVEL SECURITY ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Institutional-Grade Protection for Every Dollar & Token
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Growvest implements the highest tier of cybersecurity protocols recognized by international financial institutions. Your capital is shielded by multi-layered defenses.
          </p>
        </div>

        {/* Security Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">256-Bit</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">SSL Encryption</div>
          </div>
          <div className="text-center p-3 border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">99.99%</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">Cold Storage Custody</div>
          </div>
          <div className="text-center p-3 border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">1:1</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">Asset Backed Reserves</div>
          </div>
          <div className="text-center p-3 border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">24 / 7</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">Autonomous Fraud Guard</div>
          </div>
        </div>

        {/* 6-Card Security Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-emerald-500/40 hover:bg-slate-900 transition-all duration-200 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                    {pillar.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Protection Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Bank-Grade Infrastructure Ready</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-signature cold storage and continuous cryptographic audits protect every transaction.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                setAuthModalMode('register');
                setAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Get Started with Growvest
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
