import React from 'react';
import {
  ShieldCheck,
  Lock,
  Activity,
  Headphones,
  FileText,
  Key,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../services/i18n';

export const UserAppFooter: React.FC = () => {
  const { setActiveTab, currentLanguage, setIsLangModalOpen } = useApp();

  const currentLangObj =
    SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <footer
      id="growvest-user-app-footer"
      className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 text-slate-500 dark:text-slate-400 text-xs transition-colors py-4 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Security & Status Indicator */}
        <div className="flex items-center gap-3 text-[11px] font-mono flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Terminal Operational
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Lock className="w-3 h-3 text-emerald-500" />
            256-Bit SSL Enclave
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Activity className="w-3 h-3 text-emerald-500" />
            Latency: 14ms
          </span>
        </div>

        {/* Right: Quick Links, Language Selector & Copyright */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-wrap justify-center">
          {/* Language & Google Translate Selector tucked neatly into footer */}
          <button
            id="user-footer-lang-btn"
            onClick={() => setIsLangModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
            title={`Translate site (Current: ${currentLangObj.name})`}
          >
            <Globe className="w-3 h-3 text-emerald-500" />
            <span>{currentLangObj.flag}</span>
            <span className="font-mono uppercase font-bold">{currentLanguage}</span>
            <span className="hidden sm:inline text-slate-400">({currentLangObj.name})</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Headphones className="w-3 h-3 text-emerald-500" />
            <span>Support Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className="hover:text-emerald-600 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Security Center</span>
          </button>

          <span className="text-slate-400 dark:text-slate-600">
            © 2026 Growvest Global Technologies Inc.
          </span>
        </div>
      </div>
    </footer>
  );
};
