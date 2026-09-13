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

// App Router Pages (/app)
import LoginPage from '../app/login/page';
import AdminPage from '../app/admin/page';
import DashboardPage from '../app/dashboard/page';
import InvestPage from '../app/invest/page';
import WithdrawPage from '../app/withdraw/page';
import HistoryPage from '../app/history/page';
import CardsPage from '../app/cards/page';
import PaymentsPage from '../app/payments/page';
import MorePage from '../app/more/page';
import PointsPage from '../app/points/page';

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
      path === '/admin' ||
      path.endsWith('/app/admin') ||
      search.get('page') === 'admin' ||
      search.get('view') === 'admin'
    );
  });

  // Dedicated Dashboard Route
  const [isDashboardHashRoute, setIsDashboardHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#dashboard') ||
      hash.startsWith('#/dashboard') ||
      path.endsWith('/dashboard') ||
      path === '/dashboard' ||
      path.endsWith('/app/dashboard') ||
      search.get('page') === 'dashboard' ||
      search.get('view') === 'dashboard'
    );
  });

  // Dedicated Invest Route (/app/invest, /invest, #invest)
  const [isInvestHashRoute, setIsInvestHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#invest') ||
      hash.startsWith('#/invest') ||
      path.endsWith('/invest') ||
      path === '/invest' ||
      path.endsWith('/app/invest') ||
      search.get('page') === 'invest' ||
      search.get('view') === 'invest'
    );
  });

  // Dedicated Withdraw Route (/app/withdraw, /withdraw, #withdraw)
  const [isWithdrawHashRoute, setIsWithdrawHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#withdraw') ||
      hash.startsWith('#/withdraw') ||
      path.endsWith('/withdraw') ||
      path === '/withdraw' ||
      path.endsWith('/app/withdraw') ||
      search.get('page') === 'withdraw' ||
      search.get('view') === 'withdraw'
    );
  });

  // Dedicated History Route (/app/history, /history, #history)
  const [isHistoryHashRoute, setIsHistoryHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#history') ||
      hash.startsWith('#/history') ||
      path.endsWith('/history') ||
      path === '/history' ||
      path.endsWith('/app/history') ||
      search.get('page') === 'history' ||
      search.get('view') === 'history'
    );
  });

  // Dedicated Cards Route (/app/cards, /cards, #cards)
  const [isCardsHashRoute, setIsCardsHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#cards') ||
      hash.startsWith('#/cards') ||
      path.endsWith('/cards') ||
      path === '/cards' ||
      path.endsWith('/app/cards') ||
      search.get('page') === 'cards' ||
      search.get('view') === 'cards'
    );
  });

  // Dedicated Payments Route (/app/payments, /payments, #payments)
  const [isPaymentsHashRoute, setIsPaymentsHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#payments') ||
      hash.startsWith('#/payments') ||
      path.endsWith('/payments') ||
      path === '/payments' ||
      path.endsWith('/app/payments') ||
      search.get('page') === 'payments' ||
      search.get('view') === 'payments'
    );
  });

  // Dedicated More Route (/app/more, /more, #more)
  const [isMoreHashRoute, setIsMoreHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#more') ||
      hash.startsWith('#/more') ||
      path.endsWith('/more') ||
      path === '/more' ||
      path.endsWith('/app/more') ||
      search.get('page') === 'more' ||
      search.get('view') === 'more'
    );
  });

  // Dedicated Points Route (/app/points, /points, #points)
  const [isPointsHashRoute, setIsPointsHashRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return (
      hash.startsWith('#points') ||
      hash.startsWith('#/points') ||
      path.endsWith('/points') ||
      path === '/points' ||
      path.endsWith('/app/points') ||
      search.get('page') === 'points' ||
      search.get('view') === 'points'
    );
  });

  // Unified Navigator
  const handleNavigate = (destination: string) => {
    if (typeof window === 'undefined') return;
    if (destination.startsWith('/')) {
      window.history.pushState(null, '', destination);
    } else {
      window.location.hash = destination;
    }
    window.dispatchEvent(new Event('popstate'));
  };

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
        path === '/admin' ||
        path.endsWith('/app/admin') ||
        search.get('page') === 'admin' ||
        search.get('view') === 'admin';

      const isDash =
        hash.startsWith('#dashboard') ||
        hash.startsWith('#/dashboard') ||
        path.endsWith('/dashboard') ||
        path === '/dashboard' ||
        path.endsWith('/app/dashboard') ||
        search.get('page') === 'dashboard' ||
        search.get('view') === 'dashboard';

      const isInvest =
        hash.startsWith('#invest') ||
        hash.startsWith('#/invest') ||
        path.endsWith('/invest') ||
        path === '/invest' ||
        path.endsWith('/app/invest') ||
        search.get('page') === 'invest' ||
        search.get('view') === 'invest';

      const isWithdraw =
        hash.startsWith('#withdraw') ||
        hash.startsWith('#/withdraw') ||
        path.endsWith('/withdraw') ||
        path === '/withdraw' ||
        path.endsWith('/app/withdraw') ||
        search.get('page') === 'withdraw' ||
        search.get('view') === 'withdraw';

      const isHistory =
        hash.startsWith('#history') ||
        hash.startsWith('#/history') ||
        path.endsWith('/history') ||
        path === '/history' ||
        path.endsWith('/app/history') ||
        search.get('page') === 'history' ||
        search.get('view') === 'history';

      const isCards =
        hash.startsWith('#cards') ||
        hash.startsWith('#/cards') ||
        path.endsWith('/cards') ||
        path === '/cards' ||
        path.endsWith('/app/cards') ||
        search.get('page') === 'cards' ||
        search.get('view') === 'cards';

      const isPayments =
        hash.startsWith('#payments') ||
        hash.startsWith('#/payments') ||
        path.endsWith('/payments') ||
        path === '/payments' ||
        path.endsWith('/app/payments') ||
        search.get('page') === 'payments' ||
        search.get('view') === 'payments';

      const isMore =
        hash.startsWith('#more') ||
        hash.startsWith('#/more') ||
        path.endsWith('/more') ||
        path === '/more' ||
        path.endsWith('/app/more') ||
        search.get('page') === 'more' ||
        search.get('view') === 'more';

      const isPoints =
        hash.startsWith('#points') ||
        hash.startsWith('#/points') ||
        path.endsWith('/points') ||
        path === '/points' ||
        path.endsWith('/app/points') ||
        search.get('page') === 'points' ||
        search.get('view') === 'points';

      if (hash.includes('privacy') || path.endsWith('/privacy')) {
        setLegalRoute('privacy');
      } else if (hash.includes('terms') || path.endsWith('/terms')) {
        setLegalRoute('terms');
      } else {
        setLegalRoute(null);
      }

      setIsLoginHashRoute(isLogin);
      setIsAdminHashRoute(isAdminRoute);
      setIsDashboardHashRoute(isDash);
      setIsInvestHashRoute(isInvest);
      setIsWithdrawHashRoute(isWithdraw);
      setIsHistoryHashRoute(isHistory);
      setIsCardsHashRoute(isCards);
      setIsPaymentsHashRoute(isPayments);
      setIsMoreHashRoute(isMore);
      setIsPointsHashRoute(isPoints);
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    // Ultra-fast boot: render UI immediately with zero artificial lag
    setInitialLoading(false);
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

  // 1. DEDICATED ADMIN ROUTE GATEWAY (/admin, #admin, /app/admin)
  // Protected with middleware checking role === 'admin' from profiles table
  if (isAdminHashRoute) {
    return (
      <AdminPage onNavigate={handleNavigate} />
    );
  }

  // 2. STANDALONE CLIENT SIGN-IN ROUTE GATEWAY (/login, #login, /app/login)
  // Authenticates with Supabase auth and redirects to /dashboard
  if (isLoginHashRoute && !isAuthenticated) {
    return (
      <LoginPage
        onNavigate={handleNavigate}
        onSuccess={() => {
          setIsLoginHashRoute(false);
          setIsDashboardHashRoute(true);
          handleNavigate('/dashboard');
        }}
      />
    );
  }

  // 3. DEDICATED DASHBOARD ROUTE (/dashboard, #dashboard, /app/dashboard)
  if (isDashboardHashRoute) {
    return (
      <DashboardPage onNavigate={handleNavigate} />
    );
  }

  // 4. DEDICATED INVEST ROUTE (/invest, #invest, /app/invest)
  if (isInvestHashRoute) {
    return (
      <InvestPage onNavigate={handleNavigate} />
    );
  }

  // 5. DEDICATED WITHDRAW ROUTE (/withdraw, #withdraw, /app/withdraw)
  if (isWithdrawHashRoute) {
    return (
      <WithdrawPage onNavigate={handleNavigate} />
    );
  }

  // 6. DEDICATED HISTORY ROUTE (/history, #history, /app/history)
  if (isHistoryHashRoute) {
    return (
      <HistoryPage onNavigate={handleNavigate} />
    );
  }

  // 7. DEDICATED CARDS ROUTE (/cards, #cards, /app/cards)
  if (isCardsHashRoute) {
    return (
      <CardsPage onNavigate={handleNavigate} />
    );
  }

  // 8. DEDICATED PAYMENTS ROUTE (/payments, #payments, /app/payments)
  if (isPaymentsHashRoute) {
    return (
      <PaymentsPage onNavigate={handleNavigate} />
    );
  }

  // 9. DEDICATED MORE ROUTE (/more, #more, /app/more)
  if (isMoreHashRoute) {
    return (
      <MorePage onNavigate={handleNavigate} />
    );
  }

  // 10. DEDICATED POINTS ROUTE (/points, #points, /app/points)
  if (isPointsHashRoute) {
    return (
      <PointsPage onNavigate={handleNavigate} />
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

  // For regular verified clients, directly display the modern mobile-first investor application matching the uploaded design
  if (isAuthenticated && !isAdmin && !isPendingApproval) {
    const currentTab = activeTab as string;
    if (currentTab === 'cards') return <CardsPage onNavigate={handleNavigate} />;
    if (currentTab === 'invest') return <InvestPage onNavigate={handleNavigate} />;
    if (currentTab === 'points') return <PointsPage onNavigate={handleNavigate} />;
    if (currentTab === 'payments' || currentTab === 'activity' || currentTab === 'history') return <PaymentsPage onNavigate={handleNavigate} />;
    if (currentTab === 'more') return <MorePage onNavigate={handleNavigate} />;
    if (currentTab === 'withdraw') return <WithdrawPage onNavigate={handleNavigate} />;
    return <DashboardPage onNavigate={handleNavigate} />;
  }

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
        return <InvestPage onNavigate={handleNavigate} />;
      case 'withdraw':
        return <WithdrawPage onNavigate={handleNavigate} />;
      case 'activity':
      case 'history':
        return <HistoryPage onNavigate={handleNavigate} />;
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
