import { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LanguageCode } from '../types';
import {
  initGoogleTranslate,
  setGoogleTranslateLanguage,
  reapplyGoogleTranslation
} from '../services/googleTranslateService';

/**
 * Custom React Hook that initializes Google Translate and attaches
 * a MutationObserver to the DOM. Whenever new dynamic content is mounted
 * (e.g. modals, drawers, dynamic tickers, router tabs, alerts), the observer
 * triggers a debounced re-scan to ensure newly added elements are translated.
 */
export function useGoogleTranslate(langOverride?: LanguageCode): void {
  const appContext = useContext(AppContext);
  const storedLang = typeof window !== 'undefined' ? (localStorage.getItem('greeneza_lang') as LanguageCode) : null;
  const currentLanguage = langOverride || appContext?.currentLanguage || storedLang || 'en';

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const isUpdatingRef = useRef<boolean>(false);

  // 1. Initialize Google Translate Engine on initial mount
  useEffect(() => {
    initGoogleTranslate();
  }, []);

  // 2. Synchronize active language with Google Translate
  useEffect(() => {
    setGoogleTranslateLanguage(currentLanguage);
  }, [currentLanguage]);

  // 3. Attach MutationObserver to observe dynamic DOM changes
  useEffect(() => {
    if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
      return;
    }

    // Only observe if the language is not default English
    if (currentLanguage === 'en') {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const targetNode = document.getElementById('root') || document.body;

    // Disconnect any existing observer before creating a new one
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver((mutations: MutationRecord[]) => {
      // Avoid processing mutations triggered by Google Translate's own DOM updates
      if (isUpdatingRef.current) return;

      let hasMeaningfulContentChange = false;

      for (const mutation of mutations) {
        // Ignore Google Translate internal widgets, tooltips and scripts
        const target = mutation.target as HTMLElement;
        if (
          target &&
          (target.id?.includes('goog') ||
            target.className?.toString().includes('goog') ||
            target.tagName === 'SCRIPT' ||
            target.tagName === 'STYLE' ||
            target.closest?.('#google_translate_element') ||
            target.closest?.('.skiptranslate'))
        ) {
          continue;
        }

        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i] as HTMLElement;
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              !node.className?.toString().includes('goog') &&
              node.id !== 'google_translate_element' &&
              !node.classList?.contains('skiptranslate')
            ) {
              hasMeaningfulContentChange = true;
              break;
            }
          }
        } else if (mutation.type === 'characterData') {
          hasMeaningfulContentChange = true;
        }

        if (hasMeaningfulContentChange) break;
      }

      if (hasMeaningfulContentChange) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
          isUpdatingRef.current = true;
          try {
            reapplyGoogleTranslation(currentLanguage);
          } finally {
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 300);
          }
        }, 200);
      }
    });

    observerRef.current.observe(targetNode, {
      childList: true,
      subtree: true,
      characterData: false
    });

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [currentLanguage]);
}

export const useGoogleTranslateObserver = useGoogleTranslate;
