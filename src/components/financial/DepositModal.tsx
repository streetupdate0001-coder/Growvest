import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  ArrowDownLeft,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Building2,
  RefreshCw,
  Info,
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';

interface MethodOption {
  id: string;
  name: string;
  type: 'crypto' | 'fiat';
  asset: string;
  network?: string;
  address?: string;
  minDeposit: number;
  processingTime: string;
  fee: string;
}

export const DepositModal: React.FC = () => {
  const { depositModalOpen, setDepositModalOpen, currentCurrency, addNotification, t } = useApp();
  const { wallet, deposit, companyDepositWallets } = useAuth();

  const activeDepositMethods = companyDepositWallets.filter(w => w.isActive);
  const [selectedWalletId, setSelectedWalletId] = useState<string>(
    activeDepositMethods.length > 0 ? activeDepositMethods[0].id : 'wlt_usdt_trc20'
  );

  // Keep selected wallet synchronized if admin updates/adds wallets
  useEffect(() => {
    if (activeDepositMethods.length > 0 && !activeDepositMethods.some(w => w.id === selectedWalletId)) {
      setSelectedWalletId(activeDepositMethods[0].id);
    }
  }, [companyDepositWallets]);

  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successConfirmed, setSuccessConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Payment Screenshot & Proof State
  const [proofScreenshot, setProofScreenshot] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [proofFileSize, setProofFileSize] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedWallet = activeDepositMethods.find(w => w.id === selectedWalletId) || activeDepositMethods[0];

  if (!depositModalOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileProcess = (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setProofScreenshot(e.target?.result as string);
      setProofFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setProofFileSize(`${sizeMb} MB`);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveProof = () => {
    setProofScreenshot(null);
    setProofFileName(null);
    setProofFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSimulateDepositConfirm = async () => {
    setErrorMessage(null);
    if (!selectedWallet) {
      setErrorMessage('Please select a valid deposit method.');
      return;
    }
    const num = parseFloat(depositAmount);
    if (isNaN(num) || num < selectedWallet.minDepositUsd) {
      setErrorMessage(`Minimum deposit for ${selectedWallet.name} is $${selectedWallet.minDepositUsd}.`);
      return;
    }

    setIsSubmitting(true);
    const depositRef = txHash ? `TX-${txHash.substring(0, 10).toUpperCase()}` : undefined;
    const noteDetails = txHash ? `TxHash: ${txHash}` : 'Pending administrative verification & wire credit';

    const res = await deposit(
      num,
      selectedWallet.asset,
      selectedWallet.network,
      depositRef,
      proofScreenshot || undefined,
      noteDetails
    );
    setIsSubmitting(false);

    if (res.success) {
      setSuccessConfirmed(true);
      addNotification({
        type: 'transaction',
        title: `Deposit Submitted: ${num} ${selectedWallet.asset}`,
        message: `Inbound settlement of ${formatCurrency(num, currentCurrency)} via ${selectedWallet.network} with payment proof has been queued for verification.`,
        linkTab: 'activity'
      });
      setTimeout(() => {
        setSuccessConfirmed(false);
        handleRemoveProof();
        setTxHash('');
        setDepositModalOpen(false);
      }, 2500);
    } else {
      setErrorMessage(res.error || 'Deposit processing failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setDepositModalOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-blue-500/30 rounded-3xl shadow-2xl p-5 sm:p-6 z-10 text-slate-100 my-8 transition-colors max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={() => setDepositModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {t('deposit.title', 'Deposit Funds')}
            </h2>
            <p className="text-xs text-slate-400">
              {t('deposit.subtitle', 'Transfer funds to company crypto investment vaults')}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successConfirmed ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">
              {t('deposit.successTitle', 'Deposit Receipt & Proof Submitted')}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {t(
                'deposit.successDesc',
                'Your proof of payment and transaction reference have been recorded. Our financial desk will verify the ledger credit shortly.'
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Method Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('deposit.selectAsset', 'Select Deposit Asset / Rail')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {activeDepositMethods.map(w => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWalletId(w.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedWallet?.id === w.id
                        ? 'bg-blue-600/20 border-blue-500 text-white font-semibold ring-1 ring-blue-500/50 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{w.name}</span>
                      {w.isPopular && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{w.network}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedWallet && (
              <>
                {/* Deposit Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('deposit.amount', 'Deposit Amount')} ({selectedWallet.asset})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={selectedWallet.minDepositUsd}
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                      placeholder={`Min ${selectedWallet.minDepositUsd}`}
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-mono font-bold text-slate-400">
                      {selectedWallet.asset}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>Minimum: ${selectedWallet.minDepositUsd} USD</span>
                    <span className="text-blue-400 font-medium">
                      {selectedWallet.feeDescription || '$0.00 Platform Fee'}
                    </span>
                  </div>
                </div>

                {/* Crypto Company Receiving Address */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {t('deposit.address', 'Company Deposit Address')}:
                    </span>
                    <span className="text-blue-400 font-mono text-[10px] font-semibold">
                      Institutional Vault
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs text-slate-200 break-all shadow-xs">
                    <span className="text-[11px] select-all font-bold text-blue-400">
                      {selectedWallet.address}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedWallet.address)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0 cursor-pointer"
                      title={copied ? t('deposit.copied', 'Copied!') : t('deposit.copy', 'Copy Address')}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Upload Payment Screenshot Dropzone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    {t('deposit.proofTitle', 'Proof of Payment / Screenshot')}
                  </label>
                  <p className="text-[11px] text-slate-400">
                    {t(
                      'deposit.proofDesc',
                      'Upload your payment receipt, bank transfer slip, or blockchain transaction screenshot before confirmation.'
                    )}
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />

                  {proofScreenshot ? (
                    <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {proofScreenshot.startsWith('data:image') ? (
                          <img
                            src={proofScreenshot}
                            alt="Payment Proof Screenshot"
                            className="w-12 h-12 object-cover rounded-lg border border-blue-500/30 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {proofFileName || 'Payment Proof Screenshot'}
                          </p>
                          <p className="text-[10px] text-blue-400 font-mono">
                            {proofFileSize} • Ready for confirmation
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveProof}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors shrink-0 cursor-pointer"
                        title="Remove screenshot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-blue-500 bg-blue-950/20'
                          : 'border-slate-800 hover:border-blue-500/70 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                        <Upload className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-xs font-semibold text-slate-200">
                        {t('deposit.dropScreenshot', 'Drop payment screenshot here or click to browse')}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {t('deposit.supportedFormats', 'Supports PNG, JPG, JPEG, WEBP or PDF (Max 10MB)')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Optional TX Hash / Reference */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('deposit.txHash', 'Transaction Hash / Reference Code (Optional)')}
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={e => setTxHash(e.target.value)}
                    placeholder={t('deposit.txHashPlaceholder', 'e.g. 0x742d35... or Bank Wire Ref')}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <button
              onClick={handleSimulateDepositConfirm}
              disabled={isSubmitting || !selectedWallet}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('deposit.verifying', 'Recording Proof & Inbound Settlement...')}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('deposit.confirm', 'Confirm Inbound Settlement')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

