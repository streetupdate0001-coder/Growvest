import React, { useState } from 'react';
import {
  UserPlus,
  X,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Briefcase,
  Award,
  Sparkles,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserAccountStatus, UserVerificationStatus, CurrencyCode } from '../../types';

export const ACCOUNT_MANAGERS = [
  'Alexander Vance (Executive VP & Desk Lead)',
  'Sarah Jenkins (Senior Private Wealth Advisor)',
  'Marcus Dubois (Institutional Trading Desk)',
  'Elena Rostov (Quantitative Portfolio Lead)',
  'Christian Weber (Swiss Wealth Custody Specialist)',
  'Unassigned (General Queue)'
];

export const CLIENT_TIERS = [
  'Standard Retail Investor',
  'VIP Gold Client ($50k+)',
  'Institutional Platinum ($250k+)',
  'High-Net-Worth Sovereign ($1M+)',
  'Family Office Custodial'
];

export const ALL_TRADING_PERMISSIONS = [
  'Spot Trading',
  'Yield Strategies',
  'Margin Leverage (100x)',
  'OTC Block Execution',
  'Direct Fiat Outbound',
  'Algorithmic Bot Allocation'
];

export const POPULAR_COUNTRIES = [
  'Switzerland',
  'United Kingdom',
  'United States',
  'United Arab Emirates',
  'Germany',
  'Singapore',
  'Canada',
  'France',
  'Australia',
  'Luxembourg',
  'Hong Kong',
  'Monaco',
  'Netherlands',
  'Sweden',
  'Japan'
];

export const generateStrongPassword = (): string => {
  const words = ['Wealth', 'Growvest', 'Capital', 'Alpha', 'Swiss', 'Apex', 'Yield', 'Reserve', 'Sovereign', 'Vault'];
  const symbols = ['!', '@', '#', '$', '%', '&', '*'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  const sym = symbols[Math.floor(Math.random() * symbols.length)];
  return `${word}${sym}${num}`;
};

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { adminCreateCustomer, investmentPlans } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'assignment' | 'funding'>('profile');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(generateStrongPassword());
  const [showPassword, setShowPassword] = useState(true);
  const [country, setCountry] = useState('Switzerland');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+41');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  // Status & Financial Fields
  const [accountStatus, setAccountStatus] = useState<UserAccountStatus>('active');
  const [verificationStatus, setVerificationStatus] = useState<UserVerificationStatus>('verified');
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>('USD');
  const [initialDeposit, setInitialDeposit] = useState<number>(0);

  // Assignment Fields
  const [assignedManager, setAssignedManager] = useState(ACCOUNT_MANAGERS[0]);
  const [assignedTier, setAssignedTier] = useState(CLIENT_TIERS[0]);
  const [assignedPlanId, setAssignedPlanId] = useState('');
  const [assignedTrader, setAssignedTrader] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'Spot Trading',
    'Yield Strategies',
    'Algorithmic Bot Allocation'
  ]);
  const [sendWelcomeAlerts, setSendWelcomeAlerts] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const handleSuggestUsername = () => {
    if (!firstName && !lastName) return;
    const base = `${firstName.toLowerCase().replace(/[^a-z]/g, '')}${lastName.toLowerCase().replace(/[^a-z]/g, '')}`;
    const rand = Math.floor(10 + Math.random() * 90);
    setUsername(`${base}${rand}`);
  };

  const handleRegeneratePassword = () => {
    const newPwd = generateStrongPassword();
    setPassword(newPwd);
    setCopiedPassword(false);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2500);
  };

  const [copiedDirectLink, setCopiedDirectLink] = useState(false);

  const getDirectSignInUrl = () => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    if (email.trim()) {
      return `${origin}${path}#/login?email=${encodeURIComponent(email.trim())}`;
    }
    return `${origin}${path}#/login`;
  };

  const handleCopyDirectLink = () => {
    navigator.clipboard.writeText(getDirectSignInUrl());
    setCopiedDirectLink(true);
    setTimeout(() => setCopiedDirectLink(false), 2500);
  };

  const handleCopyAllCredentials = () => {
    const text = `GROWVEST WEALTH MANAGEMENT - CLIENT ONBOARDING
Full Name: ${firstName} ${lastName}
Username: ${username || email}
Email: ${email}
Temporary Password: ${password}
Assigned Advisor: ${assignedManager}
Client Tier: ${assignedTier}
Jurisdiction: ${country}
Direct Client Sign-In URL: ${getDirectSignInUrl()}`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const togglePermission = (perm: string) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(prev => prev.filter(p => p !== perm));
    } else {
      setSelectedPermissions(prev => [...prev, perm]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please provide both First Name and Last Name.');
      setActiveTab('profile');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid client email address.');
      setActiveTab('profile');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setActiveTab('security');
      return;
    }

    const finalUsername = (username.trim() || `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(10 + Math.random() * 90)}`).replace(/\s+/g, '');

    const selectedPlan = investmentPlans.find(p => p.id === assignedPlanId);

    setIsSubmitting(true);
    const res = await adminCreateCustomer({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: finalUsername,
      email: email.trim().toLowerCase(),
      phoneCountryCode: phoneCountryCode || '+41',
      phoneNumber: phoneNumber.trim(),
      country: country.trim() || 'Switzerland',
      dateOfBirth: dateOfBirth || undefined,
      password: password.trim(),
      accountStatus,
      verificationStatus,
      preferredCurrency,
      assignedAccountManager: assignedManager,
      assignedTier,
      assignedPlanId: selectedPlan?.id,
      assignedPlanTitle: selectedPlan?.title,
      assignedTrader: assignedTrader.trim() || undefined,
      tradingPermissions: selectedPermissions,
      initialDepositAmount: Number(initialDeposit) || 0,
      sendWelcomeAlerts,
      adminNotes: adminNotes.trim() || undefined
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to create customer account.');
    } else {
      onSuccess(
        `Customer ${firstName} ${lastName} created successfully! Password configured and assigned to ${assignedManager}.`
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10 text-slate-900 dark:text-slate-100 my-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Create New Customer</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Admin Onboarding
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register private customer, set login password, assign wealth advisor & allocate tier.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. Identity & Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>2. Password & Access</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assignment')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'assignment'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>3. Advisor & Tier Assignment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('funding')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'funding'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>4. Funding & Compliance</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: Profile & Contact */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="e.g. Jean-Paul"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="e.g. Dubois"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (Login Identity) *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="client@invest-geneva.ch"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Username / Handle
                    </label>
                    <button
                      type="button"
                      onClick={handleSuggestUsername}
                      className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Auto-Generate</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. jdubois88"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Residential Country / Jurisdiction *
                  </label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    {POPULAR_COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number & Country Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={phoneCountryCode}
                      onChange={e => setPhoneCountryCode(e.target.value)}
                      placeholder="+41"
                      className="w-20 px-2.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-center focus:border-emerald-500 focus:outline-none"
                    />
                    <div className="relative flex-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="79 123 4567"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth (Optional for KYC Tier-2)
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Password & Access Credentials */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Customer Access Password *
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegeneratePassword}
                    className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none tracking-wider"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="p-1 rounded text-slate-400 hover:text-emerald-500 cursor-pointer"
                      title="Copy password to clipboard"
                    >
                      {copiedPassword ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  This password will be immediately active for the customer. They can log in with their email (<span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{email || 'client email'}</span>) and this password.
                </p>
              </div>

              {/* Direct Sign-In URL Box */}
              <div className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Direct Client Sign-In Link</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-sm">
                    {getDirectSignInUrl()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyDirectLink}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedDirectLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDirectLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Quick Credentials Summary Card */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Copy Full Onboarding Dossier</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                    Includes Email, Username, Password, Advisor & Login URL
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAllCredentials}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Dossier Copied!' : 'Copy Dossier'}</span>
                </button>
              </div>

              {/* Notifications Dispatch */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendAlerts"
                  checked={sendWelcomeAlerts}
                  onChange={e => setSendWelcomeAlerts(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="sendAlerts" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span className="font-bold">Send Welcome SMS & Email Alerts</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dispatches official greeting and account activation notice to user's registered contact channels.
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: Advisor & Tier Assignment */}
          {activeTab === 'assignment' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Assigned Wealth Advisor / Account Manager *</span>
                  </label>
                  <select
                    value={assignedManager}
                    onChange={e => setAssignedManager(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    {ACCOUNT_MANAGERS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Client Tier Classification *</span>
                  </label>
                  <select
                    value={assignedTier}
                    onChange={e => setAssignedTier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none text-amber-600 dark:text-amber-400 font-bold"
                  >
                    {CLIENT_TIERS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Assigned Investment Strategy / Plan</span>
                  </label>
                  <select
                    value={assignedPlanId}
                    onChange={e => setAssignedPlanId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">None (Self-Directed / Unallocated)</option>
                    {investmentPlans.map(p => (
                      <option key={p.id} value={p.id}>{p.title} (Min: ${p.minAmountUsd.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Execution Desk Trader (Optional)
                  </label>
                  <input
                    type="text"
                    value={assignedTrader}
                    onChange={e => setAssignedTrader(e.target.value)}
                    placeholder="e.g. Desk Alpha #4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Trading Permissions Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Assigned Trading & Terminal Permissions</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_TRADING_PERMISSIONS.map(perm => {
                    const isSelected = selectedPermissions.includes(perm);
                    return (
                      <button
                        type="button"
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all border flex items-center justify-between gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{perm}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Internal Administrative / Compliance Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Onboarded via private executive mandate. Direct advisor contact authorized..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Funding & Compliance */}
          {activeTab === 'funding' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>Initial Opening Funding / Grant ($ USD)</span>
                </label>
                <div className="relative">
                  <span className="text-sm font-bold text-slate-400 absolute left-3.5 top-2.5">$</span>
                  <input
                    type="number"
                    step="any"
                    min={0}
                    value={initialDeposit}
                    onChange={e => setInitialDeposit(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  If greater than $0.00, this opening balance will be credited directly to the client's available balance upon account creation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Account Status
                  </label>
                  <select
                    value={accountStatus}
                    onChange={e => setAccountStatus(e.target.value as UserAccountStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="active">Active (Full Terminal Access)</option>
                    <option value="pending">Pending Approval</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    KYC Compliance Status
                  </label>
                  <select
                    value={verificationStatus}
                    onChange={e => setVerificationStatus(e.target.value as UserVerificationStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="verified">Tier-1 Verified</option>
                    <option value="tier2_verified">Tier-2 Institutional</option>
                    <option value="pending">Pending Review</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Base Currency
                  </label>
                  <select
                    value={preferredCurrency}
                    onChange={e => setPreferredCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:border-emerald-500 focus:outline-none font-mono font-bold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CHF">CHF (Fr.)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {activeTab !== 'profile' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'security') setActiveTab('profile');
                    if (activeTab === 'assignment') setActiveTab('security');
                    if (activeTab === 'funding') setActiveTab('assignment');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  ← Back
                </button>
              )}

              {activeTab !== 'funding' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'profile') setActiveTab('security');
                    if (activeTab === 'security') setActiveTab('assignment');
                    if (activeTab === 'assignment') setActiveTab('funding');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  Next Step →
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-emerald-500/20 cursor-pointer flex items-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UserPlus className="w-3.5 h-3.5" />
                )}
                <span>Create & Provision Account</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
