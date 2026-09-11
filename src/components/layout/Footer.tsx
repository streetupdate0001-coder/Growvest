import React from 'react';
import {
  ShieldCheck,
  Lock,
  Activity,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building,
  Mail,
  Phone,
  Key,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../services/i18n';

export const Footer: React.FC = () => {
  const { setActiveTab, currentLanguage, setIsLangModalOpen, t } = useApp();

  const currentLangObj =
    SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <footer id="growvest-footer" className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      {/* 1. 256-Bit SSL Encryption & Investment Level Security Banner with Lock Icon */}
      <div className="border-b border-slate-200 dark:border-slate-900 bg-white/90 dark:bg-slate-950/90 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  256-Bit SSL Enclave Encryption Active
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  INVESTMENT LEVEL SECURITY
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Growvest is registered with FCA and FINRA standards. All ledger transactions and credentials are secured by hardware-backed HSM enclaves.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Key className="w-3 h-3 text-amber-500" />
              FIPS 140-2 Level 3
            </span>
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Zero-Trust TLS 1.3
            </span>
          </div>
        </div>
      </div>

      {/* Platform Health & System Status Bar */}
      <div className="border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/70 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Platform Systems Operational
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Latency: 18ms
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              Zero-Trust Architecture
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              FCA Reg #948201 • FINRA #319402
            </span>
            <span>UTC 2026-08-21</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Col 1 & 2: Brand & Identity */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                GV
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono tracking-widest">
                GROWVEST<span className="text-[#FFC300]">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Growvest is an international financial technology and digital asset management platform registered with FCA and FINRA. Built on institutional security standards, zero-trust cryptographic protocols, and real-time market feeds.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> SOC 2 Type II Certified
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> ISO 27001 Standard
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Enclave
              </span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider font-mono">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('markets')} className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors">
                  Live Market Feeds & Charts
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portfolio')} className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors">
                  Portfolio Asset Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('invest')} className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors">
                  Realistic Return Models
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('activity')} className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors">
                  Audit Activity Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Offices & Support */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider font-mono">Offices & Support</h4>
            <div className="space-y-2 text-xs">
              <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-semibold text-slate-900 dark:text-slate-200">London Office:</div>
                <div>25 Canada Square, Canary Wharf, London, E14 5LQ</div>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-semibold text-slate-900 dark:text-slate-200">New York Office:</div>
                <div>1 World Trade Center, Suite 8500, New York, NY 10007</div>
              </div>
              <div className="pt-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                support@growvest.com
              </div>
              <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                +44 20 7946 0912 (UK) • +1 (212) 555-0198 (US)
              </div>
            </div>
          </div>

          {/* Col 4: Trust & Transparency */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider font-mono">Transparency</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('transparency')} className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors">
                  FCA & FINRA Disclosures
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('support')} className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors">
                  Institutional Support Desk
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('transparency')} className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('security')} className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors">
                  256-Bit SSL Enclave Center
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-500 space-y-3 leading-relaxed">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400/90">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-semibold">Financial & Market Risk Disclosure:</span> Growvest is registered with FCA and FINRA standards. Digital asset investments and financial instruments are subject to high market volatility. All return statistics represent realistic model benchmarks and are subject to market conditions. Never invest funds you cannot afford to lose.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span>© 2026 Growvest / GROWVEST Global Technologies Inc. Registered with FCA and FINRA. All rights reserved.</span>
              <button
                id="footer-lang-selector-btn"
                onClick={() => setIsLangModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
                title={`Translate platform (Current: ${currentLangObj.name})`}
              >
                <Globe className="w-3 h-3 text-emerald-500" />
                <span>{currentLangObj.flag}</span>
                <span className="font-mono uppercase font-bold">{currentLanguage}</span>
                <span className="hidden sm:inline text-slate-500 dark:text-slate-400">({currentLangObj.name})</span>
              </button>
            </div>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span>FCA Reg #948201</span>
              <span>•</span>
              <span>FINRA CRD #319402</span>
              <span>•</span>
              <span>256-Bit SSL Enclave</span>
              <span>•</span>
              <span>PCI-DSS Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

