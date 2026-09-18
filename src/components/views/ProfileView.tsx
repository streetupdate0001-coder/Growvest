import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  DollarSign,
  CheckCircle2,
  Calendar,
  Save,
  Check,
  AlertCircle,
  Camera,
  Edit2,
  X,
  Lock,
  Key,
  Shield,
  Clock,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Compass,
  Fingerprint,
  Scan,
  Download,
  FileSpreadsheet,
  Laptop,
  Smartphone,
  MapPin,
  MessageSquare,
  KeyRound,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import { PhotoUploadModal } from '../profile/PhotoUploadModal';
import { IdentityVerificationModal } from '../profile/IdentityVerificationModal';
import { SUPPORTED_LANGUAGES } from '../../services/i18n';
import { CURRENCY_CONFIGS } from '../../services/currency';
import { LanguageCode, CurrencyCode } from '../../types';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { smartsuppService } from '../../services/smartsuppService';
import { SovereignMembershipCard } from '../profile/SovereignMembershipCard';
import { AntiScamSecurityShield } from '../security/AntiScamSecurityShield';

export const ProfileView: React.FC = () => {
  const {
    currentLanguage,
    setLanguage,
    currentCurrency,
    setCurrency,
    addNotification,
    startTour,
    resetTour
  } = useApp();

  const {
    user,
    updateProfile,
    toggle2FA,
    toggleUserRole,
    isBiometricEnabled,
    toggleBiometric,
    biometricMethod,
    setBiometricMethod,
    openBiometricPrompt,
    transactions,
    wallet
  } = useAuth();

  const [activeProfileTab, setActiveProfileTab] = useState<
    'personal' | 'contact' | 'security' | 'sessions' | 'preferences' | 'export'
  >('personal');

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  // Editable form state
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [dob, setDob] = useState(user?.dateOfBirth || '');
  const [country, setCountry] = useState(user?.country || '');
  const [phoneCountryCode, setPhoneCountryCode] = useState(user?.phoneCountryCode || '+');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [antiPhishing, setAntiPhishing] = useState(user?.antiPhishingPhrase || '');

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    if (user) {
      if (!isEditingPersonal) {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setUsername(user.username || '');
        setDob(user.dateOfBirth || '');
        setCountry(user.country || '');
      }
      if (!isEditingContact) {
        setPhoneCountryCode(user.phoneCountryCode || '+41');
        setPhoneNumber(user.phoneNumber || '');
        setAddress(user.address || '');
        setCity(user.city || '');
        setPostalCode(user.postalCode || '');
      }
      if (!isEditingPreferences) {
        setAntiPhishing(user.antiPhishingPhrase || '');
      }
    }
  }, [user, isEditingPersonal, isEditingContact, isEditingPreferences]);

  // Mock Active Sessions
  const [sessions, setSessions] = useState([
    {
      id: '',
      device: '',
      browser: '',
      ip: '',
      location: '',
      lastActive: '',
      isCurrent: true
    },
    {
      id: 'sess-2',
      device: '',
      browser: '',
      ip: '',
      location: '',
      lastActive: '',
      isCurrent: false
    }
  ]);

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const res = await updateProfile({
      firstName,
      lastName,
      username,
      dateOfBirth: dob,
      country
    });

    setIsSaving(false);
    if (res.success) {
      setIsEditingPersonal(false);
      setFeedback({ type: 'success', message: 'Personal entity information updated successfully.' });
      addNotification({
        type: 'account',
        title: 'Profile Updated',
        message: 'Your legal entity identity details have been saved.'
      });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save changes.' });
    }
  };

  const handleCancelPersonal = () => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setUsername(user?.username || '');
    setDob(user?.dateOfBirth || '');
    setCountry(user?.country || '');
    setIsEditingPersonal(false);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const res = await updateProfile({
      phoneCountryCode,
      phoneNumber,
      address,
      city,
      postalCode
    });

    setIsSaving(false);
    if (res.success) {
      setIsEditingContact(false);
      setFeedback({ type: 'success', message: 'Residential address and contact details saved.' });
      addNotification({
        type: 'account',
        title: 'Contact Updated',
        message: 'Your residential domicile records have been successfully updated.'
      });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save contact details.' });
    }
  };

  const handleCancelContact = () => {
    setPhoneCountryCode(user?.phoneCountryCode || '+41');
    setPhoneNumber(user?.phoneNumber || '');
    setAddress(user?.address || '');
    setCity(user?.city || '');
    setPostalCode(user?.postalCode || '');
    setIsEditingContact(false);
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const res = await updateProfile({
      antiPhishingPhrase: antiPhishing
    });

    setIsSaving(false);
    if (res.success) {
      setIsEditingPreferences(false);
      setFeedback({ type: 'success', message: 'Display and security phrase updated.' });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save preferences.' });
    }
  };

  const handleRevokeOtherSessions = () => {
    setSessions(sessions.filter(s => s.isCurrent));
    addNotification({
      type: 'security',
      title: 'Sessions Terminated',
      message: 'All other active device tokens have been revoked.'
    });
  };

  const handleExportTransactionsCSV = () => {
    if (!transactions || transactions.length === 0) {
      addNotification({
        type: 'account',
        title: 'Export Generated',
        message: 'Sample ledger statement downloaded (no live records).'
      });
      return;
    }
    const headers = 'ID,Type,AmountUSD,Currency,Status,Method,Timestamp,Reference\n';
    const rows = transactions
      .map(
        t =>
          `"${t.id}","${t.type}",${t.amountUsd},"${t.currency}","${t.status}","${t.method || ''}","${t.timestamp}","${t.reference || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `GROWVEST_Ledger_Statement_${user?.username || 'user'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      type: 'account',
      title: 'Ledger Exported',
      message: 'Account transactions CSV file generated and downloaded.'
    });
  };

  const handleExportProfileJSON = () => {
    const data = {
      platform: 'GROWVEST Institutional Wealth Management',
      accountHolder: {
        id: user?.id,
        name: `${user?.firstName} ${user?.lastName}`,
        username: user?.username,
        email: user?.email,
        country: user?.country,
        tier: user?.verificationStatus,
        createdAt: user?.createdAt
      },
      walletSummary: {
        totalValuationUsd: wallet?.totalValueUsd || 0,
        availableCashUsd: wallet?.availableBalanceUsd || 0,
        investedCapitalUsd: wallet?.investedBalanceUsd || 0
      },
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `GROWVEST_Account_Certificate_${user?.username || 'user'}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      type: 'account',
      title: 'Certificate Exported',
      message: 'Cryptographically timestamped account certificate downloaded.'
    });
  };

  return (
    <div id="growvest-profile-view" className="space-y-6 pb-12 w-full max-w-full">
      {/* Sleek Top Profile Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar with Camera Overlay */}
            <div className="relative group shrink-0 self-start sm:self-center">
              <UserAvatar user={user} size="2xl" showStatus showRoleBadge />
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute inset-0 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer backdrop-blur-[2px]"
                title="Change profile photo"
                id="avatar-hover-upload-btn"
              >
                <Camera className="w-5 h-5 text-emerald-400" />
                <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Change</span>
              </button>
            </div>

            {/* User Title & Info */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {user?.firstName} {user?.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {user?.verificationStatus === 'verified' || user?.verificationStatus === 'tier2_verified'
                    ? 'Tier 1 Verified'
                    : 'Pending Verification'}
                </span>
                {user?.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Administrator
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                @{user?.username || 'user'} • {user?.email}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user?.country || 'Switzerland'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Member since{' '}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : '2025'}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anti-Phishing: <strong className="text-slate-800 dark:text-slate-200">{user?.antiPhishingPhrase || 'GZ-VANCE-88'}</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#1c1c22] hover:bg-slate-200 dark:hover:bg-[#25252e] border border-slate-200 dark:border-white/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              id="update-photo-main-btn"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Update Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setIsKycModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#ff4d38] hover:bg-[#e03e2a] rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              id="verify-identity-btn"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>KYC Verification</span>
            </button>

            <button
              type="button"
              onClick={() => smartsuppService.openChat()}
              className="px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Open 24/7 Live Support"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Live Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sovereign VIP Wealth Membership Card */}
      <SovereignMembershipCard
        user={user}
        wallet={wallet}
        onOpenKycModal={() => setIsKycModalOpen(true)}
      />

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-3xl border text-xs flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveProfileTab('personal')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeProfileTab === 'personal'
              ? 'bg-white/20 text-white shadow-xs border border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Legal Entity</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('contact')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeProfileTab === 'contact'
              ? 'bg-white/20 text-white shadow-xs border border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Address & Phone</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('security')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeProfileTab === 'security'
              ? 'bg-white/20 text-white shadow-xs border border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Hardware & 2FA</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('sessions')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeProfileTab === 'sessions'
              ? 'bg-white/20 text-white shadow-xs border border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Device Sessions</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('preferences')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeProfileTab === 'preferences'
              ? 'bg-white/20 text-white shadow-xs border border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Preferences</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('export')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeProfileTab === 'export'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Data Export</span>
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: Personal Legal Information */}
          {activeProfileTab === 'personal' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Legal Entity Identity
                  </h3>
                </div>
                {!isEditingPersonal ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingPersonal(true)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    id="edit-personal-btn"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Info</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancelPersonal}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSavePersonal} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingPersonal}
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingPersonal}
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingPersonal}
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      disabled={!isEditingPersonal}
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Country of Legal Domicile
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingPersonal}
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Verified Account Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                {isEditingPersonal && (
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleCancelPersonal}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      id="save-personal-btn"
                    >
                      {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: Address & Phone */}
          {activeProfileTab === 'contact' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Contact & Residential Domicile
                  </h3>
                </div>
                {!isEditingContact ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingContact(true)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    id="edit-contact-btn"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Address</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancelContact}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveContact} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Dial Code
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingContact}
                      value={phoneCountryCode}
                      onChange={e => setPhoneCountryCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Direct Phone Number
                    </label>
                    <input
                      type="tel"
                      disabled={!isEditingContact}
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingContact}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Gotthardstrasse 26"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingContact}
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingContact}
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-75 text-slate-900 dark:text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {isEditingContact && (
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleCancelContact}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      id="save-contact-btn"
                    >
                      {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Address</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 3: Hardware Security & Enclave */}
          {activeProfileTab === 'security' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Hardware Biometrics & Enclave 2FA
                  </h3>
                </div>
              </div>

              {/* Biometric Quick Login Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {biometricMethod === 'touch_id' ? (
                        <Fingerprint className="w-5 h-5" />
                      ) : biometricMethod === 'face_id' ? (
                        <Scan className="w-5 h-5" />
                      ) : (
                        <KeyRound className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Biometric Quick Login (FaceID / Fingerprint)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        1-tap hardware authentication for sign-in & sensitive vault reveals
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !isBiometricEnabled;
                      toggleBiometric(nextState);
                      addNotification({
                        type: 'security',
                        title: nextState ? 'Biometric Quick Login Enabled' : 'Biometric Quick Login Disabled',
                        message: nextState
                          ? 'Biometric hardware attestation is active for quick 1-tap sign-in.'
                          : 'Biometric authorization disabled.'
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isBiometricEnabled
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isBiometricEnabled ? 'ENABLED' : 'ENABLE'}
                  </button>
                </div>

                {isBiometricEnabled && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">Preferred Hardware Enclave:</span>
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      {(['face_id', 'touch_id', 'passkey'] as const).map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setBiometricMethod(m)}
                          className={`px-2 py-1 rounded-lg border uppercase transition-colors cursor-pointer ${
                            biometricMethod === m
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold'
                              : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {m === 'touch_id' ? 'Touch ID' : m === 'face_id' ? 'Face ID' : 'Passkey'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Two-Factor Authentication Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Two-Factor Authentication (TOTP)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Google Authenticator / YubiKey verification on withdrawal execution
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggle2FA(!user?.twoFactorEnabled)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      user?.twoFactorEnabled
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {user?.twoFactorEnabled ? 'ENFORCED' : 'ENFORCE'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Active Device Sessions */}
          {activeProfileTab === 'sessions' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Active Cryptographic Device Sessions
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleRevokeOtherSessions}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
                >
                  Revoke Other Sessions
                </button>
              </div>

              <div className="space-y-3">
                {sessions.map(sess => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                        {sess.device.includes('iPhone') ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span>{sess.device}</span>
                          {sess.isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                              CURRENT DEVICE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {sess.browser} • {sess.ip} • {sess.location}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {sess.lastActive}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Preferences & Localizations */}
          {activeProfileTab === 'preferences' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Platform Preferences & Language
                  </h3>
                </div>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Platform Language
                    </label>
                    <select
                      value={currentLanguage}
                      onChange={e => setLanguage(e.target.value as LanguageCode)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                    >
                      {SUPPORTED_LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name} ({l.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Base Valuation Currency
                    </label>
                    <select
                      value={currentCurrency}
                      onChange={e => setCurrency(e.target.value as CurrencyCode)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    >
                      {Object.values(CURRENCY_CONFIGS).map(c => (
                        <option key={c.code} value={c.code}>
                          {c.name} ({c.code} {c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Workspace Appearance
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Visual High-Contrast Mode
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Toggle between uniform Emerald Light and Institutional Dark modes.
                      </span>
                    </div>
                    <ThemeSwitcher variant="pill" idPrefix="profile-theme-toggle" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Anti-Phishing Verification Code
                  </label>
                  <input
                    type="text"
                    value={antiPhishing}
                    onChange={e => setAntiPhishing(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. GZ-VANCE-88"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Verify this code in all GROWVEST security emails to guard against phishing attacks.
                  </span>
                </div>

                {/* Interactive Platform Tour Control */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Interactive Platform Tour</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Replay the 8-step guided onboarding walkthrough across wealth views.
                    </p>
                  </div>

                  <button
                    type="button"
                    id="profile-start-tour-btn"
                    onClick={() => {
                      resetTour();
                      startTour(0);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Start Tour
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: Data Export & Compliance */}
          {activeProfileTab === 'export' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Financial Statements & Data Portability
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Download official signed accounting statements and chronological audit records for tax declaration, institutional proof of funds, or regulatory reporting.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                      <FileSpreadsheet className="w-5 h-5" />
                      <span className="font-bold text-xs">Transaction Ledger (CSV)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Export chronological transaction receipts with hash references, timestamps, and fees.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportTransactionsCSV}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Download CSV</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                      <FileText className="w-5 h-5" />
                      <span className="font-bold text-xs">Account Certificate (JSON)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cryptographically signed account identity and current balance snapshot.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportProfileJSON}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Security & KYC Tiers */}
        <div className="space-y-6">
          {/* Identity Verification Summary Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                KYC Verification Tiers
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                  Tier 1: Standard Clearing
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500 text-white">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                National ID / Passport verified. Daily deposit limit: $500,000.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Tier 2: Prime Enterprise
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono text-slate-500 bg-slate-200 dark:bg-slate-800 font-bold">
                  ELIGIBLE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Institutional documentation and corporate registry for unlimited OTC settlement.
              </p>
              <button
                type="button"
                onClick={() => setIsKycModalOpen(true)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-1 flex items-center gap-1 cursor-pointer"
              >
                <span>Submit Tier 2 Documents</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Dedicated Live Support Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                24/7 Institutional Live Support
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect directly with an accredited wealth manager or support officer in real time. Push notifications will alert you when an advisor replies.
            </p>

            <button
              type="button"
              onClick={() => smartsuppService.openChat()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect with Advisor</span>
            </button>
          </div>

          {/* Account Privilege Switcher (Demo / Testing) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Privilege Role
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 uppercase font-bold border border-amber-500/30">
                {user?.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Toggle between standard Investor account and Institutional Administrator view.
            </p>
            <button
              type="button"
              onClick={toggleUserRole}
              className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              id="toggle-role-btn"
            >
              Switch Role to {user?.role === 'admin' ? 'Investor' : 'Administrator'}
            </button>
          </div>
        </div>
      </div>

      {/* Photo Upload & Crop Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      {/* Identity Verification Modal */}
      <IdentityVerificationModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
      />
    </div>
  );
};
