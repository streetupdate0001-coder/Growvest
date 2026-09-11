import React, { useState, useMemo, useEffect } from 'react';
import { Search, Globe, Check, X, Scan } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageInfo } from '../../services/i18n';
import { LanguageCode } from '../../types';
import { useApp } from '../../context/AppContext';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentLanguage, setLanguage, setIsScannerOpen, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Auto focus and escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const popularLanguages = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter(lang => lang.popular);
  }, []);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return SUPPORTED_LANGUAGES;
    }
    const q = searchQuery.toLowerCase().trim();
    return SUPPORTED_LANGUAGES.filter(
      lang =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.countries?.some(c => c.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div
      id="language-selector-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
    >
      <div
        id="language-selector-modal-panel"
        className="relative w-full max-w-xl max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 id="lang-modal-title" className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {t('nav.language', 'Select Language')}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Choose your preferred global dialect and region
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close language selector"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Search Bar & Google Translate Engine Notice */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search country, dialect, or native script..."
              className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              autoFocus
            />
          </div>
          <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] px-1 text-slate-500 dark:text-slate-400 gap-1">
            <span className="flex items-center gap-1.5 font-medium truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">Google Translate Active (100% Page Translation)</span>
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase shrink-0">
              Live Dialect Sync
            </span>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 sm:space-y-6">
          {/* Popular languages chips (when not searching) */}
          {!searchQuery.trim() && (
            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Popular Global Languages
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                {popularLanguages.map(lang => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={`popular-${lang.code}`}
                      onClick={() => handleSelect(lang.code)}
                      className={`flex items-center justify-between px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-medium border transition-all text-left cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                        <span className="text-sm sm:text-base leading-none shrink-0">{lang.flag}</span>
                        <span className="truncate text-[11px] sm:text-xs">{lang.name}</span>
                      </div>
                      {isSelected && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Filtered Languages List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                {searchQuery.trim() ? `Search Results (${filteredLanguages.length})` : 'All Supported Languages'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                {SUPPORTED_LANGUAGES.length} Total Dialects
              </span>
            </div>

            {filteredLanguages.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No matching languages found for "{searchQuery}". Try searching by English name or native script.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {filteredLanguages.map(lang => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all text-left cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-semibold shadow-xs'
                          : 'bg-white dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <span className="text-base sm:text-xl leading-none shrink-0">{lang.flag}</span>
                        <div className="truncate">
                          <div className="text-[11px] sm:text-xs font-semibold truncate flex items-center gap-1.5">
                            <span>{lang.name}</span>
                            {lang.direction === 'rtl' && (
                              <span className="px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                RTL
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-sans truncate">
                            {lang.nativeName}
                          </div>
                          {searchQuery && lang.countries?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase().trim())) && (
                            <div className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
                              Matches: {lang.countries.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase().trim())).slice(0, 3).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400">
                          {lang.code}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-3 sm:p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono">Locale: {currentLanguage.toUpperCase()}</span>
            <span>•</span>
            <span>RTL layouts adjust automatically</span>
          </div>

          <button
            onClick={() => {
              onClose();
              setIsScannerOpen(true);
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer"
            title="Inspect static text nodes & localization coverage"
          >
            <Scan className="w-3 h-3" />
            <span>Scan Nodes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
