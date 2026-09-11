import React from 'react';
import { Sun, Moon, Laptop, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ThemeSwitcherProps {
  variant?: 'compact' | 'full' | 'pill';
  showSystemOption?: boolean;
  className?: string;
  idPrefix?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'compact',
  showSystemOption = true,
  className = '',
  idPrefix = 'theme-switcher'
}) => {
  const {
    theme,
    themeMode,
    systemTheme,
    isSystemPreference,
    setTheme,
    setThemeMode,
    toggleTheme
  } = useApp();

  if (variant === 'compact') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          id={`${idPrefix}-toggle-btn`}
          onClick={toggleTheme}
          type="button"
          aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          title={
            isSystemPreference
              ? `System Auto-Sync (${systemTheme.toUpperCase()}) • Click to Toggle`
              : `Manual: ${theme === 'dark' ? 'Dark' : 'Light'} Mode • Click to Toggle`
          }
          className="group relative flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </div>
          {isSystemPreference && (
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
              title="Following OS System Preference"
            />
          )}
        </button>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div
        id={`${idPrefix}-pill-group`}
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 ${className}`}
      >
        <button
          id={`${idPrefix}-pill-light`}
          type="button"
          onClick={() => setThemeMode('light')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            themeMode === 'light'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Sun className={`w-3.5 h-3.5 ${themeMode === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
          <span>Light</span>
        </button>

        <button
          id={`${idPrefix}-pill-dark`}
          type="button"
          onClick={() => setThemeMode('dark')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            themeMode === 'dark'
              ? 'bg-slate-800 text-slate-100 shadow-xs border border-slate-700 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Moon className={`w-3.5 h-3.5 ${themeMode === 'dark' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>Dark</span>
        </button>

        {showSystemOption && (
          <button
            id={`${idPrefix}-pill-system`}
            type="button"
            onClick={() => setThemeMode('system')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              themeMode === 'system'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-xs border border-emerald-500/30 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Laptop className={`w-3.5 h-3.5 ${themeMode === 'system' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span>Auto (OS)</span>
          </button>
        )}
      </div>
    );
  }

  // Full visual card variant for ProfileView / Settings / Transparency
  return (
    <div id={`${idPrefix}-full-container`} className={`space-y-3 ${className}`}>
      <div className={`grid grid-cols-1 ${showSystemOption ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3.5`}>
        {/* Light Theme Card */}
        <button
          id={`${idPrefix}-card-light`}
          type="button"
          onClick={() => setThemeMode('light')}
          className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            themeMode === 'light'
              ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
              : 'bg-white/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Clean Light</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Daytime contrast</span>
              </div>
            </div>
            {themeMode === 'light' && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Mini UI Preview */}
          <div className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-10 h-1.5 rounded bg-slate-300" />
              <div className="w-3 h-1.5 rounded bg-emerald-500" />
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="h-3 rounded bg-white border border-slate-200" />
              <div className="h-3 rounded bg-white border border-slate-200" />
              <div className="h-3 rounded bg-emerald-50 border border-emerald-200" />
            </div>
          </div>
        </button>

        {/* Dark Theme Card */}
        <button
          id={`${idPrefix}-card-dark`}
          type="button"
          onClick={() => setThemeMode('dark')}
          className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            themeMode === 'dark'
              ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
              : 'bg-white/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Deep Enclave</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Institutional dark</span>
              </div>
            </div>
            {themeMode === 'dark' && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs font-bold">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Mini UI Preview */}
          <div className="w-full h-12 rounded-xl bg-slate-950 border border-slate-800 p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-10 h-1.5 rounded bg-slate-700" />
              <div className="w-3 h-1.5 rounded bg-emerald-400" />
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="h-3 rounded bg-slate-900 border border-slate-800" />
              <div className="h-3 rounded bg-slate-900 border border-slate-800" />
              <div className="h-3 rounded bg-emerald-950/60 border border-emerald-800/40" />
            </div>
          </div>
        </button>

        {/* Automated System Preference Card */}
        {showSystemOption && (
          <button
            id={`${idPrefix}-card-system`}
            type="button"
            onClick={() => setThemeMode('system')}
            className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              themeMode === 'system'
                ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                : 'bg-white/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">System Auto</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Matches OS ({systemTheme})
                  </span>
                </div>
              </div>
              {themeMode === 'system' && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs font-bold">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>

            {/* Mini UI Preview */}
            <div className="w-full h-12 rounded-xl bg-linear-to-r from-slate-100 to-slate-900 border border-slate-300 dark:border-slate-700 p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-1.5 rounded bg-emerald-500" />
                <span className="text-[9px] font-mono font-bold text-emerald-500">AUTO</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="h-3 rounded bg-white/90 border border-slate-300" />
                <div className="h-3 rounded bg-slate-800 border border-slate-700" />
                <div className="h-3 rounded bg-emerald-500/40 border border-emerald-500" />
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span>
            {themeMode === 'system'
              ? `Live sync active: OS reports ${systemTheme.toUpperCase()} mode.`
              : `Manual override active (${theme.toUpperCase()} mode selected).`}
          </span>
        </span>
        <span className="font-mono text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
          Effective: {theme}
        </span>
      </div>
    </div>
  );
};
