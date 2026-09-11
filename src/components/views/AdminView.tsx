import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Settings,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Edit2,
  Ban,
  CheckCircle2,
  Plus,
  Activity,
  Layers,
  ShieldAlert,
  Server,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Trash2,
  Send,
  Clock,
  RotateCcw,
  Wallet,
  Globe,
  Sliders,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  BellRing,
  Zap,
  Sparkles,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../services/currency';
import { smartsuppService, SmartsuppStats } from '../../services/smartsuppService';
import {
  UserProfile,
  Transaction,
  UserAccountStatus,
  SiteMediaItem,
  KYCSubmission,
  InvestmentPlan
} from '../../types';
import { AdminUsersTab } from '../admin/AdminUsersTab';
import { AdminWalletsTab } from '../admin/AdminWalletsTab';
import { AdminTransactionsTab } from '../admin/AdminTransactionsTab';
import { NexusAdminOverview } from '../admin/NexusAdminOverview';
import {
  LayoutDashboard,
  Coins as CoinsIcon,
  LineChart,
  CandlestickChart,
  Bot,
  Terminal,
  Radar,
  ShoppingBag,
  Share2,
  Lock,
  Menu
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    transactions,
    allUsers,
    investmentPlans,
    auditLogs,
    kycSubmissions,
    siteMedia,
    companyDepositWallets,
    adminApproveDeposit,
    adminRejectDeposit,
    adminApproveWithdrawal,
    adminRejectWithdrawal,
    adminApproveKycSubmission,
    adminRejectKycSubmission,
    adminCreateInvestmentPlan,
    adminUpdateInvestmentPlan,
    adminDeleteInvestmentPlan,
    adminToggleInvestmentPlanStatus,
    adminAddMediaItem,
    adminUpdateMediaItem,
    adminDeleteMediaItem,
    adminToggleMediaItemStatus,
    getAdminStats
  } = useAuth();

  const { addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'wallets' | 'transactions' | 'deposits' | 'withdrawals' | 'kyc' | 'plans' | 'cms' | 'audit' | 'smartsupp'
  >('overview');

  const [smartsuppStats, setSmartsuppStats] = useState<SmartsuppStats>(() => smartsuppService.getLiveTelemetry());
  const [smartsuppKeyInput, setSmartsuppKeyInput] = useState('cf28a49c9535e69e4f0148b598b0f8ae');
  const [testPushText, setTestPushText] = useState('Hello! Your GreenEza portfolio advisor has reviewed your deposit.');

  // Queues & filters
  const [kycStatusFilter, setKycStatusFilter] = useState<string>('all');
  const [depositFilter, setDepositFilter] = useState<string>('pending');
  const [withdrawalFilter, setWithdrawalFilter] = useState<string>('pending');
  const [auditFilter, setAuditFilter] = useState<string>('all');

  // Deposit Proof Inspection Modal
  const [inspectProofTx, setInspectProofTx] = useState<Transaction | null>(null);

  // KYC Inspection Modal
  const [inspectKyc, setInspectKyc] = useState<KYCSubmission | null>(null);
  const [kycCustomNote, setKycCustomNote] = useState<string>('');
  const [kycRejectReason, setKycRejectReason] = useState<string>('Document image illegible or expired.');

  // Rejection modal for deposit/withdrawal
  const [rejectModalTx, setRejectModalTx] = useState<{ id: string; type: 'deposit' | 'withdrawal'; ref: string; amount: number } | null>(null);
  const [rejectReason, setRejectReason] = useState('Compliance mismatch or unverified source');

  // Site Media / CMS
  const [isNewMediaModalOpen, setIsNewMediaModalOpen] = useState(false);
  const [editingMediaItem, setEditingMediaItem] = useState<SiteMediaItem | null>(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState<SiteMediaItem['category']>('banner');
  const [mediaPlacement, setMediaPlacement] = useState<SiteMediaItem['placement']>('announcement_banner');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaDesc, setMediaDesc] = useState('');
  const [mediaLinkUrl, setMediaLinkUrl] = useState('');
  const [mediaActive, setMediaActive] = useState(true);

  // New Plan Modal
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanMin, setNewPlanMin] = useState(1000);
  const [newPlanMax, setNewPlanMax] = useState(500000);
  const [newPlanFee, setNewPlanFee] = useState(0.5);
  const [newPlanRoi, setNewPlanRoi] = useState(14.5);
  const [newPlanLockDays, setNewPlanLockDays] = useState(90);
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanRisk, setNewPlanRisk] = useState<'Low' | 'Moderate' | 'High' | 'Speculative'>('Moderate');
  const [newPlanStrategy, setNewPlanStrategy] = useState<'conservative' | 'balanced' | 'growth' | 'defi_yield'>('balanced');
  const [newPlanTerms, setNewPlanTerms] = useState('Standard 12-month capital commitment with quarterly rebalancing.');

  // Edit Plan Modal
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [editPlanTitle, setEditPlanTitle] = useState('');
  const [editPlanMin, setEditPlanMin] = useState(1000);
  const [editPlanMax, setEditPlanMax] = useState(500000);
  const [editPlanFee, setEditPlanFee] = useState(0.5);
  const [editPlanRoi, setEditPlanRoi] = useState(14.5);
  const [editPlanLockDays, setEditPlanLockDays] = useState(90);
  const [editPlanDesc, setEditPlanDesc] = useState('');
  const [editPlanRisk, setEditPlanRisk] = useState<'Low' | 'Moderate' | 'High' | 'Speculative'>('Moderate');
  const [editPlanStrategy, setEditPlanStrategy] = useState<'conservative' | 'balanced' | 'growth' | 'defi_yield'>('balanced');
  const [editPlanTerms, setEditPlanTerms] = useState('');
  const [editPlanPopular, setEditPlanPopular] = useState(false);

  // Delete Plan Confirmation Modal
  const [planToDelete, setPlanToDelete] = useState<InvestmentPlan | null>(null);

  const stats = getAdminStats();

  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
  const pendingKycCount = kycSubmissions.filter(k => k.status === 'pending').length;

  const handleApproveDeposit = async (txId: string) => {
    const res = await adminApproveDeposit(txId);
    if (res.success) {
      addNotification({
        type: 'transaction',
        title: 'Deposit Approved',
        message: `Transaction ${txId} confirmed and user ledger credited.`
      });
    }
  };

  const handleApproveWithdrawal = async (txId: string) => {
    const res = await adminApproveWithdrawal(txId);
    if (res.success) {
      addNotification({
        type: 'transaction',
        title: 'Withdrawal Approved',
        message: `Payout ${txId} approved for banking dispatch.`
      });
    }
  };

  const handleOpenRejectModal = (tx: Transaction) => {
    setRejectModalTx({
      id: tx.id,
      type: tx.type === 'deposit' ? 'deposit' : 'withdrawal',
      ref: tx.reference,
      amount: tx.amountUsd
    });
    setRejectReason(tx.type === 'deposit' ? 'Unverified source wire or compliance mismatch' : 'Destination address mismatch or security hold');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalTx) return;
    if (rejectModalTx.type === 'deposit') {
      const res = await adminRejectDeposit(rejectModalTx.id, rejectReason);
      if (res.success) {
        addNotification({
          type: 'transaction',
          title: 'Deposit Rejected',
          message: `Deposit TX #${rejectModalTx.ref} marked as rejected.`
        });
      }
    } else {
      const res = await adminRejectWithdrawal(rejectModalTx.id, rejectReason);
      if (res.success) {
        addNotification({
          type: 'transaction',
          title: 'Withdrawal Rejected',
          message: `Payout TX #${rejectModalTx.ref} rejected and balance restored.`
        });
      }
    }
    setRejectModalTx(null);
  };

  const handleApproveKyc = async (submissionId: string) => {
    const res = await adminApproveKycSubmission(submissionId, kycCustomNote);
    if (res.success) {
      addNotification({
        type: 'account',
        title: 'KYC Verified',
        message: 'Client identity documents approved.'
      });
      setInspectKyc(null);
    }
  };

  const handleRejectKyc = async (submissionId: string) => {
    const res = await adminRejectKycSubmission(submissionId, kycRejectReason);
    if (res.success) {
      addNotification({
        type: 'account',
        title: 'KYC Rejected',
        message: 'Client identity rejected with compliance note.'
      });
      setInspectKyc(null);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminCreateInvestmentPlan({
      title: newPlanTitle,
      strategyType: newPlanStrategy,
      riskLevel: newPlanRisk,
      durationMonths: 12,
      minAmountUsd: newPlanMin,
      maxAmountUsd: newPlanMax,
      managementFeePercent: newPlanFee,
      description: newPlanDesc,
      assetComposition: [
        { asset: 'Global Equities Core', percentage: 50 },
        { asset: 'Fixed Income & Sovereign Debt', percentage: 35 },
        { asset: 'Liquid Digital Assets', percentage: 15 }
      ],
      historicalBenchmark3Yr: '+11.2% p.a. (Indicative)',
      isDemoPlan: true,
      terms: newPlanTerms,
      status: 'active'
    });
    setIsNewPlanModalOpen(false);
    setNewPlanTitle('');
    setNewPlanDesc('');
    addNotification({
      type: 'system',
      title: 'Investment Strategy Created',
      message: 'New portfolio strategy is now active on the platform.'
    });
  };

  const handleOpenEditPlan = (plan: InvestmentPlan) => {
    setEditingPlan(plan);
    setEditPlanTitle(plan.title);
    setEditPlanMin(plan.minAmountUsd || 1000);
    setEditPlanMax(plan.maxAmountUsd || 500000);
    setEditPlanFee(plan.managementFeePercent || 0.5);
    setEditPlanRoi(plan.expectedRoiPercent || 14.5);
    setEditPlanLockDays(plan.lockPeriodDays || 90);
    setEditPlanDesc(plan.description || '');
    setEditPlanRisk(plan.riskLevel as any || 'Moderate');
    setEditPlanStrategy(plan.strategyType as any || 'balanced');
    setEditPlanTerms(plan.terms || 'Standard capital commitment with quarterly rebalancing.');
    setEditPlanPopular(!!plan.isPopular);
  };

  const handleSaveEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    await adminUpdateInvestmentPlan(editingPlan.id, {
      title: editPlanTitle,
      minAmountUsd: editPlanMin,
      maxAmountUsd: editPlanMax,
      managementFeePercent: editPlanFee,
      expectedRoiPercent: editPlanRoi,
      lockPeriodDays: editPlanLockDays,
      description: editPlanDesc,
      riskLevel: editPlanRisk,
      strategyType: editPlanStrategy,
      terms: editPlanTerms,
      isPopular: editPlanPopular
    });
    setEditingPlan(null);
    addNotification({
      type: 'system',
      title: 'Investment Strategy Updated',
      message: `Portfolio ${editPlanTitle} changes successfully saved.`
    });
  };

  const handleConfirmDeletePlan = async () => {
    if (!planToDelete) return;
    await adminDeleteInvestmentPlan(planToDelete.id);
    addNotification({
      type: 'system',
      title: 'Investment Strategy Deleted',
      message: `Portfolio strategy "${planToDelete.title}" has been permanently removed.`
    });
    setPlanToDelete(null);
  };

  const handleSaveMediaItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMediaItem) {
      await adminUpdateMediaItem(editingMediaItem.id, {
        title: mediaTitle,
        category: mediaCategory,
        placement: mediaPlacement,
        urlOrDataUrl: mediaUrl,
        description: mediaDesc,
        linkUrl: mediaLinkUrl,
        isActive: mediaActive
      });
    } else {
      await adminAddMediaItem({
        title: mediaTitle,
        category: mediaCategory,
        placement: mediaPlacement,
        urlOrDataUrl: mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        description: mediaDesc,
        linkUrl: mediaLinkUrl,
        isActive: mediaActive
      });
    }
    setIsNewMediaModalOpen(false);
    setEditingMediaItem(null);
  };

  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [controlPanelExpanded, setControlPanelExpanded] = useState(false);
  const [botsExpanded, setBotsExpanded] = useState(false);

  return (
    <div id="growvest-admin-workspace" className="min-h-screen bg-[#0b0c10] text-slate-100 font-sans -mx-4 -mt-6 sm:-mx-6 sm:-mt-8 p-3 sm:p-6">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-5">
        
        {/* LEFT SIDEBAR NAVIGATION (Matching Nexus Screenshot) */}
        <aside className={`
          lg:w-64 shrink-0 flex flex-col justify-between rounded-3xl bg-[#101217] border border-white/5 p-4 sm:p-5 shadow-2xl transition-all
          ${isSidebarOpenMobile ? 'block fixed inset-4 z-50 overflow-y-auto bg-[#101217]/95 backdrop-blur-xl' : 'hidden lg:flex'}
        `}>
          <div className="space-y-6">
            {/* Top Brand & Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                  <div className="w-full h-full bg-[#101217] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                    <span>Nexus Capital</span>
                  </h1>
                  <p className="text-[10px] text-slate-400 font-mono">Institutional Hub</p>
                </div>
              </div>

              {isSidebarOpenMobile && (
                <button
                  onClick={() => setIsSidebarOpenMobile(false)}
                  className="lg:hidden p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Navigation Groups */}
            <nav className="space-y-5 text-xs font-medium">
              {/* PRIMARY GROUP */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#1c202a] text-white font-bold shadow-xs border border-white/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('wallets');
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'wallets'
                      ? 'bg-[#1c202a] text-white font-bold shadow-xs border border-white/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CoinsIcon className={`w-4 h-4 ${activeTab === 'wallets' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>Coins</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400">
                    {companyDepositWallets.filter(w => w.isActive).length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'overview' && false
                      ? 'bg-[#1c202a] text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <LineChart className="w-4 h-4 text-slate-400" />
                  <span>Analytics</span>
                </button>
              </div>

              {/* TRADING SECTION */}
              <div className="space-y-1">
                <div className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Trading
                </div>

                <button
                  onClick={() => {
                    setActiveTab('users');
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-[#1c202a] text-white font-bold shadow-xs border border-white/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CandlestickChart className={`w-4 h-4 ${activeTab === 'users' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>Trading</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300">
                    {allUsers.length}
                  </span>
                </button>

                {/* Control Panel Accordion */}
                <div>
                  <button
                    onClick={() => setControlPanelExpanded(!controlPanelExpanded)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                      ['deposits', 'withdrawals', 'kyc'].includes(activeTab)
                        ? 'bg-[#1c202a] text-white font-bold border border-white/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sliders className="w-4 h-4 text-slate-400" />
                      <span>Control Panel</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${controlPanelExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {(controlPanelExpanded || ['deposits', 'withdrawals', 'kyc'].includes(activeTab)) && (
                    <div className="pl-6 pr-2 py-1 space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('deposits');
                          setIsSidebarOpenMobile(false);
                        }}
                        className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl text-[11px] transition-colors cursor-pointer ${
                          activeTab === 'deposits' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>Deposits Queue</span>
                        {pendingDeposits.length > 0 && (
                          <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-mono">
                            {pendingDeposits.length}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('withdrawals');
                          setIsSidebarOpenMobile(false);
                        }}
                        className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl text-[11px] transition-colors cursor-pointer ${
                          activeTab === 'withdrawals' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>Withdrawals Queue</span>
                        {pendingWithdrawals.length > 0 && (
                          <span className="text-[9px] px-1 rounded bg-rose-500/20 text-rose-300 font-mono">
                            {pendingWithdrawals.length}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('kyc');
                          setIsSidebarOpenMobile(false);
                        }}
                        className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl text-[11px] transition-colors cursor-pointer ${
                          activeTab === 'kyc' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>KYC Verification</span>
                        {pendingKycCount > 0 && (
                          <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300 font-mono">
                            {pendingKycCount}
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Chainex Bots */}
                <div>
                  <button
                    onClick={() => {
                      setActiveTab('plans');
                      setIsSidebarOpenMobile(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                      activeTab === 'plans'
                        ? 'bg-[#1c202a] text-white font-bold shadow-xs border border-white/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bot className={`w-4 h-4 ${activeTab === 'plans' ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>Chainex Bots</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('transactions');
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'transactions'
                      ? 'bg-[#1c202a] text-white font-bold shadow-xs border border-white/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Terminal className={`w-4 h-4 ${activeTab === 'transactions' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Terminal</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('kyc');
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'kyc'
                      ? 'bg-[#1c202a] text-white font-bold shadow-xs border border-white/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Radar className={`w-4 h-4 ${activeTab === 'kyc' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>Pump Screener</span>
                  </div>
                  {pendingKycCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('cms');
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'cms'
                      ? 'bg-[#1c202a] text-white font-bold shadow-xs border border-white/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <ShoppingBag className={`w-4 h-4 ${activeTab === 'cms' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Marketplace</span>
                </button>
              </div>

              {/* PREFERENCE SECTION */}
              <div className="space-y-1">
                <div className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Preference
                </div>

                <button
                  onClick={() => {
                    setActiveTab('smartsupp');
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'smartsupp'
                      ? 'bg-[#1c202a] text-white font-bold shadow-xs border border-white/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Share2 className={`w-4 h-4 ${activeTab === 'smartsupp' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Refer a Friend</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('audit');
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'audit'
                      ? 'bg-[#1c202a] text-white font-bold shadow-xs border border-white/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Lock className={`w-4 h-4 ${activeTab === 'audit' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Security & Audit</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Bottom Card Widget: "Never miss a pump" (Matching Screenshot) */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-b from-[#143d2c] via-[#0d2a1e] to-[#081812] border border-emerald-500/20 text-white relative overflow-hidden shadow-xl">
            {/* 3D coin illustration */}
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs leading-tight">
                Never miss<br />a pump
              </h4>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-xs shadow-md">
                ●
              </div>
            </div>

            <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">
              Get real-time AI signals and price alerts directly to your phone.
            </p>

            <button
              onClick={() => {
                addNotification({
                  type: 'system',
                  title: 'Real-Time Alert Feed',
                  message: 'Automated AI pump & volatility notifications enabled.'
                });
              }}
              className="mt-3 w-full py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-[11px] transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md"
            >
              Notify Me
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE CONTENT AREA */}
        <main className="flex-1 min-w-0 space-y-4">
          {/* Top Header Bar (Matching Nexus Screenshot) */}
          <header className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-[#101217] border border-white/5 shadow-xl">
            {/* Mobile menu toggle button */}
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="lg:hidden p-2 rounded-xl bg-[#1c202a] text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Pill Search Input Bar */}
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adminSearchQuery}
                onChange={e => setAdminSearchQuery(e.target.value)}
                placeholder="Search Crypto, Users, Ledgers..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#181b23] border border-white/5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
              />
            </div>

            {/* Right Action Icons & User Profile Pill */}
            <div className="flex items-center gap-2.5">
              {/* Notification Bell with alert indicator */}
              <button
                onClick={() => setActiveTab('smartsupp')}
                className="w-9 h-9 rounded-full bg-[#181b23] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#202530] transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <BellRing className="w-4 h-4" />
                {(pendingDeposits.length > 0 || pendingKycCount > 0) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1 animate-pulse" />
                )}
              </button>

              {/* User Profile Pill (Jack Nickelsen / Admin) */}
              <div
                onClick={() => setActiveTab('users')}
                className="flex items-center gap-2.5 px-2.5 py-1 rounded-full bg-[#181b23] border border-white/5 hover:border-white/15 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 font-bold text-xs flex items-center justify-center shadow-md">
                  JN
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-white leading-tight">
                    Jack Nickelsen
                  </div>
                  <div className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider font-mono">
                    Pro Account
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ACTIVE TAB CONTENT */}
          <div className="transition-all">
            {/* OVERVIEW (THE EXACT REPLICA LAYOUT) */}
            {activeTab === 'overview' && (
              <NexusAdminOverview onNavigateTab={(tab) => setActiveTab(tab)} />
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && <AdminUsersTab />}

            {/* WALLETS / VAULTS TAB */}
            {activeTab === 'wallets' && <AdminWalletsTab />}

            {/* TRANSACTIONS TAB */}
            {activeTab === 'transactions' && <AdminTransactionsTab />}

            {/* DEPOSITS QUEUE TAB */}
            {activeTab === 'deposits' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl">
                  <div>
                    <h2 className="text-base font-bold text-white">Customer Deposits Queue</h2>
                    <p className="text-xs text-slate-400">Review wire, crypto, and card deposit transactions.</p>
                  </div>
                  <select
                    value={depositFilter}
                    onChange={e => setDepositFilter(e.target.value)}
                    className="px-3.5 py-2 rounded-2xl bg-[#1a1d26] border border-white/10 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="pending">Pending Approval</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                    <option value="all">All Deposits</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {transactions
                    .filter(t => t.type === 'deposit' && (depositFilter === 'all' || t.status === depositFilter))
                    .map(tx => (
                      <div
                        key={tx.id}
                        className="p-4 sm:p-5 rounded-3xl bg-[#13151b] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                            <ArrowDownLeft className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-white">{tx.reference}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                tx.status === 'completed'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : tx.status === 'pending'
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}>
                                {tx.status}
                              </span>

                              {tx.proofUrl && (
                                <button
                                  type="button"
                                  onClick={() => setInspectProofTx(tx)}
                                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25 transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <ImageIcon className="w-3 h-3" />
                                  <span>Payment Proof</span>
                                </button>
                              )}
                            </div>
                            <div className="text-xs text-slate-300 mt-1">
                              <span className="font-semibold text-white">{tx.userName}</span> ({tx.userEmail})
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Rail: {tx.method} • {new Date(tx.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          <div className="text-left sm:text-right">
                            <div className="text-sm font-mono font-bold text-emerald-400">
                              +${tx.amountUsd.toFixed(2)} USD
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{tx.amount} {tx.currency}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {tx.proofUrl && (
                              <button
                                onClick={() => setInspectProofTx(tx)}
                                className="px-3 py-1.5 rounded-xl bg-[#1c202a] text-slate-200 text-xs font-semibold hover:bg-[#252b38] transition-colors cursor-pointer flex items-center gap-1 border border-white/5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Proof</span>
                              </button>
                            )}

                            {tx.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveDeposit(tx.id)}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-lg"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleOpenRejectModal(tx)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-bold text-xs cursor-pointer border border-rose-500/20"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* WITHDRAWALS QUEUE TAB */}
            {activeTab === 'withdrawals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl">
                  <div>
                    <h2 className="text-base font-bold text-white">Customer Withdrawals Queue</h2>
                    <p className="text-xs text-slate-400">Authorize or reject client capital payout requests.</p>
                  </div>
                  <select
                    value={withdrawalFilter}
                    onChange={e => setWithdrawalFilter(e.target.value)}
                    className="px-3.5 py-2 rounded-2xl bg-[#1a1d26] border border-white/10 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="completed">Dispatched</option>
                    <option value="rejected">Rejected / Restored</option>
                    <option value="all">All Withdrawals</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {transactions
                    .filter(t => t.type === 'withdrawal' && (withdrawalFilter === 'all' || t.status === withdrawalFilter))
                    .map(tx => (
                      <div
                        key={tx.id}
                        className="p-4 sm:p-5 rounded-3xl bg-[#13151b] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-white">{tx.reference}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                tx.status === 'completed'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : tx.status === 'pending'
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}>
                                {tx.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-300 mt-1">
                              <span className="font-semibold text-white">{tx.userName}</span> ({tx.userEmail})
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Destination: {tx.destinationOrSource} • {new Date(tx.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          <div className="text-left sm:text-right">
                            <div className="text-sm font-mono font-bold text-rose-400">
                              -${tx.amountUsd.toFixed(2)} USD
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{tx.amount} {tx.currency}</div>
                          </div>

                          {tx.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApproveWithdrawal(tx.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-lg"
                              >
                                Approve Payout
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(tx)}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-bold text-xs cursor-pointer border border-rose-500/20"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* KYC QUEUE TAB */}
            {activeTab === 'kyc' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl">
                  <div>
                    <h2 className="text-base font-bold text-white">KYC Identity Documents Queue</h2>
                    <p className="text-xs text-slate-400">Examine passports, national IDs, and proof of address.</p>
                  </div>
                  <select
                    value={kycStatusFilter}
                    onChange={e => setKycStatusFilter(e.target.value)}
                    className="px-3.5 py-2 rounded-2xl bg-[#1a1d26] border border-white/10 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="all">All Submissions</option>
                    <option value="pending">Pending Only</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kycSubmissions
                    .filter(k => kycStatusFilter === 'all' || k.status === kycStatusFilter)
                    .map(k => (
                      <div
                        key={k.id}
                        className="p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-sm text-white">{k.userName}</h3>
                            <p className="text-xs text-slate-400 font-mono">{k.userEmail}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            k.status === 'approved'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : k.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {k.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 space-y-1 font-mono">
                          <div>Doc Type: <span className="font-bold uppercase text-emerald-400">{k.documentType.replace('_', ' ')}</span></div>
                          <div>Doc Number: <span className="font-bold text-white">{k.documentNumber}</span></div>
                          <div>Country: <span className="font-bold text-white">{k.issuingCountry}</span></div>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(k.submittedAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setInspectKyc(k);
                                setKycCustomNote('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#1c202a] text-slate-200 font-semibold text-xs cursor-pointer border border-white/5 hover:bg-[#252b38]"
                            >
                              Inspect ID
                            </button>
                            {k.status === 'pending' && (
                              <button
                                onClick={() => handleApproveKyc(k.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-lg"
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* INVESTMENT PLANS TAB */}
            {activeTab === 'plans' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl">
                  <div>
                    <h2 className="text-base font-bold text-white">Investment Strategy Portfolios</h2>
                    <p className="text-xs text-slate-400">Configure yield strategies, edit risk parameters, or configure quantitative bots.</p>
                  </div>
                  <button
                    onClick={() => setIsNewPlanModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Portfolio Strategy</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investmentPlans.map(plan => (
                    <div
                      key={plan.id}
                      className="p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl space-y-3 relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-white">{plan.title}</h3>
                            {plan.isPopular && (
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{plan.riskLevel} Risk • {plan.strategyType}</p>
                        </div>
                        <button
                          onClick={() => adminToggleInvestmentPlanStatus(plan.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                            plan.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#1c202a] text-slate-400'
                          }`}
                        >
                          {plan.status === 'active' ? 'Active' : 'Archived'}
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {plan.description}
                      </p>

                      <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-[#0e1015] text-center text-xs font-mono border border-white/5">
                        <div>
                          <div className="text-[10px] text-slate-400">Min Capital</div>
                          <div className="font-bold text-white">${(plan.minAmountUsd ?? 0).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Max Cap</div>
                          <div className="font-bold text-white">${(plan.maxAmountUsd ?? 0).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Target ROI</div>
                          <div className="font-bold text-emerald-400">+{plan.expectedRoiPercent || 14.5}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Mgmt Fee</div>
                          <div className="font-bold text-slate-300">{plan.managementFeePercent}%</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Lock Period: {plan.lockPeriodDays || 90} Days
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPlan(plan)}
                            className="px-3 py-1.5 rounded-xl bg-[#1c202a] hover:bg-[#252b38] text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-white/5"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPlanToDelete(plan)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CMS / MEDIA TAB */}
            {activeTab === 'cms' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl">
                  <div>
                    <h2 className="text-base font-bold text-white">Live Website Media & Banners</h2>
                    <p className="text-xs text-slate-400">Publish announcements, security badges, and hero visuals.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingMediaItem(null);
                      setMediaTitle('');
                      setMediaUrl('');
                      setMediaDesc('');
                      setIsNewMediaModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Media Item</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {siteMedia.map(item => (
                    <div
                      key={item.id}
                      className="rounded-3xl bg-[#13151b] border border-white/5 overflow-hidden shadow-xl space-y-3"
                    >
                      <div className="h-32 bg-[#0a0c10] relative overflow-hidden">
                        <img
                          src={item.urlOrDataUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#13151b]/90 text-slate-200 backdrop-blur-xs border border-white/10">
                            {item.placement}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-white truncate">{item.title}</h4>
                          <button
                            onClick={() => adminToggleMediaItemStatus(item.id)}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                              item.isActive
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-[#1c202a] text-slate-400'
                            }`}
                          >
                            {item.isActive ? 'Active' : 'Hidden'}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AUDIT TRAIL TAB */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl">
                  <h2 className="text-base font-bold text-white">Cryptographic Security Audit Trail</h2>
                  <p className="text-xs text-slate-400">Immutable ledger recording all administrative, monetary, and compliance decisions.</p>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {auditLogs.map(log => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-[#13151b] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400 uppercase text-[11px]">
                            {log.action}
                          </span>
                          <span className="text-slate-400 text-[10px]">by {log.adminEmail}</span>
                        </div>
                        <div className="text-slate-300 text-[11px] font-sans">
                          {log.details}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 shrink-0">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LIVE SUPPORT & PUSH NOTIFICATIONS TAB */}
            {activeTab === 'smartsupp' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-[#13151b] via-[#101b16] to-[#0c221a] border border-white/10 text-white shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold">Institutional Live Support & Push Engine</h2>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            LIVE DESK
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Live client chat, automated push notifications on agent response, and multi-channel AI auto-responders.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => smartsuppService.openChat()}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Launch Live Chat</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-[#0c0e12]/80 border border-white/5 text-center">
                      <div className="text-xl font-bold font-mono text-emerald-400">
                        {smartsuppStats.averageResponseTimeSeconds}s
                      </div>
                      <div className="text-[11px] text-slate-400">Average Agent Response</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0c0e12]/80 border border-white/5 text-center">
                      <div className="text-xl font-bold font-mono text-white">
                        {smartsuppStats.pushNotificationsDelivered}
                      </div>
                      <div className="text-[11px] text-slate-400">Push Alerts Delivered</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0c0e12]/80 border border-white/5 text-center">
                      <div className="text-xl font-bold font-mono text-amber-400">
                        {smartsuppStats.aiAutoHandledPercentage}%
                      </div>
                      <div className="text-[11px] text-slate-400">AI Auto-Resolved</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0c0e12]/80 border border-white/5 text-center">
                      <div className="text-xl font-bold font-mono text-purple-400">
                        {smartsuppStats.satisfactionRating} / 5.0
                      </div>
                      <div className="text-[11px] text-slate-400">Customer CSAT Score</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Push Notifications Card */}
                  <div className="p-6 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white">
                        Push Notifications Engine
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Keep your visitors in the loop with push notifications when an agent responds. They don’t need to keep the app open to stay updated.
                    </p>

                    <div className="p-4 rounded-2xl bg-[#0d0e12] border border-white/5 space-y-2 text-xs font-mono">
                      <div className="text-slate-400 text-[11px]">Simulate / Test Agent Push Notification:</div>
                      <input
                        type="text"
                        value={testPushText}
                        onChange={e => setTestPushText(e.target.value)}
                        placeholder="Enter message to dispatch..."
                        className="w-full p-2.5 rounded-xl bg-[#181b23] border border-white/10 text-white text-xs"
                      />
                      <button
                        onClick={async () => {
                          await smartsuppService.requestPushNotificationPermission();
                          smartsuppService.triggerAgentResponseNotification('Marcus Lindberg (Senior Advisor)', testPushText);
                          setSmartsuppStats(smartsuppService.getLiveTelemetry());
                          addNotification({
                            type: 'system',
                            title: 'Push Notification Dispatched',
                            message: 'Test agent response alert sent successfully.'
                          });
                        }}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
                      >
                        Send Agent Response Push Notification
                      </button>
                    </div>
                  </div>

                  {/* AI Tools Integrations */}
                  <div className="p-6 rounded-3xl bg-[#13151b] border border-white/5 shadow-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">
                        Run Smartsupp with your AI Tools
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      One setup, full access to your conversations, contacts and statistics. Effortlessly connect your most popular tools without any barriers, ensuring seamless integration and streamlined workflows.
                    </p>

                    <div className="space-y-2">
                      {smartsuppStats.connectedTools.map((tool, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-[#0d0e12] border border-white/5 flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-slate-200">{tool}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Connected
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reject Modal */}
      {rejectModalTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setRejectModalTx(null)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4">
            <h3 className="text-base font-bold text-rose-600">
              Reject Transaction #{rejectModalTx.ref}
            </h3>
            <p className="text-xs text-slate-500">
              Provide formal compliance justification for rejecting this {rejectModalTx.type}.
            </p>
            <div>
              <label className="block text-xs font-semibold mb-1">Reason / Note</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect KYC Modal */}
      {inspectKyc && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setInspectKyc(null)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">KYC Review: {inspectKyc.userName}</h3>
              <button onClick={() => setInspectKyc(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs space-y-1.5 font-mono">
              <div>Email: <span className="font-bold">{inspectKyc.userEmail}</span></div>
              <div>Document: <span className="font-bold uppercase text-emerald-500">{inspectKyc.documentType}</span></div>
              <div>Doc Number: <span className="font-bold">{inspectKyc.documentNumber}</span></div>
              <div>Country: <span className="font-bold">{inspectKyc.issuingCountry}</span></div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Officer Compliance Note</label>
              <textarea
                rows={2}
                value={kycCustomNote}
                onChange={e => setKycCustomNote(e.target.value)}
                placeholder="Documents validated against sanctions and AML databases."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleRejectKyc(inspectKyc.id)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 font-bold text-xs cursor-pointer"
              >
                Reject KYC
              </button>
              <button
                onClick={() => handleApproveKyc(inspectKyc.id)}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Approve & Grant Clearance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Strategy Plan Modal */}
      {isNewPlanModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsNewPlanModalOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4 my-8">
            <h3 className="text-base font-bold">Create Investment Strategy</h3>
            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Strategy Title *</label>
                <input
                  type="text"
                  required
                  value={newPlanTitle}
                  onChange={e => setNewPlanTitle(e.target.value)}
                  placeholder="e.g. Quantitative Yield Matrix"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Min Capital ($)</label>
                  <input
                    type="number"
                    value={newPlanMin}
                    onChange={e => setNewPlanMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Mgmt Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPlanFee}
                    onChange={e => setNewPlanFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newPlanDesc}
                  onChange={e => setNewPlanDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {isNewMediaModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsNewMediaModalOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4 my-8">
            <h3 className="text-base font-bold">Site Media Item</h3>
            <form onSubmit={handleSaveMediaItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={mediaTitle}
                  onChange={e => setMediaTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={mediaDesc}
                  onChange={e => setMediaDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewMediaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer"
                >
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Investment Strategy Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setEditingPlan(null)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Edit Investment Strategy</h3>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPlan} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Portfolio Strategy Title *</label>
                <input
                  type="text"
                  required
                  value={editPlanTitle}
                  onChange={e => setEditPlanTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Risk Profile</label>
                  <select
                    value={editPlanRisk}
                    onChange={e => setEditPlanRisk(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Moderate">Moderate Risk</option>
                    <option value="High">High Risk</option>
                    <option value="Speculative">Speculative Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Strategy Type</label>
                  <select
                    value={editPlanStrategy}
                    onChange={e => setEditPlanStrategy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="balanced">Balanced</option>
                    <option value="growth">Growth</option>
                    <option value="defi_yield">DeFi / Web3 Yield</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Minimum Capital ($)</label>
                  <input
                    type="number"
                    min={10}
                    value={editPlanMin}
                    onChange={e => setEditPlanMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Maximum Cap ($)</label>
                  <input
                    type="number"
                    min={100}
                    value={editPlanMax}
                    onChange={e => setEditPlanMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Target ROI (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editPlanRoi}
                    onChange={e => setEditPlanRoi(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Mgmt Fee (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={editPlanFee}
                    onChange={e => setEditPlanFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Lock (Days)</label>
                  <input
                    type="number"
                    value={editPlanLockDays}
                    onChange={e => setEditPlanLockDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editPlanDesc}
                  onChange={e => setEditPlanDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Terms & Conditions</label>
                <textarea
                  rows={2}
                  value={editPlanTerms}
                  onChange={e => setEditPlanTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editPlanPopular"
                  checked={editPlanPopular}
                  onChange={e => setEditPlanPopular(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="editPlanPopular" className="text-xs font-semibold cursor-pointer">
                  Mark as "Popular" strategy badge for users
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer"
                >
                  Save Strategy Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Plan Confirmation Modal */}
      {planToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setPlanToDelete(null)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Portfolio Strategy</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete <strong className="text-rose-600 dark:text-rose-400">"{planToDelete.title}"</strong>? Existing invested balances will be preserved in user ledgers, but new client allocations for this strategy will no longer be allowed.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPlanToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePlan}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Yes, Delete Strategy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Deposit Payment Proof Screenshot Modal */}
      {inspectProofTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setInspectProofTx(null)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Proof Screenshot #{inspectProofTx.reference}
                </h3>
                <p className="text-xs text-slate-500">
                  Depositor: <strong className="text-slate-800 dark:text-slate-200">{inspectProofTx.userName}</strong> ({inspectProofTx.userEmail})
                </p>
              </div>
              <button
                onClick={() => setInspectProofTx(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <div>
                <div className="text-[10px] text-slate-400">Amount</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  +${inspectProofTx.amountUsd.toFixed(2)} USD ({inspectProofTx.amount} {inspectProofTx.currency})
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Payment Rail</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{inspectProofTx.method}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Status</div>
                <div className="font-bold capitalize">{inspectProofTx.status}</div>
              </div>
            </div>

            {inspectProofTx.notes && (
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                <strong>Transaction Notes:</strong> {inspectProofTx.notes}
              </div>
            )}

            {/* Proof Image / Document Container */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950/10 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-2 min-h-[250px] max-h-[450px]">
              {inspectProofTx.proofUrl ? (
                inspectProofTx.proofUrl.startsWith('data:image') || inspectProofTx.proofUrl.startsWith('http') ? (
                  <img
                    src={inspectProofTx.proofUrl}
                    alt="Payment Proof"
                    referrerPolicy="no-referrer"
                    className="max-h-[420px] w-auto object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 font-mono">
                    Payment proof document file attached: {inspectProofTx.proofUrl.substring(0, 40)}...
                  </div>
                )
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  No proof document uploaded for this legacy record.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setInspectProofTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Close
              </button>

              {inspectProofTx.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const tx = inspectProofTx;
                      setInspectProofTx(null);
                      handleOpenRejectModal(tx);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold text-xs cursor-pointer"
                  >
                    Reject Deposit
                  </button>
                  <button
                    onClick={() => {
                      const txId = inspectProofTx.id;
                      setInspectProofTx(null);
                      handleApproveDeposit(txId);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Verify & Credit Ledger
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
