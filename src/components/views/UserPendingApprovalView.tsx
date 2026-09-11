import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  AlertCircle,
  LogOut,
  Headphones,
  RefreshCw,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const UserPendingApprovalView: React.FC = () => {
  const { user, logout, allUsers } = useAuth();
  const { setActiveTab } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  if (!user) return null;

  return (
    <div id="growvest-pending-approval-view" className="max-w-3xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Top Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center sm:text-left transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>AWAITING ADMIN APPROVAL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome, {user.firstName}! Your Account is Under Review
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Your registration has been received. In accordance with institutional regulatory standards, our compliance officer must approve your account profile before trading and dashboard features become active.
            </p>
          </div>
        </div>

        {/* Verification Progress Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>1. Registration</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Account created and identity recorded in secure enclave.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>2. Alerts Dispatched</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Welcoming alerts sent to your phone and email.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 animate-spin-slow" />
              <span>3. Officer Approval</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Compliance officer review in progress.
            </p>
          </div>
        </div>

        {/* Registered Contact & Verification Summary Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-left">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Registered Contact Details</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
              256-Bit SSL Encrypted
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Registered Phone (SMS Alert Sent)</div>
                <div className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user.phoneCountryCode} {user.phoneNumber || 'Not provided'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Registered Email (Welcome Email Sent)</div>
                <div className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              Country: <strong className="text-slate-700 dark:text-slate-300">{user.country || 'International'}</strong> • Account ID: <span className="font-mono text-slate-600 dark:text-slate-400">{user.id}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer min-h-[42px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Checking Approval Status...' : 'Check Approval Status'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setActiveTab('support')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer min-h-[42px]"
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-500" />
              <span>Contact Support</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 text-xs font-semibold transition-colors cursor-pointer min-h-[42px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Information Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Security Notice:</strong> GROWVEST maintains strict regulatory compliance. Once approved by an administrative compliance officer, you will receive an automatic confirmation alert via SMS and email, and your financial terminal will be fully activated.
        </p>
      </div>
    </div>
  );
};
