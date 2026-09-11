import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  ShieldCheck,
  Key,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { useAuth, ADMIN_CREDENTIALS } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';

interface AdminLoginViewProps {
  onBackToPublic?: () => void;
  onSuccess?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onBackToPublic,
  onSuccess
}) => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { setActiveTab, setPublicPage } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please provide administrative credentials.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      setActiveTab('admin');
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(res.error || 'Invalid administrative authorization key.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <button
          onClick={() => {
            if (onBackToPublic) {
              onBackToPublic();
            } else {
              setPublicPage('home');
              window.location.hash = '';
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 px-3 rounded-xl bg-slate-900 border border-slate-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Growvest Home</span>
        </button>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Lock className="w-3 h-3" />
          <span>FCA Secure Tier</span>
        </span>
      </div>

      {/* Main Admin Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Administrative Enclave
          </h1>
          <p className="text-xs text-slate-400">
            Growvest Institutional Management & Compliance Console
          </p>
        </div>

        {/* Quick Fill Credentials Banner */}
        <div className="p-3 bg-slate-950/80 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-2">
          <div className="text-left space-y-0.5">
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Master Admin Credentials</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              admin@growvest.com • Admin@Growvest2026!
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail(ADMIN_CREDENTIALS.email);
              setPassword(ADMIN_CREDENTIALS.password);
              setAdminPin('889900');
            }}
            className="px-2.5 py-1 text-[11px] font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shrink-0 shadow-sm"
          >
            Quick Fill
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Officer / Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="admin@growvest.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Master Access Passphrase
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono pr-10 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Hardware / Master Security PIN (Optional)
            </label>
            <input
              type="password"
              maxLength={8}
              value={adminPin}
              onChange={e => setAdminPin(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono tracking-widest focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="889900"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <span>Authorizing Enclave Session...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center">
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Authorized Personnel Only • Hardware Audited</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
