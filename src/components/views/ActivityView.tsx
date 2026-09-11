import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Download,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Compass,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  FileText,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../services/currency';
import { Transaction } from '../../types';
import { SortableHeader, SortDirection } from '../common/SortableHeader';

type ActivitySortField = 'timestamp' | 'reference' | 'type' | 'amountUsd' | 'status';

export const ActivityView: React.FC = () => {
  const { currentCurrency } = useApp();
  const { transactions } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdraw' | 'invest'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<ActivitySortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: string) => {
    const target = field as ActivitySortField;
    if (sortField === target) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(target);
      // Default to descending for numbers & dates, ascending for strings
      setSortDirection(target === 'amountUsd' || target === 'timestamp' ? 'desc' : 'asc');
    }
  };

  const copyRef = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter(tx => {
      const assetStr = tx.currency || tx.destinationOrSource || '';
      const matchesSearch =
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.reference && tx.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
        assetStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.method.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (typeFilter === 'deposit' && tx.type !== 'deposit') return false;
      if (typeFilter === 'withdraw' && tx.type !== 'withdrawal' && tx.type !== 'withdraw') return false;
      if (typeFilter === 'invest' && tx.type !== 'investment' && tx.type !== 'invest') return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'timestamp': {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          comparison = timeA - timeB;
          break;
        }
        case 'amountUsd':
          comparison = (a.amountUsd || 0) - (b.amountUsd || 0);
          break;
        case 'reference': {
          const refA = (a.reference || a.id || '').toLowerCase();
          const refB = (b.reference || b.id || '').toLowerCase();
          comparison = refA.localeCompare(refB);
          break;
        }
        case 'type': {
          const typeA = (a.type || '').toLowerCase();
          const typeB = (b.type || '').toLowerCase();
          comparison = typeA.localeCompare(typeB);
          break;
        }
        case 'status': {
          const statusA = (a.status || '').toLowerCase();
          const statusB = (b.status || '').toLowerCase();
          comparison = statusA.localeCompare(statusB);
          break;
        }
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [transactions, searchQuery, typeFilter, sortField, sortDirection]);

  const exportCsv = () => {
    const headers = ['Transaction ID', 'Reference', 'Type', 'Amount USD', 'Currency', 'Method', 'Status', 'Timestamp'];
    const rows = filteredAndSortedTransactions.map(t => [
      t.id,
      t.reference || t.id,
      t.type,
      t.amountUsd,
      t.currency || 'USD',
      t.method,
      t.status,
      t.timestamp
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GROWVEST_Ledger_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="growvest-activity-view" className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-2xl transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
              Audit Activity Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-200 border border-white/10">
              Immutable Cryptographic Log
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological audit trail of all inbound deposits, outbound payouts, and model allocations.
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c1c22] hover:bg-[#25252e] text-slate-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* Filter, Sort and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs transition-colors">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by TxID, asset (e.g. USDT, BTC) or network..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {(['all', 'deposit', 'withdraw', 'invest'] as const).map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3.5 py-1.5 rounded-full capitalize transition-colors cursor-pointer ${
                  typeFilter === f
                    ? 'bg-white/20 text-white font-bold border border-white/20'
                    : 'bg-slate-100 dark:bg-[#1c1c22] text-slate-600 dark:text-slate-400 hover:text-white border border-slate-200 dark:border-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {(sortField !== 'timestamp' || sortDirection !== 'desc') && (
            <button
              onClick={() => {
                setSortField('timestamp');
                setSortDirection('desc');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-mono text-slate-400 hover:text-white bg-slate-100 dark:bg-[#1c1c22] border border-white/10 transition-colors cursor-pointer"
              title="Reset sorting to latest first"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sort</span>
            </button>
          )}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121216] shadow-xs dark:shadow-2xl transition-colors">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <SortableHeader
                label="TxID / Timestamp"
                field="timestamp"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={handleSort}
                align="left"
              />
              <SortableHeader
                label="Type & Rail"
                field="type"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={handleSort}
                align="left"
              />
              <SortableHeader
                label={`Amount (${currentCurrency})`}
                field="amountUsd"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Status"
                field="status"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={handleSort}
                align="center"
              />
              <th className="py-3 px-4 text-right font-mono uppercase text-[10px] text-slate-500 dark:text-slate-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {filteredAndSortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  No activity found matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredAndSortedTransactions.map(tx => {
                const isDeposit = tx.type === 'deposit';
                const isWithdraw = tx.type === 'withdrawal' || tx.type === 'withdraw';
                const assetLabel = tx.currency || (tx.destinationOrSource?.split(' ')[0]) || 'USD';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">{tx.reference || tx.id}</span>
                        <button
                          onClick={() => copyRef(tx.reference || tx.id)}
                          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                          title="Copy Reference"
                        >
                          {copiedId === (tx.reference || tx.id) ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isDeposit
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : isWithdraw
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : isWithdraw ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <Compass className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                            {tx.type} • {assetLabel}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{tx.method || tx.destinationOrSource}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <div
                        className={`font-bold ${
                          isDeposit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {isDeposit ? '+' : '-'}
                        {formatCurrency(tx.amountUsd, currentCurrency)}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {tx.amountUsd.toFixed(2)} USD
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          tx.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {tx.status === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span className="capitalize">{tx.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono cursor-pointer transition-colors"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Institutional Ledger Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Reference:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Operation:</span>
                <span className="capitalize text-slate-800 dark:text-slate-200">{selectedTx.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Network Rail:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedTx.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Settled Value:</span>
                <span className="text-slate-900 dark:text-slate-100 font-bold">${selectedTx.amountUsd} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Platform Fee:</span>
                <span className="text-emerald-600 dark:text-emerald-400">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Timestamp:</span>
                <span className="text-slate-500 dark:text-slate-400">{new Date(selectedTx.timestamp).toUTCString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
                <span className="text-slate-500 dark:text-slate-400">Consensus Status:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% FINALITY</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
