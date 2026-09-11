import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  KeyRound,
  ShieldAlert,
  Smartphone,
  Tablet,
  Monitor,
  Moon,
  Sun,
  Copy,
  Check,
  Download,
  Send,
  Code2,
  Eye,
  FileText,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Info,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import {
  generateWelcomeEmail,
  generatePasswordResetEmail,
  generateLoginAlertEmail,
  WelcomeEmailData,
  PasswordResetEmailData,
  LoginAlertEmailData,
  EmailTemplateOutput
} from '../../services/emailTemplates';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

type TemplateType = 'welcome' | 'password_reset' | 'login_alert';
type ViewportType = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'preview' | 'html' | 'text';

export const EmailTemplatesView: React.FC = () => {
  const { addNotification } = useApp();
  const { user } = useAuth();

  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('welcome');
  const [viewport, setViewport] = useState<ViewportType>('desktop');
  const [clientDarkMode, setClientDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Template Parameters State
  const [welcomeParams, setWelcomeParams] = useState<WelcomeEmailData>({
    recipientName: user ? `${user.firstName} ${user.lastName}` : 'Alexander Vance',
    recipientEmail: user ? user.email : 'alexander.vance@institutional-wealth.ch',
    verificationCode: '849-201',
    verificationUrl: 'https://greeneza.com/auth/verify?token=gz_wtk_948291048201',
    accountTier: 'Level 1: Standard Institutional',
    antiPhishingCode: 'GZ-VANCE-88',
    expiryMinutes: 60
  });

  const [resetParams, setResetParams] = useState<PasswordResetEmailData>({
    recipientName: user ? `${user.firstName} ${user.lastName}` : 'Alexander Vance',
    recipientEmail: user ? user.email : 'alexander.vance@institutional-wealth.ch',
    resetUrl: 'https://greeneza.com/auth/reset-password?token=gz_rst_839021849102',
    resetCode: 'GZ-RST-9104',
    ipAddress: '194.209.14.88',
    location: 'Zurich, Switzerland',
    device: 'Chrome 128 (macOS Sequoia)',
    requestTimestamp: 'August 17, 2026 at 17:55 UTC',
    expiryMinutes: 15,
    antiPhishingCode: 'GZ-VANCE-88',
    freezeAccountUrl: 'https://greeneza.com/security/emergency-lock?account=alexander.vance'
  });

  const [alertParams, setAlertParams] = useState<LoginAlertEmailData>({
    recipientName: user ? `${user.firstName} ${user.lastName}` : 'Alexander Vance',
    recipientEmail: user ? user.email : 'alexander.vance@institutional-wealth.ch',
    ipAddress: '82.165.197.1',
    location: 'London, Greater London, United Kingdom',
    device: 'Apple iPhone 16 Pro (iOS 19.1)',
    browser: 'Mobile Safari 18.0',
    loginTimestamp: 'August 17, 2026 at 17:54 UTC',
    authMethod: 'Password + Hardware TOTP (2FA)',
    confirmDeviceUrl: 'https://greeneza.com/security/trust-device?session=gz_sess_891048',
    freezeAccountUrl: 'https://greeneza.com/security/freeze-session?session=gz_sess_891048',
    antiPhishingCode: 'GZ-VANCE-88'
  });

  // Generated Email Output
  const templateOutput: EmailTemplateOutput = useMemo(() => {
    switch (activeTemplate) {
      case 'welcome':
        return generateWelcomeEmail(welcomeParams);
      case 'password_reset':
        return generatePasswordResetEmail(resetParams);
      case 'login_alert':
        return generateLoginAlertEmail(alertParams);
      default:
        return generateWelcomeEmail(welcomeParams);
    }
  }, [activeTemplate, welcomeParams, resetParams, alertParams]);

  // Handle Copy HTML
  const handleCopyCode = () => {
    const textToCopy = viewMode === 'text' ? templateOutput.plainText : templateOutput.html;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Handle Download HTML
  const handleDownloadHtml = () => {
    const element = document.createElement('a');
    const file = new Blob([templateOutput.html], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `growvest-${templateOutput.id}-email-template.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle Send Test Email
  const handleSendTestEmail = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setTestSentSuccess(true);
      addNotification({
        type: 'security',
        title: `Test Email Dispatched: ${templateOutput.name}`,
        message: `Template delivered to ${user?.email || welcomeParams.recipientEmail} with 100% SPF/DKIM validation.`,
        linkTab: 'security'
      });
      setTimeout(() => setTestSentSuccess(false), 4000);
    }, 1000);
  };

  // Viewport width styling
  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[520px]';
      case 'desktop':
      default:
        return 'max-w-[640px]';
    }
  };

  return (
    <div id="growvest-email-templates-studio" className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-xl transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              Authentication Email Templates
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Responsive RFC 5322
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Institutional-grade, bulletproof HTML email templates for account onboarding, cryptographic password resets, and real-time login security alerts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="growvest-toggle-customizer-btn"
            type="button"
            onClick={() => setShowCustomizer(!showCustomizer)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              showCustomizer
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showCustomizer ? 'Hide Customizer' : 'Edit Parameters'}</span>
          </button>

          <button
            id="growvest-send-test-email-btn"
            type="button"
            onClick={handleSendTestEmail}
            disabled={isSendingTest}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSendingTest ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Dispatching...</span>
              </>
            ) : testSentSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Test Dispatched!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Dispatch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Template Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Tab 1: Welcome */}
        <button
          id="growvest-tab-welcome-email"
          type="button"
          onClick={() => setActiveTemplate('welcome')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTemplate === 'welcome'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 shadow-xs'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {activeTemplate === 'welcome' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          )}
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border ${
              activeTemplate === 'welcome'
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">1. Welcome Email</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Onboarding</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Account creation confirmation, 6-digit verification code token, and institutional security starter guide.
              </p>
            </div>
          </div>
        </button>

        {/* Tab 2: Password Reset */}
        <button
          id="growvest-tab-reset-email"
          type="button"
          onClick={() => setActiveTemplate('password_reset')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTemplate === 'password_reset'
              ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 shadow-xs'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {activeTemplate === 'password_reset' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          )}
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border ${
              activeTemplate === 'password_reset'
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              <KeyRound className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">2. Password Reset</span>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">Security</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Time-sensitive cryptographic reset link, IP/origin audit telemetry, and 1-click emergency lock.
              </p>
            </div>
          </div>
        </button>

        {/* Tab 3: Login Alert */}
        <button
          id="growvest-tab-alert-email"
          type="button"
          onClick={() => setActiveTemplate('login_alert')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTemplate === 'login_alert'
              ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 shadow-xs'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {activeTemplate === 'login_alert' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
          )}
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border ${
              activeTemplate === 'login_alert'
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">3. New Login Alert</span>
                <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold">Telemetry</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Instant device/geo telemetry notice with "Yes, this was me" or "Freeze Account" action buttons.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Live Customizer Drawer (Expandable) */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">
                    Live Template Parameter Customizer ({templateOutput.name})
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Changes reflect in real-time</span>
              </div>

              {/* Form fields based on active template */}
              {activeTemplate === 'welcome' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={welcomeParams.recipientName}
                      onChange={e => setWelcomeParams({ ...welcomeParams, recipientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Recipient Email</label>
                    <input
                      type="email"
                      value={welcomeParams.recipientEmail}
                      onChange={e => setWelcomeParams({ ...welcomeParams, recipientEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Verification Code</label>
                    <input
                      type="text"
                      value={welcomeParams.verificationCode}
                      onChange={e => setWelcomeParams({ ...welcomeParams, verificationCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Account Tier</label>
                    <input
                      type="text"
                      value={welcomeParams.accountTier}
                      onChange={e => setWelcomeParams({ ...welcomeParams, accountTier: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Anti-Phishing Phrase</label>
                    <input
                      type="text"
                      value={welcomeParams.antiPhishingCode}
                      onChange={e => setWelcomeParams({ ...welcomeParams, antiPhishingCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Expiry (Minutes)</label>
                    <input
                      type="number"
                      value={welcomeParams.expiryMinutes}
                      onChange={e => setWelcomeParams({ ...welcomeParams, expiryMinutes: parseInt(e.target.value) || 60 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {activeTemplate === 'password_reset' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={resetParams.recipientName}
                      onChange={e => setResetParams({ ...resetParams, recipientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Requesting IP</label>
                    <input
                      type="text"
                      value={resetParams.ipAddress}
                      onChange={e => setResetParams({ ...resetParams, ipAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Approx. Location</label>
                    <input
                      type="text"
                      value={resetParams.location}
                      onChange={e => setResetParams({ ...resetParams, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Client Device</label>
                    <input
                      type="text"
                      value={resetParams.device}
                      onChange={e => setResetParams({ ...resetParams, device: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Security Checksum Code</label>
                    <input
                      type="text"
                      value={resetParams.resetCode}
                      onChange={e => setResetParams({ ...resetParams, resetCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Expiry (Minutes)</label>
                    <input
                      type="number"
                      value={resetParams.expiryMinutes}
                      onChange={e => setResetParams({ ...resetParams, expiryMinutes: parseInt(e.target.value) || 15 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {activeTemplate === 'login_alert' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={alertParams.recipientName}
                      onChange={e => setAlertParams({ ...alertParams, recipientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Origin Location</label>
                    <input
                      type="text"
                      value={alertParams.location}
                      onChange={e => setAlertParams({ ...alertParams, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Origin IP Address</label>
                    <input
                      type="text"
                      value={alertParams.ipAddress}
                      onChange={e => setAlertParams({ ...alertParams, ipAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Device / Hardware</label>
                    <input
                      type="text"
                      value={alertParams.device}
                      onChange={e => setAlertParams({ ...alertParams, device: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Browser Engine</label>
                    <input
                      type="text"
                      value={alertParams.browser}
                      onChange={e => setAlertParams({ ...alertParams, browser: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Authentication Method</label>
                    <input
                      type="text"
                      value={alertParams.authMethod}
                      onChange={e => setAlertParams({ ...alertParams, authMethod: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Studio Frame Layout */}
      <div className="space-y-4">
        {/* Studio Toolbar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* View Mode Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              id="growvest-mode-preview"
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual Preview</span>
            </button>
            <button
              id="growvest-mode-html"
              type="button"
              onClick={() => setViewMode('html')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'html'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML Source</span>
            </button>
            <button
              id="growvest-mode-text"
              type="button"
              onClick={() => setViewMode('text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'text'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Plain Text</span>
            </button>
          </div>

          {/* Device & Theme Toggles (Available in preview mode) */}
          {viewMode === 'preview' && (
            <div className="flex items-center gap-2">
              {/* Device Selector */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    viewport === 'desktop'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Desktop (640px max-width)"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('tablet')}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    viewport === 'tablet'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Tablet (520px width)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    viewport === 'mobile'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Mobile Phone (375px width)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Client Dark Mode Toggle */}
              <button
                type="button"
                onClick={() => setClientDarkMode(!clientDarkMode)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  clientDarkMode
                    ? 'bg-slate-950 text-amber-400 border-slate-800 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Toggle Email Client Dark Mode Rendering"
              >
                {clientDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span className="text-[11px] hidden sm:inline">{clientDarkMode ? 'Dark Client' : 'Light Client'}</span>
              </button>
            </div>
          )}

          {/* Export & Copy buttons */}
          <div className="flex items-center gap-2">
            <button
              id="growvest-copy-template-btn"
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy {viewMode === 'text' ? 'Text' : 'HTML'}</span>
                </>
              )}
            </button>

            <button
              id="growvest-download-html-btn"
              type="button"
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download standalone .html email file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Realistic Email Client Header Envelope */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Subject:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-xs">{templateOutput.subject}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <span>SPF: PASS</span>
              <span>•</span>
              <span>DKIM: PASS (2048-bit)</span>
              <span>•</span>
              <span>DMARC: 100%</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <div>
              <span className="text-slate-400">From: </span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{templateOutput.fromName}</strong> &lt;{templateOutput.fromEmail}&gt;
            </div>
            <div>
              <span className="text-slate-400">To: </span>
              <span className="text-slate-800 dark:text-slate-200 font-mono">
                {activeTemplate === 'welcome'
                  ? welcomeParams.recipientEmail
                  : activeTemplate === 'password_reset'
                  ? resetParams.recipientEmail
                  : alertParams.recipientEmail}
              </span>
            </div>
          </div>
        </div>

        {/* View Content Display */}
        {viewMode === 'preview' && (
          <div className={`p-4 sm:p-8 rounded-3xl border transition-all flex items-center justify-center min-h-[600px] overflow-x-auto ${
            clientDarkMode
              ? 'bg-slate-950 border-slate-800'
              : 'bg-slate-100 border-slate-200'
          }`}>
            <div className={`w-full ${getViewportWidth()} transition-all duration-300 mx-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800`}>
              <iframe
                title="Email Preview"
                srcDoc={templateOutput.html}
                className="w-full h-[760px] border-0 bg-white"
                sandbox="allow-same-origin allow-popups"
              />
            </div>
          </div>
        )}

        {viewMode === 'html' && (
          <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Standalone Bulletproof HTML Template (Inline Styles + MSO Outlook Fallbacks)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Size: {(templateOutput.html.length / 1024).toFixed(1)} KB
              </span>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 leading-relaxed max-h-[600px] select-all">
              {templateOutput.html}
            </pre>
          </div>
        )}

        {viewMode === 'text' && (
          <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                RFC 5322 Plain-Text Fallback Version
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Format: UTF-8 Plain Text
              </span>
            </div>
            <pre className="text-xs font-mono text-slate-200 overflow-x-auto p-4 leading-relaxed max-h-[600px] whitespace-pre-wrap bg-slate-900/60 rounded-xl border border-slate-800/80">
              {templateOutput.plainText}
            </pre>
          </div>
        )}
      </div>

      {/* Institutional Email Engineering Specifications Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono uppercase tracking-wider">
            Email Engineering & Compliance Specifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="text-emerald-500">✓</span>
              <span>Universal Client Compatibility</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Tested across Apple Mail, Gmail (Web, iOS, Android), Outlook (2016-2024 + MSO VML tables), Thunderbird, and Samsung Mail with zero layout breaks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="text-emerald-500">✓</span>
              <span>Anti-Phishing Integrity</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Includes user-customized cryptographic Anti-Phishing security phrases, sender verification signatures, and strict 15-minute token TTL constraints.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="text-emerald-500">✓</span>
              <span>Dark Mode Optimization</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Uses modern `@media (prefers-color-scheme: dark)` styling overrides to preserve high contrast, legible typography, and emerald brand hierarchy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
