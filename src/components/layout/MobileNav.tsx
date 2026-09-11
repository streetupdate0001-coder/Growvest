import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import {
  LayoutDashboard,
  Home,
  CreditCard,
  Send,
  TrendingUp,
  Briefcase,
  History,
  Activity,
  X,
  Compass,
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Shield,
  User,
  HelpCircle,
  Globe,
  DollarSign,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  LayoutGrid,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp, AppTab } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../../services/i18n';
import { CURRENCY_CONFIGS, formatCurrency } from '../../services/currency';
import { LanguageCode, CurrencyCode } from '../../types';
import { UserAvatar } from '../common/UserAvatar';

export const MobileNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setDepositModalOpen,
    setWithdrawModalOpen,
    currentLanguage,
    setLanguage,
    currentCurrency,
    setCurrency,
    unreadNotificationCount,
    theme,
    toggleTheme,
    t,
    startTour,
    setIsAiAssistantOpen
  } = useApp();

  const { user, wallet, isAuthenticated, logout, isAdmin } = useAuth();

  // Lock background scroll when the mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Handle swipe down gesture to dismiss
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        setIsMobileMenuOpen(false);
      }
    },
    [setIsMobileMenuOpen]
  );

  const bottomBarTabs: { tab: AppTab | 'menu'; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { tab: 'cards', label: 'Cards', icon: <CreditCard className="w-5 h-5" /> },
    { tab: 'activity', label: 'Payments', icon: <Send className="w-5 h-5" /> },
    { tab: 'invest', label: 'Invest', icon: <TrendingUp className="w-5 h-5" /> },
    {
      tab: 'menu',
      label: 'More',
      icon: <LayoutGrid className="w-5 h-5" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined
    },
  ];

  const primaryWorkspaceLinks: { tab: AppTab; label: string; icon: React.ReactNode; badge?: number | string; description?: string }[] = [
    { tab: 'dashboard', label: t('nav.dashboard', 'Dashboard'), icon: <LayoutDashboard className="w-5 h-5 text-emerald-500" />, description: 'Overview & Net Worth' },
    { tab: 'cards', label: 'Vault Cards', icon: <CreditCard className="w-5 h-5 text-amber-500" />, description: 'Virtual & Physical Cards' },
    { tab: 'analytics', label: 'Analytics', icon: <Activity className="w-5 h-5 text-teal-500" />, description: 'Yield & P&L Reports' },
    { tab: 'markets', label: t('nav.markets', 'Markets'), icon: <TrendingUp className="w-5 h-5 text-blue-500" />, description: 'Live Tickers & Crypto' },
    { tab: 'portfolio', label: t('nav.portfolio', 'Portfolio'), icon: <Briefcase className="w-5 h-5 text-purple-500" />, description: 'Holdings & Allocation' },
    { tab: 'invest', label: t('nav.invest', 'Invest'), icon: <Compass className="w-5 h-5 text-indigo-500" />, description: 'High-Yield Vaults' },
    { tab: 'activity', label: t('nav.activity', 'Activity'), icon: <History className="w-5 h-5 text-sky-500" />, description: 'Ledger & Audit History' },
  ];

  const accountToolsLinks: { tab: AppTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      tab: 'notifications',
      label: t('nav.notifications', 'Notification Center'),
      icon: <Bell className="w-5 h-5 text-blue-500" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined
    },
    { tab: 'security', label: t('nav.securityCenter', 'Security & 2FA'), icon: <Shield className="w-5 h-5 text-emerald-500" /> },
    { tab: 'profile', label: t('nav.profile', 'Account & Profile'), icon: <User className="w-5 h-5 text-violet-500" /> },
    { tab: 'support', label: t('nav.support', 'Customer Support'), icon: <HelpCircle className="w-5 h-5 text-sky-500" /> },
  ];

  return (
    <>
      {/* Bottom Navigation Bar with Ultra-Sleek Luxury Glass Dock */}
      <nav
        id="growvest-mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c10]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-2 flex items-center justify-around select-none transition-colors shadow-2xl safe-area-pb"
        aria-label="Mobile Navigation"
      >
        {bottomBarTabs.map(item => {
          const isSelected = item.tab === 'menu' ? isMobileMenuOpen : activeTab === item.tab && !isMobileMenuOpen;
          return (
            <button
              key={item.tab}
              id={`mobile-tab-${item.tab}`}
              onClick={() => {
                if (item.tab === 'menu') {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                } else {
                  setActiveTab(item.tab);
                  setIsMobileMenuOpen(false);
                }
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer relative active:scale-90 touch-manipulation ${
                isSelected
                  ? 'text-white font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className={`relative flex items-center justify-center p-1 rounded-xl transition-all ${
                isSelected ? 'bg-white/10 text-white' : ''
              }`}>
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1.5 min-w-3.5 h-3.5 px-0.5 bg-[#ff4d38] text-white font-mono text-[8px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight leading-none ${
                isSelected ? 'font-bold text-white' : 'font-medium text-slate-400'
              }`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Slide-over Full Menu Drawer Sheet with Smooth Spring Transitions */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 overflow-hidden flex flex-col justify-end">
            {/* Smooth Backdrop with Fade Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Bottom Sheet Modal with Fluid Spring Animation and Drag Handle */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280, mass: 0.75 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={handleDragEnd}
              id="mobile-menu-sheet"
              className="relative w-full max-h-[88vh] bg-white dark:bg-[#121216] border-t border-slate-200 dark:border-white/10 rounded-t-[28px] shadow-2xl overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-900 dark:text-white touch-pan-y"
            >
              {/* Drag Indicator Handle */}
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full mx-auto -mt-1 mb-2 shrink-0 cursor-grab active:cursor-grabbing" />

              {/* Sheet Header with Brand Identity & Close Target */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 text-white flex items-center justify-center font-black text-base shadow-xs">
                    GV
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-wide flex items-center gap-1.5 font-mono">
                      <span>GROWVEST HUB</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white/10 text-slate-200 border border-white/10">
                        v2.4
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mobile Financial Workspace</p>
                  </div>
                </div>

                <button
                  id="btn-close-mobile-nav"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-w-[44px] min-h-[44px] p-2.5 rounded-2xl bg-slate-100 dark:bg-[#1c1c22] text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs border border-transparent dark:border-white/10"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Financial Snapshot Card (When Authenticated) */}
              {isAuthenticated && wallet && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-medium">Total Portfolio Value</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Feed
                    </span>
                  </div>

                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
                    {formatCurrency(wallet.totalValueUsd, currentCurrency)}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Available Balance</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-white">
                        {formatCurrency(wallet.availableBalanceUsd, currentCurrency)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[11px]">Invested Vaults</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-white">
                        {formatCurrency(wallet.investedBalanceUsd, currentCurrency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Transaction Action Touch Targets (min-h 50px) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="mobile-btn-deposit"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setDepositModalOpen(true);
                  }}
                  className="min-h-[50px] flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#ff4d38] hover:bg-[#e03e2a] text-white font-bold text-xs shadow-md shadow-[#ff4d38]/20 active:scale-98 transition-all cursor-pointer"
                >
                  <ArrowDownLeft className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t('action.deposit', 'Deposit Funds')}</span>
                </button>

                <button
                  id="mobile-btn-withdraw"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setWithdrawModalOpen(true);
                  }}
                  className="min-h-[50px] flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-[#25252e] active:scale-98 transition-all cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{t('action.withdraw', 'Withdraw')}</span>
                </button>
              </div>

              {/* Dedicated AI Advisor Quick Action */}
              <button
                id="mobile-btn-ai-advisor"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAiAssistantOpen(true);
                }}
                className="w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#18181e] hover:bg-slate-100 dark:hover:bg-[#22222a] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold transition-all active:scale-98 cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>AI Portfolio Advisor</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md font-mono bg-white/10 text-slate-200 font-bold border border-white/10">
                  Instant Insights
                </span>
              </button>

              {/* Admin Workspace Gateway Link (If Admin User) */}
              {isAuthenticated && isAdmin && (
                <button
                  id="mobile-btn-admin-workspace"
                  onClick={() => {
                    setActiveTab('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                    </div>
                    <span>Admin Control Enclave</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-black bg-amber-500 text-slate-950 uppercase">
                    OFFICER
                  </span>
                </button>
              )}

              {/* Financial Workspace Navigation List (Generous min-h 48px targets) */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold px-2 mb-1 flex items-center justify-between">
                  <span>Workspace Views</span>
                  <span className="text-[10px] font-normal text-slate-400">7 Sections</span>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {primaryWorkspaceLinks.map(item => {
                    const isActive = activeTab === item.tab;
                    return (
                      <button
                        key={item.tab}
                        id={`mobile-menu-item-${item.tab}`}
                        onClick={() => {
                          setActiveTab(item.tab);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full min-h-[48px] flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all active:scale-98 cursor-pointer ${
                          isActive
                            ? 'bg-white/10 text-white font-bold border border-white/10 shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/15' : 'bg-slate-100 dark:bg-[#1c1c22]'}`}>
                            {item.icon}
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-semibold leading-tight">{item.label}</div>
                            {item.description && (
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          )}
                          <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Account, Compliance & Support List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold px-2 mb-1">
                  Account & Security
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {accountToolsLinks.map(item => {
                    const isActive = activeTab === item.tab;
                    return (
                      <button
                        key={item.tab}
                        id={`mobile-menu-item-${item.tab}`}
                        onClick={() => {
                          setActiveTab(item.tab);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full min-h-[48px] flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all active:scale-98 cursor-pointer ${
                          isActive
                            ? 'bg-white/10 text-white font-bold border border-white/10'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#1c1c22] flex items-center justify-center">
                            {item.icon}
                          </div>
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.badge !== undefined && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white dark:text-slate-950 font-mono text-[10px] font-bold shadow-xs">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferences: Theme, Platform Tour, Language & Currency */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold px-2">
                  Preferences & Localization
                </div>

                {/* Theme Toggle Button (Touch Target min-h 48px) */}
                <button
                  id="mobile-btn-theme-toggle"
                  onClick={toggleTheme}
                  className="w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-black/40 flex items-center justify-center">
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                    </div>
                    <span className="font-semibold">Display Theme</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold px-2 py-1 rounded-lg bg-emerald-500/10">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </button>

                {/* Interactive Platform Tour Button (Touch Target min-h 48px) */}
                <button
                  id="mobile-btn-tour"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    startTour(0);
                  }}
                  className="w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
                      <Compass className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span>Interactive Guided Tour</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-white/10 text-slate-200 border border-white/10">
                    8 Steps
                  </span>
                </button>

                {/* Language & Currency Selection Select Boxes (min-h 48px) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block px-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-emerald-400" />
                      <span>Language</span>
                    </label>
                    <select
                      id="mobile-select-language"
                      value={currentLanguage}
                      onChange={e => setLanguage(e.target.value as LanguageCode)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-medium focus:ring-2 focus:ring-white/20 outline-none"
                    >
                      {SUPPORTED_LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block px-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      <span>Currency</span>
                    </label>
                    <select
                      id="mobile-select-currency"
                      value={currentCurrency}
                      onChange={e => setCurrency(e.target.value as CurrencyCode)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-medium focus:ring-2 focus:ring-white/20 outline-none"
                    >
                      {Object.values(CURRENCY_CONFIGS).map(c => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* User Account Info & Sign Out Button (min-h 48px) */}
              {isAuthenticated && user && (
                <div className="pt-3 pb-8 border-t border-slate-200 dark:border-white/10 space-y-3">
                  <div
                    onClick={() => {
                      setActiveTab('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all active:scale-98"
                  >
                    <UserAvatar user={user} size="sm" showStatus />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                        {user.email}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-white/10 text-slate-200 border border-white/10">
                      {user.role}
                    </span>
                  </div>

                  <button
                    id="mobile-btn-signout"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-rose-500/10 text-rose-400 font-bold text-xs border border-rose-500/20 active:bg-rose-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out from Growvest</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>AES-256 Encrypted Session</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
