import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  DollarSign,
  Moon,
  Sun,
  Bell,
  User,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Mail,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CURRENCY_CONFIGS } from '../../services/currency';
import { CurrencyCode } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

export const Navbar: React.FC = () => {
  const {
    currentCurrency,
    setCurrency,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setAuthModalOpen,
    setAuthModalMode,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    t,
    setIsAiAssistantOpen,
    startTour
  } = useApp();

  const { user, isAuthenticated, logout } = useAuth();

  const [currDropdownOpen, setCurrDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const currRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currRef.current && !currRef.current.contains(e.target as Node)) {
        setCurrDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCurr = CURRENCY_CONFIGS[currentCurrency] || CURRENCY_CONFIGS.USD;

  return (
    <header
      id="growvest-navbar"
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md text-slate-900 dark:text-slate-100 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <BrandLogo
            size="md"
            onClick={() => setActiveTab('dashboard')}
            showTagline={false}
          />
        </div>

        {/* Public Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <button
            id="nav-tab-markets"
            onClick={() => setActiveTab('markets')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'markets'
                ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.markets', 'Markets')}
          </button>

          <button
            id="nav-tab-portfolio"
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'portfolio'
                ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.portfolio', 'Portfolio')}
          </button>

          <button
            id="nav-tab-invest"
            onClick={() => setActiveTab('invest')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'invest'
                ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.invest', 'Invest')}
          </button>

          <button
            id="nav-tab-security"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.security', 'Security')}
          </button>

          <button
            id="nav-tab-transparency"
            onClick={() => setActiveTab('transparency')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'transparency'
                ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.transparency', 'Transparency')}
          </button>

          <button
            id="nav-tab-support"
            onClick={() => setActiveTab('support')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'support'
                ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.support', 'Support')}
          </button>
        </nav>

        {/* Action Controls (Language, Currency, Theme, AI, Notifications, Auth) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Assistant Quick Toggle */}
          <button
            id="btn-nav-ai-assistant"
            onClick={() => setIsAiAssistantOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            title="Open Growvest AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Guide</span>
          </button>

          {/* Currency Display Selector */}
          <div className="relative" ref={currRef}>
            <button
              id="btn-curr-selector"
              onClick={() => setCurrDropdownOpen(!currDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
              title="Display Currency (Indicative)"
              aria-label="Currency Selector"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-mono text-xs font-semibold">{activeCurr.code}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {currDropdownOpen && (
              <div
                id="dropdown-currencies-menu"
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1 z-50 text-xs"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Display Currency</div>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 leading-tight">
                    *Indicative conversion. Settlement currency remains USD/Asset.
                  </p>
                </div>
                {Object.values(CURRENCY_CONFIGS).map(curr => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code as CurrencyCode);
                      setCurrDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      currentCurrency === curr.code
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold w-6 text-slate-900 dark:text-slate-200">{curr.symbol}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{curr.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{curr.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dedicated Theme Switcher (Light / Dark Mode Override) */}
          <ThemeSwitcher variant="compact" idPrefix="navbar-theme" />

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="btn-notifications"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm"
              title="System & Account Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white dark:text-slate-950 rounded-full font-mono text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div
                id="dropdown-notifications-panel"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Notifications</span>
                    {unreadNotificationCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                        {unreadNotificationCount} New
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-slate-400">No notifications available.</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.linkTab) setActiveTab(n.linkTab as any);
                          setNotifDropdownOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                          !n.read
                            ? 'bg-emerald-50/50 dark:bg-slate-800/80 border-emerald-500/30'
                            : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                            <span className="font-semibold text-slate-900 dark:text-slate-200">{n.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('notifications');
                      setNotifDropdownOpen(false);
                    }}
                    className="text-[11px] text-emerald-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-slate-200 font-medium cursor-pointer"
                  >
                    View All Notifications & Audit Logs →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Auth Buttons */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userRef}>
              <button
                id="btn-user-profile-menu"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                aria-label="User Menu"
              >
                <UserAvatar user={user} size="sm" showStatus />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                    {user.firstName} {user.lastName.charAt(0)}.
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    {user.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  id="dropdown-user-account"
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-xs"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Level 1
                      </span>
                      {user.role === 'admin' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </div>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-600 dark:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer text-left font-bold"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                      <span>Admin Workspace (Enclave)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Personal Profile & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('security');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Security Center & 2FA</span>
                  </button>

                  <button
                    id="btn-nav-user-email-templates"
                    onClick={() => {
                      setActiveTab('emails');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Email Templates</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      3 RFC
                    </span>
                  </button>

                  <button
                    id="btn-nav-user-tour"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      startTour(0);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer text-left font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Interactive Platform Tour</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      8 STEPS
                    </span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    id="btn-logout"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-header-login"
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('nav.login', 'Log In')}
              </button>

              <button
                id="btn-header-register"
                onClick={() => {
                  setAuthModalMode('register');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{t('nav.register', 'Create Account')}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Mobile Navigation Drawer Button */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
