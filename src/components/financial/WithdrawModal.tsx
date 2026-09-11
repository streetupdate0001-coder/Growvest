import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Lock,
  Key,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';

export const WithdrawModal: React.FC = () => {
  const { withdrawModalOpen, setWithdrawModalOpen, currentCurrency, addNotification } = useApp();
  const { wallet, withdraw } = useAuth();

  const [asset, setAsset] = useState<'USD' | 'USDT' | 'BTC' | 'ETH'>('USDT');
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successConfirmed, setSuccessConfirmed] = useState(false);

  if (!withdrawModalOpen) return null;

  const availableBalance = wallet?.availableBalanceUsd || 0;
  const numAmount = parseFloat(amount) || 0;
  const networkFee = asset === 'USD' ? 0 : 2.5; // Transparent network gas
  const netSettlement = Math.max(0, numAmount - networkFee);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numAmount <= 0) {
      setErrorMessage('Please specify a valid withdrawal amount.');
      return;
    }
    if (numAmount > availableBalance) {
      setErrorMessage(`Insufficient available funds. Available: ${formatCurrency(availableBalance, currentCurrency)}`);
      return;
    }
    if (!destinationAddress) {
      setErrorMessage('Please enter destination address or IBAN.');
      return;
    }
    if (twoFactorCode.length < 6) {
      setErrorMessage('Please enter a valid 6-digit 2FA security code.');
      return;
    }

    setIsSubmitting(true);
    const res = await withdraw(numAmount, asset, destinationAddress, twoFactorCode);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessConfirmed(true);
      addNotification({
        type: 'transaction',
        title: `Withdrawal Authorized: ${numAmount} ${asset}`,
        message: `Payout of ${formatCurrency(numAmount, currentCurrency)} to ${destinationAddress.slice(0, 8)}... is in transit.`,
        linkTab: 'activity'
      });
      setTimeout(() => {
        setSuccessConfirmed(false);
        setWithdrawModalOpen(false);
      }, 2200);
    } else {
      setErrorMessage(res.error || 'Withdrawal authorization failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setWithdrawModalOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 my-8 transition-colors"
      >
        <button
          onClick={() => setWithdrawModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Withdraw Assets</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Institutional settlement with 2FA authorization</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successConfirmed ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Withdrawal Request Dispatched</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
              Your request for {amount} {asset} has been queued for blockchain / clearing network broadcast.
            </p>
          </div>
        ) : (
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            {/* Available Balance Header */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Available for Withdrawal</span>
                <span className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(availableBalance, currentCurrency)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAmount(availableBalance.toString())}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold cursor-pointer transition-colors"
              >
                Max Available
              </button>
            </div>

            {/* Asset Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Withdrawal Currency</label>
              <div className="grid grid-cols-4 gap-2">
                {(['USDT', 'USDC', 'BTC', 'USD'] as const).map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAsset(a as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      asset === a
                        ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  max={availableBalance}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm focus:border-emerald-500"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-mono font-bold text-slate-400">
                  {asset}
                </span>
              </div>
            </div>

            {/* Destination Address / IBAN */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Destination {asset === 'USD' ? 'IBAN / Account Number' : 'Wallet Address'}
              </label>
              <input
                type="text"
                value={destinationAddress}
                onChange={e => setDestinationAddress(e.target.value)}
                placeholder={asset === 'USD' ? 'CH93 0000 0000 0000 0000 0' : '0x... or bc1q... or TJb...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:border-emerald-500"
                required
              />
            </div>

            {/* 2FA Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  Two-Factor Security Code (2FA)
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Authenticator App</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={e => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center font-mono text-base tracking-widest text-emerald-600 dark:text-emerald-400 focus:border-emerald-500"
                required
              />
            </div>

            {/* Breakdown */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs space-y-1.5 transition-colors">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Withdrawal Fee</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Network Gas</span>
                <span className="font-mono">${networkFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-800 dark:text-slate-200 font-semibold border-t border-slate-200 dark:border-slate-800/80 pt-1.5">
                <span>Net Estimated Payout</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {netSettlement.toFixed(2)} {asset}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing Dual-Key Withdrawal...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign & Execute Withdrawal</span>
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
