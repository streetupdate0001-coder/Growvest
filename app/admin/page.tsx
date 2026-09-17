import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { adminRouteMiddleware, AuthProfile } from '../middleware';
import {
  ShieldCheck,
  Users,
  DollarSign,
  Search,
  RefreshCw,
  LogOut,
  Edit2,
  Check,
  X,
  Lock,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Trash2,
  Wallet,
  Ban,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface AdminPageProps {
  onNavigate?: (path: string) => void;
}

interface TransactionItem {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [currentAdminProfile, setCurrentAdminProfile] = useState<AuthProfile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<AuthProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<AuthProfile | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [editCurrency, setEditCurrency] = useState('USD');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const [editBlocked, setEditBlocked] = useState(false);

  // View Transactions Modal State
  const [transactionsUser, setTransactionsUser] = useState<AuthProfile | null>(null);
  const [userTransactions, setUserTransactions] = useState<TransactionItem[]>([]);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txType, setTxType] = useState('deposit');
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txStatus, setTxStatus] = useState('completed');
  const [editingTx, setEditingTx] = useState<TransactionItem | null>(null);

  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    setLoading(true);
    setAuthError(null);
    const result = await adminRouteMiddleware();

    if (!result.authorized) {
      setAuthorized(false);
      setAuthError(result.errorMessage || 'Executive access restricted.');
      setLoading(false);
      return;
    }

    setAuthorized(true);
    setCurrentAdminProfile(result.profile);
    await loadProfiles();
    setLoading(false);
  };

  const loadProfiles = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProfiles(data as AuthProfile[]);
      } else {
        setProfiles([]);
      }
    } catch (err) {
      console.warn('[AdminPage] Error loading profiles:', err);
      setProfiles([]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenEdit = (user: AuthProfile) => {
    setEditingUser(user);
    setEditFullName(user.full_name || '');
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '');
    setEditBalance(String(user.balance || 0));
    setEditCurrency(user.currency || 'USD');
    setEditPhotoUrl(user.photo_url || '');
    setEditBlocked(user.account_status === 'blocked' || user.is_blocked === true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updatedData = {
        full_name: editFullName,
        email: editEmail,
        phone: editPhone,
        balance: parseFloat(editBalance) || 0,
        currency: editCurrency,
        photo_url: editPhotoUrl,
        account_status: editBlocked ? 'blocked' : 'active',
        is_blocked: editBlocked
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', editingUser.id);

      if (error) throw error;

      setActionMessage('User profile updated successfully.');
      setEditingUser(null);
      await loadProfiles();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert('Error updating user: ' + (err.message || err));
    }
  };

  const handleToggleBlock = async (user: AuthProfile) => {
    const isCurrentlyBlocked = user.account_status === 'blocked' || user.is_blocked === true;
    const newStatus = !isCurrentlyBlocked;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          account_status: newStatus ? 'blocked' : 'active',
          is_blocked: newStatus
        })
        .eq('id', user.id);

      if (error) throw error;
      setActionMessage(newStatus ? 'User account blocked.' : 'User account unblocked.');
      await loadProfiles();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert('Error changing block status: ' + (err.message || err));
    }
  };

  const handleOpenTransactions = async (user: AuthProfile) => {
    setTransactionsUser(user);
    await loadUserTransactions(user.id);
  };

  const loadUserTransactions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUserTransactions(data as TransactionItem[]);
      } else {
        setUserTransactions([]);
      }
    } catch (err) {
      setUserTransactions([]);
    }
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionsUser) return;

    const amt = parseFloat(txAmount) || 0;
    try {
      if (editingTx) {
        const { error } = await supabase
          .from('transactions')
          .update({
            type: txType,
            amount: amt,
            description: txDescription,
            status: txStatus
          })
          .eq('id', editingTx.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('transactions')
          .insert([
            {
              user_id: transactionsUser.id,
              type: txType,
              amount: amt,
              description: txDescription,
              status: txStatus
            }
          ]);

        if (error) throw error;
      }

      setIsAddTxOpen(false);
      setEditingTx(null);
      setTxAmount('');
      setTxDescription('');
      await loadUserTransactions(transactionsUser.id);
      setActionMessage('Transaction saved successfully.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert('Error saving transaction: ' + (err.message || err));
    }
  };

  const handleDeleteTransaction = async (txId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', txId);
      if (error) throw error;
      if (transactionsUser) {
        await loadUserTransactions(transactionsUser.id);
      }
      setActionMessage('Transaction deleted.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert('Error deleting transaction: ' + (err.message || err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Loading Executive Control Center...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-sm text-slate-400">{authError || 'You do not have administrative privileges.'}</p>
          <button
            type="button"
            onClick={() => navigate('/app/dashboard')}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const filteredProfiles = profiles.filter((p) =>
    (p.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">Executive Control Center</h1>
            <p className="text-xs text-slate-400">Manage real user accounts, balances, and ledger transactions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadProfiles}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/dashboard')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 cursor-pointer"
          >
            Exit Admin
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {actionMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400">Total Registered Users</span>
            <h3 className="text-3xl font-black font-mono text-cyan-400">{profiles.length}</h3>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400">System Liquidity Pool</span>
            <h3 className="text-3xl font-black font-mono text-emerald-400">
              ${profiles.reduce((acc, curr) => acc + Number(curr.balance || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400">Active Admin Session</span>
            <h3 className="text-sm font-bold text-slate-200 truncate">{currentAdminProfile?.email || 'Administrator'}</h3>
          </div>
        </div>

        {/* Users Management Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Registered User Accounts ({profiles.length})</span>
            </h2>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">User / Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Currency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((user) => {
                    const isBlocked = user.account_status === 'blocked' || user.is_blocked === true;
                    return (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 overflow-hidden">
                              {user.photo_url ? (
                                <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                (user.full_name || user.email || 'U').charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{user.full_name || 'Unnamed User'}</span>
                              <span className="text-[11px] text-slate-400">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">{user.phone || 'N/A'}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          ${Number(user.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 uppercase font-bold text-slate-300">{user.currency || 'USD'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isBlocked ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenTransactions(user)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold transition-all cursor-pointer"
                          >
                            Transactions
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleBlock(user)}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                              isBlocked ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                            }`}
                          >
                            {isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white">Edit User Profile</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Currency</label>
                  <select
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-cyan-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={editPhotoUrl}
                  onChange={(e) => setEditPhotoUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="blockedCheck"
                  checked={editBlocked}
                  onChange={(e) => setEditBlocked(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 text-rose-500 focus:ring-0"
                />
                <label htmlFor="blockedCheck" className="text-xs font-bold text-rose-400 cursor-pointer">
                  Block User Account
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW TRANSACTIONS MODAL */}
      {transactionsUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white">Transactions for {transactionsUser.full_name || transactionsUser.email}</h3>
                <p className="text-xs text-slate-400">Manage real ledger entries</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTx(null);
                    setTxType('deposit');
                    setTxAmount('');
                    setTxDescription('');
                    setTxStatus('completed');
                    setIsAddTxOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Transaction</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionsUser(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isAddTxOpen ? (
              <form onSubmit={handleSaveTransaction} className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {editingTx ? 'Edit Transaction' : 'New Transaction'}
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Type</label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="profit">Profit</option>
                      <option value="bonus">Bonus</option>
                      <option value="payment">Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={txDescription}
                    onChange={(e) => setTxDescription(e.target.value)}
                    placeholder="e.g., Institutional Transfer / Staking Reward"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Status</label>
                  <select
                    value={txStatus}
                    onChange={(e) => setTxStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddTxOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold cursor-pointer"
                  >
                    Save Transaction
                  </button>
                </div>
              </form>
            ) : null}

            <div className="max-h-80 overflow-y-auto space-y-2">
              {userTransactions.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No transactions found for this user.
                </div>
              ) : (
                userTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{tx.description}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] uppercase font-mono">{tx.type}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(tx.created_at).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-black font-mono ${
                        (tx.type || '').toLowerCase().includes('deposit') || (tx.type || '').toLowerCase().includes('profit') || (tx.type || '').toLowerCase().includes('bonus')
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}>
                        ${Number(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTx(tx);
                            setTxType(tx.type);
                            setTxAmount(String(tx.amount));
                            setTxDescription(tx.description);
                            setTxStatus(tx.status || 'completed');
                            setIsAddTxOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-400 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setTransactionsUser(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
