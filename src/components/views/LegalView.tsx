import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Lock,
  FileText,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Building,
  Mail,
  ExternalLink,
  Globe
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface LegalViewProps {
  initialTab?: 'privacy' | 'terms';
  onBack: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ initialTab = 'privacy', onBack }) => {
  const [tab, setTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return</span>
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <BrandLogo variant="light" size="sm" />
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('privacy')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === 'privacy'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setTab('terms')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === 'terms'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Terms of Service
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {tab === 'privacy' ? (
          <article className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2 border-b border-slate-800/80 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>GDPR & Swiss FINMA Compliant</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Global Privacy Policy
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Effective Date: January 1, 2026 • Last Revised: September 2026
              </p>
            </div>

            {/* Overview */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Our Privacy Commitment</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Growvest (&quot;GROWVEST Global Technologies Inc.&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to safeguarding the personal identity and financial integrity of our global users. This Privacy Policy details how we collect, process, encrypt, and store personal and transactional data across our multi-asset digital wealth platform.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">1. Data We Collect</h3>
                <p>
                  To deliver institutional-grade asset allocation and comply with Anti-Money Laundering (AML) and Know Your Customer (KYC) directives, we collect:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li><strong>Account Credentials:</strong> Full legal name, verified email address, telephone country code, and encrypted password hashes.</li>
                  <li><strong>Identity Verification Data:</strong> Government-issued passport or national ID credentials, proof of residency, and facial liveness verification tokens.</li>
                  <li><strong>Financial & Ledger Records:</strong> Transaction references, inbound cryptocurrency wallet addresses, wire receipts, and internal peer transfers.</li>
                  <li><strong>Device Telemetry:</strong> Anonymized IP addresses, session geolocation data, browser user agents, and hardware security token signatures.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">2. Cryptographic Security & Data Storage</h3>
                <p>
                  All personal identity documentation and cryptographic assets are protected by:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li>AES-256 military-grade encryption at rest for all stored identification files.</li>
                  <li>TLS 1.3 / 256-Bit SSL encryption for all network transmissions.</li>
                  <li>Segregated cold-storage architecture with Multi-Party Computation (MPC) signing keys for digital reserve custody.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">3. Zero Third-Party Monetization</h3>
                <p>
                  We <strong>never sell, lease, or monetize</strong> your personal or financial data to advertising brokers or marketing syndicates. Data is solely disclosed when required by court order, statutory financial regulatory authorities (such as FINMA or FCA), or trusted cryptographic infrastructure custodians.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">4. User Rights Under GDPR & CCPA</h3>
                <p>
                  Global investors maintain full control over their personal data, including the right to:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li>Request a full machine-readable export of all ledger and account activities.</li>
                  <li>Request correction of inaccurate personal or geographic records.</li>
                  <li>Request permanent account deletion and erasure, subject to mandatory statutory financial record-retention obligations.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">5. Contact Data Protection Officer (DPO)</h3>
                <p>
                  For privacy inquiries, audit requests, or data deletion petitions, contact our compliance team:
                </p>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>compliance@growvest.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GROWVEST Global Technologies Inc. • Zurich Financial Enclave, Gotthardstrasse 26, 8002 Zurich</span>
                  </div>
                </div>
              </section>
            </div>
          </article>
        ) : (
          <article className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2 border-b border-slate-800/80 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
                <Scale className="w-3.5 h-3.5" />
                <span>Institutional Client Agreement</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Terms of Service
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Effective Date: January 1, 2026 • Last Revised: September 2026
              </p>
            </div>

            {/* Terms Summary */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Agreement Overview</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                By creating an account, accessing the Growvest terminal, or utilizing our investment portfolios, you confirm that you are at least 18 years of age and agree to be bound by these Terms of Service.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">1. Account Establishment & Verification</h3>
                <p>
                  You agree to provide accurate, current, and complete information during registration. Accounts are strictly personal and non-transferable. Growvest reserves the right to suspend or terminate accounts that fail AML/KYC checks or exhibit suspicious activity.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">2. Investment Plans & Daily Yield Accrual</h3>
                <p>
                  Yield plans (including Starter, Professional, Housing, Gold, and VIP tiers) are subject to contract terms, minimum lock-up schedules, and specified daily rates. Capital allocations are managed through institutional algorithmic hedging and diversified real-world asset pools.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">3. Deposits, Administrative Approvals & Custody</h3>
                <p>
                  All inbound client deposits are routed to segregated institutional custody vaults. To ensure institutional safety, all deposits and administrative credit adjustments require compliance verification before available settlement.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">4. Withdrawals & Settlement Timing</h3>
                <p>
                  Withdrawal requests are processed through automated multi-sig validation and executive oversight. Standard network transaction fees and cryptographic gas charges apply transparently at settlement.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">5. Market Risk Disclosure</h3>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Statutory Financial Risk Disclosure</span>
                  </div>
                  <p>
                    Cryptocurrency assets, digital tokens, and high-yield investments carry inherent market volatility. Historical yield rates do not guarantee future returns. Never allocate capital that you cannot afford to risk.
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">6. Governing Law & Jurisdiction</h3>
                <p>
                  These Terms are governed by and construed in accordance with the laws of Switzerland, without regard to conflict of law principles. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the commercial courts of Zurich, Switzerland.
                </p>
              </section>
            </div>
          </article>
        )}

        {/* Back Button */}
        <div className="pt-6 border-t border-slate-800 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20 min-h-[48px] flex items-center justify-center gap-2"
          >
            <span>Understood & Return to Platform</span>
          </button>
        </div>
      </main>
    </div>
  );
};
