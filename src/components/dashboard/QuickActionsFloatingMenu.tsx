import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  Sparkles,
  TrendingUp,
  X,
  ChevronUp,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickActionsFloatingMenu: React.FC = () => {
  const {
    setDepositModalOpen,
    setWithdrawModalOpen,
    setTransferModalOpen,
    setActiveTab,
    setIsAiAssistantOpen
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div
      id="dashboard-quick-actions-floating-container"
      ref={menuRef}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-3 w-60 sm:w-64 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl p-2.5 space-y-1 text-slate-900 dark:text-slate-100"
          >
            <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Quick Actions
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Enclave
              </span>
            </div>

            {/* 1. Deposit Funds */}
            <button
              onClick={() => handleAction(() => setDepositModalOpen(true))}
              id="fab-action-deposit"
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  Deposit Funds
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Crypto vault & SEPA wire
                </div>
              </div>
            </button>

            {/* 2. Withdraw Capital */}
            <button
              onClick={() => handleAction(() => setWithdrawModalOpen(true))}
              id="fab-action-withdraw"
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-left transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  Withdraw Capital
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Fast cold-vault settlement
                </div>
              </div>
            </button>

            {/* 3. Instant Transfer */}
            <button
              onClick={() => handleAction(() => setTransferModalOpen(true))}
              id="fab-action-transfer"
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Send className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Transfer to User
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Instant internal transfer (0% fee)
                </div>
              </div>
            </button>

            {/* 4. Invest / Strategies */}
            <button
              onClick={() => handleAction(() => setActiveTab('invest'))}
              id="fab-action-invest"
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Algorithmic Portfolios
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Allocate capital for yield
                </div>
              </div>
            </button>

            {/* 5. AI Assistant */}
            <button
              onClick={() => handleAction(() => setIsAiAssistantOpen(true))}
              id="fab-action-ai-advisor"
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-left transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  AI Financial Advisor
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Ask questions & voice alerts
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <motion.button
        id="dashboard-floating-quick-actions-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold text-xs sm:text-sm shadow-2xl transition-all cursor-pointer border ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-300'
            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-emerald-400/40 shadow-emerald-500/25'
        }`}
        title="Quick Actions (Deposit, Withdraw, Transfer)"
      >
        <Zap className={`w-4 h-4 ${isOpen ? 'rotate-180' : 'animate-bounce'} transition-transform duration-300`} />
        <span>{isOpen ? 'Close' : 'Quick Actions'}</span>
        {isOpen ? (
          <X className="w-3.5 h-3.5 ml-0.5" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
        )}
      </motion.button>
    </div>
  );
};
