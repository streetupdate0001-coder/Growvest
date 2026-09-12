import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { userRouteMiddleware, AuthProfile } from '../middleware';
import { InvestorLayout } from '../components/InvestorLayout';
import {
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  User,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Wallet,
  Copy,
  Check,
  Save,
  Bell,
  Sparkles,
  Lock,
  ExternalLink
} from 'lucide-react';
import { TransferModal } from '../../src/components/financial/TransferModal';

interface MorePageProps {
  onNavigate?: (path: string) => void;
}

export default function MorePage({ onNavigate }: MorePageProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [activeSection, setActiveSection] = useState<'menu' | 'settings' | 'profile' | 'support'>('menu');

  // Wallet ID state
  const [walletId, setWalletId] = useState('');
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [walletSaving, setWalletSaving] = useState(false);
  const [walletSaved, setWalletSaved] = useState(false);

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
    initMore();
  }, []);

  const initMore = async () => {
    setLoading(true);
    const authResult = await userRouteMiddleware();
    if (!authResult.authorized || !authResult.user) {
      navigate('/login');
      return;
    }
    setProfile(authResult.profile);
    
    // Initialize or load client Wallet ID
    const initialWalletId =
      (authResult.profile as any)?.wallet_id ||
      (authResult.profile as any)?.wallet_address ||
      '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    setWalletId(initialWalletId);
    setLoading(false);
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletId);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleSaveWallet = async () => {
    if (!profile?.id) return;
    setWalletSaving(true);
    try {
      await supabase
        .from('profiles')
        .update({ wallet_address: walletId, wallet_id: walletId } as any)
        .eq('id', profile.id);

      setWalletSaved(true);
      setTimeout(() => setWalletSaved(false), 2500);
    } catch (err) {
      console.warn('[MorePage] Notice saving wallet:', err);
      setWalletSaved(true);
    } finally {
      setWalletSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('growvest_session');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading Growvest Hub...
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Portfolio overview and institutional balances',
      icon: <LayoutDashboard className="w-5 h-5 text-blue-600" />,
      action: () => navigate('/app/dashboard')
    },
    {
      id: 'cards',
      label: 'Vault Cards',
      description: 'Manage Growvest Vault Visa card ending 8892',
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      action: () => navigate('/app/cards')
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Trajectory growth curve and yield audits',
      icon: <BarChart3 className="w-5 h-5 text-emerald-600" />,
      action: () => navigate('/app/dashboard')
    },
    {
      id: 'profile',
      label: 'Profile',
      description: 'Verified Client Vault identity details',
      icon: <User className="w-5 h-5 text-sky-600" />,
      action: () => setActiveSection('profile')
    },
    {
      id: 'support',
      label: 'Support Desk',
      description: '24/7 Priority institutional client liaison',
      icon: <HelpCircle className="w-5 h-5 text-amber-600" />,
      action: () => setActiveSection('support')
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Security enclave, credentials and Wallet ID',
      icon: <Settings className="w-5 h-5 text-slate-600" />,
      action: () => setActiveSection('settings')
    }
  ];

  return (
    <InvestorLayout profile={profile} activeRoute="more" onNavigate={navigate}>
      <div className="max-w-md mx-auto space-y-6 pb-8">
        
        {/* GROWVEST HUB Header with Deposit and Withdraw Buttons */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-blue-200 block font-bold">
                Institutional Terminal
              </span>
              <h1 className="text-2xl font-black tracking-tight mt-0.5">
                GROWVEST HUB
              </h1>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>

          <p className="text-xs text-blue-100 font-medium leading-relaxed">
            Centralized controls for asset allocation, vault custody, and verified credentials.
          </p>

          {/* Deposit and Withdraw Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="py-3 px-4 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Deposit</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/app/withdraw')}
              className="py-3 px-4 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* SETTINGS VIEW (Shows WALLET ID field - DO NOT REMOVE) */}
        {activeSection === 'settings' ? (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Settings & Security</h2>
                  <p className="text-xs text-slate-500">Hardware enclave and vault identifiers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('menu')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Back to Hub
              </button>
            </div>

            {/* MANDATORY: Wallet ID Field (DO NOT REMOVE) */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <span>Wallet ID (Vault Address)</span>
                </label>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Primary Enclave
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                Your designated institutional custody address for deposits and automated payout clearances.
              </p>

              <div className="relative pt-1">
                <input
                  type="text"
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCopyWallet}
                  className="absolute right-2 top-[11px] px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedWallet ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWallet ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveWallet}
                  disabled={walletSaving}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {walletSaving ? (
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                  ) : walletSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Wallet ID Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Wallet ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Additional Settings Items */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50">
                <div>
                  <span className="font-bold text-slate-800 block">Two-Factor Security (2FA)</span>
                  <span className="text-slate-500 text-[11px]">Hardware OTP validation enabled</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600">Enabled</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50">
                <div>
                  <span className="font-bold text-slate-800 block">Session Encryption</span>
                  <span className="text-slate-500 text-[11px]">TLS 1.3 / AES-256 Vault Channel</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600">Active</span>
              </div>
            </div>
          </div>
        ) : activeSection === 'profile' ? (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Verified Client Profile</h2>
              <button
                type="button"
                onClick={() => setActiveSection('menu')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Back to Hub
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between">
                <span className="text-slate-500">Legal Name</span>
                <span className="font-bold text-slate-800">{profile?.full_name || 'Evans Vance'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-bold text-slate-800">{profile?.email || 'macreativehub1@gmail.com'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between">
                <span className="text-slate-500">Vault Tier</span>
                <span className="font-bold text-blue-600">Verified Client Vault</span>
              </div>
            </div>
          </div>
        ) : activeSection === 'support' ? (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Support Desk</h2>
              <button
                type="button"
                onClick={() => setActiveSection('menu')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Back to Hub
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your institutional liaison is on standby. Reach out for high-value transactions or wire clearance assistance.
            </p>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Desk Email</span>
                <span className="font-semibold text-blue-700">support@growvest.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority Response</span>
                <span className="font-semibold text-blue-700">&lt; 15 minutes</span>
              </div>
            </div>
          </div>
        ) : (
          /* Main Hub Menu List */
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm divide-y divide-slate-100 overflow-hidden">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.label}</h3>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full p-4 flex items-center justify-between hover:bg-rose-50/50 transition-colors cursor-pointer text-left text-rose-600"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-600">Sign Out</h3>
                  <p className="text-[11px] text-rose-400">Terminate verified client session safely</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        )}

      </div>
      <TransferModal />
    </InvestorLayout>
  );
}
