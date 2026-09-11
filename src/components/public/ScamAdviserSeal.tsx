import React from 'react';
import { ShieldCheck, ExternalLink, CheckCircle2, Award } from 'lucide-react';
import { OFFICIAL_SCAMADVISER_DATA } from '../../services/scamAdviserService';

interface ScamAdviserSealProps {
  variant?: 'badge' | 'card' | 'compact' | 'pill';
  onClick?: () => void;
  className?: string;
}

export const ScamAdviserSeal: React.FC<ScamAdviserSealProps> = ({
  variant = 'badge',
  onClick,
  className = ''
}) => {
  const { trustScore, trustPercentage } = OFFICIAL_SCAMADVISER_DATA;

  if (variant === 'pill') {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold transition-all cursor-pointer shadow-xs ${className}`}
        title={`ScamAdviser Score ${trustScore}/100 - ${trustPercentage}% Trusted`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>ScamAdviser {trustScore}/100</span>
        <span className="text-[10px] text-emerald-300/80">({trustPercentage}% Safe)</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/30 text-xs font-semibold text-white transition-all cursor-pointer ${className}`}
        title="View official ScamAdviser trust audit"
      >
        <div className="w-5 h-5 rounded bg-emerald-500 text-slate-950 flex items-center justify-center font-black font-mono text-[10px]">
          SA
        </div>
        <div className="flex items-center gap-1 font-mono">
          <span className="text-emerald-400 font-bold">{trustScore}/100</span>
          <span className="text-slate-400 text-[10px]">({trustPercentage}% Trusted)</span>
        </div>
      </button>
    );
  }

  // Default 'badge' / 'card'
  return (
    <button
      onClick={onClick}
      className={`group relative p-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/40 text-left transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10 flex items-center justify-between gap-3 ${className}`}
      title="Click to inspect live ScamAdviser Trust Audit"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 flex items-center justify-center font-black font-mono text-sm shadow-md">
          SA
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>ScamAdviser Verified</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xs text-slate-300 font-medium">
            Trust Score: <span className="font-mono font-bold text-white">{trustScore}/100</span> ({trustPercentage}% Trust Index)
          </div>
        </div>
      </div>

      <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold shrink-0">
        GREEN ZONE
      </div>
    </button>
  );
};
