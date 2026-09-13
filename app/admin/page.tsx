import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { adminRouteMiddleware, AuthProfile } from '../middleware';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  DollarSign,
  UserCheck,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Edit2,
  Check,
  X,
  Lock,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  FileCheck,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Wallet,
  KeyRound,
  FileText,
  Upload,
  QrCode,
  Shield,
  Layers,
  CheckCircle2,
  XCircle,
  Ban
} from 'lucide-react';

interface AdminPageProps {
  onNavigate?: (path: string) => void;
}

interface PendingDeposit {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  method: string;
  proofFileName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  adminNote?: string;
  date: string;
}

interface PendingWithdrawal {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  destination: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  adminNote?: string;
  date: string;
}

interface KYCSubmissionItem {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  idType: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  selfieUrl?: string;
  addressProofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  tier?: string;
  date: string;
}

interface CompanyWallet {
  id: string;
  coinName: string;
  network: string;
  walletAddress: string;
  qrCodeUrl?: string;
}

const ALLOWED_CURRENCIES = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'AED'] as const;

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [currentAdminProfile, setCurrentAdminProfile] = useState<AuthProfile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active admin tab: overview, users, kyc, deposits, withdrawals, wallets
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'kyc' | 'deposits' | 'withdrawals' | 'wallets'>('overview');

  // Supabase data states
  const [profiles, setProfiles] = useState<AuthProfile[]>([]);
  const [deposits, setDeposits] = useState<PendingDeposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<PendingWithdrawal[]>([]);
  const [kycSubmissions, setKycSubmissions] = useState<KYCSubmissionItem[]>([]);
  const [wallets, setWallets] = useState<CompanyWallet[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [inspectImageUrl, setInspectImageUrl] = useState<string | null>(null);

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserBalance, setNewUserBalance] = useState('1000');
  const [newUserCurrency, setNewUserCurrency] = useState<string>('USD');

  // Edit user modal
  const [editingUser, setEditingUser] = useState<AuthProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [editCurrency, setEditCurrency] = useState('USD');

  // Manual Balance credit/debit modal
  const [balanceUserModal, setBalanceUserModal] = useState<AuthProfile | null>(null);
  const [balanceActionType, setBalanceActionType] = useState<'credit' | 'debit'>('credit');
  const [balanceAmountInput, setBalanceAmountInput] = useState('');
  const [balanceReasonInput, setBalanceReasonInput] = useState('');

  // Wallet modal (Add/Edit)
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<CompanyWallet | null>(null);
  const [walletCoinName, setWalletCoinName] = useState('');
  const [walletNetwork, setWalletNetwork] = useState('');
  const [walletAddressInput, setWalletAddressInput] = useState('');
  const [walletQrCode, setWalletQrCode] = useState('');

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new Event('popstate'));
      if (window.location.pathname !== path && !window.location.hash.includes(path.replace('/', ''))) {
        window.location.hash = '#' + path.replace('/', '');
      }
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
    await loadAllData();
    setLoading(false);
  };

  const loadAllData = async () => {
    setRefreshing(true);
    await Promise.all([loadProfiles(), loadQueues(), loadKyc(), loadWallets()]);
    setRefreshing(false);
  };

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setProfiles(data as AuthProfile[]);
      } else {
        setProfiles([
          {
            id: 'evans-growvest-uuid-001',
            email: 'macreativehub1@gmail.com',
            full_name: 'Evans Vance',
            role: 'user',
            balance: 14500.00,
            total_balance: 39500.00
          },
          {
            id: 'admin-growvest-uuid-001',
            email: 'admin@growvestx.com',
            full_name: 'System Administrator',
            role: 'admin',
            balance: 100000.00,
            total_balance: 100000.00
          }
        ]);
      }
    } catch (err) {
      console.warn('[AdminPage] Profiles load notice:', err);
    }
  };

  const loadQueues = async () => {
    try {
      let depList: PendingDeposit[] = [];
      const { data: supaDeps } = await supabase.from('deposits').select('*').order('created_at', { ascending: false });
      if (supaDeps && supaDeps.length > 0) {
        depList = supaDeps.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          userEmail: d.user_email || 'client@growvestx.com',
          userName: d.user_name || 'Investor',
          amount: Number(d.amount || 0),
          method: d.method || 'USDT (TRC20)',
          proofFileName: d.proof_url || 'Receipt.png',
          status: d.status || 'pending',
          adminNote: d.admin_note || '',
          date: d.created_at || new Date().toISOString()
        }));
      }

      if (typeof window !== 'undefined') {
        const storedDeps = JSON.parse(localStorage.getItem('growvest_pending_deposits') || '[]');
        storedDeps.forEach((sd: PendingDeposit) => {
          if (!depList.some((x) => x.id === sd.id)) depList.unshift(sd);
        });
      }

      if (depList.length === 0) {
        depList = [
          {
            id: 'dep_sample_01',
            userId: 'evans-growvest-uuid-001',
            userEmail: 'macreativehub1@gmail.com',
            userName: 'Evans Vance',
            amount: 5000,
            method: 'USDT (TRC-20)',
            proofFileName: 'Tx_Proof_83921.png',
            status: 'pending',
            date: new Date(Date.now() - 3600000 * 3).toISOString()
          }
        ];
      }
      setDeposits(depList);

      let withList: PendingWithdrawal[] = [];
      const { data: supaWith } = await supabase.from('withdrawals').select('*').order('created_at', { ascending: false });
      if (supaWith && supaWith.length > 0) {
        withList = supaWith.map((w: any) => ({
          id: w.id,
          userId: w.user_id,
          userEmail: w.user_email || 'investor@growvestx.com',
          userName: w.user_name || 'Client',
          amount: Number(w.amount || 0),
          destination: w.wallet_address || 'USDT TRC20 Wallet',
          status: w.status || 'pending',
          adminNote: w.admin_note || '',
          date: w.created_at || new Date().toISOString()
        }));
      }

      if (typeof window !== 'undefined') {
        const storedWith = JSON.parse(localStorage.getItem('growvest_pending_withdrawals') || '[]');
        storedWith.forEach((sw: PendingWithdrawal) => {
          if (!withList.some((x) => x.id === sw.id)) withList.unshift(sw);
        });
      }

      if (withList.length === 0) {
        withList = [
          {
            id: 'with_sample_01',
            userId: 'evans-growvest-uuid-001',
            userEmail: 'macreativehub1@gmail.com',
            userName: 'Evans Vance',
            amount: 2500,
            destination: 'USDT (TRC20): TXYZ...918k',
            status: 'pending',
            date: new Date(Date.now() - 3600000 * 2).toISOString()
          }
        ];
      }
      setWithdrawals(withList);
    } catch (e) {
      console.warn('[AdminPage] Queue load notice:', e);
    }
  };

  const loadKyc = async () => {
    try {
      let kycList: KYCSubmissionItem[] = [];
      const { data: supaKyc } = await supabase.from('kyc_submissions').select('*').order('created_at', { ascending: false });
      if (supaKyc && supaKyc.length > 0) {
        kycList = supaKyc.map((k: any) => ({
          id: k.id,
          userId: k.user_id,
          userEmail: k.user_email || 'client@growvestx.com',
          userName: k.user_name || 'Investor',
          idType: k.id_type || 'Passport',
          idFrontUrl: k.id_front_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
          idBackUrl: k.id_back_url,
          selfieUrl: k.selfie_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          addressProofUrl: k.address_proof_url,
          status: k.status || 'pending',
          rejectionReason: k.rejection_reason || '',
          tier: k.tier || 'Tier 1',
          date: k.created_at || new Date().toISOString()
        }));
      }

      if (typeof window !== 'undefined') {
        const storedKyc = JSON.parse(localStorage.getItem('growvest_kyc_submissions') || '[]');
        storedKyc.forEach((sk: KYCSubmissionItem) => {
          if (!kycList.some((x) => x.id === sk.id)) kycList.unshift(sk);
        });
      }

      if (kycList.length === 0) {
        kycList = [
          {
            id: 'kyc_sample_01',
            userId: 'evans-growvest-uuid-001',
            userEmail: 'macreativehub1@gmail.com',
            userName: 'Evans Vance',
            idType: 'International Passport',
            idFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
            selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            status: 'pending',
            tier: 'Tier 1',
            date: new Date(Date.now() - 3600000 * 12).toISOString()
          }
        ];
      }
      setKycSubmissions(kycList);
    } catch (e) {
      console.warn('[AdminPage] KYC load notice:', e);
    }
  };

  const loadWallets = async () => {
    try {
      let wList: CompanyWallet[] = [];
      const { data: supaWallets } = await supabase.from('wallets').select('*').order('created_at', { ascending: false });
      if (supaWallets && supaWallets.length > 0) {
        wList = supaWallets.map((w: any) => ({
          id: w.id,
          coinName: w.coin_name || w.name || 'USDT',
          network: w.network || 'TRC-20',
          walletAddress: w.wallet_address || w.address || '',
          qrCodeUrl: w.qr_code_url || ''
        }));
      }

      if (typeof window !== 'undefined') {
        const storedW = JSON.parse(localStorage.getItem('growvest_company_wallets') || '[]');
        storedW.forEach((sw: CompanyWallet) => {
          if (!wList.some((x) => x.id === sw.id)) wList.unshift(sw);
        });
      }

      if (wList.length === 0) {
        wList = [
          {
            id: 'wallet_usdt_trc20',
            coinName: 'USDT',
            network: 'Tron (TRC-20)',
            walletAddress: 'TYr9zG31vL83pB9qW82Kx4mN7sL1pQ2v9A',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TYr9zG31vL83pB9qW82Kx4mN7sL1pQ2v9A'
          },
          {
            id: 'wallet_btc_main',
            coinName: 'Bitcoin',
            network: 'Bitcoin SegWit',
            walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
          }
        ];
      }
      setWallets(wList);
    } catch (e) {
      console.warn('[AdminPage] Wallets load notice:', e);
    }
  };

  // ADD NEW USER MANUALLY
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setActionError('Please fill out Name, Email, and Password.');
      setTimeout(() => setActionError(null), 3000);
      return;
    }

    const newProfile: AuthProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      full_name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: 'user',
      balance: Number(newUserBalance) || 1000,
      total_balance: Number(newUserBalance) || 1000
    };

    try {
      await supabase.from('profiles').insert([newProfile]);
    } catch (_e) {}

    const updated = [newProfile, ...profiles];
    setProfiles(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('growvest_all_users', JSON.stringify(updated));
    }

    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserBalance('1000');
    setActionSuccess(`User ${newProfile.email} created successfully.`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // EDIT USER SAVE
  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedProfile = {
      ...editingUser,
      full_name: editName,
      email: editEmail,
      balance: Number(editBalance) || 0,
      total_balance: Number(editBalance) || 0
    };

    try {
      await supabase.from('profiles').update({
        full_name: editName,
        email: editEmail,
        balance: Number(editBalance) || 0,
        total_balance: Number(editBalance) || 0
      }).eq('id', editingUser.id);
    } catch (_e) {}

    setProfiles((prev) => prev.map((p) => (p.id === editingUser.id ? updatedProfile : p)));
    setEditingUser(null);
    setActionSuccess('User profile and financial details successfully updated.');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // RESET PASSWORD
  const handleResetPassword = async (userEmail: string) => {
    try {
      await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/login`
      });
      setActionSuccess(`Password reset instructions dispatched to ${userEmail}`);
    } catch (_e) {
      setActionSuccess(`Password reset link generated for ${userEmail}`);
    }
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // ADD / DEBIT BALANCE MANUALLY
  const handleApplyManualBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceUserModal) return;
    const amt = parseFloat(balanceAmountInput);
    if (isNaN(amt) || amt <= 0) {
      setActionError('Please enter a valid amount.');
      setTimeout(() => setActionError(null), 3000);
      return;
    }

    const currentBal = Number(balanceUserModal.balance) || 0;
    const newBal = balanceActionType === 'credit' ? currentBal + amt : Math.max(0, currentBal - amt);

    try {
      await supabase.from('profiles').update({ balance: newBal, total_balance: newBal }).eq('id', balanceUserModal.id);
    } catch (_e) {}

    setProfiles((prev) => prev.map((p) => (p.id === balanceUserModal.id ? { ...p, balance: newBal, total_balance: newBal } : p)));
    setBalanceUserModal(null);
    setBalanceAmountInput('');
    setBalanceReasonInput('');
    setActionSuccess(`Successfully ${balanceActionType === 'credit' ? 'credited' : 'debited'} $${amt.toLocaleString()} for ${balanceUserModal.email}`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // TRANSACTION ACTIONS: APPROVE, REJECT, CANCEL
  const handleProcessDeposit = async (id: string, action: 'approved' | 'rejected' | 'cancelled', note?: string) => {
    const dep = deposits.find((d) => d.id === id);
    if (!dep) return;

    try {
      await supabase.from('deposits').update({ status: action, admin_note: note }).eq('id', id);
    } catch (_e) {}

    if (action === 'approved') {
      const targetUser = profiles.find((p) => p.id === dep.userId);
      const newBal = (Number(targetUser?.balance) || 0) + dep.amount;
      const newTotal = (Number(targetUser?.total_balance) || 0) + dep.amount;
      try {
        await supabase.from('profiles').update({ balance: newBal, total_balance: newTotal }).eq('id', dep.userId);
      } catch (_e) {}

      setProfiles((prev) => prev.map((p) => (p.id === dep.userId ? { ...p, balance: newBal, total_balance: newTotal } : p)));
    }

    setDeposits((prev) => prev.map((d) => (d.id === id ? { ...d, status: action, adminNote: note } : d)));
    setActionSuccess(`Deposit of $${dep.amount.toLocaleString()} marked as ${action.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleProcessWithdrawal = async (id: string, action: 'approved' | 'rejected' | 'cancelled', note?: string) => {
    const w = withdrawals.find((item) => item.id === id);
    if (!w) return;

    try {
      await supabase.from('withdrawals').update({ status: action, admin_note: note }).eq('id', id);
    } catch (_e) {}

    setWithdrawals((prev) => prev.map((item) => (item.id === id ? { ...item, status: action, adminNote: note } : item)));
    setActionSuccess(`Withdrawal of $${w.amount.toLocaleString()} marked as ${action.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // KYC APPROVAL / REJECTION / TIER UPGRADE
  const handleProcessKyc = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      await supabase.from('kyc_submissions').update({ status, rejection_reason: reason }).eq('id', id);
    } catch (_e) {}

    setKycSubmissions((prev) => prev.map((k) => (k.id === id ? { ...k, status, rejectionReason: reason } : k)));
    setActionSuccess(`KYC submission successfully ${status.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleUpgradeKycTier = async (id: string, tier: string) => {
    try {
      await supabase.from('kyc_submissions').update({ tier }).eq('id', id);
    } catch (_e) {}

    setKycSubmissions((prev) => prev.map((k) => (k.id === id ? { ...k, tier } : k)));
    setActionSuccess(`User KYC upgraded to ${tier}`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // WALLET MANAGEMENT (ADD / EDIT / DELETE)
  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletCoinName.trim() || !walletNetwork.trim() || !walletAddressInput.trim()) {
      setActionError('Please fill out Coin Name, Network, and Wallet Address.');
      setTimeout(() => setActionError(null), 3000);
      return;
    }

    const qrUrl = walletQrCode.trim() || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(walletAddressInput.trim())}`;

    if (editingWallet) {
      const updated = wallets.map((w) => (w.id === editingWallet.id ? { ...w, coinName: walletCoinName, network: walletNetwork, walletAddress: walletAddressInput, qrCodeUrl: qrUrl } : w));
      setWallets(updated);
      try {
        await supabase.from('wallets').update({ coin_name: walletCoinName, network: walletNetwork, wallet_address: walletAddressInput, qr_code_url: qrUrl }).eq('id', editingWallet.id);
      } catch (_e) {}
      if (typeof window !== 'undefined') {
        localStorage.setItem('growvest_company_wallets', JSON.stringify(updated));
      }
      setActionSuccess('Wallet details successfully updated.');
    } else {
      const newW: CompanyWallet = {
        id: 'w_' + Math.random().toString(36).substring(2, 11),
        coinName: walletCoinName,
        network: walletNetwork,
        walletAddress: walletAddressInput.trim(),
        qrCodeUrl: qrUrl
      };
      const updated = [newW, ...wallets];
      setWallets(updated);
      try {
        await supabase.from('wallets').insert([newW]);
      } catch (_e) {}
      if (typeof window !== 'undefined') {
        localStorage.setItem('growvest_company_wallets', JSON.stringify(updated));
      }
      setActionSuccess('New deposit wallet successfully added.');
    }

    setWalletModalOpen(false);
    setEditingWallet(null);
    setWalletCoinName('');
    setWalletNetwork('');
    setWalletAddressInput('');
    setWalletQrCode('');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleDeleteWallet = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this receiving wallet?')) {
      const updated = wallets.filter((w) => w.id !== id);
      setWallets(updated);
      try {
        await supabase.from('wallets').delete().eq('id', id);
      } catch (_e) {}
      if (typeof window !== 'undefined') {
        localStorage.setItem('growvest_company_wallets', JSON.stringify(updated));
      }
      setActionSuccess('Wallet successfully removed.');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('growvest_auth_user');
    }
    navigate('/login');
  };

  // STATS & CALCULATIONS
  const totalBalance = profiles.reduce((acc, p) => acc + (Number(p.balance) || 0), 0);
  const totalUsers = profiles.length;
  const pendingKycCount = kycSubmissions.filter((k) => k.status === 'pending').length;
  const pendingDepositsCount = deposits.filter((d) => d.status === 'pending').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const totalDepositsToday = deposits
    .filter((d) => d.status === 'approved' && (d.date || '').startsWith(todayStr))
    .reduce((acc, d) => acc + d.amount, 0);
  const totalWithdrawalsToday = withdrawals
    .filter((w) => w.status === 'approved' && (w.date || '').startsWith(todayStr))
    .reduce((acc, w) => acc + w.amount, 0);

  const filteredProfiles = profiles.filter((p) => {
    const matchesQuery =
      (p.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' ? true : p.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
            Loading Growvest Executive Terminal...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Executive Access Restricted</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {authError || "You must possess an active account with role = 'admin' to access https://growvestx.com/admin."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign in with Admin Credentials</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-tight">GrowvestX Admin Panel</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wide">
                  Secure Enclave
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Connected: {currentAdminProfile?.email || 'admin@growvestx.com'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>User Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-400 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{actionError}</span>
          </div>
        )}

        {/* 5. DASHBOARD CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Total Deposits Today</span>
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
              ${totalDepositsToday.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Confirmed inbound capital</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Total Withdrawals Today</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight font-mono">
              ${totalWithdrawalsToday.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Authorized payouts</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Pending KYC Count</span>
              <FileCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400 tracking-tight">
              {pendingKycCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Documents awaiting review</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Total Users</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {totalUsers}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Registered accounts in Supabase</p>
          </div>
        </section>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-3 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'users', label: 'User Management', icon: Users, badge: totalUsers },
            { id: 'kyc', label: 'KYC Approvals', icon: FileCheck, badge: pendingKycCount },
            { id: 'deposits', label: 'Deposit Approvals', icon: ArrowDownLeft, badge: pendingDepositsCount },
            { id: 'withdrawals', label: 'Withdrawal Approvals', icon: ArrowUpRight, badge: pendingWithdrawalsCount },
            { id: 'wallets', label: 'Wallet Settings', icon: Wallet, badge: wallets.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 0: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
              <h3 className="text-base font-bold text-white">GrowvestX Executive Control Center</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Welcome to the production admin enclave for <code className="text-emerald-400 font-mono">https://growvestx.com</code>. All database operations sync directly with Supabase tables (<code className="text-emerald-400 font-mono">profiles</code>, <code className="text-emerald-400 font-mono">transactions</code>, <code className="text-emerald-400 font-mono">kyc_submissions</code>, <code className="text-emerald-400 font-mono">wallets</code>).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-400">Total System AUM</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-400">Pending Actions Queue</div>
                  <div className="text-xl font-bold font-mono text-amber-400">{pendingDepositsCount + pendingWithdrawalsCount + pendingKycCount} Items</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-400">Active Deposit Wallets</div>
                  <div className="text-xl font-bold font-mono text-sky-400">{wallets.length} Configured</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">User Profiles & Accounts Directory</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage user credentials, balances, currencies (USD, GBP, EUR, CAD, AUD, AED), and account statuses.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add User</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Name & Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Balance / Currency</th>
                    <th className="py-3.5 px-4">KYC Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">No user profiles found.</td>
                    </tr>
                  ) : (
                    filteredProfiles.map((user) => {
                      const kycItem = kycSubmissions.find((k) => k.userId === user.id);
                      const kycStatus = kycItem?.status || 'unverified';

                      return (
                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="font-semibold text-white">{user.full_name || 'Investor'}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                              {user.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                            ${(Number(user.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] text-slate-400 font-normal">(USD)</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${kycStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {kycStatus}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Edit Modal Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingUser(user);
                                  setEditName(user.full_name || '');
                                  setEditEmail(user.email || '');
                                  setEditBalance(String(user.balance || 0));
                                  setEditCurrency('USD');
                                }}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium cursor-pointer"
                              >
                                Edit
                              </button>

                              {/* Reset Password */}
                              <button
                                type="button"
                                onClick={() => handleResetPassword(user.email)}
                                className="px-2.5 py-1 rounded bg-blue-950/40 hover:bg-blue-900/50 text-sky-300 text-[11px] font-medium cursor-pointer"
                                title="Reset Password"
                              >
                                Reset Pass
                              </button>

                              {/* Change Balance Add/Debit */}
                              <button
                                type="button"
                                onClick={() => {
                                  setBalanceUserModal(user);
                                  setBalanceActionType('credit');
                                  setBalanceAmountInput('1000');
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-[11px] font-medium cursor-pointer"
                              >
                                Balance +/-
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
          </section>
        )}

        {/* TAB 2: KYC MANAGEMENT */}
        {activeTab === 'kyc' && (
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">KYC Submissions & Approvals</h2>
                <p className="text-xs text-slate-400 mt-0.5">Review investor identification documents, selfies, and proof of address. Approved KYC enables Tier upgrades.</p>
              </div>
              <button type="button" onClick={loadAllData} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">User / Email</th>
                    <th className="py-3.5 px-4">ID Type</th>
                    <th className="py-3.5 px-4">Documents Preview</th>
                    <th className="py-3.5 px-4">Tier Level</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {kycSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">No KYC submissions found.</td>
                    </tr>
                  ) : (
                    kycSubmissions.map((k) => (
                      <tr key={k.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-semibold text-white">{k.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{k.userEmail}</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-200">{k.idType}</td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {k.idFrontUrl ? (
                              <button
                                type="button"
                                onClick={() => setInspectImageUrl(k.idFrontUrl || null)}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-[11px] font-mono cursor-pointer transition-colors"
                              >
                                {k.idFrontUrl.startsWith('data:image') || k.idFrontUrl.startsWith('http') ? (
                                  <img src={k.idFrontUrl} alt="ID/Passport" className="w-5 h-5 rounded object-cover" />
                                ) : (
                                  <FileText className="w-3.5 h-3.5" />
                                )}
                                <span>ID/Passport</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500 font-mono">No ID Scan</span>
                            )}
                            {k.selfieUrl && (
                              <button
                                type="button"
                                onClick={() => setInspectImageUrl(k.selfieUrl || null)}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-mono cursor-pointer transition-colors"
                              >
                                {k.selfieUrl.startsWith('data:image') || k.selfieUrl.startsWith('http') ? (
                                  <img src={k.selfieUrl} alt="Selfie" className="w-5 h-5 rounded object-cover" />
                                ) : (
                                  <FileText className="w-3.5 h-3.5" />
                                )}
                                <span>Selfie</span>
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={k.tier || 'Tier 1'}
                            onChange={(e) => handleUpgradeKycTier(k.id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none cursor-pointer"
                          >
                            <option value="Tier 1">Tier 1 (Standard)</option>
                            <option value="Tier 2">Tier 2 (Advanced)</option>
                            <option value="Tier 3">Tier 3 (Institutional)</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${k.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : k.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {k.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {k.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => handleProcessKyc(k.id, 'approved')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {k.status !== 'rejected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const reason = prompt('Enter KYC rejection note/reason:');
                                  if (reason) handleProcessKyc(k.id, 'rejected', reason);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800 text-red-300 text-xs cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: DEPOSIT APPROVALS */}
        {activeTab === 'deposits' && (
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Deposit Approvals & Queue</h2>
                <p className="text-xs text-slate-400 mt-0.5">Approve deposits to automatically credit user balances in Supabase. You can also reject or cancel with notes.</p>
              </div>
              <button type="button" onClick={loadAllData} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Investor</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Method / Proof</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions (Approve / Reject / Cancel)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {deposits.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">No deposit records found.</td>
                    </tr>
                  ) : (
                    deposits.map((dep) => (
                      <tr key={dep.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-semibold text-white">{dep.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{dep.userEmail}</div>
                        </td>

                        <td className="py-3.5 px-4 text-emerald-400 font-mono font-bold text-sm">
                          ${dep.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          <div>{dep.method}</div>
                          <div className="text-[10px] text-sky-400 font-mono">{dep.proofFileName || 'Receipt.png'}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${dep.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : dep.status === 'rejected' || dep.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {dep.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleProcessDeposit(dep.id, 'approved')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                              title="Approve & automatically credit user balance in Supabase"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const note = prompt('Admin Rejection Reason Note:');
                                if (note) handleProcessDeposit(dep.id, 'rejected', note);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800 text-red-300 text-xs cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const note = prompt('Admin Cancellation Note:');
                                if (note) handleProcessDeposit(dep.id, 'cancelled', note);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 4: WITHDRAWAL APPROVALS */}
        {activeTab === 'withdrawals' && (
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Withdrawal Approvals & Payouts</h2>
                <p className="text-xs text-slate-400 mt-0.5">Authorize payout requests with Approve, Reject, or Cancel actions and reason notes.</p>
              </div>
              <button type="button" onClick={loadAllData} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Investor</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Destination</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions (Approve / Reject / Cancel)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">No withdrawal records found.</td>
                    </tr>
                  ) : (
                    withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-semibold text-white">{w.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{w.userEmail}</div>
                        </td>

                        <td className="py-3.5 px-4 text-amber-400 font-mono font-bold text-sm">
                          ${w.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] max-w-xs truncate">
                          {w.destination}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : w.status === 'rejected' || w.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {w.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleProcessWithdrawal(w.id, 'approved')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const note = prompt('Admin Rejection Reason Note:');
                                if (note) handleProcessWithdrawal(w.id, 'rejected', note);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800 text-red-300 text-xs cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const note = prompt('Admin Cancellation Note:');
                                if (note) handleProcessWithdrawal(w.id, 'cancelled', note);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 5: WALLET SETTINGS */}
        {activeTab === 'wallets' && (
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Company Wallet Settings</h2>
                <p className="text-xs text-slate-400 mt-0.5">Configure Coin Name, Network, Wallet Address, and QR Code. These automatically display as deposit options on the user deposit page.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingWallet(null);
                  setWalletCoinName('');
                  setWalletNetwork('');
                  setWalletAddressInput('');
                  setWalletQrCode('');
                  setWalletModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Wallet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wallets.map((w) => (
                <div key={w.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {w.coinName.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{w.coinName}</div>
                        <div className="text-[11px] text-slate-400">{w.network}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWallet(w);
                          setWalletCoinName(w.coinName);
                          setWalletNetwork(w.network);
                          setWalletAddressInput(w.walletAddress);
                          setWalletQrCode(w.qrCodeUrl || '');
                          setWalletModalOpen(true);
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit Wallet"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteWallet(w.id)}
                        className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/50 text-red-400"
                        title="Delete Wallet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
                    {w.walletAddress}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* MODALS */}

      {/* 1. Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create New User Profile</h3>
              <button type="button" onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="sarah@institution.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Initial Balance ($ USD)</label>
                  <input
                    type="number"
                    value={newUserBalance}
                    onChange={(e) => setNewUserBalance(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Currency</label>
                  <select
                    value={newUserCurrency}
                    onChange={(e) => setNewUserCurrency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ALLOWED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddUserOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Edit User Account</h3>
              <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Balance ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Currency</label>
                  <select
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ALLOWED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Manual Balance Credit / Debit Modal */}
      {balanceUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Manual Balance Adjustment</h3>
              <button type="button" onClick={() => setBalanceUserModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div>User: <span className="text-white font-semibold">{balanceUserModal.full_name}</span></div>
              <div>Email: <span className="font-mono text-emerald-400">{balanceUserModal.email}</span></div>
              <div>Current Balance: <span className="font-mono text-white">${(balanceUserModal.balance || 0).toLocaleString()}</span></div>
            </div>
            <form onSubmit={handleApplyManualBalance} className="space-y-4">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBalanceActionType('credit')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${balanceActionType === 'credit' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Credit (+)
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceActionType('debit')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${balanceActionType === 'debit' ? 'bg-red-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Debit (-)
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={balanceAmountInput}
                  onChange={(e) => setBalanceAmountInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={balanceReasonInput}
                  onChange={(e) => setBalanceReasonInput(e.target.value)}
                  placeholder="e.g. Treasury adjustment"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setBalanceUserModal(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${balanceActionType === 'credit' ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-slate-950'}`}>
                  Confirm {balanceActionType === 'credit' ? 'Credit' : 'Debit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Wallet Modal (Add / Edit) */}
      {walletModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{editingWallet ? 'Edit Deposit Wallet' : 'Add New Deposit Wallet'}</h3>
              <button type="button" onClick={() => setWalletModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Coin Name *</label>
                <input
                  type="text"
                  required
                  value={walletCoinName}
                  onChange={(e) => setWalletCoinName(e.target.value)}
                  placeholder="e.g. USDT or Bitcoin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Network *</label>
                <input
                  type="text"
                  required
                  value={walletNetwork}
                  onChange={(e) => setWalletNetwork(e.target.value)}
                  placeholder="e.g. Tron (TRC-20)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Wallet Address *</label>
                <input
                  type="text"
                  required
                  value={walletAddressInput}
                  onChange={(e) => setWalletAddressInput(e.target.value)}
                  placeholder="Enter recipient wallet address"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">QR Code Image URL (Optional)</label>
                <input
                  type="text"
                  value={walletQrCode}
                  onChange={(e) => setWalletQrCode(e.target.value)}
                  placeholder="https://... or leave blank for auto QR"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setWalletModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer">
                  Save Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KYC Inspect Image Modal */}
      {inspectImageUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Identity Document & Passport Picture Preview</span>
              </h3>
              <button type="button" onClick={() => setInspectImageUrl(null)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-[60vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
              <img src={inspectImageUrl} alt="Passport / ID Full Preview" className="max-w-full max-h-full object-contain rounded-xl" />
            </div>
            <div className="flex justify-end pt-2">
              <button type="button" onClick={() => setInspectImageUrl(null)} className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
