import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  QrCode,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CompanyDepositWallet } from '../../types';

export const AdminWalletsTab: React.FC = () => {
  const {
    companyDepositWallets,
    adminAddDepositWallet,
    adminUpdateDepositWallet,
    adminDeleteDepositWallet,
    adminToggleDepositWalletStatus
  } = useAuth();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<CompanyDepositWallet | null>(null);

  // Form states
  const [name, setName] = useState('USDT (TRC-20)');
  const [asset, setAsset] = useState('USDT');
  const [symbol, setSymbol] = useState('USDT');
  const [network, setNetwork] = useState('Tron (TRC-20)');
  const [address, setAddress] = useState('');
  const [minDepositUsd, setMinDepositUsd] = useState(50);
  const [processingTime, setProcessingTime] = useState('1-3 mins (12 network confirms)');
  const [feeDescription, setFeeDescription] = useState('$0.00 Platform Fee');
  const [instructions, setInstructions] = useState('Send only USDT via Tron (TRC-20) network to this cold storage address.');
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingWallet(null);
    setName('');
    setAsset('USDT');
    setSymbol('USDT');
    setNetwork('Tron (TRC-20)');
    setAddress('');
    setMinDepositUsd(50);
    setProcessingTime('1-3 mins (12 confirms)');
    setFeeDescription('$0.00 Platform Fee');
    setInstructions('Send only specified crypto token to this company receiving address.');
    setIsPopular(false);
    setIsActive(true);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w: CompanyDepositWallet) => {
    setEditingWallet(w);
    setName(w.name);
    setAsset(w.asset);
    setSymbol(w.symbol);
    setNetwork(w.network);
    setAddress(w.address);
    setMinDepositUsd(w.minDepositUsd);
    setProcessingTime(w.processingTime || '');
    setFeeDescription(w.feeDescription || '$0.00 Platform Fee');
    setInstructions(w.instructions || '');
    setIsPopular(!!w.isPopular);
    setIsActive(w.isActive);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !address.trim() || !asset.trim() || !network.trim()) {
      setErrorMsg('Please complete all required fields (Name, Asset, Network, Address).');
      return;
    }

    setIsSubmitting(true);

    if (editingWallet) {
      const res = await adminUpdateDepositWallet(editingWallet.id, {
        name,
        asset: asset.toUpperCase(),
        symbol: (symbol || asset).toUpperCase(),
        network,
        address: address.trim(),
        minDepositUsd: Number(minDepositUsd) || 10,
        processingTime,
        feeDescription,
        instructions,
        isPopular,
        isActive
      });
      setIsSubmitting(false);
      if (res.success) {
        setIsModalOpen(false);
      } else {
        setErrorMsg('Failed to update receiving wallet.');
      }
    } else {
      const res = await adminAddDepositWallet({
        name,
        asset: asset.toUpperCase(),
        symbol: (symbol || asset).toUpperCase(),
        network,
        address: address.trim(),
        minDepositUsd: Number(minDepositUsd) || 10,
        processingTime,
        feeDescription,
        instructions,
        isPopular,
        isActive
      });
      setIsSubmitting(false);
      if (res.success) {
        setIsModalOpen(false);
      } else {
        setErrorMsg('Failed to add receiving wallet.');
      }
    }
  };

  const handleDelete = async (id: string, wName: string) => {
    if (window.confirm(`Are you sure you want to delete the receiving address for "${wName}"? Customer deposits for this method will be disabled.`)) {
      await adminDeleteDepositWallet(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Company Deposit & Receiving Vaults
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {companyDepositWallets.filter(w => w.isActive).length} Active Vaults
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure destination crypto wallet addresses where user deposits and investment funds will be received.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Receiving Wallet</span>
        </button>
      </div>

      {/* Wallet Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companyDepositWallets.map((w) => (
          <div
            key={w.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              w.isActive
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/60 opacity-70'
            }`}
          >
            <div className="space-y-3">
              {/* Top Row: Name, Network & Active Toggle */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                    {w.symbol || w.asset}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{w.name}</span>
                      {w.isPopular && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          Popular
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{w.network}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => adminToggleDepositWalletStatus(w.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer border ${
                      w.isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {w.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Wallet Receiving Address Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Receiving Address:</span>
                  <span>Min: ${w.minDepositUsd} USD</span>
                </div>
                <div className="flex items-center justify-between gap-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold break-all select-all">
                  <span className="text-[11px]">{w.address}</span>
                  <button
                    onClick={() => handleCopy(w.id, w.address)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer"
                    title="Copy Address"
                  >
                    {copiedId === w.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Details & Instructions */}
              {w.instructions && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {w.instructions}
                </p>
              )}
            </div>

            {/* Bottom Controls: Edit & Delete */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
              <span className="text-[10px] font-mono text-slate-400">
                {w.processingTime || 'Instant Settlement'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(w)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(w.id, w.name)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Wallet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Wallet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {editingWallet ? 'Edit Company Receiving Wallet' : 'Add Company Receiving Wallet'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provide company wallet address where crypto deposits will be paid.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. USDT (Tron TRC-20)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asset Symbol *
                  </label>
                  <input
                    type="text"
                    required
                    value={asset}
                    onChange={e => {
                      setAsset(e.target.value);
                      setSymbol(e.target.value);
                    }}
                    placeholder="USDT, BTC, ETH, SOL"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono uppercase font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Network Protocol *
                  </label>
                  <input
                    type="text"
                    required
                    value={network}
                    onChange={e => setNetwork(e.target.value)}
                    placeholder="Tron (TRC-20), ERC-20, SegWit, Solana"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min Deposit (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={minDepositUsd}
                    onChange={e => setMinDepositUsd(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Receiving Wallet Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. TJb6GZeNaFiN7ech9XvYq8q9L2p5K3z1wR"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Processing Speed
                  </label>
                  <input
                    type="text"
                    value={processingTime}
                    onChange={e => setProcessingTime(e.target.value)}
                    placeholder="e.g. 1-3 mins (12 network confirms)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fee Note
                  </label>
                  <input
                    type="text"
                    value={feeDescription}
                    onChange={e => setFeeDescription(e.target.value)}
                    placeholder="e.g. $0.00 Platform Fee"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Deposit Instructions
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="e.g. Send only USDT via TRC-20 protocol. Cross-chain deposits cannot be recovered."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Active for Customers</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={e => setIsPopular(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Mark as "Popular"</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingWallet ? 'Save Changes' : 'Create Receiving Wallet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
