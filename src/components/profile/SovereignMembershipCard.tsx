import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Award,
  CreditCard,
  QrCode,
  Lock,
  ChevronRight,
  Wifi,
  Cpu,
  CheckCircle2,
  Download,
  KeyRound
} from 'lucide-react';
import { UserProfile, UserWallet } from '../../types';
import { useApp } from '../../context/AppContext';

interface SovereignMembershipCardProps {
  user: UserProfile | null;
  wallet?: UserWallet | null;
  onOpenKycModal: () => void;
}

export const SovereignMembershipCard: React.FC<SovereignMembershipCardProps> = ({
  user,
  wallet,
  onOpenKycModal
}) => {
  const { addNotification } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);

  const tier = user?.verificationStatus === 'tier2_verified' || user?.verificationStatus === 'verified'
    ? 'SOVEREIGN INSTITUTIONAL'
    : 'STANDARD TIER 1';

  const memberId = `GZ-${(user?.id || '88019').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}`;

  const handleCopyCardData = () => {
    navigator.clipboard?.writeText(memberId);
    addNotification({
      type: 'account',
      title: 'Member UID Copied',
      message: `Cryptographic Member Identifier ${memberId} copied to clipboard.`
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* 3D Holographic Style Institutional Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer group relative w-full max-w-xl mx-auto min-h-[230px] sm:min-h-[250px] rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0c1c17] via-[#102a22] to-[#081512] text-white border border-emerald-500/40 shadow-2xl shadow-emerald-950/50 overflow-hidden flex flex-col justify-between select-none transition-all duration-300 hover:border-emerald-400 hover:shadow-emerald-900/60"
      >
        {/* Subtle holographic metallic light beam */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/5 to-transparent opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Front side of card */}
        {!isFlipped ? (
          <>
            {/* Top Row: Brand & Chip & Contactless */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                  G
                </div>
                <div>
                  <div className="font-mono text-xs tracking-widest uppercase font-black text-emerald-400">
                    GROWVEST
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono tracking-wider">
                    PRIVATE WEALTH VAULT
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-emerald-400/80 rotate-90" />
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  {tier}
                </span>
              </div>
            </div>

            {/* Middle: EMV Chip & Hologram Hash */}
            <div className="flex items-center justify-between relative z-10 py-2">
              <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 border border-amber-600/40 shadow-xs flex items-center justify-center p-1">
                <div className="w-full h-full border border-amber-800/40 rounded flex flex-col justify-between">
                  <div className="w-full h-px bg-amber-800/30" />
                  <div className="w-full h-px bg-amber-800/30" />
                </div>
              </div>

              <div className="font-mono text-xs text-slate-400 text-right">
                <div className="text-[9px] uppercase tracking-wider text-slate-500">Daily Clearing Limit</div>
                <div className="font-bold text-emerald-400">$500,000.00 USD</div>
              </div>
            </div>

            {/* Bottom Row: Member Name & Card ID */}
            <div className="flex items-end justify-between relative z-10 pt-2 border-t border-emerald-950/80">
              <div className="space-y-0.5">
                <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                  Account Holder
                </div>
                <div className="text-base sm:text-lg font-bold tracking-wide font-mono text-white">
                  {user?.firstName ? `${user.firstName} ${user.lastName}`.toUpperCase() : 'ALEXANDER VANCE'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                  Member UID
                </div>
                <div className="text-xs sm:text-sm font-mono font-bold text-emerald-300">
                  {memberId}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Back side of card: Cryptographic Hash & Cold Vault Security Data */
          <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                Custody Attestation Ledger
              </span>
              <span className="text-[10px] font-mono text-slate-400">Click to flip front</span>
            </div>

            {/* Magnetic Stripe visual */}
            <div className="w-full h-9 bg-black rounded-lg border border-slate-800 flex items-center px-4">
              <div className="w-full h-2 bg-emerald-900/40 rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-black/50 border border-emerald-950">
                <span className="text-[9px] text-slate-400 block">HSM Vault Signature</span>
                <span className="text-emerald-400 font-bold truncate block">0x9F4C...B288</span>
              </div>
              <div className="p-2 rounded-xl bg-black/50 border border-emerald-950">
                <span className="text-[9px] text-slate-400 block">FCA / MSB Protected</span>
                <span className="text-white font-bold block">100% Segregated</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center font-mono">
              Authorized signatory only • Non-transferable digital wealth pass
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs">
        <button
          onClick={handleCopyCardData}
          className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 font-mono transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Copy Member UID: {memberId}</span>
        </button>
        <span className="text-slate-400">•</span>
        <button
          onClick={onOpenKycModal}
          className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Upgrade Tier Limits</span>
        </button>
      </div>
    </div>
  );
};
