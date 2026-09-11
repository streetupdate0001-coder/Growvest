import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingScreen } from './components/common/LoadingScreen';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';
import { LanguageSelectorModal } from './components/common/LanguageSelectorModal';
import { LocalizationScannerModal } from './components/dev/LocalizationScannerModal';
import { ScamAdviserVerificationModal } from './components/public/ScamAdviserVerificationModal';
import { LiveChatWidget } from './components/common/LiveChatWidget';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { SvgSprite } from './components/common/SvgSprite';

// Public Experience
import { PublicWebsite } from './components/public/PublicWebsite';
import { AdminLoginView } from './components/auth/AdminLoginView';
import { StandaloneLoginView } from './components/auth/StandaloneLoginView';
import { LegalView } from './components/views/LegalView';
import { ShieldAlert } from 'lucide-react';

// Dedicated Admin Layout
import { AdminLayout } from './components/layout/AdminLayout';

// Authenticated User Application Shell & Views
import { UserAppHeader } from './components/layout/UserAppHeader';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { UserAppFooter } from './components/layout/UserAppFooter';

// Authenticated Views
import { DashboardView } from './components/views/DashboardView';
import { CardsView } from './components/views/CardsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { MarketsView } from './components/views/MarketsView';
import { PortfolioView } from './components/views/PortfolioView';
import { InvestView } from './components/views/InvestView';
import { ActivityView } from './components/views/ActivityView';
import { SecurityView } from './components/views/SecurityView';
import { ProfileView } from './components/views/ProfileView';
import { SupportView } from './components/views/SupportView';
import { NotificationsView } from './components/views/NotificationsView';
import { EmailTemplatesView } from './components/views/EmailTemplatesView';
import { UserPendingApprovalView } from './components/views/UserPendingApprovalView';
import { TransparencySection } from './components/public/TransparencySection';
import { SecuritySection } from './components/public/SecuritySection';
import { motion, AnimatePresence } from 'motion/react';

// Modals & Drawers
import { AuthModal } from './components/auth/AuthModal';
import { DepositModal } from './components/financial/DepositModal';
import { WithdrawModal } from './components/financial/WithdrawModal';
import { TransferModal } from './components/financial/TransferModal';
import { AiAssistantDrawer } from './components/views/AiAssistantDrawer';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { SessionTimeoutModal } from './components/security/SessionTimeoutModal';
import { BiometricAuthModal } from './components/security/BiometricAuthModal';
import { PlatformTour } from './components/tour/PlatformTour';
import { useGoogleTranslate } from './hooks/useGoogleTranslate';

const MainAppContent: React.FC = () => {
  // Execute Google Translate MutationObserver hook across application lifecycle
  useGoogleTranslate();

  const {
    activeTab,
    setActiveTab,
    setPublicPage,
    isLangModalOpen,
    setIsLangModalOpen,
    isScannerOpen,
    setIsScannerOpen,
    isScamAdviserModalOpen,
    setIsScamAdviserModalOpen
  } = useApp();
  const {
    user,
    isAuthenticated,
    isAdmin,
    isSessionTimeoutWarningOpen,
    sessionTimeoutRemainingSeconds,
    extendSession,
    logout,
    isBiometricPromptOpen,
    closeBiometricPrompt,
    authenticateBiometric,
    biometricMethod,
    biometricTargetArea
  } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);

  // Standalone Direct Client Sign-In Route
  const [isLoginHashRoute, setIsLoginHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#login') ||
      hash.startsWith('#/login') ||
      hash.startsWith('#signin') ||
      hash.startsWith('#/signin') ||
      hash.startsWith('#sign-in') ||
      hash.startsWith('#/sign-in') ||
      hash.startsWith('#portal') ||
      hash.startsWith('#/portal') ||
      hash.startsWith('#auth') ||
      hash.startsWith('#/auth') ||
      path.endsWith('/login') ||
      path.endsWith('/signin') ||
      path.endsWith('/sign-in') ||
      path.endsWith('/portal') ||
      search.get('login') === 'true' ||
      search.get('view') === 'login' ||
      search.get('page') === 'login' ||
      search.get('auth') === 'login' ||
      search.get('auth') === 'signin' ||
      search.get('mode') === 'login'
    );
  });

  // Dedicated Admin Gateway Route
  const [isAdminHashRoute, setIsAdminHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#admin') ||
      hash.startsWith('#/admin') ||
      path.endsWith('/admin') ||
      search.get('page') === 'admin' ||
      search.get('view') === 'admin'
    );
  });

  // Legal Route (/privacy, /terms, #privacy, #terms)
  const [legalRoute, setLegalRoute] = useState<'privacy' | 'terms' | null>(() => {
    if (typeof window === 'undefined') return null;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    if (hash.includes('privacy') || path.endsWith('/privacy')) return 'privacy';
    if (hash.includes('terms') || path.endsWith('/terms')) return 'terms';
    return null;
  });

  // Global dev keyboard shortcut to launch localization scanner (Alt+L or Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'l') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l')) {
        e.preventDefault();
        setIsScannerOpen(!isScannerOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScannerOpen, setIsScannerOpen]);

  // Listen to hash and browser history changes for direct deep linking
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      const search = new URLSearchParams(window.location.search);

      const isLogin =
        hash.startsWith('#login') ||
        hash.startsWith('#/login') ||
        hash.startsWith('#signin') ||
        hash.startsWith('#/signin') ||
        hash.startsWith('#sign-in') ||
        hash.startsWith('#/sign-in') ||
        hash.startsWith('#portal') ||
        hash.startsWith('#/portal') ||
        hash.startsWith('#auth') ||
        hash.startsWith('#/auth') ||
        path.endsWith('/login') ||
        path.endsWith('/signin') ||
        path.endsWith('/sign-in') ||
        path.endsWith('/portal') ||
        search.get('login') === 'true' ||
        search.get('view') === 'login' ||
        search.get('page') === 'login' ||
        search.get('auth') === 'login' ||
        search.get('auth') === 'signin' ||
        search.get('mode') === 'login';

      const isAdminRoute =
        hash.startsWith('#admin') ||
        hash.startsWith('#/admin') ||
        path.endsWith('/admin') ||
        search.get('page') === 'admin' ||
        search.get('view') === 'admin';

      if (hash.includes('privacy') || path.endsWith('/privacy')) {
        setLegalRoute('privacy');
      } else if (hash.includes('terms') || path.endsWith('/terms')) {
        setLegalRoute('terms');
      } else {
        setLegalRoute(null);
      }

      setIsLoginHashRoute(isLogin);
      setIsAdminHashRoute(isAdminRoute);
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    // Branded initial boot
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // When admin logs in, switch active tab to admin
  useEffect(() => {
    if (isAuthenticated && isAdmin && isAdminHashRoute) {
      setActiveTab('admin');
    }
  }, [isAuthenticated, isAdmin, isAdminHashRoute, setActiveTab]);

  if (initialLoading) {
    return <LoadingScreen message="Initializing Institutional Financial Enclave..." />;
  }

  // 0. LEGAL PAGES (/#privacy, #/terms, /privacy, /terms)
  if (legalRoute) {
    return (
      <LegalView
        initialTab={legalRoute}
        onBack={() => {
          setLegalRoute(null);
          window.location.hash = isAuthenticated ? '#dashboard' : '';
        }}
      />
    );
  }

  // 1. NON-ADMIN RESTRICTION: Hide admin panel completely from normal users
  if (isAuthenticated && !isAdmin && (isAdminHashRoute || activeTab === 'admin')) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The requested administrative terminal requires verified executive compliance credentials. Your user account does not possess administrative access rights.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsAdminHashRoute(false);
              setActiveTab('dashboard');
              window.location.hash = '#dashboard';
            }}
            className="w-full h-12 min-h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
          >
            Return to Client Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 2. STANDALONE DIRECT CLIENT SIGN-IN ROUTE GATEWAY (/#login, #/signin, /login, etc.)
  // When accessed via direct link, user enters directly without seeing public front page
  if (isLoginHashRoute && !isAuthenticated) {
    return (
      <StandaloneLoginView
        onBackToPublic={() => {
          setIsLoginHashRoute(false);
          setPublicPage('home');
          window.location.hash = '';
          if (window.history.pushState) {
            window.history.pushState(null, '', window.location.pathname);
          }
        }}
        onSuccess={() => {
          setIsLoginHashRoute(false);
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // 3. DIRECT ADMIN ROUTE GATEWAY (For unauthenticated visitors requesting #admin or /admin)
  if (isAdminHashRoute && !isAuthenticated) {
    return (
      <AdminLoginView
        onBackToPublic={() => {
          setIsAdminHashRoute(false);
          setPublicPage('home');
          window.location.hash = '';
          if (window.history.pushState) {
            window.history.pushState(null, '', window.location.pathname);
          }
        }}
        onSuccess={() => {
          setIsAdminHashRoute(false);
          setActiveTab('admin');
        }}
      />
    );
  }

  // 2. PUBLIC WEBSITE EXPERIENCE (Visitors who have not signed in)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors">
        <PublicWebsite />
        <AuthModal />
        <LanguageSelectorModal
          isOpen={isLangModalOpen}
          onClose={() => setIsLangModalOpen(false)}
        />
        <LocalizationScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
        />
        <ScamAdviserVerificationModal
          isOpen={isScamAdviserModalOpen}
          onClose={() => setIsScamAdviserModalOpen(false)}
        />
        <PwaInstallBanner />
        <LiveChatWidget />
        <CookieConsentBanner />
      </div>
    );
  }

  // 3. DEDICATED ADMIN WORKSPACE (Officers with role === 'admin' accessing admin tab)
  if (isAuthenticated && isAdmin && activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors">
        <AdminLayout />
        <LanguageSelectorModal
          isOpen={isLangModalOpen}
          onClose={() => setIsLangModalOpen(false)}
        />
        <LocalizationScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
        />
        <SessionTimeoutModal
          isOpen={isSessionTimeoutWarningOpen}
          onExtend={extendSession}
          onLogout={logout}
          remainingSeconds={sessionTimeoutRemainingSeconds}
          totalWarningSeconds={60}
        />
        <LiveChatWidget />
      </div>
    );
  }

  // 4. AUTHENTICATED USER APPLICATION SHELL (Clients and Admin testing client views)
  const isPendingApproval = user?.accountStatus === 'pending';

  const renderAuthenticatedContent = () => {
    // If account is still pending administrative approval, show the dedicated status screen
    if (isPendingApproval) {
      return <UserPendingApprovalView />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'cards':
        return <CardsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'markets':
        return <MarketsView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'invest':
        return <InvestView />;
      case 'activity':
        return <ActivityView />;
      case 'security':
        return <SecurityView />;
      case 'profile':
        return <ProfileView />;
      case 'support':
        return <SupportView />;
      case 'notifications':
        return <NotificationsView />;
      case 'emails':
        // Only admins can inspect raw outbound email templates
        return isAdmin ? <EmailTemplatesView /> : <DashboardView />;
      case 'transparency':
        return isAdmin ? (
          <div className="space-y-8">
            <TransparencySection />
            <SecuritySection />
          </div>
        ) : (
          <DashboardView />
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#08080a] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#ff4d38] selection:text-white transition-colors">
      {/* App Top Navigation (Dedicated Client Terminal Header) */}
      <UserAppHeader />

      {/* Authenticated Dashboard Workspace */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Left Desktop Sidebar (Hidden if pending approval to avoid confusion) */}
        {!isPendingApproval && <Sidebar />}

        {/* Dynamic App Content View with Animated Page Transitions */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0 pb-24 lg:pb-12 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {renderAuthenticatedContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Only for active logged-in users) */}
      {!isPendingApproval && <MobileNav />}

      {/* App Footer (Dedicated Client Terminal Footer) */}
      <UserAppFooter />

      {/* PWA Prompt Banner */}
      <PwaInstallBanner />

      {/* Operations Modals & Drawers */}
      <ScrollProgressBar />
      <AuthModal />
      <DepositModal />
      <WithdrawModal />
      <TransferModal />
      <AiAssistantDrawer />
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
      <LocalizationScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
      <ScamAdviserVerificationModal
        isOpen={isScamAdviserModalOpen}
        onClose={() => setIsScamAdviserModalOpen(false)}
      />
      <PlatformTour />
      <SessionTimeoutModal
        isOpen={isSessionTimeoutWarningOpen}
        onExtend={extendSession}
        onLogout={logout}
        remainingSeconds={sessionTimeoutRemainingSeconds}
        totalWarningSeconds={60}
      />
      <BiometricAuthModal
        isOpen={isBiometricPromptOpen}
        onClose={closeBiometricPrompt}
        onSuccess={authenticateBiometric}
        method={biometricMethod}
        targetAreaName={biometricTargetArea}
      />
      <LiveChatWidget />
      <CookieConsentBanner />
      <SvgSprite />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </AuthProvider>
  );
}
