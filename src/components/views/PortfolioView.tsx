import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  TrendingUp,
  PieChart,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  RotateCcw,
  Fingerprint,
  Scan,
  Lock,
  Unlock,
  KeyRound,
  Shield,
  Wallet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';
import { SortableHeader, SortDirection } from '../common/SortableHeader';

type PortfolioSortField = 'symbol' | 'amount' | 'avgBuyPrice' | 'currentPrice' | 'valueUsd' | 'pnlPercent' | 'allocation';

export const PortfolioView: React.FC = () => {
  const { setDepositModalOpen, setWithdrawModalOpen, setActiveTab, currentCurrency } = useApp();
  const {
    wallet,
    isBiometricEnabled,
    isBiometricUnlocked,
    biometricMethod,
    openBiometricPrompt,
    lockBiometric
  } = useAuth();

  const [sortField, setSortField] = useState<PortfolioSortField>('valueUsd');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: string) => {
    const target = field as PortfolioSortField;
    if (sortField === target) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(target);
      setSortDirection(target === 'symbol' ? 'asc' : 'desc');
    }
  };

  const totalValue = wallet?.totalValueUsd ?? 0;
  const investedValue = wallet?.investedBalanceUsd ?? 0;
  const hasAssets = totalValue > 0 || investedValue > 0;

  const rawHoldings = useMemo(() => {
    if (!hasAssets) return [];
    
    // Proportional asset distribution based on actual total balance
    const btcVal = totalValue * 0.425;
    const ethVal = totalValue * 0.228;
    const usdtVal = totalValue * 0.245;
    const solVal = totalValue * 0.102;

    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: Number((btcVal / 97800).toFixed(4)),
        avgBuyPrice: 91200,
        currentPrice: 97800,
        valueUsd: btcVal,
        allocation: '42.5%',
        allocationNum: 42.5,
        pnlUsd: btcVal * 0.0723,
        pnlPercent: 7.23
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        amount: Number((ethVal / 2840).toFixed(4)),
        avgBuyPrice: 2650,
        currentPrice: 2840,
        valueUsd: ethVal,
        allocation: '22.8%',
        allocationNum: 22.8,
        pnlUsd: ethVal * 0.0717,
        pnlPercent: 7.17
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        amount: Number(usdtVal.toFixed(2)),
        avgBuyPrice: 1.0,
        currentPrice: 1.0,
        valueUsd: usdtVal,
        allocation: '24.5%',
        allocationNum: 24.5,
        pnlUsd: 0,
        pnlPercent: 0.0
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        amount: Number((solVal / 196.5).toFixed(4)),
        avgBuyPrice: 185,
        currentPrice: 196.5,
        valueUsd: solVal,
        allocation: '10.2%',
        allocationNum: 10.2,
        pnlUsd: solVal * 0.0621,
        pnlPercent: 6.21
      }
    ];
  }, [hasAssets, totalValue]);

  const holdings = useMemo(() => {
    return [...rawHoldings].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'avgBuyPrice':
          comparison = a.avgBuyPrice - b.avgBuyPrice;
          break;
        case 'currentPrice':
          comparison = a.currentPrice - b.currentPrice;
          break;
        case 'valueUsd':
          comparison = a.valueUsd - b.valueUsd;
          break;
        case 'pnlPercent':
          comparison = a.pnlPercent - b.pnlPercent;
          break;
        case 'allocation':
          comparison = a.allocationNum - b.allocationNum;
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [rawHoldings, sortField, sortDirection]);

  return (
    <div id="growvest-portfolio-view" className="space-y-6 text-white">
      {/* Portfolio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-2xl transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
              Institutional Asset Holdings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-200 border border-white/10">
              Segregated Vault
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time balance valuation across fiat reserves and digital custodian custody.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isBiometricEnabled && (
            <button
              id="portfolio-biometric-lock-toggle-btn"
              type="button"
              onClick={() => {
                if (isBiometricUnlocked) {
                  lockBiometric();
                } else {
                  openBiometricPrompt(undefined, 'Institutional Asset Holdings');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs border transition-colors cursor-pointer ${
                isBiometricUnlocked
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold'
              }`}
              title={isBiometricUnlocked ? 'Vault Unlocked. Click to re-lock.' : 'Vault Locked. Click to scan.'}
            >
              {biometricMethod === 'touch_id' ? <Fingerprint className="w-3.5 h-3.5" /> : <Scan className="w-3.5 h-3.5" />}
              <span>{isBiometricUnlocked ? 'Vault Unlocked' : 'Unlock Vault'}</span>
            </button>
          )}

          <button
            onClick={() => setDepositModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ff4d38] hover:bg-[#e03e2a] text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer active:scale-95"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Deposit Asset</span>
          </button>

          <button
            onClick={() => setWithdrawModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1c1c22] hover:bg-[#25252e] text-slate-200 font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Biometric Lock Wall (If enabled and locked) */}
      {isBiometricEnabled && !isBiometricUnlocked ? (
        <div
          id="portfolio-biometric-locked-wall"
          className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xl text-center space-y-6 flex flex-col items-center justify-center min-h-[380px]"
        >
          <div className="relative w-20 h-20 rounded-3xl bg-white/5 border border-white/10 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            {biometricMethod === 'touch_id' ? (
              <Fingerprint className="w-10 h-10 stroke-[1.8] animate-pulse text-emerald-400" />
            ) : (
              <Scan className="w-10 h-10 stroke-[1.8] animate-pulse text-emerald-400" />
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black text-white border-2 border-white/20 flex items-center justify-center">
              <Lock className="w-3 h-3 text-amber-400" />
            </div>
          </div>

          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              Institutional Vault Locked
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Biometric hardware authentication is enforced on this portfolio. Please verify your identity with {biometricMethod === 'touch_id' ? 'Touch ID' : 'Face ID'} to reveal active asset valuations and trade allocations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="portfolio-unlock-biometric-btn"
              type="button"
              onClick={() => openBiometricPrompt(undefined, 'Institutional Asset Holdings')}
              className="px-6 py-3 rounded-2xl bg-[#ff4d38] hover:bg-[#e03e2a] text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              {biometricMethod === 'touch_id' ? <Fingerprint className="w-4 h-4" /> : <Scan className="w-4 h-4" />}
              <span>Authenticate with {biometricMethod === 'touch_id' ? 'Touch ID' : 'Face ID'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className="px-4 py-3 rounded-2xl bg-[#1c1c22] hover:bg-[#25252e] text-slate-300 font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
            >
              Security Settings
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs space-y-2 transition-colors">
          <span className="text-xs text-slate-400">Total Portfolio Value</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(totalValue, currentCurrency)}
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% Fully Solvent
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs space-y-2 transition-colors">
          <span className="text-xs text-slate-400">Cumulative Unrealized PnL</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {hasAssets ? `+${formatCurrency(totalValue * 0.0525, currentCurrency)}` : formatCurrency(0, currentCurrency)}
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {hasAssets ? '+5.25% Weighted ROI' : '0.00% ROI'}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs space-y-2 transition-colors">
          <span className="text-xs text-slate-400">Institutional Strategy Model</span>
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>{hasAssets ? 'Active Multi-Asset Vault' : 'No Active Allocation'}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
              {hasAssets ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('invest')}
            className="text-xs text-emerald-400 hover:underline cursor-pointer font-medium"
          >
            {hasAssets ? 'Rebalance Model Allocations →' : 'Deploy Capital & Invest →'}
          </button>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-mono text-slate-400 text-[11px]">
            Sorted by <span className="font-bold text-white capitalize">{sortField}</span> ({sortDirection === 'asc' ? 'Ascending ↑' : 'Descending ↓'})
          </span>
          {(sortField !== 'valueUsd' || sortDirection !== 'desc') && (
            <button
              onClick={() => {
                setSortField('valueUsd');
                setSortDirection('desc');
              }}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sort</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121216] shadow-xs dark:shadow-2xl transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <SortableHeader
                  label="Asset"
                  field="symbol"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="left"
                />
                <SortableHeader
                  label="Holdings"
                  field="amount"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label="Avg Entry"
                  field="avgBuyPrice"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label="Mark Price"
                  field="currentPrice"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={`Value (${currentCurrency})`}
                  field="valueUsd"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label="Unrealized PnL"
                  field="pnlPercent"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label="Allocation"
                  field="allocation"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center border border-white/10">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">No Asset Positions Yet</div>
                        <div className="text-xs text-slate-400 max-w-sm">
                          Your account ledger is newly provisioned. Deposit funds or subscribe to an investment strategy to begin building your portfolio.
                        </div>
                      </div>
                      <button
                        onClick={() => setDepositModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#ff4d38] hover:bg-[#e03e2a] text-white font-bold text-xs shadow-md cursor-pointer"
                      >
                        Make First Deposit
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                holdings.map(h => {
                  const isPos = h.pnlPercent >= 0;
                  return (
                    <tr key={h.symbol} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center font-mono font-bold text-xs border border-white/10">
                            {h.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{h.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono uppercase">{h.symbol}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 dark:text-white">
                        {h.amount} {h.symbol}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                        {formatCurrency(h.avgBuyPrice, currentCurrency)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(h.currentPrice, currentCurrency)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(h.valueUsd, currentCurrency)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className={`font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPos ? '+' : ''}
                          {formatCurrency(h.pnlUsd, currentCurrency)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isPos ? '+' : ''}
                          {h.pnlPercent}%
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                        {h.allocation}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
