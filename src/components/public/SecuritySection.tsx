import React from 'react';
import { ShieldCheck, Lock, Key, Server, Eye, FileCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SecuritySection: React.FC = () => {
  const { setActiveTab } = useApp();

  const securityPillars = [
    {
      title: 'End-to-End Encryption',
      desc: 'All communications and database records are safeguarded using AES-256 and TLS 1.3 cryptographic cipher suites.',
      icon: <Lock className="w-5 h-5 text-emerald-500" />
    },
    {
      title: 'Two-Factor Authentication (2FA)',
      desc: 'Mandatory TOTP authenticator protection for sensitive withdrawals, API key access, and profile credential updates.',
      icon: <Key className="w-5 h-5 text-emerald-500" />
    },
    {
      title: 'Active Session Telemetry',
      desc: 'Real-time monitoring of IP origins, client user-agents, and instantaneous one-click session revocation across devices.',
      icon: <Server className="w-5 h-5 text-emerald-500" />
    },
    {
      title: 'Continuous AML & Transaction Monitoring',
      desc: 'Automated heuristics to identify unusual activity and enforce anti-money laundering international regulatory compliance.',
      icon: <Eye className="w-5 h-5 text-emerald-500" />
    }
  ];

  return (
    <section id="growvest-security-section" className="py-16 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                Cryptographic Fortress
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Defense-in-Depth Security Framework
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Rather than relying on marketing slogans, our infrastructure implements rigorous zero-trust policies, segregation of duties, and hardware key standards.
              </p>
            </div>

            <div className="space-y-4">
              {securityPillars.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{item.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <button
                onClick={() => setActiveTab('security')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition-colors cursor-pointer"
              >
                Access Security Center & 2FA Setup →
              </button>
            </div>
          </div>

          {/* Right Column: Visual Security Checklist Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/40 border border-emerald-500/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 font-mono">GROWVEST SHIELD</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                AUDITED PROTOCOL
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <span className="text-slate-700 dark:text-slate-300">Database Storage Tier</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">AES-256 Encrypted</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <span className="text-slate-700 dark:text-slate-300">Transit Protocol</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">TLS 1.3 Perfect Forward Secrecy</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <span className="text-slate-700 dark:text-slate-300">Payout Dual-Authorization</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">2FA + Email Token</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <span className="text-slate-700 dark:text-slate-300">Session Hijack Shield</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">IP Origin Binding</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-3">
              Notice: Security is an ongoing commitment. We advise all users to enable 2FA and never share one-time authentication codes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
