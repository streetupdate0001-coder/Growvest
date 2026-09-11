import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Initializing Secure Financial Enclave...' }) => {
  return (
    <div
      id="growvest-loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 transition-colors"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Brand Mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-900 p-0.5 shadow-2xl shadow-emerald-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,#10b981_360deg)] opacity-40"
              />
              <div className="relative flex items-center justify-center">
                <span className="text-3xl font-black tracking-tighter text-emerald-400 font-sans">G</span>
                <span className="text-2xl font-light tracking-tighter text-slate-100 font-sans">Z</span>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-2 bg-emerald-500/20 rounded-3xl -z-10 blur-md"
          />
        </motion.div>

        {/* Brand Text */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-1.5 mb-8"
        >
          <h1 className="text-2xl font-bold tracking-widest text-slate-50 font-mono">GROWVEST</h1>
          <p className="text-xs uppercase tracking-widest text-emerald-400/90 font-medium">
            Global Digital Asset Architecture
          </p>
        </motion.div>

        {/* Progress Bar & Indicators */}
        <div className="w-64 space-y-3">
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="h-full w-1/2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 / EAL6+</span>
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Live Node Sync</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 font-sans tracking-wide pt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};
