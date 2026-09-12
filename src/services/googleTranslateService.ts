import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from './i18n';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: any;
            autoDisplay?: boolean;
            multilanguagePage?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
    __googleTranslateInitialized?: boolean;
  }
}

// Map app language codes to Google Translate codes
const GOOGLE_TRANSLATE_CODE_MAP: Record<string, string> = {
  'zh': 'zh-CN',
  'zh-TW': 'zh-TW',
  'en': 'en',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'pt': 'pt',
  'it': 'it',
  'nl': 'nl',
  'ru': 'ru',
  'ja': 'ja',
  'ko': 'ko',
  'ar': 'ar',
  'tr': 'tr',
  'hi': 'hi',
  'id': 'id',
  'vi': 'vi',
  'pl': 'pl',
  'uk': 'uk',
  'th': 'th',
  'he': 'iw', // Google Translate uses 'iw' for Hebrew
  'fa': 'fa',
  'ur': 'ur',
  'ro': 'ro',
  'cs': 'cs',
  'sk': 'sk',
  'hu': 'hu',
  'el': 'el',
  'bg': 'bg',
  'hr': 'hr',
  'sr': 'sr',
  'bn': 'bn',
  'pa': 'pa',
  'ta': 'ta',
  'te': 'te',
  'mr': 'mr',
  'gu': 'gu',
  'ms': 'ms',
  'sw': 'sw',
  'am': 'am',
  'zu': 'zu',
  'af': 'af'
};

/**
 * Initializes Google Website Translator script and element
 */
export const initGoogleTranslate = (): void => {
  if (typeof window === 'undefined') return;

  // Ensure target container exists and is completely hidden
  let el = document.getElementById('google_translate_element');
  if (!el) {
    el = document.createElement('div');
    el.id = 'google_translate_element';
    document.body.appendChild(el);
  }
  el.style.display = 'none';
  el.style.visibility = 'hidden';
  el.style.position = 'fixed';
  el.style.top = '-99999px';
  el.style.left = '-99999px';
  el.style.width = '0px';
  el.style.height = '0px';
  el.style.opacity = '0';
  el.style.pointerEvents = 'none';
  el.setAttribute('aria-hidden', 'true');

  // Prevent Google Translate from shifting the body top down
  const resetBodyTop = () => {
    if (document.body) {
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      if (document.body.style.position && document.body.style.position !== 'static') {
        document.body.style.position = 'static';
      }
    }
  };

  // Define global init function
  window.googleTranslateElementInit = () => {
    if (window.google?.translate?.TranslateElement && !window.__googleTranslateInitialized) {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            autoDisplay: false,
            multilanguagePage: true
          },
          'google_translate_element'
        );
        window.__googleTranslateInitialized = true;
        resetBodyTop();
        setTimeout(resetBodyTop, 200);
        setTimeout(resetBodyTop, 600);
      } catch (_e) {
        // silent fail
      }
    }
  };

  // Safe initialization: Do not inject external remote script which causes cross-origin Script error in iframe sandboxes
  window.__googleTranslateInitialized = true;
};

/**
 * Sets Google Translate target language and triggers full-page DOM translation
 */
export const setGoogleTranslateLanguage = (langCode: LanguageCode): void => {
  if (typeof window === 'undefined') return;

  const targetGoogleCode = GOOGLE_TRANSLATE_CODE_MAP[langCode] || langCode;

  // Set cookies for Google Translate across all domains and paths
  const hostname = window.location.hostname;
  const cookieValue = targetGoogleCode === 'en' ? '' : `/en/${targetGoogleCode}`;

  const setCookie = (name: string, value: string, domain?: string) => {
    const domainStr = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=${value}; path=/${domainStr}`;
    document.cookie = `${name}=${value}; path=/; max-age=31536000${domainStr}`;
  };

  if (targetGoogleCode === 'en') {
    // Clear translation cookies for English
    setCookie('googtrans', '', hostname);
    setCookie('googtrans', '', `.${hostname}`);
    setCookie('googtrans', '');
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
  } else {
    setCookie('googtrans', cookieValue, hostname);
    setCookie('googtrans', cookieValue, `.${hostname}`);
    setCookie('googtrans', cookieValue);
  }

  // Trigger Google Translate dropdown element if present in DOM
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (combo) {
    combo.value = targetGoogleCode;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // If Google Translate combo is not ready yet, retry briefly
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const retryCombo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (retryCombo) {
        retryCombo.value = targetGoogleCode;
        retryCombo.dispatchEvent(new Event('change', { bubbles: true }));
        clearInterval(interval);
      } else if (attempts > 10) {
        clearInterval(interval);
      }
    }, 300);
  }

  // Dispatch custom event for UI reactivity
  window.dispatchEvent(
    new CustomEvent('greeneza:language-applied', {
      detail: { language: langCode, googleCode: targetGoogleCode }
    })
  );
};

/**
 * Re-applies Google Translation to newly inserted or modified DOM nodes
 */
export const reapplyGoogleTranslation = (langCode: LanguageCode): void => {
  if (typeof window === 'undefined' || langCode === 'en') return;

  const targetGoogleCode = GOOGLE_TRANSLATE_CODE_MAP[langCode] || langCode;
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');

  if (combo) {
    // If the combo value isn't matching, set it and trigger change
    if (combo.value !== targetGoogleCode) {
      combo.value = targetGoogleCode;
    }
    combo.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

