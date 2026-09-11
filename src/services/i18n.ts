import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LanguageCode } from '../types';
import { BASE_TRANSLATIONS } from './i18nData';
import { TRANSLATIONS_MAP } from './translations/languages';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
  popular?: boolean;
  countries?: string[];
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  // Major Global & Popular Languages
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸', popular: true, countries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand', 'Ireland', 'Singapore'] },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷', popular: true, countries: ['France', 'Canada', 'Belgium', 'Switzerland', 'Monaco', 'Senegal', 'Ivory Coast'] },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸', popular: true, countries: ['Spain', 'Mexico', 'Colombia', 'Argentina', 'Chile', 'Peru', 'Ecuador', 'Venezuela', 'Dominican Republic', 'Guatemala'] },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪', popular: true, countries: ['Germany', 'Austria', 'Switzerland', 'Liechtenstein', 'Luxembourg'] },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', flag: '🇵🇹', popular: true, countries: ['Portugal', 'Brazil', 'Angola', 'Mozambique', 'Cape Verde'] },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', flag: '🇮🇹', popular: true, countries: ['Italy', 'Switzerland', 'San Marino', 'Vatican City'] },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', flag: '🇳🇱', popular: true, countries: ['Netherlands', 'Belgium', 'Suriname', 'Aruba', 'Curacao'] },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', direction: 'ltr', flag: '🇨🇳', popular: true, countries: ['China', 'Singapore', 'Malaysia'] },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', direction: 'ltr', flag: '🇹🇼', countries: ['Taiwan', 'Hong Kong', 'Macau'] },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', flag: '🇯🇵', popular: true, countries: ['Japan'] },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', flag: '🇰🇷', popular: true, countries: ['South Korea', 'Korea'] },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇦🇪', popular: true, countries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Egypt', 'Kuwait', 'Bahrain', 'Oman', 'Morocco', 'Jordan', 'Lebanon'] },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl', flag: '🇮🇱', countries: ['Israel'] },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl', flag: '🇮🇷', countries: ['Iran', 'Afghanistan', 'Tajikistan'] },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', flag: '🇵🇰', countries: ['Pakistan', 'India'] },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', flag: '🇹🇷', popular: true, countries: ['Turkey', 'Cyprus', 'Azerbaijan'] },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', flag: '🇷🇺', popular: true, countries: ['Russia', 'Kazakhstan', 'Belarus', 'Kyrgyzstan', 'Armenia', 'Uzbekistan'] },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', flag: '🇵🇱', countries: ['Poland'] },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', direction: 'ltr', flag: '🇷🇴', countries: ['Romania', 'Moldova'] },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', direction: 'ltr', flag: '🇨🇿', countries: ['Czech Republic', 'Czechia'] },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', direction: 'ltr', flag: '🇸🇰', countries: ['Slovakia'] },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', direction: 'ltr', flag: '🇭🇺', countries: ['Hungary'] },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', direction: 'ltr', flag: '🇬🇷', countries: ['Greece', 'Cyprus'] },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', direction: 'ltr', flag: '🇧🇬', countries: ['Bulgaria'] },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', direction: 'ltr', flag: '🇭🇷', countries: ['Croatia', 'Bosnia and Herzegovina'] },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', direction: 'ltr', flag: '🇷🇸', countries: ['Serbia', 'Montenegro'] },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', direction: 'ltr', flag: '🇺🇦', countries: ['Ukraine'] },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳', popular: true, countries: ['India', 'Fiji', 'Nepal', 'Mauritius'] },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', flag: '🇧🇩', countries: ['Bangladesh', 'India'] },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', flag: '🇮🇳', countries: ['India', 'Pakistan'] },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', flag: '🇮🇳', countries: ['India', 'Sri Lanka', 'Singapore', 'Malaysia'] },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', flag: '🇮🇳', countries: ['India'] },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', flag: '🇮🇳', countries: ['India'] },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr', flag: '🇮🇳', countries: ['India'] },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: 'ltr', flag: '🇮🇩', popular: true, countries: ['Indonesia'] },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', direction: 'ltr', flag: '🇲🇾', countries: ['Malaysia', 'Brunei', 'Singapore'] },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', flag: '🇻🇳', countries: ['Vietnam'] },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', direction: 'ltr', flag: '🇹🇭', countries: ['Thailand'] },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', direction: 'ltr', flag: '🇰🇪', countries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'DR Congo'] },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', direction: 'ltr', flag: '🇪🇹', countries: ['Ethiopia'] },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', direction: 'ltr', flag: '🇿🇦', countries: ['South Africa'] },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', direction: 'ltr', flag: '🇿🇦', countries: ['South Africa', 'Namibia'] }
];

export const RTL_LANGUAGES: LanguageCode[] = ['ar', 'he', 'fa', 'ur'];

export const isRtlLanguage = (code: LanguageCode): boolean => {
  return RTL_LANGUAGES.includes(code);
};

export const getLanguageInfo = (code: LanguageCode): LanguageInfo => {
  const found = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return found || SUPPORTED_LANGUAGES[0];
};

export { BASE_TRANSLATIONS };

// Dynamic fallback term dictionaries for standard phrases
const COMMON_TERMS: Record<string, Partial<Record<LanguageCode, string>>> = {
  'Home': {
    fr: 'Accueil', es: 'Inicio', de: 'Startseite', it: 'Home', pt: 'Início', ru: 'Главная', zh: '首页', ja: 'ホーム', ko: '홈', ar: 'الرئيسية', tr: 'Ana Sayfa', hi: 'होम', id: 'Beranda', vi: 'Trang chủ', pl: 'Główna', uk: 'Головна', nl: 'Home', he: 'בית'
  },
  'Market': {
    fr: 'Marchés', es: 'Mercados', de: 'Märkte', it: 'Mercati', pt: 'Mercados', ru: 'Рынки', zh: '行情市场', ja: 'マーケット', ko: '시장', ar: 'الأسواق', tr: 'Piyasalar', hi: 'बाजार', id: 'Pasar', vi: 'Thị trường', pl: 'Rynki', uk: 'Ринки', nl: 'Markten', he: 'שווקים'
  },
  'About': {
    fr: 'À Propos', es: 'Nosotros', de: 'Über Uns', it: 'Chi Siamo', pt: 'Sobre', ru: 'О нас', zh: '关于我们', ja: '企業情報', ko: '소개', ar: 'من نحن', tr: 'Hakkımızda', hi: 'हमारे बारे में', id: 'Tentang Kami', vi: 'Giới thiệu', pl: 'O nas', uk: 'Про нас', nl: 'Over Ons', he: 'אודות'
  },
  'How It Works': {
    fr: 'Comment Ça Marche', es: 'Cómo Funciona', de: 'Wie es Funktioniert', it: 'Come Funziona', pt: 'Como Funciona', ru: 'Как это работает', zh: '运作方式', ja: 'ご利用の流れ', ko: '이용 방법', ar: 'كيف يعمل', tr: 'Nasıl Çalışır', hi: 'यह कैसे काम करता है', id: 'Cara Kerja', vi: 'Cách thức hoạt động', pl: 'Jak to działa', uk: 'Як це працює', nl: 'Hoe het werkt', he: 'איך זה עובד'
  },
  'Deposit': {
    fr: 'Déposer', es: 'Depositar', de: 'Einzahlen', it: 'Deposita', pt: 'Depositar', ru: 'Пополнить', zh: '充值', ja: '入金', ko: '입금', ar: 'إيداع', tr: 'Para Yatır', hi: 'जमा करें', id: 'Deposit', vi: 'Nạp tiền', pl: 'Wpłać', uk: 'Поповнити', nl: 'Storten', he: 'הפקדה'
  },
  'Withdraw': {
    fr: 'Retirer', es: 'Retirar', de: 'Auszahlen', it: 'Preleva', pt: 'Sacar', ru: 'Вывести', zh: '提现', ja: '出金', ko: '출금', ar: 'سحب', tr: 'Para Çek', hi: 'निकासी', id: 'Penarikan', vi: 'Rút tiền', pl: 'Wypłać', uk: 'Вивести', nl: 'Opnemen', he: 'משיכה'
  },
  'Invest': {
    fr: 'Investir', es: 'Invertir', de: 'Investieren', it: 'Investi', pt: 'Investir', ru: 'Инвестировать', zh: '投资', ja: '投資', ko: '투자', ar: 'استثمار', tr: 'Yatırım', hi: 'निवेश', id: 'Investasi', vi: 'Đầu tư', pl: 'Inwestuj', uk: 'Інвестувати', nl: 'Investeren', he: 'השקעה'
  },
  'Total Net Valuation': {
    fr: 'Évaluation Nette Totale', es: 'Valoración Neta Total', de: 'Gesamte Netto-Bewertung', it: 'Valutazione Netta Totale', pt: 'Avaliação Líquida Total', ru: 'Общая чистая оценка', zh: '总净估值', ja: '総純資産評価額', ko: '총 순 평가액', ar: 'إجمالي صافي التقييم', tr: 'Toplam Net Değerleme', hi: 'कुल शुद्ध मूल्यांकन', id: 'Total Valuasi Bersih', vi: 'Tổng Định Giá Thuần', pl: 'Całkowita Wycena Netto', uk: 'Загальна чиста оцінка', nl: 'Totale Netto Waardering', he: 'הערכת שווי נטו כוללת'
  },
  'Deposit Funds': {
    fr: 'Déposer des Fonds', es: 'Depositar Fondos', de: 'Guthaben Einzahlen', it: 'Deposita Fondi', pt: 'Depositar Fundos', ru: 'Пополнить баланс', zh: '充值资金', ja: '資金を入金', ko: '자금 입금', ar: 'إيداع الأموال', tr: 'Para Yatır', hi: 'पूंजी जमा करें', id: 'Deposit Dana', vi: 'Nạp Tiền', pl: 'Wpłać Środki', uk: 'Поповнити рахунок', nl: 'Geld Storten', he: 'הפקדת כספים'
  },
  'Available Cash': {
    fr: 'Liquidités Disponibles', es: 'Efectivo Disponible', de: 'Verfügbares Bargeld', it: 'Liquidità Disponibile', pt: 'Liquidez Disponível', ru: 'Доступная ликвидность', zh: '可用现金', ja: '利用可能残高', ko: '사용 가능 현금', ar: 'السيولة المتاحة', tr: 'Kullanılabilir Nakit', hi: 'उपलब्ध नकदी', id: 'Kas Tersedia', vi: 'Tiền mặt khả dụng', pl: 'Dostępne środki', uk: 'Доступна готівка', nl: 'Beschikbaar Geld', he: 'מזומן זמין'
  },
  'Invested Capital': {
    fr: 'Capital Investi', es: 'Capital Invertido', de: 'Investiertes Kapital', it: 'Capitale Investito', pt: 'Capital Investido', ru: 'Инвестированный капитал', zh: '在投资本', ja: '運用中資本', ko: '투자된 자본', ar: 'رأس المال المستثمر', tr: 'Yatırılan Sermaye', hi: 'निवेशित पूंजी', id: 'Modal Diinvestasikan', vi: 'Vốn đã đầu tư', pl: 'Zainwestowany kapitał', uk: 'Інвестований капітал', nl: 'Geïnvesteerd Kapitaal', he: 'הון מושקע'
  },
  'Portfolio': {
    fr: 'Portefeuille', es: 'Portafolio', de: 'Portfolio', it: 'Portafoglio', pt: 'Portfólio', ru: 'Портфель', zh: '投资组合', ja: 'ポートフォリオ', ko: '포트폴리오', ar: 'المحفظة', tr: 'Portföy', hi: 'पोर्टफोलियो', id: 'Portofolio', vi: 'Danh mục', pl: 'Portfel', uk: 'Портфель', nl: 'Portfolio', he: 'תיק השקעות'
  },
  'Dashboard': {
    fr: 'Tableau de Bord', es: 'Panel Principal', de: 'Dashboard', it: 'Dashboard', pt: 'Painel', ru: 'Панель управления', zh: '控制面板', ja: 'ダッシュボード', ko: '대시보드', ar: 'لوحة التحكم', tr: 'Kontrol Paneli', hi: 'डैशबोर्ड', id: 'Dasbor', vi: 'Bảng điều khiển', pl: 'Panel', uk: 'Панель приладів', nl: 'Dashboard', he: 'לוח בקרה'
  },
  'Security': {
    fr: 'Sécurité', es: 'Seguridad', de: 'Sicherheit', it: 'Sicurezza', pt: 'Segurança', ru: 'Безопасность', zh: '安全', ja: 'セキュリティ', ko: '보안', ar: 'الأمان', tr: 'Güvenlik', hi: 'सुरक्षा', id: 'Keamanan', vi: 'Bảo mật', pl: 'Bezpieczeństwo', uk: 'Безпека', nl: 'Beveiliging', he: 'אבטחה'
  },
  'Log In': {
    fr: 'Connexion', es: 'Iniciar Sesión', de: 'Anmelden', it: 'Accedi', pt: 'Entrar', ru: 'Войти', zh: '登录', ja: 'ログイン', ko: '로그인', ar: 'تسجيل الدخول', tr: 'Giriş Yap', hi: 'लॉग इन', id: 'Masuk', vi: 'Đăng nhập', pl: 'Zaloguj się', uk: 'Увійти', nl: 'Inloggen', he: 'התחברות'
  },
  'Create Account': {
    fr: 'Créer un Compte', es: 'Crear Cuenta', de: 'Konto Erstellen', it: 'Crea Account', pt: 'Criar Conta', ru: 'Создать аккаунт', zh: '创建账户', ja: '口座開設', ko: '계정 생성', ar: 'إنشاء حساب', tr: 'Hesap Aç', hi: 'खाता बनाएं', id: 'Buat Akun', vi: 'Tạo tài khoản', pl: 'Załóż konto', uk: 'Створити акаунт', nl: 'Account Aanmaken', he: 'יצירת חשבון'
  },
  'Get Started Now': {
    fr: 'Commencer Maintenant', es: 'Comenzar Ahora', de: 'Jetzt Starten', it: 'Inizia Ora', pt: 'Começar Agora', ru: 'Начать сейчас', zh: '立即开始', ja: '今すぐ始める', ko: '지금 시작하기', ar: 'ابدأ الآن', tr: 'Hemen Başlayın', hi: 'अभी शुरू करें', id: 'Mulai Sekarang', vi: 'Bắt đầu ngay', pl: 'Rozpocznij teraz', uk: 'Почати зараз', nl: 'Nu Beginnen', he: 'התחל עכשיו'
  }
};

/**
 * Builds the complete multi-language resources bundle for i18next
 */
export const buildI18nResources = () => {
  const resources: Record<string, { translation: Record<string, string> }> = {};

  // English base
  resources.en = {
    translation: { ...BASE_TRANSLATIONS }
  };

  // Populate all other supported languages with base fallbacks + overrides
  SUPPORTED_LANGUAGES.forEach(lang => {
    const code = lang.code;
    const custom = TRANSLATIONS_MAP[code] || {};
    resources[code] = {
      translation: {
        ...BASE_TRANSLATIONS,
        ...custom
      }
    };
  });

  return resources;
};

/**
 * Gets stored language code from localStorage
 */
export const getStoredLanguage = (): LanguageCode => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('greeneza_lang');
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved as LanguageCode;
      }
    } catch (_e) {
      // ignore
    }
  }
  return 'en';
};

const initialLang = getStoredLanguage();

// Initialize i18next instance with React wrapper
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: buildI18nResources(),
      lng: initialLang,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false // React already escapes values
      },
      react: {
        useSuspense: false
      }
    });
}

/**
 * Universal translation function supporting all 42 languages with i18next integration
 */
export const translate = (lang: LanguageCode, key: string, fallback?: string): string => {
  // 1. Direct i18next translation lookup if active
  if (i18n.isInitialized && i18n.language === lang) {
    const i18nVal = i18n.t(key, { defaultValue: '' });
    if (i18nVal && i18nVal !== key && i18nVal !== '') {
      return i18nVal;
    }
  }

  // 2. Direct dictionary lookup for target language
  const dict = TRANSLATIONS_MAP[lang];
  if (dict && dict[key]) {
    return dict[key];
  }

  // 3. Term-based fallback for standard strings
  if (fallback && COMMON_TERMS[fallback] && COMMON_TERMS[fallback][lang]) {
    return COMMON_TERMS[fallback][lang]!;
  }

  // 4. Fallback to English dictionary
  if (BASE_TRANSLATIONS[key]) {
    const enText = BASE_TRANSLATIONS[key];
    if (COMMON_TERMS[enText] && COMMON_TERMS[enText][lang]) {
      return COMMON_TERMS[enText][lang]!;
    }
    if (lang === 'en') {
      return enText;
    }
  }

  // 5. Return caller fallback or English text
  if (fallback) {
    return fallback;
  }

  if (BASE_TRANSLATIONS[key]) {
    return BASE_TRANSLATIONS[key];
  }

  // 6. Clean readable fallback from key
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  return lastPart
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

/**
 * Locale-aware number formatter
 */
export const formatNumberLocale = (
  num: number,
  lang: LanguageCode = 'en',
  options?: Intl.NumberFormatOptions
): string => {
  const safeNum = typeof num === 'number' && !isNaN(num) ? num : 0;
  try {
    const localeMap: Partial<Record<LanguageCode, string>> = {
      en: 'en-US',
      fr: 'fr-FR',
      es: 'es-ES',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-PT',
      nl: 'nl-NL',
      ar: 'ar-AE',
      zh: 'zh-CN',
      'zh-TW': 'zh-TW',
      ja: 'ja-JP',
      ko: 'ko-KR',
      ru: 'ru-RU',
      tr: 'tr-TR',
      hi: 'hi-IN',
      pl: 'pl-PL',
      vi: 'vi-VN',
      id: 'id-ID',
      he: 'he-IL',
      uk: 'uk-UA',
      th: 'th-TH',
      sw: 'sw-KE'
    };
    const targetLocale = localeMap[lang] || 'en-US';
    return new Intl.NumberFormat(targetLocale, options).format(safeNum);
  } catch {
    return safeNum.toLocaleString();
  }
};

/**
 * Locale-aware date formatter
 */
export const formatDateLocale = (
  date: Date | string,
  lang: LanguageCode = 'en',
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    const localeMap: Partial<Record<LanguageCode, string>> = {
      en: 'en-US',
      fr: 'fr-FR',
      es: 'es-ES',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-PT',
      nl: 'nl-NL',
      ar: 'ar-AE',
      zh: 'zh-CN',
      'zh-TW': 'zh-TW',
      ja: 'ja-JP',
      ko: 'ko-KR',
      ru: 'ru-RU',
      tr: 'tr-TR',
      hi: 'hi-IN',
      pl: 'pl-PL',
      vi: 'vi-VN',
      id: 'id-ID',
      he: 'he-IL',
      uk: 'uk-UA',
      th: 'th-TH',
      sw: 'sw-KE'
    };
    const targetLocale = localeMap[lang] || 'en-US';
    return new Intl.DateTimeFormat(
      targetLocale,
      options || { year: 'numeric', month: 'short', day: 'numeric' }
    ).format(d);
  } catch {
    return String(date);
  }
};

export default i18n;
