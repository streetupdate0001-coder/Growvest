import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import { LanguageCode, CurrencyCode, AppNotification, MarketAsset } from '../types';
import i18n, { SUPPORTED_LANGUAGES, translate, isRtlLanguage } from '../services/i18n';
import {
  useSystemThemePreference,
  ThemeMode,
  ResolvedTheme
} from '../hooks/useSystemThemePreference';
import {
  isSpeechSynthesisSupported,
  speakTextWithWebSpeech,
  formatMarketMovementAlert,
  VoiceAlertSensitivity,
  SENSITIVITY_THRESHOLDS
} from '../services/voiceAlerts';

export type { ThemeMode, ResolvedTheme };

export type AppTab =
  | 'dashboard'
  | 'markets'
  | 'portfolio'
  | 'activity'
  | 'history'
  | 'invest'
  | 'cards'
  | 'analytics'
  | 'deposit'
  | 'withdraw'
  | 'notifications'
  | 'support'
  | 'profile'
  | 'security'
  | 'settings'
  | 'transparency'
  | 'emails'
  | 'admin';

export type PublicPage =
  | 'home'
  | 'markets'
  | 'about'
  | 'how-it-works'
  | 'security'
  | 'faq'
  | 'contact'
  | 'transparency'
  | 'reviews'
  | 'calculator'
  | 'company-info'
  | 'services'
  | 'terms'
  | 'privacy'
  | 'risk-disclosure'
  | 'refund-policy'
  | 'customer-support';

interface AppContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isRtl: boolean;
  isLangModalOpen: boolean;
  setIsLangModalOpen: (open: boolean) => void;
  currentCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  theme: ResolvedTheme;
  themeMode: ThemeMode;
  systemTheme: ResolvedTheme;
  isSystemPreference: boolean;
  setTheme: (theme: ResolvedTheme) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  publicPage: PublicPage;
  setPublicPage: (page: PublicPage) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot' | 'verify_email';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot' | 'verify_email') => void;
  depositModalOpen: boolean;
  setDepositModalOpen: (open: boolean) => void;
  withdrawModalOpen: boolean;
  setWithdrawModalOpen: (open: boolean) => void;
  transferModalOpen: boolean;
  setTransferModalOpen: (open: boolean) => void;
  isCertificateModalOpen: boolean;
  setIsCertificateModalOpen: (open: boolean) => void;
  isScamAdviserModalOpen: boolean;
  setIsScamAdviserModalOpen: (open: boolean) => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  toggleNotificationRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  restoreNotification: (notification: AppNotification, index?: number) => void;
  resetDemoNotifications: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  t: (key: string, fallback?: string) => string;
  isPwaInstallable: boolean;
  triggerPwaInstall: () => Promise<void>;
  dismissPwaBanner: () => void;
  showPwaBanner: boolean;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  tourCurrentStep: number;
  setTourCurrentStep: (step: number) => void;
  startTour: (stepIndex?: number) => void;
  closeTour: () => void;
  completeTour: () => void;
  hasSeenTour: boolean;
  resetTour: () => void;

  // Voice Notification & Market Volatility Radar States
  isVoiceAlertsEnabled: boolean;
  toggleVoiceAlerts: (enabled?: boolean) => void;
  voiceAlertSensitivity: VoiceAlertSensitivity;
  setVoiceAlertSensitivity: (level: VoiceAlertSensitivity) => void;
  isSpeechSupported: boolean;
  isSpeakingVoiceAlert: boolean;
  speakVoiceAlert: (text: string, force?: boolean) => boolean;
  testVoiceNotification: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'security',
    title: 'New Secure Session Authenticated',
    message: 'Authorized login detected from Chrome (macOS) in Zurich, Switzerland.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    read: false,
    linkTab: 'security'
  },
  {
    id: 'notif_2',
    type: 'verification',
    title: 'Identity Verification Verified',
    message: 'Tier-1 Institutional passport verification has been confirmed.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    linkTab: 'profile'
  },
  {
    id: 'notif_3',
    type: 'transaction',
    title: 'Inbound SEPA Deposit Confirmed',
    message: 'Transfer of $5,000.00 USD (SEPA Instant) has completed settlement.',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    read: true,
    linkTab: 'activity'
  },
  {
    id: 'notif_4',
    type: 'system',
    title: 'Growvest Core Engine Update',
    message: 'Real-time WebSocket market streams enhanced with sub-second latency.',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    read: true
  }
];

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('greeneza_lang');
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === saved);
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('dir', langInfo?.direction || 'ltr');
          document.documentElement.setAttribute('lang', saved);
        }
        return saved as LanguageCode;
      }
    } catch (_e) {
      // ignore
    }
    return 'en';
  });

  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('greeneza_curr');
      return (saved as CurrencyCode) || 'USD';
    } catch (_e) {
      return 'USD';
    }
  });

  // Automated System Theme Preference & User Setting Synchronization
  const {
    systemTheme,
    resolvedTheme: theme,
    themeMode,
    isSystemPreference,
    setThemeMode,
    setTheme,
    toggleTheme
  } = useSystemThemePreference({
    storageKey: 'growvest_theme_mode',
    defaultMode: 'system'
  });

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'verify_email'>('login');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isScamAdviserModalOpen, setIsScamAdviserModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Platform Tour State
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(() => {
    return localStorage.getItem('greeneza_platform_tour_seen') === 'true';
  });
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourCurrentStep, setTourCurrentStep] = useState(0);

  const startTour = (stepIndex: number = 0) => {
    setTourCurrentStep(stepIndex);
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  const completeTour = () => {
    setIsTourOpen(false);
    setHasSeenTour(true);
    localStorage.setItem('greeneza_platform_tour_seen', 'true');
  };

  const resetTour = () => {
    localStorage.removeItem('greeneza_platform_tour_seen');
    setHasSeenTour(false);
    setTourCurrentStep(0);
    setIsTourOpen(true);
  };

  const isRtl = isRtlLanguage(currentLanguage);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('greeneza_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seenIds = new Set<string>();
          const sanitized: AppNotification[] = [];
          for (let i = 0; i < parsed.length; i++) {
            const item = parsed[i];
            if (!item || typeof item !== 'object') continue;
            let id = item.id;
            if (!id || seenIds.has(id)) {
              id = `notif_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 9)}`;
            }
            seenIds.add(id);
            sanitized.push({
              ...item,
              id
            });
          }
          return sanitized;
        }
      } catch (_e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // PWA Install states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstallable, setIsPwaInstallable] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(() => {
    return localStorage.getItem('greeneza_pwa_dismissed') !== 'true';
  });

  // Handle RTL direction, lang attribute & i18next synchronization
  useEffect(() => {
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);
    const dir = langInfo?.direction || 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLanguage);
    localStorage.setItem('greeneza_lang', currentLanguage);
    if (i18n.isInitialized && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('greeneza_curr', currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    localStorage.setItem('greeneza_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPwaInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem('greeneza_lang', lang);
      if (i18n.isInitialized) {
        i18n.changeLanguage(lang);
      }
      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('dir', langInfo?.direction || 'ltr');
        document.documentElement.setAttribute('lang', lang);
      }
    } catch (_e) {
      // ignore
    }
  };

  const setCurrency = (currency: CurrencyCode) => {
    setCurrentCurrencyState(currency);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const toggleNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const restoreNotification = (notification: AppNotification, index?: number) => {
    setNotifications(prev => {
      // Check if already present
      if (prev.some(n => n.id === notification.id)) return prev;
      const updated = [...prev];
      if (typeof index === 'number' && index >= 0 && index <= updated.length) {
        updated.splice(index, 0, notification);
      } else {
        updated.unshift(notification);
      }
      return updated;
    });
  };

  const resetDemoNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const uniqueId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${Math.random().toString(36).substring(2, 6)}`;
    const newNotif: AppNotification = {
      ...notif,
      id: uniqueId,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev.filter(n => n.id !== uniqueId)]);
  };

  const triggerPwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPwaInstallable(false);
        setShowPwaBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  // Voice Notification & Market Volatility State
  const [isVoiceAlertsEnabled, setIsVoiceAlertsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('greeneza_voice_notifications_enabled');
      return saved === 'true';
    } catch (_e) {
      return false;
    }
  });

  const [voiceAlertSensitivity, setVoiceAlertSensitivityState] = useState<VoiceAlertSensitivity>(() => {
    try {
      const saved = localStorage.getItem('greeneza_voice_alert_sensitivity');
      if (saved === 'high' || saved === 'medium' || saved === 'low') return saved;
    } catch (_e) {
      // ignore
    }
    return 'medium';
  });

  const [isSpeakingVoiceAlert, setIsSpeakingVoiceAlert] = useState(false);
  const isSpeechSupported = isSpeechSynthesisSupported();

  // Tracking last alerted asset timestamps to prevent spam (cooldown 90s per asset)
  const lastAlertedRef = useRef<Record<string, number>>({});
  const previousPricesRef = useRef<Record<string, { price: number; timestamp: number }>>({});

  useEffect(() => {
    try {
      localStorage.setItem('greeneza_voice_notifications_enabled', String(isVoiceAlertsEnabled));
    } catch (_e) {
      // ignore
    }
  }, [isVoiceAlertsEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('greeneza_voice_alert_sensitivity', voiceAlertSensitivity);
    } catch (_e) {
      // ignore
    }
  }, [voiceAlertSensitivity]);

  const toggleVoiceAlerts = (forcedState?: boolean) => {
    setIsVoiceAlertsEnabled(prev => {
      const next = typeof forcedState === 'boolean' ? forcedState : !prev;
      return next;
    });
  };

  const setVoiceAlertSensitivity = (level: VoiceAlertSensitivity) => {
    setVoiceAlertSensitivityState(level);
  };

  const speakVoiceAlert = (text: string, force: boolean = false): boolean => {
    if (!force && !isVoiceAlertsEnabled) return false;
    return speakTextWithWebSpeech(text, {
      onStart: () => setIsSpeakingVoiceAlert(true),
      onEnd: () => setIsSpeakingVoiceAlert(false)
    });
  };

  const testVoiceNotification = () => {
    const demoAsset = { name: 'Bitcoin', symbol: 'BTC', change: 3.45, price: 94520 };
    const alertMessage = formatMarketMovementAlert(
      demoAsset.name,
      demoAsset.symbol,
      demoAsset.change,
      demoAsset.price,
      currentCurrency
    );

    addNotification({
      type: 'market',
      title: `Critical Price Alert: ${demoAsset.name} (+${demoAsset.change}%)`,
      message: `Volatile upward surge detected. Asset traded at $${demoAsset.price.toLocaleString()} ${currentCurrency}.`,
      linkTab: 'markets'
    });

    speakVoiceAlert(alertMessage, true);
  };

  // Background Market Volatility & Price Movement Monitor
  useEffect(() => {
    let isMounted = true;

    const checkMarketVolatility = async () => {
      try {
        const res = await fetch('/api/markets');
        if (!res.ok) return;
        const json = await res.json();
        if (!json.data || !Array.isArray(json.data) || !isMounted) return;

        const currentThreshold = SENSITIVITY_THRESHOLDS[voiceAlertSensitivity]?.percent ?? 2.5;
        const now = Date.now();

        json.data.forEach((asset: MarketAsset) => {
          const assetId = asset.id;
          const currentPrice = asset.current_price;
          const change24h = asset.price_change_percentage_24h ?? 0;
          const prevEntry = previousPricesRef.current[assetId];

          // Compute immediate delta if previous price was recorded
          let immediateDeltaPercent = 0;
          if (prevEntry && prevEntry.price > 0) {
            immediateDeltaPercent = ((currentPrice - prevEntry.price) / prevEntry.price) * 100;
          }

          // Check if either 24h change or immediate price delta exceeds sensitivity threshold
          const isSignificant =
            Math.abs(change24h) >= currentThreshold ||
            Math.abs(immediateDeltaPercent) >= (currentThreshold / 2);

          const lastAlertedTime = lastAlertedRef.current[assetId] || 0;
          const isCooldownPassed = now - lastAlertedTime > 90000; // 90 seconds cooldown

          if (isSignificant && isCooldownPassed) {
            lastAlertedRef.current[assetId] = now;

            const direction = change24h >= 0 ? '+' : '';
            const vocalAlert = formatMarketMovementAlert(
              asset.name,
              asset.symbol,
              change24h,
              currentPrice,
              currentCurrency
            );

            // Add notification
            addNotification({
              type: 'market',
              title: `Significant Market Movement: ${asset.name} (${direction}${change24h.toFixed(1)}%)`,
              message: `Price threshold triggered at $${currentPrice.toLocaleString()} ${currentCurrency}. 24h delta: ${direction}${change24h.toFixed(2)}%.`,
              linkTab: 'markets'
            });

            // Speak out if voice notifications enabled
            if (isVoiceAlertsEnabled) {
              speakVoiceAlert(vocalAlert);
            }
          }

          // Record latest price
          previousPricesRef.current[assetId] = { price: currentPrice, timestamp: now };
        });
      } catch (_err) {
        // Silently handle background fetch failure
      }
    };

    // Initial check after short boot delay, then poll every 60s
    const initialTimer = setTimeout(checkMarketVolatility, 3000);
    const interval = setInterval(checkMarketVolatility, 60000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isVoiceAlertsEnabled, voiceAlertSensitivity, currentCurrency]);

  const dismissPwaBanner = () => {
    setShowPwaBanner(false);
    localStorage.setItem('greeneza_pwa_dismissed', 'true');
  };

  const t = (key: string, fallback?: string) => {
    return translate(currentLanguage, key, fallback);
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        isRtl,
        isLangModalOpen,
        setIsLangModalOpen,
        currentCurrency,
        setCurrency,
        theme,
        themeMode,
        systemTheme,
        isSystemPreference,
        setTheme,
        setThemeMode,
        toggleTheme,
        activeTab,
        setActiveTab,
        publicPage,
        setPublicPage,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        depositModalOpen,
        setDepositModalOpen,
        withdrawModalOpen,
        setWithdrawModalOpen,
        transferModalOpen,
        setTransferModalOpen,
        isCertificateModalOpen,
        setIsCertificateModalOpen,
        isScamAdviserModalOpen,
        setIsScamAdviserModalOpen,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        toggleNotificationRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        restoreNotification,
        resetDemoNotifications,
        addNotification,
        t,
        isPwaInstallable,
        triggerPwaInstall,
        dismissPwaBanner,
        showPwaBanner,
        isScannerOpen,
        setIsScannerOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isTourOpen,
        setIsTourOpen,
        tourCurrentStep,
        setTourCurrentStep,
        startTour,
        closeTour,
        completeTour,
        hasSeenTour,
        resetTour,

        // Voice Notification & Market Volatility Radar
        isVoiceAlertsEnabled,
        toggleVoiceAlerts,
        voiceAlertSensitivity,
        setVoiceAlertSensitivity,
        isSpeechSupported,
        isSpeakingVoiceAlert,
        speakVoiceAlert,
        testVoiceNotification
      }}
    >
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
