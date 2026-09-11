import React from 'react';
import { Globe, ChevronDown, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES, LanguageInfo } from '../../services/i18n';

interface LanguageIndicatorProps {
  variant?: 'pill' | 'compact' | 'minimal' | 'full';
  showGlobeIcon?: boolean;
  className?: string;
  id?: string;
}

export const LanguageIndicator: React.FC<LanguageIndicatorProps> = ({
  variant = 'pill',
  showGlobeIcon = true,
  className = '',
  id = 'btn-header-language-indicator'
}) => {
  const { currentLanguage, setIsLangModalOpen, isRtl } = useApp();

  const currentLangObj: LanguageInfo =
    SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLangModalOpen(true);
  };

  if (variant === 'minimal') {
    return (
      <button
        id={id}
        onClick={handleClick}
        className={`flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg bg-slate-100/90 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-800/80 active:scale-95 ${className}`}
        aria-label={`Current language: ${currentLangObj.name}. Click to change language.`}
        title={`Current language: ${currentLangObj.name} (${currentLangObj.nativeName}). Click to select language.`}
      >
        <span className="text-xs sm:text-sm leading-none" role="img" aria-label={currentLangObj.name}>
          {currentLangObj.flag}
        </span>
        <span className="uppercase text-[10px] sm:text-[11px] font-bold">{currentLangObj.code}</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        id={id}
        onClick={handleClick}
        className={`group flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 hover:bg-slate-200/90 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs ${className}`}
        aria-label={`Select language. Active: ${currentLangObj.name}`}
        title={`Active Language: ${currentLangObj.name} (${currentLangObj.nativeName}). Click to change.`}
      >
        <span className="text-xs sm:text-sm leading-none shrink-0" role="img" aria-label={currentLangObj.name}>
          {currentLangObj.flag}
        </span>
        <span className="font-mono uppercase font-bold text-[10px] sm:text-[11px] text-slate-800 dark:text-slate-200">
          {currentLangObj.code}
        </span>
        <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 group-hover:text-emerald-500 transition-colors" />
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        id={id}
        onClick={handleClick}
        className={`group flex items-center justify-between gap-2.5 sm:gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-all cursor-pointer w-full text-left shadow-xs active:scale-98 ${className}`}
        aria-label={`Change language. Current is ${currentLangObj.name}`}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <span className="text-base sm:text-lg leading-none shrink-0" role="img" aria-label={currentLangObj.name}>
            {currentLangObj.flag}
          </span>
          <div className="truncate">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1">
              <span>{currentLangObj.name}</span>
              {isRtl && (
                <span className="px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  RTL
                </span>
              )}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-sans truncate">
              {currentLangObj.nativeName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {currentLangObj.code}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-colors" />
        </div>
      </button>
    );
  }

  // Default 'pill' indicator - tuned to be compact on mobile viewports
  return (
    <button
      id={id}
      onClick={handleClick}
      className={`group flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/40 ${className}`}
      aria-label={`Select language. Active: ${currentLangObj.name} (${currentLangObj.nativeName})`}
      title={`Active Language: ${currentLangObj.name} (${currentLangObj.nativeName}). Click to choose from ${SUPPORTED_LANGUAGES.length} languages.`}
    >
      {showGlobeIcon && (
        <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
      )}
      <span className="text-xs sm:text-sm leading-none shrink-0" role="img" aria-label={currentLangObj.name}>
        {currentLangObj.flag}
      </span>
      <span className="truncate max-w-[60px] sm:max-w-[100px] text-[11px] sm:text-xs font-medium text-slate-900 dark:text-slate-100">
        {currentLangObj.nativeName}
      </span>
      <span className="hidden sm:inline font-mono uppercase text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold shrink-0">
        ({currentLangObj.code})
      </span>
      <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
    </button>
  );
};
