import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PwaInstallBanner: React.FC = () => {
  const { showPwaBanner, triggerPwaInstall, dismissPwaBanner, t } = useApp();

  if (!showPwaBanner) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Install GROWVEST Web App"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        id="growvest-pwa-banner"
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 text-slate-100"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 mb-1">
              <h4 className="text-sm font-semibold text-slate-100 tracking-tight">
                {t('pwa.bannerTitle', 'Install GROWVEST')}
              </h4>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {t('pwa.bannerDesc', 'Get faster access from your device home screen.')}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                id="btn-pwa-install"
                onClick={triggerPwaInstall}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('pwa.install', 'Install')}</span>
              </button>

              <button
                id="btn-pwa-dismiss"
                onClick={dismissPwaBanner}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                {t('pwa.notNow', 'Not now')}
              </button>
            </div>
          </div>

          <button
            onClick={dismissPwaBanner}
            aria-label="Dismiss banner"
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
