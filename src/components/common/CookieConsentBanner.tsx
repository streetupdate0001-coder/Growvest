import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, Check, Sliders, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  acceptedAt: string;
}

const STORAGE_KEY = 'greeneza_cookie_consent';

export const CookieConsentBanner: React.FC = () => {
  const { t } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: false,
    functional: true,
    acceptedAt: ''
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Show after a brief delay for smooth entrance
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (_e) {
      setIsVisible(false);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (_e) {}
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const fullConsent: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      acceptedAt: new Date().toISOString()
    };
    setPreferences(fullConsent);
    saveConsent(fullConsent);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      acceptedAt: new Date().toISOString()
    };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  const handleSaveCustom = () => {
    const customConsent: CookiePreferences = {
      ...preferences,
      essential: true,
      acceptedAt: new Date().toISOString()
    };
    saveConsent(customConsent);
  };

  if (!isVisible) return null;

  return (
    <aside
      id="cookie-consent-alert"
      role="region"
      aria-label="Cookie & Privacy Consent Alert"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none transition-all duration-300 animate-slide-up"
    >
      <div className="max-w-4xl mx-auto pointer-events-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-900/60 shadow-2xl shadow-slate-950/20 dark:shadow-black/50 p-5 sm:p-6 text-slate-900 dark:text-slate-100 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <Cookie className="w-6 h-6" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('cookie.title', 'Cookie Preferences & Data Privacy')}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  GDPR & UK DPA
                </span>
              </div>
              <button
                onClick={handleRejectNonEssential}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg cursor-pointer"
                title="Dismiss and use essential only"
                aria-label="Dismiss cookie notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t(
                'cookie.description',
                'We use cookies to maintain your encrypted session security, deliver real-time market data feeds, and analyze platform performance. You can choose which cookies to permit below.'
              )}
            </p>

            {/* Expandable Customization Settings */}
            {isCustomizing && (
              <div className="pt-3 pb-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-xs animate-fade-in">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Strictly Necessary & Security Cookies</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Required for 256-bit authentication, CSRF tokens, and secure vault state.
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    ALWAYS ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Analytics & Performance Cookies
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Helps us monitor latency, price feed stability, and platform uptime.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={e => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Functional & Live Support Cookies
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Enables 24/7 live advisor chat, push notifications, and persistent user preferences.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={e => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setIsCustomizing(!isCustomizing)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer py-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isCustomizing ? 'Hide Preferences' : 'Customize Preferences'}</span>
                {isCustomizing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div className="flex items-center gap-2.5 ml-auto">
                {isCustomizing ? (
                  <button
                    onClick={handleSaveCustom}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Preferences
                  </button>
                ) : (
                  <button
                    onClick={handleRejectNonEssential}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Essential Only
                  </button>
                )}

                <button
                  id="btn-accept-all-cookies"
                  onClick={handleAcceptAll}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer active:scale-98"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Accept All Cookies</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
