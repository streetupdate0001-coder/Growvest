import React from 'react';
import { FileText, CheckCircle2, Shield, Info, ExternalLink, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TransparencySection: React.FC = () => {
  const { setActiveTab } = useApp();

  const fees = [
    { service: 'Account Maintenance', fee: 'Free ($0.00)', details: 'No monthly subscription or inactivity fees' },
    { service: 'Inbound SEPA / Bank Wire Deposit', fee: '0.00%', details: 'Zero platform deposit fees (bank intermediary fees may apply)' },
    { service: 'Inbound Digital Asset Deposit', fee: '0.00%', details: 'Zero platform deposit fees' },
    { service: 'Crypto Network Payout', fee: 'Dynamic Network Cost', details: 'Exact blockchain miners fee with zero platform markup' },
    { service: 'SEPA Outbound Wire Payout', fee: '€0.00 / Free', details: 'Institutional clearing within EEA / Switzerland' },
    { service: 'Model Portfolio Management', fee: '0.25% / annum', details: 'Calculated daily and deducted transparently on settled assets' }
  ];

  return (
    <section id="growvest-transparency-section" className="py-16 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Institutional Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Trust & Transparency Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Honest financial governance. No fabricated testimonials, no fake countdowns, and no hidden fee structures.
          </p>
        </div>

        {/* Demo Data / Production Status Disclosure */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-emerald-500/30 shadow-xs flex items-start gap-3.5">
          <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-slate-900 dark:text-slate-200 block">
              Data Integrity & Demo Environment Notice
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Growvest utilizes real-time market price discovery streams via verified exchange endpoints. In development and demonstration modes, portfolio model allocations are clearly labeled as <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">DEMO PLAN</span>. We never invent fictitious investor numbers, fake transaction receipts, or simulated customer testimonials.
            </p>
          </div>
        </div>

        {/* Transparent Fee Schedule Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Transparent Fee Schedule</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Clear cost breakdown with zero hidden spreads.</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Updated August 2026
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Service Operation</th>
                  <th className="py-3 px-4">Platform Fee</th>
                  <th className="py-3 px-4">Execution Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {fees.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{f.service}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{f.fee}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{f.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Governance and Legal Framework */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              Segregated Accounts
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Client digital assets and fiat balances are maintained in segregated institutional custody and never commingled with operational funds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Proof of Solvency
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Regular cryptographic Merkle-tree audits verify 1:1 asset backing across all digital reserves on a continuous schedule.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Strict Regulatory AML/KYC
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Adherence to international Financial Action Task Force (FATF) guidelines, travel rule compliance, and sanctions screening.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
