import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  X,
  Globe,
  DollarSign,
  UserCheck,
  RefreshCw,
  Ban,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  UserPlus,
  Sliders,
  Award,
  Briefcase,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  LogIn,
  KeyRound,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserVerificationStatus, UserAccountStatus } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { formatCurrency } from '../../services/currency';
import { SortableHeader, SortDirection } from '../common/SortableHeader';
import { CreateCustomerModal } from './CreateCustomerModal';
import { AssignCustomerModal } from './AssignCustomerModal';

type UserSortField = 'name' | 'email' | 'balance' | 'country' | 'kyc' | 'createdAt';

export const AdminUsersTab: React.FC = () => {
  const {
    allUsers,
    getUserWalletForAdmin,
    adminCreditUserWallet,
    adminDebitUserWallet,
    adminVerifyUserKyc,
    adminUpdateUserStatus,
    adminUpdateUserCountry,
    adminEditUserFields,
    adminApproveUser,
    adminResetUserPassword,
    adminLoginAsUser
  } = useAuth();
  const { setActiveTab } = useApp();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending_approval' | 'pending_kyc' | 'verified' | 'suspended'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<UserSortField>('balance');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: string) => {
    const target = field as UserSortField;
    if (sortField === target) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(target);
      setSortDirection(target === 'balance' || target === 'createdAt' ? 'desc' : 'asc');
    }
  };

  // Create Customer Modal
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] = useState(false);

  // Assign Customer Modal
  const [assignTargetUser, setAssignTargetUser] = useState<UserProfile | null>(null);

  // Link copy feedback states
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);
  const [copiedGlobalPortalLink, setCopiedGlobalPortalLink] = useState(false);

  const getDirectSignInUrlForUser = (u?: UserProfile) => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    if (u?.email) {
      return `${origin}${path}#/login?email=${encodeURIComponent(u.email)}`;
    }
    return `${origin}${path}#/login`;
  };

  const handleCopyUserSignInLink = (u: UserProfile) => {
    const url = getDirectSignInUrlForUser(u);
    navigator.clipboard.writeText(url);
    setCopiedUserId(u.id);
    setTimeout(() => setCopiedUserId(null), 2500);
  };

  const handleCopyGlobalPortalLink = () => {
    const url = getDirectSignInUrlForUser();
    navigator.clipboard.writeText(url);
    setCopiedGlobalPortalLink(true);
    setTimeout(() => setCopiedGlobalPortalLink(false), 2500);
  };

  const handleLoginAsClient = async (u: UserProfile) => {
    if (window.confirm(`Launch direct client terminal session for ${u.firstName} ${u.lastName} (${u.email})?`)) {
      const res = await adminLoginAsUser(u.id);
      if (res.success) {
        setActiveTab('dashboard');
      }
    }
  };

  // Credit Modal
  const [creditUser, setCreditUser] = useState<UserProfile | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(1000);
  const [creditAsset, setCreditAsset] = useState<string>('USD');
  const [creditType, setCreditType] = useState<string>('Direct Treasury Wire Credit');
  const [creditNotes, setCreditNotes] = useState<string>('Liquidity deposit allocation approved by Treasury');
  const [isSubmittingCredit, setIsSubmittingCredit] = useState(false);

  // Debit Modal
  const [debitUser, setDebitUser] = useState<UserProfile | null>(null);
  const [debitAmount, setDebitAmount] = useState<number>(500);
  const [debitAsset, setDebitAsset] = useState<string>('USD');
  const [debitReason, setDebitReason] = useState<string>('Compliance adjustment / Reversal');
  const [isSubmittingDebit, setIsSubmittingDebit] = useState(false);

  // Edit User & Country Modal
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editKycStatus, setEditKycStatus] = useState<UserVerificationStatus>('unverified');
  const [editAccountStatus, setEditAccountStatus] = useState<UserAccountStatus>('active');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const pendingApprovalsCount = useMemo(() => {
    return allUsers.filter(u => u.accountStatus === 'pending').length;
  }, [allUsers]);

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = allUsers.filter(u => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.country && u.country.toLowerCase().includes(search.toLowerCase())) ||
        (u.phoneNumber && u.phoneNumber.includes(search));

      if (!matchesSearch) return false;

      if (filter === 'pending_approval') {
        return u.accountStatus === 'pending';
      }
      if (filter === 'pending_kyc') {
        return u.verificationStatus === 'pending' || u.verificationStatus === 'unverified';
      }
      if (filter === 'verified') {
        return u.verificationStatus === 'verified' || u.verificationStatus === 'tier2_verified';
      }
      if (filter === 'suspended') {
        return u.accountStatus === 'suspended';
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name': {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        }
        case 'email': {
          comparison = (a.email || '').toLowerCase().localeCompare((b.email || '').toLowerCase());
          break;
        }
        case 'balance': {
          const balA = getUserWalletForAdmin(a.id)?.totalValueUsd ?? 0;
          const balB = getUserWalletForAdmin(b.id)?.totalValueUsd ?? 0;
          comparison = balA - balB;
          break;
        }
        case 'country': {
          comparison = (a.country || '').localeCompare(b.country || '');
          break;
        }
        case 'kyc': {
          comparison = (a.verificationStatus || '').localeCompare(b.verificationStatus || '');
          break;
        }
        case 'createdAt': {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          comparison = dateA - dateB;
          break;
        }
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [allUsers, search, filter, sortField, sortDirection, getUserWalletForAdmin]);

  const handleOpenCredit = (u: UserProfile) => {
    setCreditUser(u);
    setCreditAmount(1000);
    setCreditAsset('USD');
    setCreditType('Direct Treasury Wire Credit');
    setCreditNotes('Treasury capital credit');
  };

  const handleConfirmCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditUser) return;
    setIsSubmittingCredit(true);
    await adminCreditUserWallet(
      creditUser.id,
      Number(creditAmount),
      creditAsset,
      creditType,
      creditNotes
    );
    setIsSubmittingCredit(false);
    setCreditUser(null);
  };

  const handleOpenDebit = (u: UserProfile) => {
    setDebitUser(u);
    setDebitAmount(500);
    setDebitAsset('USD');
    setDebitReason('Compliance adjustment / Reversal');
  };

  const handleConfirmDebit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debitUser) return;
    setIsSubmittingDebit(true);
    await adminDebitUserWallet(
      debitUser.id,
      Number(debitAmount),
      debitAsset,
      debitReason
    );
    setIsSubmittingDebit(false);
    setDebitUser(null);
  };

  const handleOpenEdit = (u: UserProfile) => {
    setEditUser(u);
    setEditFirstName(u.firstName);
    setEditLastName(u.lastName);
    setEditEmail(u.email);
    setEditPhone(u.phoneNumber || '');
    setEditCountry(u.country || 'Switzerland');
    setEditKycStatus(u.verificationStatus);
    setEditAccountStatus(u.accountStatus);
    setEditRole(u.role || 'user');

    // Retrieve stored password
    try {
      const passwordsMap = JSON.parse(localStorage.getItem('greeneza_user_passwords') || '{}');
      const existingPwd = passwordsMap[u.id] || passwordsMap[u.email.toLowerCase()] || passwordsMap[u.username.toLowerCase()] || '';
      setEditPassword(existingPwd || 'Investor@Growvest2026!');
    } catch (_e) {
      setEditPassword('');
    }
    setShowEditPassword(false);
  };

  const handleConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setIsSubmittingEdit(true);

    // Update profile fields
    await adminEditUserFields(editUser.id, {
      firstName: editFirstName,
      lastName: editLastName,
      email: editEmail,
      phoneNumber: editPhone,
      country: editCountry,
      verificationStatus: editKycStatus,
      accountStatus: editAccountStatus,
      role: editRole
    });

    if (editCountry !== editUser.country) {
      await adminUpdateUserCountry(editUser.id, editCountry);
    }

    if (editPassword.trim()) {
      await adminResetUserPassword(editUser.id, editPassword.trim());
    }

    setApprovalFeedback(`Profile and security credentials for ${editFirstName} ${editLastName} updated successfully!`);
    setTimeout(() => setApprovalFeedback(null), 5000);

    setIsSubmittingEdit(false);
    setEditUser(null);
  };

  const handleApproveUser = async (u: UserProfile) => {
    await adminApproveUser(u.id);
    setApprovalFeedback(
      `Account for ${u.firstName} ${u.lastName} is approved & activated! Welcoming SMS alert sent to ${u.phoneCountryCode || ''} ${u.phoneNumber || ''} and Email alert to ${u.email}.`
    );
    setTimeout(() => {
      setApprovalFeedback(null);
    }, 6000);
  };

  const handleQuickVerify = async (u: UserProfile) => {
    if (window.confirm(`Verify KYC status for ${u.firstName} ${u.lastName}?`)) {
      await adminVerifyUserKyc(u.id);
    }
  };

  const handleToggleSuspend = async (u: UserProfile) => {
    const nextStatus: UserAccountStatus = u.accountStatus === 'suspended' ? 'active' : 'suspended';
    await adminUpdateUserStatus(u.id, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Approval Feedback Banner */}
      {approvalFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{approvalFeedback}</span>
          </div>
          <button
            onClick={() => setApprovalFeedback(null)}
            className="p-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Controls & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              User Accounts & Client Terminal Permissions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Approve new registrations, dispatch welcome alerts, edit account information, and manage balances.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsCreateCustomerModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm hover:shadow-emerald-500/20 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Customer</span>
            </button>

            <button
              onClick={handleCopyGlobalPortalLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Copy the direct standalone sign-in link to share with anyone"
            >
              {copiedGlobalPortalLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <LinkIcon className="w-3.5 h-3.5" />}
              <span>{copiedGlobalPortalLink ? 'Portal Link Copied!' : 'Copy Portal Sign-In Link'}</span>
            </button>

            {pendingApprovalsCount > 0 && (
              <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{pendingApprovalsCount} Pending</span>
              </div>
            )}
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              Total: <span className="font-bold text-emerald-600 dark:text-emerald-400">{allUsers.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Filter Buttons & Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search user name, email, country, or phone..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filter === 'all'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Users ({allUsers.length})
            </button>
            <button
              onClick={() => setFilter('pending_approval')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                filter === 'pending_approval'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Approval ({pendingApprovalsCount})</span>
            </button>
            <button
              onClick={() => setFilter('pending_kyc')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filter === 'pending_kyc'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Pending KYC
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filter === 'verified'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setFilter('suspended')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filter === 'suspended'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Suspended
            </button>
          </div>
        </div>

        {/* Sorting Indicator & View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-500 font-mono">
              Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredAndSortedUsers.length}</span> of {allUsers.length} accounts
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              Sorted by <span className="font-bold capitalize">{sortField}</span> ({sortDirection === 'asc' ? 'Ascending ↑' : 'Descending ↓'})
            </span>

            {(sortField !== 'balance' || sortDirection !== 'desc') && (
              <button
                onClick={() => {
                  setSortField('balance');
                  setSortDirection('desc');
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Table or Cards */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-xl transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <SortableHeader
                  label="Customer Account"
                  field="name"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="left"
                />
                <SortableHeader
                  label="Country & Phone"
                  field="country"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="left"
                />
                <th className="py-3 px-4 text-left font-mono uppercase text-[10px] text-slate-500 dark:text-slate-400">
                  Advisor & Tier
                </th>
                <SortableHeader
                  label="KYC Status"
                  field="kyc"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="center"
                />
                <SortableHeader
                  label="Portfolio Balance"
                  field="balance"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <th className="py-3 px-4 text-right font-mono uppercase text-[10px] text-slate-500 dark:text-slate-400">
                  Treasury & User Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredAndSortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No user accounts match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSortedUsers.map(u => {
                  const w = getUserWalletForAdmin(u.id);
                  const isVerified = u.verificationStatus === 'verified' || u.verificationStatus === 'tier2_verified';

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={`${u.firstName} ${u.lastName}`}
                            size="sm"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {u.firstName} {u.lastName}
                              </span>
                              {u.role === 'admin' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                                  Admin
                                </span>
                              )}
                              {u.assignedPlanTitle && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                                  {u.assignedPlanTitle}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                              <span>{u.email}</span>
                              {u.username && (
                                <span className="text-[10px] text-slate-400">(@{u.username})</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{u.country || 'Switzerland'}</span>
                        </div>
                        {u.phoneNumber && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {u.phoneCountryCode} {u.phoneNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate max-w-[160px]" title={u.assignedAccountManager || 'Alexander Vance'}>
                              {u.assignedAccountManager ? u.assignedAccountManager.split('(')[0].trim() : 'Alexander Vance'}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <Award className="w-2.5 h-2.5" />
                            <span>{u.assignedTier || 'Standard Retail'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          {u.accountStatus === 'pending' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span>Pending Approval</span>
                            </span>
                          ) : isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                              <Clock className="w-3 h-3" />
                              <span>{u.verificationStatus || 'Pending'}</span>
                            </span>
                          )}

                          {u.accountStatus === 'suspended' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              <Ban className="w-2.5 h-2.5" />
                              <span>Suspended</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          ${(w?.totalValueUsd ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                          Avail: ${(w?.availableBalanceUsd ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {u.accountStatus === 'pending' && (
                            <button
                              onClick={() => handleApproveUser(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                              title="Approve User Registration & Send SMS/Email Alerts"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenCredit(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                            title="Credit Funds"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Credit</span>
                          </button>

                          <button
                            onClick={() => handleOpenDebit(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                            title="Debit Funds"
                          >
                            <Minus className="w-3 h-3" />
                            <span>Debit</span>
                          </button>

                          {/* Assign Advisor & Tier */}
                          <button
                            onClick={() => setAssignTargetUser(u)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold transition-colors cursor-pointer"
                            title="Assign Advisor, Strategy Tier & Trader"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Assign</span>
                          </button>

                          {/* Copy Direct Sign-In Link for this client */}
                          <button
                            onClick={() => handleCopyUserSignInLink(u)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                            title="Copy Direct Sign-In Link for this customer"
                          >
                            {copiedUserId === u.id ? <Check className="w-3 h-3 text-emerald-500" /> : <LinkIcon className="w-3 h-3" />}
                            <span>{copiedUserId === u.id ? 'Copied' : 'Link'}</span>
                          </button>

                          {/* Login as Client Terminal Session */}
                          <button
                            onClick={() => handleLoginAsClient(u)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold transition-colors cursor-pointer"
                            title="Launch Direct Client Dashboard Session (Test Account)"
                          >
                            <LogIn className="w-3 h-3" />
                            <span>Terminal</span>
                          </button>

                          {!isVerified && (
                            <button
                              onClick={() => handleQuickVerify(u)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
                              title="Verify KYC"
                            >
                              <UserCheck className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                            title="Edit User Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleSuspend(u)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              u.accountStatus === 'suspended'
                                ? 'text-emerald-500 hover:bg-emerald-500/10'
                                : 'text-slate-400 hover:text-rose-500 hover:bg-rose-500/10'
                            }`}
                            title={u.accountStatus === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
                          >
                            <Ban className="w-3.5 h-3.5" />
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
      ) : (
        /* User Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedUsers.length === 0 ? (
            <div className="col-span-full p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              No user accounts match the selected criteria.
            </div>
          ) : (
            filteredAndSortedUsers.map(u => {
              const w = getUserWalletForAdmin(u.id);
              const isVerified = u.verificationStatus === 'verified' || u.verificationStatus === 'tier2_verified';

              return (
                <div
                  key={u.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4"
                >
                  {/* User Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={`${u.firstName} ${u.lastName}`}
                          size="md"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {u.firstName} {u.lastName}
                            </h3>
                            {u.role === 'admin' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            <span>{u.verificationStatus || 'Pending'}</span>
                          </span>
                        )}

                        {u.accountStatus === 'suspended' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <Ban className="w-2.5 h-2.5" />
                            <span>Suspended</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Country & Details Line */}
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{u.country || 'Switzerland'}</span>
                      </div>
                      {u.phoneNumber && (
                        <div className="text-[11px] font-mono text-slate-400">
                          {u.phoneCountryCode} {u.phoneNumber}
                        </div>
                      )}
                    </div>

                    {/* Advisor & Tier Assignment Badge */}
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <div className="truncate">
                          <span className="text-[10px] text-slate-400 block">Advisor</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block text-[11px]">
                            {u.assignedAccountManager ? u.assignedAccountManager.split('(')[0].trim() : 'Alexander Vance'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block">Client Tier</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <Award className="w-2.5 h-2.5" />
                          <span>{u.assignedTier || 'Standard Retail'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Balance Snapshot Box */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Portfolio</div>
                        <div className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                          ${(w?.totalValueUsd ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Available</div>
                        <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          ${(w?.availableBalanceUsd ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Invested</div>
                        <div className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                          ${(w?.investedBalanceUsd ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Button Group */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {u.accountStatus === 'pending' && (
                        <button
                          onClick={() => handleApproveUser(u)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                          title="Approve User & Send Welcoming Alerts"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Approve & Unlock</span>
                        </button>
                      )}

                      {/* Add / Credit Money */}
                      <button
                        onClick={() => handleOpenCredit(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                        title="Add money to user wallet"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Credit (+)</span>
                      </button>

                      {/* Debit / Deduct Money */}
                      <button
                        onClick={() => handleOpenDebit(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                        title="Debit money from user wallet"
                      >
                        <Minus className="w-3.5 h-3.5" />
                        <span>Debit (-)</span>
                      </button>

                      {/* Assign Advisor & Tier */}
                      <button
                        onClick={() => setAssignTargetUser(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold transition-colors cursor-pointer"
                        title="Assign Advisor, Strategy Tier & Trader"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Assign</span>
                      </button>

                      {/* Copy Direct Sign-In Link */}
                      <button
                        onClick={() => handleCopyUserSignInLink(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                        title="Copy Direct Sign-In Link for this customer"
                      >
                        {copiedUserId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <LinkIcon className="w-3.5 h-3.5" />}
                        <span>{copiedUserId === u.id ? 'Copied' : 'Link'}</span>
                      </button>

                      {/* Login as Client Terminal Session */}
                      <button
                        onClick={() => handleLoginAsClient(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold transition-colors cursor-pointer"
                        title="Launch Direct Client Dashboard Session (Test Account)"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Terminal</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isVerified && (
                        <button
                          onClick={() => handleQuickVerify(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
                          title="Verify KYC"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                      )}

                      {/* Edit Profile & Country */}
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                        title="Edit Profile & Country"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Toggle Suspend */}
                      <button
                        onClick={() => handleToggleSuspend(u)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          u.accountStatus === 'suspended'
                            ? 'text-emerald-500 hover:bg-emerald-500/10'
                            : 'text-slate-400 hover:text-rose-500 hover:bg-rose-500/10'
                        }`}
                        title={u.accountStatus === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Credit User Wallet Modal */}
      {creditUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setCreditUser(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 my-8">
            <button
              onClick={() => setCreditUser(null)}
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
                  Credit User Wallet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {creditUser.firstName} {creditUser.lastName} ({creditUser.email})
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmCredit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Credit Amount ($ USD) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  min={1}
                  value={creditAmount}
                  onChange={e => setCreditAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Credit Method / Rail
                </label>
                <input
                  type="text"
                  value={creditType}
                  onChange={e => setCreditType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Audit Notes
                </label>
                <textarea
                  rows={2}
                  value={creditNotes}
                  onChange={e => setCreditNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreditUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCredit}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {isSubmittingCredit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Credit ${creditAmount}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Debit User Wallet Modal */}
      {debitUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setDebitUser(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 my-8">
            <button
              onClick={() => setDebitUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Minus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Debit User Wallet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {debitUser.firstName} {debitUser.lastName} ({debitUser.email})
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmDebit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Debit Amount ($ USD) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  min={1}
                  value={debitAmount}
                  onChange={e => setDebitAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-rose-600 dark:text-rose-400 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Debit
                </label>
                <textarea
                  rows={2}
                  value={debitReason}
                  onChange={e => setDebitReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDebitUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDebit}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {isSubmittingDebit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Debit -${debitAmount}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile & Country Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setEditUser(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 my-8">
            <button
              onClick={() => setEditUser(null)}
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
                  Edit User Profile & Country
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update customer residential jurisdiction, verification tier & details.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={e => setEditFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editLastName}
                    onChange={e => setEditLastName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Country of Residence *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCountry}
                    onChange={e => setEditCountry(e.target.value)}
                    placeholder="Switzerland, United Kingdom, USA, Germany..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none text-emerald-600 dark:text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    KYC Verification Status
                  </label>
                  <select
                    value={editKycStatus}
                    onChange={e => setEditKycStatus(e.target.value as UserVerificationStatus)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="unverified">Unverified</option>
                    <option value="pending">Pending Review</option>
                    <option value="verified">Verified (Tier-1)</option>
                    <option value="tier2_verified">Tier-2 Institutional Verified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Account Status
                  </label>
                  <select
                    value={editAccountStatus}
                    onChange={e => setEditAccountStatus(e.target.value as UserAccountStatus)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending Verification</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="+41 79 123 4567"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Platform Role
                  </label>
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as 'user' | 'admin')}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="user">User (Client Dashboard Only)</option>
                    <option value="admin">Administrator (Full Access)</option>
                  </select>
                </div>
              </div>

              {/* Password Management / Reset */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Security Password / Portal Access</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    {showEditPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showEditPassword ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={e => setEditPassword(e.target.value)}
                    placeholder="Enter new password for customer..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  You can set or inspect this client's password here. Updating this saves immediately into the platform credentials storage.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 flex-wrap">
                {editUser?.accountStatus === 'pending' ? (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!editUser) return;
                      await handleApproveUser(editUser);
                      setEditUser(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve & Unlock Now</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
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
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Create Customer Modal */}
      <CreateCustomerModal
        isOpen={isCreateCustomerModalOpen}
        onClose={() => setIsCreateCustomerModalOpen(false)}
        onSuccess={(msg) => setApprovalFeedback(msg)}
      />

      {/* Assign Customer Advisory & Tier Modal */}
      <AssignCustomerModal
        user={assignTargetUser}
        onClose={() => setAssignTargetUser(null)}
        onSuccess={(msg) => setApprovalFeedback(msg)}
      />
    </div>
  );
};
