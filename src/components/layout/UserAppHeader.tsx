import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Bell,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  User,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  ArrowDownLeft,
  ArrowUpRight,
  Compass,
  Menu,
  X,
  Sparkles,
  Lock,
  Phone,
  Mail
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';
import { UserAvatar } from '../common/UserAvatar';

export const UserAppHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentCurrency,
    theme,
    toggleTheme,
    unreadNotificationCount,
    notifications,
    setDepositModalOpen,
    setWithdrawModalOpen,
    setIsAiAssistantOpen,
    startTour,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    t
  } = useApp();

  const { user, wallet, logout, isAdmin } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="growvest-user-app-header"
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#08080a]/95 backdrop-blur-2xl transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Client Portal Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer flex items-center gap-2"
          >
            <BrandLogo size="sm" />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10">
              Client Portal
            </span>
          </div>
        </div>

        {/* Center: Quick Valuation & Financial CTAs */}
        {wallet && (
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#121216] border border-slate-200 dark:border-white/10 font-mono">
              <span className="text-slate-400 text-[11px]">Available:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(wallet.availableBalanceUsd, currentCurrency)}
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="header-btn-quick-deposit"
                onClick={() => setDepositModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>{t('action.deposit', 'Deposit')}</span>
              </button>

              <button
                id="header-btn-quick-withdraw"
                onClick={() => setWithdrawModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('action.withdraw', 'Withdraw')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Right: Controls, Notifications & User Account */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* AI Insights Button */}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
            title="AI Financial Insights"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">AI Advisor</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Center with Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="btn-user-notifications"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#121216] hover:bg-slate-200 dark:hover:bg-[#1c1c22] active:scale-95 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#08080a] animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <>
                {/* Mobile Backdrop to cleanly dismiss on click outside */}
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
                  onClick={() => setNotifDropdownOpen(false)}
                />

                <div
                  id="dropdown-user-notifications"
                  className="fixed inset-x-3 top-[68px] sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 max-w-none sm:max-w-md rounded-2xl bg-white/95 dark:bg-[#121216]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl p-3 sm:p-4 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/[0.08] mb-2">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm">Alerts & Notifications</span>
                      {unreadNotificationCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-500">
                          {unreadNotificationCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setNotifDropdownOpen(false);
                      }}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[60vh] sm:max-h-80 overflow-y-auto overscroll-contain pr-0.5">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                        <Bell className="w-6 h-6 mx-auto mb-2 opacity-40" />
                        <p className="text-xs font-medium">No new notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 4).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setActiveTab('notifications');
                            setNotifDropdownOpen(false);
                          }}
                          className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-[#18181f] hover:bg-emerald-50/50 dark:hover:bg-[#1f1f28] border border-slate-200/80 dark:border-white/[0.06] cursor-pointer transition-colors active:scale-[0.99]"
                        >
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5 text-xs">
                              {notif.title.includes('SMS') ? (
                                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : notif.title.includes('Email') ? (
                                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              ) : (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              )}
                              <span className="truncate">{notif.title}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed break-words">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/[0.08]">
                      <button
                        onClick={() => {
                          setActiveTab('notifications');
                          setNotifDropdownOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#18181f] hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Open Notification Center</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User Account Profile Tab & Trigger (Discreet until clicked) */}
          {user && (
            <div className="relative" ref={userRef}>
              <button
                id="btn-user-profile-menu"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 min-h-[40px] min-w-[40px] rounded-xl border transition-all cursor-pointer active:scale-95 text-xs font-semibold ${
                  userDropdownOpen || activeTab === 'profile'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#121216] hover:bg-slate-200 dark:hover:bg-[#1c1c22] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                }`}
                aria-label="Account Profile Tab"
                title="Account Profile & Settings"
              >
                <UserAvatar user={user} size="xs" showStatus />
                <span className="hidden md:inline font-medium text-xs">Account</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
              </button>

              {userDropdownOpen && (
                <>
                  {/* Mobile Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
                    onClick={() => setUserDropdownOpen(false)}
                  />

                  <div
                    id="dropdown-user-account"
                    className="fixed inset-x-3 top-[68px] sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-72 max-w-none sm:max-w-xs rounded-2xl bg-white/95 dark:bg-[#121216]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl p-2.5 sm:p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-100 dark:border-white/[0.08] mb-1">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono mt-0.5">
                        {user.email}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {user.accountStatus === 'pending' ? 'Pending Approval' : 'Verified'}
                        </span>
                        {user.role === 'admin' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold">
                            ADMIN
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Strictly only visible if user is an admin */}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-600 dark:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer text-left font-bold"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                        <span>Admin Workspace</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1c24] transition-colors cursor-pointer text-left"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Personal Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('security');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1c24] transition-colors cursor-pointer text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Security Center & 2FA</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1c24] transition-colors cursor-pointer text-left"
                    >
                      <Bell className="w-3.5 h-3.5 text-emerald-500" />
                      <span>SMS & Email Alerts</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        startTour(0);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer text-left font-semibold"
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Platform Tour</span>
                      </div>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-white/[0.08]" />

                    <button
                      id="btn-user-logout"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer text-left font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile Navigation Drawer Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
