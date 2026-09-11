import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Send,
  ShieldCheck,
  AlertCircle,
  Check,
  RefreshCw,
  User,
  DollarSign,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';

export const TransferModal: React.FC = () => {
  const { transferModalOpen, setTransferModalOpen, setDepositModalOpen, currentCurrency, addNotification } = useApp();
  const { user, wallet, transfer } = useAuth();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState<'USD' | 'USDT' | 'BTC' | 'ETH'>('USD');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successConfirmed, setSuccessConfirmed] = useState(false);

  if (!transferModalOpen) return null;

  const availableBalance = wallet?.availableBalanceUsd ?? user?.balance ?? 0;
  const numAmount = parseFloat(amount) || 0;

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanRecipient = recipient.trim();
    if (!cleanRecipient) {
      setErrorMessage('Please enter the recipient email address or GROWVEST User ID.');
      return;
    }
    if (user && cleanRecipient.toLowerCase() === user.email.toLowerCase()) {
      setErrorMessage('You cannot transfer funds to your own account.');
      return;
    }
    if (availableBalance <= 0) {
      setErrorMessage('Your available balance is $0.00. Funds must be credited by the administrator or deposited before you can initiate a transfer.');
      return;
    }
    if (numAmount <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }
    if (numAmount > availableBalance) {
      setErrorMessage(`Insufficient available funds. Available balance: ${formatCurrency(availableBalance, currentCurrency)}`);
      return;
    }

    setIsSubmitting(true);
    const res = await transfer(cleanRecipient, numAmount, asset, note);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessConfirmed(true);
      addNotification({
        type: 'transaction',
        title: `Internal Transfer Sent: ${formatCurrency(numAmount, currentCurrency)}`,
        message: `Successfully transferred ${formatCurrency(numAmount, currentCurrency)} to ${cleanRecipient}. Zero network fee applied.`,
        linkTab: 'activity'
      });
      setTimeout(() => {
        setSuccessConfirmed(false);
        setTransferModalOpen(false);
        setRecipient('');
        setAmount('');
        setNote('');
      }, 2000);
    } else {
      setErrorMessage(res.error || 'Transfer failed. Please check recipient credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setTransferModalOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 z-10 text-slate-900 dark:text-slate-100 my-4 sm:my-8 transition-colors"
      >
        <button
          onClick={() => setTransferModalOpen(false)}
          className="absolute right-4 top-4 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">Instant P2P Transfer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero-fee internal transfer to any GROWVEST investor account
            </p>
          </div>
        </div>

        {/* Success Confirmation State */}
        {successConfirmed ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Transfer Cleared</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatCurrency(numAmount, currentCurrency)} {asset} has been transferred to {recipient} with zero fee.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-mono text-emerald-500 font-semibold">
              Status: Instant Settlement Complete
            </div>
          </div>
        ) : (
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            {/* Zero Balance Notice */}
            {availableBalance <= 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-500 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Fresh Account Notice: Balance is $0.00</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  New accounts start fresh with no demo funds. Funds must be credited by the Administrator or deposited before initiating transfers.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTransferModalOpen(false);
                    setDepositModalOpen(true);
                  }}
                  className="w-full h-12 min-h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Deposit Funds to Start</span>
                </button>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Recipient Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recipient Email or Account ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="e.g. investor@growvest.com or client ID"
                  className="w-full px-4 py-3 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-4" />
              </div>
            </div>

            {/* Asset Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Transfer Asset / Currency
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['USD', 'USDT', 'BTC', 'ETH'] as const).map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAsset(a)}
                    className={`h-12 min-h-[48px] py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border flex items-center justify-center ${
                      asset === a
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Transfer Amount
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-mono">
                  Available: <strong className="text-emerald-500">{formatCurrency(availableBalance, currentCurrency)}</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-sm font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAmount(availableBalance.toString())}
                  className="absolute right-3 top-2.5 h-7 px-2.5 rounded-lg text-xs font-mono font-bold bg-slate-200 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer flex items-center"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Optional Memo / Reference Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Transfer Note / Memo (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Portfolio settlement, loan rebalance..."
                className="w-full px-4 py-3 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-xs"
              />
            </div>

            {/* Fee summary banner */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">Network Fee:</span>
              <span className="text-emerald-500 font-bold">$0.00 (Instant Zero-Fee Enclave)</span>
            </div>

            {/* Submit button - 48px height minimum */}
            <button
              type="submit"
              disabled={isSubmitting || numAmount <= 0}
              className="w-full h-12 min-h-[48px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Clearing Transfer...</span>
                </>
              ) : (
                <>
                  <span>Send {numAmount > 0 ? `${numAmount} ${asset}` : 'Funds'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Regulatory footnote */}
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Protected by 256-Bit Hardware Security Enclave</span>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
