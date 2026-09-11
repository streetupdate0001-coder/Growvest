import React, { useState, useEffect } from 'react';
import {
  Sliders,
  X,
  Briefcase,
  Award,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Link as LinkIcon,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../types';
import {
  ACCOUNT_MANAGERS,
  CLIENT_TIERS,
  ALL_TRADING_PERMISSIONS
} from './CreateCustomerModal';

interface AssignCustomerModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const AssignCustomerModal: React.FC<AssignCustomerModalProps> = ({
  user,
  onClose,
  onSuccess
}) => {
  const { adminAssignCustomer, investmentPlans } = useAuth();

  const [assignedManager, setAssignedManager] = useState(ACCOUNT_MANAGERS[0]);
  const [assignedTier, setAssignedTier] = useState(CLIENT_TIERS[0]);
  const [assignedPlanId, setAssignedPlanId] = useState('');
  const [assignedTrader, setAssignedTrader] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const getDirectSignInUrl = () => {
    if (!user) return '';
    return `${window.location.origin}${window.location.pathname}#/login?email=${encodeURIComponent(user.email)}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getDirectSignInUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  useEffect(() => {
    if (user) {
      setAssignedManager(user.assignedAccountManager || ACCOUNT_MANAGERS[0]);
      setAssignedTier(user.assignedTier || CLIENT_TIERS[0]);
      setAssignedPlanId(user.assignedPlanId || '');
      setAssignedTrader(user.assignedTrader || '');
      setSelectedPermissions(
        user.tradingPermissions || ['Spot Trading', 'Yield Strategies', 'Algorithmic Bot Allocation']
      );
      setAdminNotes(user.adminNotes || '');
      setErrorMessage(null);
    }
  }, [user]);

  if (!user) return null;

  const togglePermission = (perm: string) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(prev => prev.filter(p => p !== perm));
    } else {
      setSelectedPermissions(prev => [...prev, perm]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMessage(null);

    const selectedPlan = investmentPlans.find(p => p.id === assignedPlanId);

    setIsSubmitting(true);
    const res = await adminAssignCustomer(user.id, {
      assignedAccountManager: assignedManager,
      assignedTier,
      assignedPlanId: selectedPlan?.id,
      assignedPlanTitle: selectedPlan?.title,
      assignedTrader: assignedTrader.trim() || undefined,
      tradingPermissions: selectedPermissions,
      adminNotes: adminNotes.trim() || undefined
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update customer assignment.');
    } else {
      onSuccess(
        `Assignment updated for ${user.firstName} ${user.lastName}! Assigned Advisor: ${assignedManager}, Tier: ${assignedTier}.`
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10 text-slate-900 dark:text-slate-100 my-6 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Assign Customer Advisory & Tier
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.firstName} {user.lastName} ({user.email})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
              <span>Assigned Wealth Advisor / Account Manager</span>
            </label>
            <select
              value={assignedManager}
              onChange={e => setAssignedManager(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
            >
              {ACCOUNT_MANAGERS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Client Tier Classification</span>
            </label>
            <select
              value={assignedTier}
              onChange={e => setAssignedTier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-amber-600 dark:text-amber-400 focus:border-emerald-500 focus:outline-none"
            >
              {CLIENT_TIERS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                <span>Assigned Strategy Plan</span>
              </label>
              <select
                value={assignedPlanId}
                onChange={e => setAssignedPlanId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
              >
                <option value="">None (Self-Directed)</option>
                {investmentPlans.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Desk Trader
              </label>
              <input
                type="text"
                value={assignedTrader}
                onChange={e => setAssignedTrader(e.target.value)}
                placeholder="e.g. Desk Alpha #4"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Assigned Trading Permissions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_TRADING_PERMISSIONS.map(perm => {
                const isSelected = selectedPermissions.includes(perm);
                return (
                  <button
                    type="button"
                    key={perm}
                    onClick={() => togglePermission(perm)}
                    className={`p-2 rounded-xl text-left text-xs font-semibold transition-all border flex items-center justify-between gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{perm}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Internal Compliance / Advisory Notes
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="Executive relationship notes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Direct Sign-In Link Box for Client */}
          <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-between gap-2 text-xs">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-mono text-indigo-600 dark:text-indigo-400 font-bold block">
                Direct Client Sign-In Link
              </span>
              <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px] truncate block max-w-xs">
                {getDirectSignInUrl()}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/20 cursor-pointer flex items-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
              <span>Save Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
