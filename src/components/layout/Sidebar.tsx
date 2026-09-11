import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  ArrowDownLeft,
  ArrowUpRight,
  Compass,
  History,
  Shield,
  HelpCircle,
  User,
  Settings,
  Bell,
  CheckCircle,
  FileText,
  Lock,
  ChevronRight,
  Sun,
  Moon,
  Mail,
  ShieldAlert,
  Server,
  CreditCard,
  Activity
} from 'lucide-react';
import { useApp, AppTab } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';
import { UserAvatar } from '../common/UserAvatar';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setDepositModalOpen,
    setWithdrawModalOpen,
    currentCurrency,
    t,
    unreadNotificationCount,
    theme,
    toggleTheme,
    startTour
  } = useApp();
  const { user, wallet, isAuthenticated } = useAuth();

  const mainNavItems: { tab: AppTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { tab: 'dashboard', label: t('nav.dashboard', 'Dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'invest', label: 'Investment Plans', icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
    { tab: 'cards', label: 'Vault Cards', icon: <CreditCard className="w-4 h-4 text-[#ff5e3a]" /> },
    { tab: 'analytics', label: 'Analytics', icon: <Activity className="w-4 h-4 text-teal-500" /> },
    { tab: 'portfolio', label: t('nav.portfolio', 'Portfolio'), icon: <Briefcase className="w-4 h-4" /> },
    { tab: 'activity', label: t('nav.activity', 'Activity'), icon: <History className="w-4 h-4" /> },
  ];

  const financialActions: { label: string; icon: React.ReactNode; onClick: () => void; variant: 'deposit' | 'withdraw' }[] = [
    {
      label: t('action.deposit', 'Deposit'),
      icon: <ArrowDownLeft className="w-4 h-4 text-emerald-500" />,
      onClick: () => setDepositModalOpen(true),
      variant: 'deposit'
    },
    {
      label: t('action.withdraw', 'Withdraw'),
      icon: <ArrowUpRight className="w-4 h-4 text-amber-500" />,
      onClick: () => setWithdrawModalOpen(true),
      variant: 'withdraw'
    }
  ];

  const managementNavItems: { tab: AppTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      tab: 'notifications',
      label: t('nav.notifications', 'SMS & Alerts'),
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined
    },
    { tab: 'security', label: t('nav.securityCenter', 'Security & 2FA'), icon: <Shield className="w-4 h-4" /> },
    { tab: 'profile', label: t('nav.profile', 'Account Profile'), icon: <User className="w-4 h-4" /> },
    { tab: 'support', label: t('nav.support', 'Client Support'), icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <aside
      id="growvest-desktop-sidebar"
      className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 border-r border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c0c10]/95 backdrop-blur-2xl p-4 space-y-5 select-none transition-colors"
    >
      {/* Portfolio Balance Mini Card (when authenticated) */}
      {isAuthenticated && wallet && (
        <div
          id="sidebar-balance-card"
          className="p-4 rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-[#121216] dark:via-[#16161b] dark:to-[#1c1c22] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium tracking-wide">Total Value</span>
            <span className="font-mono text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(wallet.totalValueUsd, currentCurrency)}
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Available</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {formatCurrency(wallet.availableBalanceUsd, currentCurrency)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Invested</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {formatCurrency(wallet.investedBalanceUsd, currentCurrency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Deposit / Withdraw Buttons */}
      <div id="sidebar-quick-actions" className="grid grid-cols-2 gap-2">
        {financialActions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Primary Financial Workspace Navigation */}
      <div id="sidebar-workspace-nav" className="space-y-1">
        <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-1.5">
          Workspace
        </div>
        {mainNavItems.map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              id={`sidebar-link-${item.tab}`}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Administration & Compliance Section */}
      <div className="space-y-1">
        <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-1.5 flex items-center justify-between">
          <span>Account & Security</span>
        </div>
        {managementNavItems.map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              id={`sidebar-link-${item.tab}`}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white dark:text-slate-950 font-mono text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Mini Profile Card at Bottom */}
      {isAuthenticated && user && (
        <div
          onClick={() => setActiveTab('profile')}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:border-emerald-500/40 transition-all"
        >
          <UserAvatar user={user} size="sm" showStatus />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
              {user.email}
            </div>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            {user.role}
          </span>
        </div>
      )}

      {/* Theme Switcher in Sidebar */}
      <div className="space-y-1.5">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </button>

        <button
          id="btn-sidebar-take-tour"
          onClick={() => startTour(0)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer shadow-xs active:scale-98"
        >
          <div className="flex items-center gap-2.5">
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Platform Tour</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            Guide
          </span>
        </button>
      </div>

      {/* Compliance / Security Badge */}
      <div className="mt-auto pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Lock className="w-3 h-3 text-emerald-500" /> AES-256 / SOC2
          </span>
          <span className="text-emerald-600 dark:text-emerald-400">Systems 100%</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Growvest Fintech Architecture. Regulated standard compliance.
        </p>
      </div>
    </aside>
  );
};
