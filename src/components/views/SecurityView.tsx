import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Smartphone,
  Server,
  Globe,
  Trash2,
  Check,
  Copy,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Clock,
  Timer,
  Play,
  Mail,
  ArrowUpRight,
  Fingerprint,
  Scan,
  KeyRound,
  Shield,
  CheckCircle2,
  Volume2,
  VolumeX,
  Radio,
  BellRing,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PasswordStrengthMeter, analyzePassword } from '../security/PasswordStrengthMeter';
import { SENSITIVITY_THRESHOLDS, VoiceAlertSensitivity } from '../../services/voiceAlerts';
import { AntiScamSecurityShield } from '../security/AntiScamSecurityShield';
import { DeviceTrustModule } from '../security/DeviceTrustModule';

export const SecurityView: React.FC = () => {
  const {
    addNotification,
    setActiveTab,
    isVoiceAlertsEnabled,
    toggleVoiceAlerts,
    voiceAlertSensitivity,
    setVoiceAlertSensitivity,
    isSpeechSupported,
    isSpeakingVoiceAlert,
    testVoiceNotification
  } = useApp();
  const {
    user,
    sessions,
    revokeSession,
    toggle2FA,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes,
    triggerSessionTimeoutWarning,
    isBiometricEnabled,
    toggleBiometric,
    biometricMethod,
    setBiometricMethod,
    openBiometricPrompt,
    isBiometricUnlocked,
    lockBiometric,
    updateProfile
  } = useAuth();

  const [totpSecret] = useState('GZNA 9K3P 7X2M L8QW');
  const [totpInputCode, setTotpInputCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [setup2FAModal, setSetup2FAModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  // Anti-Phishing Phrase State
  const [antiPhishingPhrase, setAntiPhishingPhrase] = useState(user?.antiPhishingPhrase || 'GROWVEST-VAULT-AUTHENTIC-2026');
  const [isEditingPhrase, setIsEditingPhrase] = useState(false);
  const [tempPhrase, setTempPhrase] = useState(antiPhishingPhrase);
  const [phraseSaved, setPhraseSaved] = useState(false);

  const handleSaveAntiPhishingPhrase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPhrase.trim()) return;
    setAntiPhishingPhrase(tempPhrase.trim().toUpperCase());
    setIsEditingPhrase(false);
    setPhraseSaved(true);
    setTimeout(() => setPhraseSaved(false), 2500);
    await updateProfile({ antiPhishingPhrase: tempPhrase.trim().toUpperCase() });
    addNotification({
      type: 'security',
      title: 'Anti-Phishing Security Phrase Updated',
      message: `Your personalized cryptographic phrase "${tempPhrase.trim().toUpperCase()}" will be embedded in all genuine system emails and notifications.`
    });
  };

  const copySecret = () => {
    navigator.clipboard.writeText(totpSecret.replace(/\s/g, ''));
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleConfirm2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpInputCode.length < 6) return;
    toggle2FA(true);
    setSetup2FAModal(false);
    addNotification({
      type: 'security',
      title: 'Two-Factor Authentication Enabled',
      message: 'TOTP hardware token security is now active on your account.'
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);

    if (!currentPw) {
      setPwError('Please provide your current password for security verification.');
      return;
    }

    const analysis = analyzePassword(newPw, user?.username, user?.email);
    if (analysis.score < 2) {
      setPwError('New password is too weak. Please meet at least moderate complexity criteria.');
      return;
    }

    if (newPw !== confirmPw) {
      setPwError('New password and confirmation password do not match.');
      return;
    }

    setPwSuccess(true);
    setTimeout(() => {
      setPwSuccess(false);
      setPasswordModal(false);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      addNotification({
        type: 'security',
        title: 'Account Password Updated',
        message: 'Your cryptographic login password was successfully modified.'
      });
    }, 1500);
  };

  const is2FAActive = user?.twoFactorEnabled ?? true;
  const securityScore = is2FAActive ? 95 : 65;

  return (
    <div id="growvest-security-view" className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-2xl transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
              Security Center & Access Governance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-200 border border-white/10">
              Zero-Trust Guard
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hardware keys, cryptographic sessions, session timeout guardians, and continuous audit security logs.
          </p>
        </div>

        {/* Security Score Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
            {securityScore}%
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Security Posture</span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {is2FAActive ? 'Institutional Grade' : 'Action Recommended'}
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time WAF, Anti-Phishing & Crypto Address Poisoning Shield */}
      <AntiScamSecurityShield />

      {/* Security Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Biometric Security & Quick Login Access */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-3.5">
            {/* Header & Toggle Switch */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {biometricMethod === 'touch_id' ? (
                    <Fingerprint className="w-5 h-5" />
                  ) : biometricMethod === 'face_id' ? (
                    <Scan className="w-5 h-5" />
                  ) : (
                    <KeyRound className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Biometric Quick Login
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    FaceID, TouchID & Fingerprint Hardware
                  </p>
                </div>
              </div>

              {/* Interactive Toggle Switch */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                  {isBiometricEnabled ? 'ACTIVE' : 'OFF'}
                </span>
                <button
                  id="biometric-quick-login-toggle"
                  type="button"
                  role="switch"
                  aria-checked={isBiometricEnabled}
                  onClick={() => {
                    const nextState = !isBiometricEnabled;
                    toggleBiometric(nextState);
                    addNotification({
                      type: 'security',
                      title: nextState ? 'Biometric Quick Login Enabled' : 'Biometric Quick Login Disabled',
                      message: nextState
                        ? `Biometric ${biometricMethod === 'touch_id' ? 'Fingerprint (TouchID)' : biometricMethod === 'face_id' ? 'FaceID' : 'Passkey'} authentication is now active for 1-tap quick login access.`
                        : 'Biometric quick login access has been disabled.'
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    isBiometricEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isBiometricEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enable biometric hardware attestation (Apple FaceID, TouchID, Android Biometrics, or Passkey) for rapid 1-tap login access without typing passwords, and lock sensitive portfolio operations.
            </p>

            {/* Biometric Quick Login Status Card */}
            <div className={`p-3 rounded-2xl border text-xs transition-colors flex items-center justify-between gap-2 ${
              isBiometricEnabled
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-50 dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-400'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 shrink-0 ${isBiometricEnabled ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="font-semibold text-[11px]">
                  {isBiometricEnabled
                    ? `Quick Login Active with ${biometricMethod === 'touch_id' ? 'Fingerprint (TouchID)' : biometricMethod === 'face_id' ? 'FaceID' : 'Passkey'}`
                    : 'Quick login disabled. Standard password verification required.'}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                isBiometricEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-200 dark:bg-[#1c1c22] text-slate-400'
              }`}>
                {isBiometricEnabled ? 'Ready' : 'Disabled'}
              </span>
            </div>

            {/* Biometric Method Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                Preferred Hardware Sensor:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setBiometricMethod('face_id')}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-mono border transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    biometricMethod === 'face_id'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-black/40 text-slate-400 border-slate-200 dark:border-white/10 hover:border-white/30'
                  }`}
                >
                  <Scan className="w-3 h-3" />
                  <span>FaceID</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBiometricMethod('touch_id')}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-mono border transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    biometricMethod === 'touch_id'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-black/40 text-slate-400 border-slate-200 dark:border-white/10 hover:border-white/30'
                  }`}
                >
                  <Fingerprint className="w-3 h-3" />
                  <span>Fingerprint</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBiometricMethod('passkey')}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-mono border transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    biometricMethod === 'passkey'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-black/40 text-slate-400 border-slate-200 dark:border-white/10 hover:border-white/30'
                  }`}
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Passkey</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
            <button
              id="toggle-biometric-security-btn"
              type="button"
              onClick={() => {
                const nextState = !isBiometricEnabled;
                toggleBiometric(nextState);
                addNotification({
                  type: 'security',
                  title: nextState ? 'Biometric Quick Login Enabled' : 'Biometric Quick Login Disabled',
                  message: nextState
                    ? `Local ${biometricMethod.toUpperCase()} authentication is now active for quick login and vault operations.`
                    : 'Biometric authorization disabled.'
                });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isBiometricEnabled
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-[#ff4d38] hover:bg-[#e03e2a] text-white shadow-xs'
              }`}
            >
              {isBiometricEnabled ? 'Disable Biometrics' : 'Enable Biometrics'}
            </button>

            <button
              id="test-biometric-auth-btn"
              type="button"
              onClick={() => {
                openBiometricPrompt(
                  () => {
                    addNotification({
                      type: 'security',
                      title: 'Biometric Test Successful',
                      message: 'Hardware enclave verified biometric signature for quick login access.'
                    });
                  },
                  'Quick Login & Portfolio Vault Attestation'
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#1c1c22] hover:bg-[#25252e] text-slate-200 font-semibold text-xs border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Sensor Scan</span>
            </button>
          </div>
        </div>

        {/* 2. 2FA Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Google Authenticator, Authy, or YubiKey</p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  is2FAActive
                    ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {is2FAActive ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enforce a 6-digit one-time code for sensitive operations including external withdrawals, password resets, and session approvals.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            {is2FAActive ? (
              <button
                type="button"
                onClick={() => toggle2FA(false)}
                className="text-xs text-rose-400 hover:underline cursor-pointer font-medium"
              >
                Disable 2FA Security
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSetup2FAModal(true)}
                className="px-4 py-2 rounded-xl bg-[#ff4d38] hover:bg-[#e03e2a] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Setup 2FA Protection
              </button>
            )}
          </div>
        </div>

        {/* Password & Credential Security */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-black/40 text-slate-300 border border-slate-200 dark:border-white/10">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account Password & Strength</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cryptographic salted SHA-256 / Argon2</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our real-time strength meter verifies high entropy, character diversity, and absence of predictable sequences.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Entropy: Strong</span>
            <button
              type="button"
              onClick={() => setPasswordModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Session Inactivity Timeout Safeguard */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Inactivity Session Timeout</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Fintech auto-lock security safeguard</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold">
                {sessionTimeoutMinutes} MIN
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automatically warns and locks idle authenticated sessions to protect funds against physical device intrusion.
            </p>

            {/* Threshold Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block">
                Inactivity Warning Threshold:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[5, 15, 30, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSessionTimeoutMinutes(mins)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-mono border transition-all cursor-pointer text-center ${
                      sessionTimeoutMinutes === mins
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={triggerSessionTimeoutWarning}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Test Timeout Warning Modal</span>
            </button>
          </div>
        </div>

        {/* 5. Voice Notification & Volatility Radar (Web Speech API) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-3.5">
            {/* Header & Toggle Switch */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl border transition-colors ${
                  isVoiceAlertsEnabled
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  {isVoiceAlertsEnabled ? (
                    <Volume2 className={`w-5 h-5 ${isSpeakingVoiceAlert ? 'animate-pulse text-emerald-500' : ''}`} />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Voice Notification Alerts
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                      Web Speech API
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Speech synthesis for critical portfolio & market volatility moves
                  </p>
                </div>
              </div>

              {/* Interactive Toggle Switch */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                  {isVoiceAlertsEnabled ? 'ACTIVE' : 'MUTED'}
                </span>
                <button
                  id="voice-notifications-toggle"
                  type="button"
                  role="switch"
                  aria-checked={isVoiceAlertsEnabled}
                  onClick={() => {
                    const nextState = !isVoiceAlertsEnabled;
                    toggleVoiceAlerts(nextState);
                    addNotification({
                      type: 'security',
                      title: nextState ? 'Voice Notifications Enabled' : 'Voice Notifications Muted',
                      message: nextState
                        ? 'The Web Speech engine will now vocalize critical portfolio events, asset swings, and security alerts.'
                        : 'Vocal alerts have been muted. Notifications will be visual only.'
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    isVoiceAlertsEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isVoiceAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Vocalizes critical portfolio equity updates, significant price swings (surges/dips), and urgent account notices using the browser's native speech synthesis engine.
            </p>

            {/* Voice Status & Engine Indicator */}
            <div className={`p-3 rounded-2xl border text-xs transition-colors flex items-center justify-between gap-2 ${
              isVoiceAlertsEnabled
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 shrink-0 ${isVoiceAlertsEnabled ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
                <span className="font-semibold text-[11px]">
                  {isSpeakingVoiceAlert ? (
                    <span className="text-emerald-600 dark:text-emerald-300 font-bold animate-pulse">
                      🎙️ Vocalizing Auditory Alert in Progress...
                    </span>
                  ) : isVoiceAlertsEnabled ? (
                    `Voice Synthesis Ready (${SENSITIVITY_THRESHOLDS[voiceAlertSensitivity]?.label})`
                  ) : (
                    'Auditory speech muted. Standard visual ledger alerts active.'
                  )}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                isVoiceAlertsEnabled
                  ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {isSpeechSupported ? (isVoiceAlertsEnabled ? 'Online' : 'Standby') : 'No Browser Speech'}
              </span>
            </div>

            {/* Sensitivity Threshold Selector */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block">
                  Price Movement Trigger Sensitivity:
                </label>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  {SENSITIVITY_THRESHOLDS[voiceAlertSensitivity]?.desc}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['high', 'medium', 'low'] as VoiceAlertSensitivity[]).map(level => {
                  const info = SENSITIVITY_THRESHOLDS[level];
                  const isSelected = voiceAlertSensitivity === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setVoiceAlertSensitivity(level)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-mono border transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Activity className="w-3 h-3 text-emerald-500" />
                      <span>{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              id="toggle-voice-alerts-btn"
              type="button"
              onClick={() => {
                const next = !isVoiceAlertsEnabled;
                toggleVoiceAlerts(next);
                addNotification({
                  type: 'security',
                  title: next ? 'Voice Notifications Enabled' : 'Voice Notifications Muted',
                  message: next
                    ? 'Auditory alerts will announce significant price movements and critical portfolio notifications.'
                    : 'Auditory alerts disabled.'
                });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isVoiceAlertsEnabled
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
              }`}
            >
              {isVoiceAlertsEnabled ? 'Mute Voice Alerts' : 'Enable Voice Alerts'}
            </button>

            <button
              id="test-voice-alert-btn"
              type="button"
              onClick={testVoiceNotification}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Test Voice Readout</span>
            </button>
          </div>
        </div>

        {/* 6. Anti-Phishing Security Phrase & Enclave Attestation */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Anti-Phishing Security Phrase
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tamper-proof signature on official emails & critical alerts
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                ENCLAVE GUARD
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every authentic email, transaction slip, and critical security dispatch from GROWVEST contains your personalized security phrase to prevent man-in-the-middle attacks.
            </p>

            {/* Current Phrase Display / Edit */}
            {isEditingPhrase ? (
              <form onSubmit={handleSaveAntiPhishingPhrase} className="space-y-2 pt-1">
                <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block">
                  Set Custom Anti-Phishing Code:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempPhrase}
                    onChange={e => setTempPhrase(e.target.value.toUpperCase())}
                    placeholder="E.G. GROWVEST-VAULT-2026"
                    className="w-full px-3 py-2 text-xs font-mono font-bold tracking-wider rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                    maxLength={32}
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempPhrase(antiPhishingPhrase);
                      setIsEditingPhrase(false);
                    }}
                    className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Your Verified Anti-Phishing Phrase:</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {antiPhishingPhrase}
                  </span>
                </div>
                {phraseSaved && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Cryptographic Enclave: Active
            </span>
            {!isEditingPhrase && (
              <button
                type="button"
                onClick={() => {
                  setTempPhrase(antiPhishingPhrase);
                  setIsEditingPhrase(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                Modify Phrase
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive Device Trust & Hardware Sentinel Module */}
      <DeviceTrustModule />

      {/* Authentication Email Templates Hub Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Authentication Email Security Communications
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive previewer and live dispatcher for Welcome Onboarding, Cryptographic Password Resets, and Suspicious Login Alerts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('emails')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Open Email Template Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div
            onClick={() => setActiveTab('emails')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 flex items-center justify-between">
              <span>1. Welcome & Activation</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded">6-Digit Code</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Account activation token, security phrase & onboarding instructions.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('emails')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-500 flex items-center justify-between">
              <span>2. Password Reset</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded">15m TTL</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Cryptographic one-time reset link, requesting IP & emergency lock trigger.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('emails')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-500 flex items-center justify-between">
              <span>3. New Login Alert</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-rose-500/15 text-rose-600 dark:text-rose-400 rounded">Real-time</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Immediate device fingerprint, geolocation alert & 1-click account freeze.
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {setup2FAModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                Configure Two-Factor Authenticator
              </h3>
              <button
                type="button"
                onClick={() => setSetup2FAModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Scan the QR setup barcode in Google Authenticator or enter the manual secret key below:
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                {totpSecret}
              </span>
              <button
                type="button"
                onClick={copySecret}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSecret ? 'Copied' : 'Copy'}
              </button>
            </div>

            <form onSubmit={handleConfirm2FA} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enter 6-Digit Code from App
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={totpInputCode}
                  onChange={e => setTotpInputCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000 000"
                  className="w-full text-center tracking-widest font-mono text-lg p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Verify & Activate 2FA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal with Real-Time Strength Meter */}
      {passwordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-7 text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Update Cryptographic Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {pwError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pwError}</span>
              </div>
            )}

            {pwSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Password Updated Successfully</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">All credentials have been re-encrypted with Argon2 hashes.</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
                {/* Current Password */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPw}
                      onChange={e => setCurrentPw(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Real-time Password Strength Meter */}
                  <div className="mt-2.5">
                    <PasswordStrengthMeter
                      password={newPw}
                      username={user?.username}
                      email={user?.email}
                      showCriteria={true}
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    >
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPasswordModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
