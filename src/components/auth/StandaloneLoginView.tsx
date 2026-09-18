import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Fingerprint,
  Copy,
  ChevronLeft,
  KeyRound,
  Shield,
  ExternalLink,
  Globe,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { webAuthnService } from '../../services/webAuthnService';

interface StandaloneLoginViewProps {
  initialEmail?: string;
  onBackToPublic?: () => void;
  onSuccess?: () => void;
}

export const StandaloneLoginView: React.FC<StandaloneLoginViewProps> = ({
  initialEmail = '',
  onBackToPublic,
  onSuccess
}) => {
  const { login, register, sendPasswordResetEmail, isLoading } = useAuth();
  const { setActiveTab, setPublicPage } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [emailOrUser, setEmailOrUser] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCountry, setRegCountry] = useState('Switzerland');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasPasskey, setHasPasskey] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Parse any email/user from URL search or hash on mount
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let emailParam = urlParams.get('email') || urlParams.get('user') || urlParams.get('username');

      // Also check hash query string (e.g. #/login?email=test@example.com)
      if (!emailParam && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        emailParam = hashParams.get('email') || hashParams.get('user') || hashParams.get('username');
      }

      if (emailParam) {
        setEmailOrUser(emailParam);
        setRegEmail(emailParam);
      }
    } catch {
      // safe fallback
    }
  }, []);

  // Check WebAuthn platform authenticator
  useEffect(() => {
    webAuthnService.isPlatformAuthenticatorAvailable().then(avail => {
      setHasPasskey(avail);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!emailOrUser.trim() || !password) {
      setErrorMessage('Please enter your email/username and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(emailOrUser.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('Authentication verified. Accessing secure terminal...');
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          setActiveTab('admin');
        } else {
          setActiveTab('dashboard');
        }
        if (onSuccess) onSuccess();
      }, 500);
    } else {
      const err = res.error || '';
      if (!navigator.onLine || err.toLowerCase().includes('network') || err.toLowerCase().includes('fetch')) {
        setErrorMessage('Network error, please check internet connection and try again.');
      } else {
        setErrorMessage(err || 'Invalid credentials. Please verify your access details.');
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: regEmail.trim().split('@')[0] || 'client',
      email: regEmail.trim(),
      password: regPassword,
      country: regCountry,
      phoneCountryCode: '+1',
      phoneNumber: '',
      marketingConsent: false
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('Account established successfully! Opening client terminal...');
      setTimeout(() => {
        setActiveTab('dashboard');
        if (onSuccess) onSuccess();
      }, 700);
    } else {
      const err = res.error || '';
      if (!navigator.onLine || err.toLowerCase().includes('network') || err.toLowerCase().includes('fetch')) {
        setErrorMessage('Network error, please check internet connection and try again.');
      } else {
        setErrorMessage(err || 'Registration failed. Email may already be in use.');
      }
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await sendPasswordResetEmail(forgotEmail.trim());
    setIsSubmitting(false);
    if (res.success) {
      setForgotSubmitted(true);
    } else {
      const err = res.error || '';
      if (!navigator.onLine || err.toLowerCase().includes('network') || err.toLowerCase().includes('fetch')) {
        setErrorMessage('Network error, please check internet connection and try again.');
      } else {
        setErrorMessage(err || 'Failed to dispatch password recovery link.');
      }
    }
  };

  const handlePasskeyLogin = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await webAuthnService.authenticateWithPasskey(emailOrUser.trim() || undefined);
      if (res.success && res.passkey) {
        setSuccessMessage('Biometric token verified. Accessing terminal...');
        setTimeout(() => {
          setActiveTab('dashboard');
          if (onSuccess) onSuccess();
        }, 500);
      } else {
        setErrorMessage(res.error || 'Passkey biometric authentication was cancelled or not recognized.');
      }
    } catch {
      setErrorMessage('Biometric authentication could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyDirectLink = () => {
    const directUrl = `${window.location.origin}${window.location.pathname}#/login`;
    navigator.clipboard.writeText(directUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReturnHome = () => {
    if (onBackToPublic) {
      onBackToPublic();
    } else {
      setPublicPage('home');
      window.location.hash = '';
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const getDirectShareableUrl = () => {
    if (emailOrUser.trim()) {
      return `${window.location.origin}${window.location.pathname}#/login?email=${encodeURIComponent(emailOrUser.trim())}`;
    }
    return `${window.location.origin}${window.location.pathname}#/login`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center px-4 py-8 sm:py-12 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="w-full max-w-lg flex items-center justify-between z-10 gap-3">
        <button
          onClick={handleReturnHome}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 px-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 backdrop-blur-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Public Website</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Enclave</span>
          </div>

          <button
            onClick={handleCopyDirectLink}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 py-2 px-3.5 rounded-xl transition-all cursor-pointer font-bold"
            title="Copy this direct sign-in link to share with anyone"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
          </button>
        </div>
      </div>

      {/* Main Authentication Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl relative z-10 my-6 backdrop-blur-xl space-y-6"
      >
        {/* Institutional Branding Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <BrandLogo size="lg" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Client Sign-In Terminal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {mode === 'login' && 'Sign In to Your Account'}
            {mode === 'register' && 'Open Private Client Account'}
            {mode === 'forgot' && 'Reset Access Password'}
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {mode === 'login' && 'Direct institutional access to Swiss custody wealth, algorithmic trading & portfolio management.'}
            {mode === 'register' && 'Register your private wealth account to access real-time markets and wealth advisory.'}
            {mode === 'forgot' && 'Enter your registered email address to receive password restoration instructions.'}
          </p>
        </div>

        {/* Error / Success Banners */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2.5"
            >
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. SIGN IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  autoFocus={!emailOrUser}
                  value={emailOrUser}
                  onChange={e => setEmailOrUser(e.target.value)}
                  placeholder="Sign in"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-medium focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-medium focus:border-emerald-500 focus:outline-none transition-colors tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="w-full h-12 min-h-[48px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-sm transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Client Portal'}</span>
            </button>

            {/* Passkey / WebAuthn Biometric Option */}
            {hasPasskey && (
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-mono text-slate-500 uppercase">or authenticate via</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={handlePasskeyLogin}
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-slate-700"
                >
                  <Fingerprint className="w-4 h-4 text-emerald-400" />
                  <span>Sign In with Face ID / Touch ID / Passkey</span>
                </button>
              </div>
            )}

            {/* Footer switcher */}
            <div className="pt-3 border-t border-slate-800/70 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Jean-Paul"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Dubois"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder=""
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Country of Residence</label>
              <input
                type="text"
                value={regCountry}
                onChange={e => setRegCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Terms and Privacy policy notice */}
            <div className="text-[11px] text-slate-400 leading-relaxed text-center">
              By creating an account, you agree to our{' '}
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#terms';
                }}
                className="text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#privacy';
                }}
                className="text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
              >
                Privacy Policy
              </a>
              .
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 min-h-[48px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
            </button>

            <div className="pt-3 border-t border-slate-800/70 text-center">
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {forgotSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Reset Instructions Dispatched</h3>
                <p className="text-xs text-slate-300">
                  If an account exists matching <span className="font-mono text-emerald-400">{forgotEmail}</span>, a secure authentication recovery link has been transmitted.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setForgotSubmitted(false);
                    setErrorMessage(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder=""
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 min-h-[48px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Sending...' : 'Send Recovery Link'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 font-bold"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </motion.div>

      {/* Shareable Link Box & Institutional Compliance Footer */}
      <div className="w-full max-w-lg text-center space-y-3 z-10">
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="text-left min-w-0">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">
              Direct Sign-In Portal URL
            </span>
            <span className="text-slate-300 font-mono text-[11px] truncate block">
              {getDirectShareableUrl()}
            </span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(getDirectShareableUrl());
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2500);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span>Swiss FINMA Custody Standard</span>
          <span>•</span>
          <span>FCA Regulated #849201</span>
          <span>•</span>
          <span>256-Bit TLS</span>
        </div>
      </div>
    </div>
  );
};
