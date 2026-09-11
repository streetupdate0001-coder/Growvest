import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCircle2,
  Shield,
  History,
  Trash2,
  Check,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Plus,
  Sparkles,
  Info,
  ArrowRight,
  HandMetal,
  Smartphone,
  Eye,
  Mail,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification, NotificationType } from '../../types';
import { SwipeableNotificationItem } from '../notifications/SwipeableNotificationItem';

type FilterCategory = 'all' | 'unread' | 'security' | 'transaction' | 'verification' | 'system';

interface DismissedNotificationTracker {
  notification: AppNotification;
  index: number;
  timerId: any;
}

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    toggleNotificationRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    restoreNotification,
    resetDemoNotifications,
    addNotification,
    setActiveTab,
    unreadNotificationCount,
    t
  } = useApp();

  const [filter, setFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGestureGuide, setShowGestureGuide] = useState(() => {
    return localStorage.getItem('greeneza_gesture_guide_dismissed') !== 'true';
  });

  // Undo dismiss state
  const [dismissedItem, setDismissedItem] = useState<DismissedNotificationTracker | null>(null);
  const [undoProgress, setUndoProgress] = useState(100);

  // Handle dismiss with 5-second undo grace period
  const handleDismiss = (id: string) => {
    const itemIndex = notifications.findIndex(n => n.id === id);
    const item = notifications[itemIndex];
    if (!item) return;

    // Clear existing timer if any
    if (dismissedItem?.timerId) {
      clearTimeout(dismissedItem.timerId);
    }

    // Delete item from list
    deleteNotification(id);

    // Setup 5-second countdown timer for undo
    const duration = 5000;
    const intervalTime = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
      setUndoProgress(remainingPct);
      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, intervalTime);

    const timerId = setTimeout(() => {
      setDismissedItem(null);
      clearInterval(interval);
    }, duration);

    setUndoProgress(100);
    setDismissedItem({
      notification: item,
      index: itemIndex,
      timerId
    });
  };

  const handleUndo = () => {
    if (!dismissedItem) return;
    clearTimeout(dismissedItem.timerId);
    restoreNotification(dismissedItem.notification, dismissedItem.index);
    setDismissedItem(null);
  };

  const dismissGestureGuide = () => {
    setShowGestureGuide(false);
    localStorage.setItem('greeneza_gesture_guide_dismissed', 'true');
  };

  // Quick helper to spawn sample banking telemetry notifications
  const handleSpawnSampleNotification = () => {
    const samples: Array<Omit<AppNotification, 'id' | 'timestamp' | 'read'>> = [
      {
        type: 'transaction',
        title: 'Institutional Settlement Executed',
        message: 'Direct SEPA Instant credit of +25,000.00 EUR from Zurich Kantonalbank confirmed.',
        linkTab: 'activity'
      },
      {
        type: 'security',
        title: 'New Hardware Key Enrolled',
        message: 'FIDO2 / WebAuthn security key (YubiKey 5C) registered for root account operations.',
        linkTab: 'security'
      },
      {
        type: 'market',
        title: 'Price Telemetry Alert: BTC +4.8%',
        message: 'Bitcoin exceeded target resistance tier with sustained institutional liquidity.',
        linkTab: 'markets'
      },
      {
        type: 'verification',
        title: 'Beneficiary Whitelist Cleared',
        message: 'Withdrawal destination Swiss Vault Alpha (CH93...) cleared compliance 24h cooldown.',
        linkTab: 'withdraw'
      }
    ];

    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    addNotification(randomSample);
  };

  // Filter and search logic
  const filteredNotifs = useMemo(() => {
    return notifications.filter(n => {
      // Category filter
      if (filter === 'unread' && n.read) return false;
      if (filter === 'security' && n.type !== 'security') return false;
      if (filter === 'transaction' && n.type !== 'transaction') return false;
      if (filter === 'verification' && n.type !== 'verification') return false;
      if (filter === 'system' && n.type !== 'system' && n.type !== 'market') return false;

      // Search text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesMsg = n.message.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg) return false;
      }

      return true;
    });
  }, [notifications, filter, searchQuery]);

  // Counts by category
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      security: notifications.filter(n => n.type === 'security').length,
      transaction: notifications.filter(n => n.type === 'transaction').length,
      verification: notifications.filter(n => n.type === 'verification').length,
      system: notifications.filter(n => n.type === 'system' || n.type === 'market').length
    };
  }, [notifications]);

  return (
    <div id="growvest-notifications-view" className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-xl transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              Institutional Notification Hub
            </h1>
            {unreadNotificationCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-white dark:text-slate-950">
                {unreadNotificationCount} NEW
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Real-time security telemetry, smart audit feeds, transaction settlements, and biometric alerts.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-spawn-test-alert"
            type="button"
            onClick={handleSpawnSampleNotification}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Create sample notification to test swipe gesture physics"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Simulate Alert</span>
          </button>

          {unreadNotificationCount > 0 && (
            <button
              id="btn-mark-all-read"
              type="button"
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              id="btn-clear-all-notifs"
              type="button"
              onClick={clearAllNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          {notifications.length === 0 && (
            <button
              id="btn-reset-demo-notifs"
              type="button"
              onClick={resetDemoNotifications}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Default Alerts</span>
            </button>
          )}
        </div>
      </div>

      {/* High-End Mobile Banking Gesture Affordance Banner */}
      <AnimatePresence>
        {showGestureGuide && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-slate-50 to-rose-500/10 dark:from-emerald-950/30 dark:via-slate-900/60 dark:to-rose-950/30 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                      Institutional Touch & Swipe Gestures Active
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                      HAPTIC PHYSICS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-rose-600 dark:text-rose-400">Swipe Left</strong> to instantly dismiss notifications with undo safety. <strong className="text-emerald-600 dark:text-emerald-400">Swipe Right</strong> to toggle read status.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={dismissGestureGuide}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter & Search Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notifications, transactions, security audits..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 self-end sm:self-center">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredNotifs.length}</strong> of {notifications.length} alerts
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {[
            { key: 'all', label: 'All Alerts', count: counts.all },
            { key: 'unread', label: 'Unread', count: counts.unread },
            { key: 'security', label: 'Security & 2FA', count: counts.security },
            { key: 'transaction', label: 'Transactions', count: counts.transaction },
            { key: 'verification', label: 'KYC / Compliance', count: counts.verification },
            { key: 'system', label: 'System & Market', count: counts.system }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key as FilterCategory)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                filter === tab.key
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filter === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Swipeable Notification Item List */}
      <div className="space-y-3 min-h-[300px]">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                No Notifications Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'No notifications match your active search criteria.'
                  : filter !== 'all'
                  ? `No alerts available in the '${filter}' category.`
                  : 'Your institutional alert stream is currently clear.'}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              {notifications.length === 0 ? (
                <button
                  type="button"
                  onClick={resetDemoNotifications}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Sample Alerts</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredNotifs.map(notification => (
              <SwipeableNotificationItem
                key={notification.id}
                notification={notification}
                onDismiss={handleDismiss}
                onToggleRead={toggleNotificationRead}
                onNavigate={tab => setActiveTab(tab as any)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Floating Institutional Undo Toast Banner */}
      <AnimatePresence>
        {dismissedItem && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md"
          >
            <div className="relative rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-700 shadow-2xl p-4 overflow-hidden backdrop-blur-md">
              {/* Countdown Progress Bar */}
              <div
                className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-75"
                style={{ width: `${undoProgress}%` }}
              />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-mono truncate">
                      Notification Dismissed
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {dismissedItem.notification.title}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUndo}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-mono font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>UNDO</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
