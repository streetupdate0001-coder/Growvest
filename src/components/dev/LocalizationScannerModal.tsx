import React, { useState, useEffect, useMemo } from 'react';
import {
  Scan,
  Eye,
  EyeOff,
  Copy,
  Check,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Layers,
  Code2
} from 'lucide-react';
import {
  scanComponentTree,
  toggleVisualLocalizationHighlights,
  clearLocalizationHighlights,
  LocalizationScanSummary,
  UnlocalizedNodeInfo
} from '../../services/localizationScanner';
import { useApp } from '../../context/AppContext';

interface LocalizationScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalizationScannerModal: React.FC<LocalizationScannerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentLanguage, t } = useApp();
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [scanResult, setScanResult] = useState<LocalizationScanSummary | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');

  const runScan = (highlight = isHighlighting) => {
    if (highlight) {
      const result = toggleVisualLocalizationHighlights(true);
      setScanResult(result);
    } else {
      const result = scanComponentTree(document.body);
      setScanResult(result);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runScan(isHighlighting);
    } else {
      clearLocalizationHighlights();
      setIsHighlighting(false);
    }
  }, [isOpen]);

  const handleToggleHighlight = () => {
    const nextState = !isHighlighting;
    setIsHighlighting(nextState);
    if (nextState) {
      const result = toggleVisualLocalizationHighlights(true);
      setScanResult(result);
    } else {
      clearLocalizationHighlights();
      const result = scanComponentTree(document.body);
      setScanResult(result);
    }
  };

  const handleCopyCode = (item: UnlocalizedNodeInfo) => {
    navigator.clipboard.writeText(item.suggestedCode);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJumpToElement = (element: HTMLElement) => {
    try {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a quick pulse highlight
      element.style.transition = 'all 0.3s ease';
      element.style.boxShadow = '0 0 0 4px #10b981';
      setTimeout(() => {
        element.style.boxShadow = '';
      }, 1500);
    } catch (_e) {
      // ignore
    }
  };

  const availableTags = useMemo(() => {
    if (!scanResult) return [];
    const tags = new Set<string>();
    scanResult.unwrappedList.forEach(item => tags.add(item.tagName));
    return Array.from(tags).sort();
  }, [scanResult]);

  const filteredItems = useMemo(() => {
    if (!scanResult) return [];
    return scanResult.unwrappedList.filter(item => {
      const matchesSearch =
        item.text.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.suggestedKey.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.tagName.toLowerCase().includes(searchFilter.toLowerCase());

      const matchesTag =
        selectedTagFilter === 'all' || item.tagName.toLowerCase() === selectedTagFilter.toLowerCase();

      return matchesSearch && matchesTag;
    });
  }, [scanResult, searchFilter, selectedTagFilter]);

  if (!isOpen) return null;

  const coverage = scanResult?.coveragePercentage ?? 100;
  const coverageColor =
    coverage >= 95
      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
      : coverage >= 80
      ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      : 'text-rose-500 bg-rose-500/10 border-rose-500/30';

  return (
    <div
      id="growvest-scanner-overlay"
      data-i18n-ignore="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Localization & Static Node Inspector
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  i18next Scanner
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scans component tree for static text nodes needing translation hook wrapping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => runScan(isHighlighting)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title="Rescan DOM"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rescan</span>
            </button>

            <button
              onClick={handleToggleHighlight}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isHighlighting
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 animate-pulse'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {isHighlighting ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isHighlighting ? 'Highlights ON' : 'Highlight Nodes'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close scanner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Metrics Ribbon */}
        {scanResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-100/50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Coverage Score</div>
              <div className={`text-lg font-bold font-mono mt-0.5 ${coverageColor.split(' ')[0]}`}>
                {scanResult.coveragePercentage}%
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Total Text Nodes</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                {scanResult.totalTextNodes}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Localized & Wrapped</div>
              <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{scanResult.localizedNodes}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Unwrapped Static</div>
              <div className={`text-lg font-bold font-mono mt-0.5 flex items-center gap-1 ${
                scanResult.unwrappedNodes === 0 ? 'text-emerald-500' : 'text-amber-500'
              }`}>
                {scanResult.unwrappedNodes === 0 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{scanResult.unwrappedNodes}</span>
              </div>
            </div>
          </div>
        )}

        {/* Search & Tag Filter Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search detected text or key..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {availableTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedTagFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTagFilter === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Tags
              </button>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTagFilter(tag)}
                  className={`px-2 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTagFilter === tag
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  &lt;{tag}&gt;
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List of Detected Text Nodes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {scanResult?.unwrappedNodes === 0
                  ? 'All Visible Text Nodes Localized & Wrapped!'
                  : 'No matching static strings for filter criteria.'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                The current page has high internationalization compliance. Toggle Highlight mode to view active elements directly in the viewport.
              </p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      &lt;{item.tagName}&gt;
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 truncate">
                      Key: {item.suggestedKey}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900 dark:text-slate-100 break-words">
                    "{item.text}"
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 overflow-x-auto flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{item.suggestedCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleJumpToElement(item.element)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    title="Jump and scroll to element"
                  >
                    <ExternalLink className="w-3 h-3 text-emerald-500" />
                    <span>Locate</span>
                  </button>

                  <button
                    onClick={() => handleCopyCode(item)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      copiedId === item.id
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Active Locale: {currentLanguage.toUpperCase()} (i18next framework)</span>
          </div>
          <span>Showing {filteredItems.length} of {scanResult?.unwrappedNodes || 0} unwrapped nodes</span>
        </div>
      </div>
    </div>
  );
};
