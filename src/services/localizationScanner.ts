/**
 * GROWVEST Institutional Localization Scanner Utility
 * Scans the live DOM / component tree for static or unwrapped text nodes,
 * calculates internationalization coverage, and visually highlights strings needing translation hooks.
 */

import { BASE_TRANSLATIONS } from './i18nData';
import { TRANSLATIONS_MAP } from './translations/languages';

export interface UnlocalizedNodeInfo {
  id: string;
  text: string;
  tagName: string;
  suggestedKey: string;
  suggestedCode: string;
  element: HTMLElement;
  isLikelyDynamic?: boolean;
}

export interface LocalizationScanSummary {
  timestamp: string;
  totalTextNodes: number;
  localizedNodes: number;
  unwrappedNodes: number;
  coveragePercentage: number;
  unwrappedList: UnlocalizedNodeInfo[];
}

const HIGHLIGHT_CLASS = 'growvest-i18n-highlighted-node';
const BADGE_CLASS = 'growvest-i18n-scanner-badge';
const IGNORED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'CODE',
  'PRE',
  'SVG',
  'PATH',
  'G',
  'RECT',
  'CIRCLE',
  'POLYGON',
  'IFRAME',
  'CANVAS',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'OPTION'
]);

// Build a fast lookup set of all known localized English & multi-language phrases
const KNOWN_LOCALIZED_PHRASES = new Set<string>();
Object.values(BASE_TRANSLATIONS).forEach(val => {
  if (typeof val === 'string' && val.trim()) {
    KNOWN_LOCALIZED_PHRASES.add(val.trim().toLowerCase());
  }
});
Object.values(TRANSLATIONS_MAP).forEach(dict => {
  Object.values(dict).forEach(val => {
    if (typeof val === 'string' && val.trim()) {
      KNOWN_LOCALIZED_PHRASES.add(val.trim().toLowerCase());
    }
  });
});

/**
 * Generates a clean dot-notation key from raw text string
 */
export const generateSuggestedKey = (text: string, contextTag: string): string => {
  const clean = text
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

  const prefix = contextTag.toLowerCase() === 'button' ? 'btn' : 'label';
  return `${prefix}.${clean || 'text'}`;
};

/**
 * Checks if a string is non-translatable data (pure numbers, currency, timestamps, symbols, hashes)
 */
const isIgnorableText = (text: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 2) return true;

  // Numbers, currencies, percentages (e.g. "$10,000.00", "5.2%", "+12.4%", "0.00")
  if (/^[\$€£¥₹]?\s*[-+]?[0-9,.]+\s*[%kMBG]?$/i.test(trimmed)) return true;

  // Single word punctuation or math
  if (/^[|\-–—•·\/\\:;,\.\(\)\[\]\{\}\<\>\+\*\#\@\&\%\$\=]+$/.test(trimmed)) return true;

  // Pure dates / times (e.g. "12:45 PM", "2026-08-24", "10:30")
  if (/^[0-9]{1,4}[-/:][0-9]{1,2}[-/:][0-9]{1,4}(\s*(AM|PM))?$/i.test(trimmed)) return true;

  // UUIDs or hashes or CRN numbers
  if (/^(0x[a-fA-F0-9]{6,}|CRN\s*#?[0-9]+|[a-f0-9-]{12,})$/i.test(trimmed)) return true;

  // Code or technical tokens
  if (/^[A-Z0-9_]{3,}_[A-Z0-9_]+$/.test(trimmed)) return true;

  return false;
};

/**
 * Scans the DOM tree for static text nodes and computes localization metrics
 */
export const scanComponentTree = (
  root: HTMLElement = document.body
): LocalizationScanSummary => {
  const unwrappedList: UnlocalizedNodeInfo[] = [];
  let totalTextNodes = 0;
  let localizedNodes = 0;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node: Node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;

        if (IGNORED_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[data-i18n-ignore="true"]')) return NodeFilter.FILTER_REJECT;
        if (parent.closest('#growvest-scanner-overlay')) return NodeFilter.FILTER_REJECT;

        const val = node.nodeValue?.trim() || '';
        if (isIgnorableText(val)) return NodeFilter.FILTER_REJECT;

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let currentNode = walker.nextNode();
  let index = 0;

  while (currentNode) {
    totalTextNodes++;
    const textVal = currentNode.nodeValue?.trim() || '';
    const parentEl = currentNode.parentElement;

    if (parentEl) {
      // Check if parent has explicit localization attributes
      const hasDataI18n = parentEl.hasAttribute('data-i18n') || parentEl.hasAttribute('data-i18n-key');
      const isKnownPhrase = KNOWN_LOCALIZED_PHRASES.has(textVal.toLowerCase());

      if (hasDataI18n || isKnownPhrase) {
        localizedNodes++;
      } else {
        index++;
        const suggestedKey = generateSuggestedKey(textVal, parentEl.tagName);
        unwrappedList.push({
          id: `unlocalized_${index}_${Date.now()}`,
          text: textVal,
          tagName: parentEl.tagName.toLowerCase(),
          suggestedKey,
          suggestedCode: `t('${suggestedKey}', '${textVal.replace(/'/g, "\\'")}')`,
          element: parentEl
        });
      }
    }

    currentNode = walker.nextNode();
  }

  const unwrappedCount = unwrappedList.length;
  const coverage = totalTextNodes > 0
    ? Math.round(((totalTextNodes - unwrappedCount) / totalTextNodes) * 1000) / 10
    : 100;

  return {
    timestamp: new Date().toLocaleTimeString(),
    totalTextNodes,
    localizedNodes: totalTextNodes - unwrappedCount,
    unwrappedNodes: unwrappedCount,
    coveragePercentage: coverage,
    unwrappedList
  };
};

/**
 * Injects or removes visual glowing highlights and badges on static text nodes in the DOM
 */
export const toggleVisualLocalizationHighlights = (enable: boolean): LocalizationScanSummary => {
  clearLocalizationHighlights();

  if (!enable) {
    return {
      timestamp: new Date().toLocaleTimeString(),
      totalTextNodes: 0,
      localizedNodes: 0,
      unwrappedNodes: 0,
      coveragePercentage: 100,
      unwrappedList: []
    };
  }

  const summary = scanComponentTree(document.body);

  // Apply visual styling to all detected unwrapped elements
  summary.unwrappedList.forEach(item => {
    const el = item.element;
    el.classList.add(HIGHLIGHT_CLASS);
    el.setAttribute('data-i18n-unwrapped', 'true');
    el.setAttribute('data-i18n-suggested', item.suggestedKey);
    el.title = `⚠️ Static Text Node: "${item.text}"\nSuggested wrapping: ${item.suggestedCode}`;
  });

  // Inject scanner highlight CSS if not present
  if (!document.getElementById('growvest-i18n-scanner-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'growvest-i18n-scanner-styles';
    styleEl.innerHTML = `
      .${HIGHLIGHT_CLASS} {
        position: relative !important;
        outline: 2px dashed #f59e0b !important;
        outline-offset: 2px !important;
        background-color: rgba(245, 158, 11, 0.12) !important;
        transition: all 0.2s ease-in-out !important;
      }
      .${HIGHLIGHT_CLASS}:hover {
        outline-color: #ef4444 !important;
        background-color: rgba(239, 68, 68, 0.2) !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  return summary;
};

/**
 * Removes all scanner highlight CSS classes and tooltips
 */
export const clearLocalizationHighlights = () => {
  const highlighted = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
  highlighted.forEach(el => {
    el.classList.remove(HIGHLIGHT_CLASS);
    el.removeAttribute('data-i18n-unwrapped');
    el.removeAttribute('data-i18n-suggested');
  });
};
