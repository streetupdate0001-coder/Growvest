import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  History,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
  Search,
  ChevronRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Transaction, UserInvestmentPosition } from '../../types';
import { formatCurrency } from '../../services/currency';

interface InvestmentHistorySectionProps {
  transactions: Transaction[];
  userInvestments: UserInvestmentPosition[];
  currentCurrency: string;
  userId?: string;
  onExplorePlans?: () => void;
}

export const InvestmentHistorySection: React.FC<InvestmentHistorySectionProps> = ({
  transactions,
  userInvestments,
  currentCurrency,
  userId,
  onExplorePlans
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter investment-specific transactions
  const investmentTxs = useMemo(() => {
    return transactions.filter(tx => {
      const isInv = tx.type === 'investment' || tx.destinationOrSource?.toLowerCase().includes('plan') || tx.method?.toLowerCase().includes('allocation');
      const matchesUser = !userId || tx.userId === userId || !tx.userId || tx.userId === 'usr_guest';
      return isInv && matchesUser;
    });
  }, [transactions, userId]);

  // Combined records for display
  const combinedHistory = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      amountUsd: number;
      date: string;
      maturityDate?: string;
      status: 'active' | 'completed' | 'pending' | 'matured' | 'cancelled';
      reference: string;
      roiPercent?: number;
      accruedYieldUsd?: number;
      type: 'position' | 'transaction';
    }> = [];

    // Add active positions
    userInvestments.forEach(pos => {
      list.push({
        id: pos.id,
        title: pos.planTitle,
        amountUsd: pos.amountUsd,
        date: pos.startDate,
        maturityDate: pos.maturityDate,
        status: pos.status === 'matured' ? 'completed' : (pos.status || 'active'),
        reference: `POS-${pos.id.substring(pos.id.length - 6).toUpperCase()}`,
        accruedYieldUsd: pos.accruedYieldUsd,
        type: 'position'
      });
    });

    // Add transactions that aren't already represented as positions
    investmentTxs.forEach(tx => {
      const existing = list.some(item => Math.abs(item.amountUsd - tx.amountUsd) < 0.01 && new Date(item.date).toDateString() === new Date(tx.timestamp).toDateString());
      if (!existing) {
        list.push({
          id: tx.id,
          title: tx.destinationOrSource || 'Portfolio Strategy Allocation',
          amountUsd: tx.amountUsd || tx.amount,
          date: tx.timestamp,
          status: tx.status === 'completed' ? 'active' : (tx.status === 'pending' ? 'pending' : 'completed'),
          reference: tx.reference || tx.id,
          type: 'transaction'
        });
      }
    });

    // Sort by date descending
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [userInvestments, investmentTxs]);

  // Filtered by status and search
  const filteredList = useMemo(() => {
    return combinedHistory.filter(item => {
      if (filterStatus !== 'all') {
        if (filterStatus === 'active' && item.status !== 'active') return false;
        if (filterStatus === 'completed' && item.status !== 'completed' && item.status !== 'matured') return false;
        if (filterStatus === 'pending' && item.status !== 'pending') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchRef = item.reference.toLowerCase().includes(q);
        return matchTitle || matchRef;
      }
      return true;
    });
  }, [combinedHistory, filterStatus, searchQuery]);

  const totalInvested = useMemo(() => {
    return combinedHistory.reduce((sum, item) => sum + (item.amountUsd || 0), 0);
  }, [combinedHistory]);

  const totalAccruedYield = useMemo(() => {
    return userInvestments.reduce((sum, pos) => sum + (pos.accruedYieldUsd || (pos.amountUsd * 0.05)), 0);
  }, [userInvestments]);

  return (
    <div
      id="investment-history-section"
      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Investment History</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                {combinedHistory.length} Total
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit trail of active positions, cycle maturity timelines, and transaction allocations
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200/60 dark:border-white/5">
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-white dark:bg-[#1e1e24] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Graphical Timeline
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-[#1e1e24] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Detailed Table
          </button>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Capital Allocated
            </span>
            <span className="text-base font-black font-mono text-slate-900 dark:text-white">
              {formatCurrency(totalInvested, currentCurrency)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-200/70 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider block">
              Accrued Cycle Yield
            </span>
            <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(totalAccruedYield, currentCurrency)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider block">
              Active Strategy Contracts
            </span>
            <span className="text-base font-black font-mono text-blue-600 dark:text-blue-400">
              {userInvestments.length} Running
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'active', 'completed', 'pending'] as const).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search reference or plan..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Content: Timeline or Table */}
      {filteredList.length === 0 ? (
        <div className="py-10 text-center space-y-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Investment Records Found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {searchQuery || filterStatus !== 'all'
                ? 'No transactions match your current search or filter criteria.'
                : 'You have not initiated any investment allocations yet. Select a plan above to begin accruing daily returns.'}
            </p>
          </div>
          {onExplorePlans && (
            <button
              type="button"
              onClick={onExplorePlans}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Explore Available Plans
            </button>
          )}
        </div>
      ) : viewMode === 'timeline' ? (
        /* GRAPHICAL TIMELINE VIEW */
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-slate-300 dark:before:to-slate-700">
          {filteredList.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isPending = item.status === 'pending';
            const isActive = item.status === 'active';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className="relative group"
              >
                {/* Timeline Node Icon */}
                <div
                  className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 bg-white dark:bg-[#121216] flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'border-emerald-500 text-emerald-500'
                      : isCompleted
                      ? 'border-blue-500 text-blue-500'
                      : 'border-amber-500 text-amber-500'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-emerald-500 animate-pulse' : isCompleted ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                  />
                </div>

                {/* Timeline Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all shadow-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.reference}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : isCompleted
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs sm:text-sm font-black font-mono text-slate-900 dark:text-white">
                        {formatCurrency(item.amountUsd, currentCurrency)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Initiated: <strong>{new Date(item.date).toLocaleDateString()}</strong></span>
                    </div>

                    {item.maturityDate && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Maturity: <strong>{new Date(item.maturityDate).toLocaleDateString()}</strong></span>
                      </div>
                    )}

                    {item.accruedYieldUsd !== undefined && (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Yield: +{formatCurrency(item.accruedYieldUsd, currentCurrency)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* DETAILED TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/5">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-white/5">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Plan / Strategy</th>
                <th className="py-3 px-4">Allocated Amount</th>
                <th className="py-3 px-4">Accrued Profit</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200">
              {filteredList.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300 font-semibold text-[11px] whitespace-nowrap">
                    {item.reference}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {formatCurrency(item.amountUsd, currentCurrency)}
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                    {item.accruedYieldUsd !== undefined ? `+${formatCurrency(item.accruedYieldUsd, currentCurrency)}` : 'Accruing Daily'}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : item.status === 'completed'
                          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
