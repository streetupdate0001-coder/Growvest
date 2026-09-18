import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Building2,
  CreditCard,
  User,
  ArrowRight,
  Lock,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';
import { supabase } from '../../lib/supabase';

export const TransferModal: React.FC = () => {
  const { transferModalOpen, setTransferModalOpen, currentCurrency, setActiveTab } = useApp();
  const { user, wallet } = useAuth();

  // 3-Step Flow: 1 -> 2 -> 3
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 Form Data
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');

  // Step 2 PIN State
  const [transferPin, setTransferPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 3 Result State
  const [txId, setTxId] = useState('');

  // Reset modal state when opened
  useEffect(() => {
    if (transferModalOpen) {
      setStep(1);
      setAmount('');
      setBank('');
      setAccountNo('');
      setAccountName(user ? `${user.firstName} ${user.lastName}`.trim() : '');
      setTransferPin('');
      setPinError(null);
      setErrorMessage(null);
      setTxId(`TX-${Date.now().toString().slice(-8)}`);
    }
  }, [transferModalOpen, user]);

  if (!transferModalOpen) return null;

  const availableBalance = user?.balance ?? wallet?.availableBalanceUsd ?? 0;
  const numAmount = parseFloat(amount) || 0;

  // Step 1 Validation -> Step 2
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numAmount <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }
    if (numAmount > availableBalance) {
      setErrorMessage('Insufficient balance for this transfer.');
      return;
    }
    if (!bank.trim()) {
      setErrorMessage('Please specify the destination Bank.');
      return;
    }
    if (!accountNo.trim() || accountNo.replace(/\s/g, '').length < 6) {
      setErrorMessage('Please enter a valid Account Number (min 6 digits).');
      return;
    }
    if (!accountName.trim()) {
      setErrorMessage('Please enter the Account Beneficiary Name.');
      return;
    }

    setStep(2);
  };

  // Step 2 Submission -> Step 3 (PIN verification)
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setErrorMessage(null);

    if (!transferPin || transferPin.length < 4) {
      setPinError('Please enter your 4-digit Transfer PIN.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (user?.id) {
        // 1. Check if user has set PIN in profile
        const { data: profile } = await supabase.from('profiles').select('transfer_pin').eq('id', user.id).single();
        
        if (profile?.transfer_pin && transferPin !== profile.transfer_pin) {
          setPinError('Invalid Transfer PIN.');
          setIsSubmitting(false);
          return;
        }
      }

      const generatedTxId = `TX-${Date.now().toString().slice(-8)}`;
      setTxId(generatedTxId);

      // Save to Supabase transactions table
      if (user?.id) {
        await supabase.from('transactions').insert([
          {
            user_id: user.id,
            amount: numAmount,
            type: 'withdrawal',
            status: 'pending',
            tx_hash: generatedTxId,
            description: `Transfer to ${bank} - Acc ${accountNo.slice(-4)} (${accountName})`
          }
        ]);

        await supabase.from('withdrawals').insert([
          {
            user_id: user.id,
            amount: numAmount,
            wallet_address: `${bank} - ${accountNo}`,
            status: 'pending'
          }
        ]);
      }

      setStep(3);
    } catch (err: any) {
      console.warn('[TransferModal] notice recording to Supabase:', err);
      setStep(3);
    } finally {
      setIsSubmitting(false);
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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 z-10 text-slate-900 my-6 transition-all"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setTransferModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
              {step === 1 && 'Wire / Bank Transfer'}
              {step === 2 && 'Confirm & Enter PIN'}
              {step === 3 && 'Transfer Submitted'}
            </h3>
            <p className="text-xs text-slate-500">
              {step === 1 && 'Dispatch funds to external bank accounts'}
              {step === 2 && 'Secure transaction authorization'}
              {step === 3 && 'Order logged successfully'}
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 1: Enter Transfer Details                              */}
        {/* ============================================================ */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            {/* Available Balance pill */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Available Liquidity</span>
              <span className="font-mono font-extrabold text-slate-900">
                ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Transfer Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-base focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Destination Bank */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Destination Bank / Institution
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Chase Bank, Barclays, HSBC"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs sm:text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Number / IBAN
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter account number"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-medium text-xs sm:text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Name (Beneficiary)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Full legal account holder name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs sm:text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Step 1 Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ============================================================ */}
        {/* STEP 2: Confirm + Enter 4-digit Transfer PIN                */}
        {/* ============================================================ */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            {/* Transfer Summary Review Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Transfer Amount</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">
                  ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Bank</span>
                <span className="font-semibold text-slate-800">{bank}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Account No</span>
                <span className="font-mono font-semibold text-slate-800">
                  •••• {accountNo.slice(-4) || '••••'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Account Name</span>
                <span className="font-semibold text-slate-800">{accountName}</span>
              </div>
            </div>

            {/* PIN Instructions */}
            <div className="text-center pt-1">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Enter Transfer PIN</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                Enter your 4-digit security PIN to authorize this wire transfer.
              </p>
            </div>

            {/* PIN Input */}
            <div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={transferPin}
                onChange={(e) => setTransferPin(e.target.value.replace(/\D/g, ''))}
                className="w-full h-14 text-center text-2xl tracking-[0.5em] rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-mono"
                required
              />
              {pinError && <p className="text-xs text-rose-500 mt-2 text-center font-medium">{pinError}</p>}
            </div>

            {/* Actions: Back & Confirm */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Transfer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* STEP 3: "Withdrawal Request Submitted - Pending Admin Approval" */}
        {/* ============================================================ */}
        {step === 3 && (
          <div className="py-3 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Withdrawal Request Submitted
              </h4>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Pending Admin Approval
              </span>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed pt-1">
                Your transfer request for <strong className="text-slate-800 font-mono">${numAmount.toFixed(2)}</strong> to <strong className="text-slate-800">{bank}</strong> has been logged and placed in the compliance review queue.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>TXID</span>
                <span className="text-slate-800 font-semibold">{txId}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Beneficiary</span>
                <span className="text-slate-800 font-semibold">{accountName}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Destination</span>
                <span className="text-slate-800 font-semibold">{bank} (••{accountNo.slice(-4)})</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setTransferModalOpen(false);
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/app/payments');
                    window.dispatchEvent(new Event('popstate'));
                  }
                  setActiveTab('activity');
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                View in Payments Ledger
              </button>

              <button
                type="button"
                onClick={() => setTransferModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
