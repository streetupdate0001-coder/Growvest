import React, { useState, useMemo } from 'react';
import {
  Activity,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  X,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Transaction, TransactionStatus, TransactionType } from '../../types';
import { formatCurrency } from '../../services/currency';
import { SortableHeader, SortDirection } from '../common/SortableHeader';

type AdminTxSortField = 'timestamp' | 'reference' | 'userName' | 'type' | 'amountUsd' | 'status';

export const AdminTransactionsTab: React.FC = () => {
  const {
    transactions,
    allUsers,
    adminEditTransaction,
    adminDeleteTransaction,
    adminAddUserTransaction
  } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Sorting state
  const [sortField, setSortField] = useState<AdminTxSortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: string) => {
    const target = field as AdminTxSortField;
    if (sortField === target) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(target);
      setSortDirection(target === 'amountUsd' || target === 'timestamp' ? 'desc' : 'asc');
    }
  };

  // Edit Modal
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editCurrency, setEditCurrency] = useState<string>('USD');
  const [editAmountUsd, setEditAmountUsd] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<TransactionStatus>('completed');
  const [editType, setEditType] = useState<TransactionType>('deposit');
  const [editTimestamp, setEditTimestamp] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // New Transaction Modal
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [newUserId, setNewUserId] = useState<string>(allUsers[0]?.id || '');
  const [newAmount, setNewAmount] = useState<number>(1000);
  const [newCurrency, setNewCurrency] = useState<string>('USD');
  const [newType, setNewType] = useState<TransactionType>('deposit');
  const [newStatus, setNewStatus] = useState<TransactionStatus>('completed');
  const [newDestination, setNewDestination] = useState<string>('Main Account Ledger');
  const [newMethod, setNewMethod] = useState<string>('Admin Manual Settlement');
  const [newNotes, setNewNotes] = useState<string>('Manual liquidity allocation verified by Treasury');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter(t => {
      const matchesSearch =
        t.reference.toLowerCase().includes(search.toLowerCase()) ||
        (t.userName && t.userName.toLowerCase().includes(search.toLowerCase())) ||
        (t.userEmail && t.userEmail.toLowerCase().includes(search.toLowerCase())) ||
        t.currency.toLowerCase().includes(search.toLowerCase()) ||
        (t.destinationOrSource && t.destinationOrSource.toLowerCase().includes(search.toLowerCase())) ||
        (t.method && t.method.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesType = typeFilter === 'all' || t.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
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
        case 'userName': {
          const nameA = (a.userName || a.userEmail || '').toLowerCase();
          const nameB = (b.userName || b.userEmail || '').toLowerCase();
          comparison = nameA.localeCompare(nameB);
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
  }, [transactions, search, statusFilter, typeFilter, sortField, sortDirection]);

  const handleOpenEdit = (t: Transaction) => {
    setEditingTx(t);
    setEditAmount(t.amount);
    setEditCurrency(t.currency);
    setEditAmountUsd(t.amountUsd);
    setEditStatus(t.status);
    setEditType(t.type);
    setEditTimestamp(t.timestamp ? new Date(t.timestamp).toISOString().slice(0, 16) : '');
    setEditNotes(t.notes || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    setIsSubmittingEdit(true);
    await adminEditTransaction(editingTx.id, {
      amount: Number(editAmount),
      currency: editCurrency.toUpperCase(),
      amountUsd: Number(editAmountUsd || editAmount),
      status: editStatus,
      type: editType,
      timestamp: editTimestamp ? new Date(editTimestamp).toISOString() : new Date().toISOString(),
      notes: editNotes
    });
    setIsSubmittingEdit(false);
    setEditingTx(null);
  };

  const handleDelete = async (txId: string) => {
    if (window.confirm(`Are you sure you want to permanently delete transaction #${txId}? This will remove it from ledger history.`)) {
      await adminDeleteTransaction(txId);
    }
  };

  const handleCreateNewTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId) return;

    setIsSubmittingNew(true);
    const targetUser = allUsers.find(u => u.id === newUserId);
    await adminAddUserTransaction(newUserId, {
      userId: newUserId,
      userEmail: targetUser?.email || '',
      userName: targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'Customer',
      type: newType,
      amount: Number(newAmount),
      currency: newCurrency.toUpperCase(),
      amountUsd: Number(newAmount),
      status: newStatus,
      timestamp: new Date().toISOString(),
      reference: `TX-${Date.now().toString(36).toUpperCase()}`,
      destinationOrSource: newDestination,
      method: newMethod,
      feeUsd: 0,
      notes: newNotes
    });
    setIsSubmittingNew(false);
    setIsNewTxModalOpen(false);
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'pending':
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'rejected':
      case 'failed':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Transactions & Ledger Editor
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {transactions.length} Total Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, modify amounts, adjust status, add manual transactions, or remove erroneous entries.
          </p>
        </div>

        <button
          onClick={() => {
            setNewUserId(allUsers[0]?.id || '');
            setIsNewTxModalOpen(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add / Inject Transaction</span>
        </button>
      </div>

      {/* Filters, Search & Sort Control Bar */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ref, user, or email..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:border-emerald-500 focus:outline-none font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:border-emerald-500 focus:outline-none font-medium"
            >
              <option value="all">All Transaction Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="investment">Investments</option>
              <option value="yield">Yield / Profit</option>
              <option value="fee">Fees / Adjustments</option>
            </select>
          </div>
        </div>

        {/* Active Sorting Status & Quick Sort Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-0.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredAndSortedTransactions.length}</span> of {transactions.length} entries
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              Sorted by <span className="font-bold capitalize">{sortField}</span> ({sortDirection === 'asc' ? 'Ascending ↑' : 'Descending ↓'})
            </span>
          </div>

          {(sortField !== 'timestamp' || sortDirection !== 'desc') && (
            <button
              onClick={() => {
                setSortField('timestamp');
                setSortDirection('desc');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sort</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Card List View (Visible on Small / Mobile Screens) */}
      <div className="block md:hidden space-y-3">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No transactions match the selected filters.
          </div>
        ) : (
          filteredAndSortedTransactions.map((tx) => {
            const isPositive = tx.type === 'deposit' || tx.type === 'yield';
            return (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isPositive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {isPositive ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                        {tx.reference}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-mono font-bold text-sm ${
                      isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isPositive ? '+' : '-'}${tx.amountUsd.toFixed(2)} USD
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {tx.amount} {tx.currency}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Client</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{tx.userName || 'Account'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Type & Rail</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{tx.type} • {tx.method || tx.destinationOrSource}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>{getStatusBadge(tx.status)}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(tx)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Records Sortable Table (Desktop Screen) */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-xl transition-colors">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <SortableHeader
                label="Tx Reference / Date"
                field="timestamp"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={handleSort}
                align="left"
              />
              <SortableHeader
                label="Customer Account"
                field="userName"
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
                label="Amount (USD)"
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {filteredAndSortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  No transactions match the selected filters.
                </td>
              </tr>
            ) : (
              filteredAndSortedTransactions.map((tx) => {
                const isPositive = tx.type === 'deposit' || tx.type === 'yield';
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {tx.reference}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {tx.userName || 'Account'}
                      </div>
                      {tx.userEmail && (
                        <div className="text-[11px] text-slate-500 font-mono">{tx.userEmail}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                          isPositive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {isPositive ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            {tx.type}
                          </span>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                            {tx.method || tx.destinationOrSource}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {isPositive ? '+' : '-'}${tx.amountUsd.toFixed(2)} USD
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {tx.amount} {tx.currency}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(tx.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setEditingTx(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 my-8">
            <button
              onClick={() => setEditingTx(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Edit Transaction #{editingTx.reference}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  User: {editingTx.userName || editingTx.userEmail}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editAmount}
                    onChange={e => {
                      setEditAmount(Number(e.target.value));
                      setEditAmountUsd(Number(e.target.value));
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    required
                    value={editCurrency}
                    onChange={e => setEditCurrency(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono uppercase font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value as TransactionType)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="investment">Investment</option>
                    <option value="yield">Yield / Profit</option>
                    <option value="fee">Fee / Debit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as TransactionStatus)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="rejected">Rejected</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Timestamp Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={editTimestamp}
                  onChange={e => setEditTimestamp(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Notes / Reason
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {isSubmittingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Injected Transaction Modal */}
      {isNewTxModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsNewTxModalOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 my-8">
            <button
              onClick={() => setIsNewTxModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Inject Manual Transaction
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add ledger entry for customer wallet balance.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateNewTx} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target User Account *
                </label>
                <select
                  value={newUserId}
                  onChange={e => setNewUserId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.email}) - {u.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min={1}
                    value={newAmount}
                    onChange={e => setNewAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={newCurrency}
                    onChange={e => setNewCurrency(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono uppercase font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as TransactionType)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="deposit">Deposit (Credit Balance)</option>
                    <option value="yield">Yield / Profit Bonus</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="investment">Plan Investment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as TransactionStatus)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="completed">Completed (Immediate Credit)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Settlement Method / Rail
                </label>
                <input
                  type="text"
                  value={newMethod}
                  onChange={e => setNewMethod(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Audit Notes / Description
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTxModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {isSubmittingNew && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Inject Transaction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
