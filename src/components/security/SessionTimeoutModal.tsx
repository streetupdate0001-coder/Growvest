import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Clock,
  LogOut,
  RefreshCw,
  Lock,
  Globe,
  AlertTriangle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onExtend: () => void;
  onLogout: () => void;
  remainingSeconds: number;
  totalWarningSeconds?: number;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  onExtend,
  onLogout,
  remainingSeconds,
  totalWarningSeconds = 60
}) => {
  const { user, sessions } = useAuth();
  const { currentCurrency } = useApp();

  if (!isOpen) return null;

  const currentSession = sessions.find(s => s.isCurrent) || sessions[0];
  const progressPercent = Math.max(0, Math.min(100, (remainingSeconds / totalWarningSeconds) * 100));

  // Determine urgency color
  const isUrgent = remainingSeconds <= 15;

  return (
    <AnimatePresence>
      <div
        id="growvest-session-timeout-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
      >
        <motion.div
          id="growvest-session-timeout-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 md:p-7 shadow-2xl space-y-6 relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors"
        >
          {/* Subtle Top Glowing Indicator */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300 ${
              isUrgent ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
            }`}
          />

          {/* Icon and Header */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                isUrgent
                  ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
              }`}
            >
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  Security Safeguard
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">FINTECH SOC-2</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                Session Inactivity Warning
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Your GROWVEST authenticated session has been idle. To protect your segregated institutional vault balances and confidential transactions, inactive sessions are automatically locked.
          </p>

          {/* Countdown Display Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-500 dark:text-rose-400 animate-pulse' : 'text-amber-500 dark:text-amber-400'}`} />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Automatic Logout In:</span>
              </div>
              <span
                className={`text-base font-bold font-mono ${
                  isUrgent ? 'text-rose-500 dark:text-rose-400 animate-pulse' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                00:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}s
              </span>
            </div>

            {/* Visual Progress Countdown Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  isUrgent ? 'bg-rose-500' : 'bg-amber-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Session Telemetry snapshot */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 truncate">
                <Globe className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate">{currentSession?.ip || '194.209.14.88 (Zurich)'}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Lock className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="text-emerald-600 dark:text-emerald-400">TLS 1.3 256-Bit</span>
              </div>
            </div>
          </div>

          {/* Account Context */}
          {user && (
            <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="truncate">
                <span className="text-slate-400 dark:text-slate-500">Authenticated: </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{user.email}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              id="growvest-extend-session-btn"
              type="button"
              onClick={onExtend}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Extend Active Session</span>
            </button>
            <button
              id="growvest-logout-now-btn"
              type="button"
              onClick={onLogout}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:border-rose-500/30 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
