import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Radio,
  FileCheck,
  KeyRound,
  ExternalLink,
  RefreshCw,
  Cpu,
  Eye,
  Check
} from 'lucide-react';
import { securityShield, SecurityThreatMetric } from '../../services/securityShield';

export const AntiScamSecurityShield: React.FC<{ isCompact?: boolean }> = ({ isCompact = false }) => {
  const [metrics] = useState<SecurityThreatMetric[]>(() => securityShield.getLiveThreatMetrics());
  const [testAddress, setTestAddress] = useState('');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    valid: boolean;
    poisonRisk: boolean;
    network?: string;
    warning?: string;
  } | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleTestAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testAddress.trim()) return;

    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      const res = securityShield.validateCryptoAddress(testAddress);
      setTestResult({
        tested: true,
        valid: res.isValid,
        poisonRisk: res.isPoisoningRisk,
        network: res.network,
        warning: res.warning
      });
    }, 600);
  };

  if (isCompact) {
    return (
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 text-white space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Threat Defense Enclave</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h4>
              <p className="text-[11px] text-slate-400">Military-grade protection active</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            SCORE: 100/100
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">WAF Edge Filter</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3" /> Tier IV Armed
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Cold Storage</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3" /> 100% Segregated
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Institutional Security & Threat Defense Enclave
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Automated anti-hacker countermeasures, real-time address poisoning prevention, and segregated HSM vault attestation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Zero-Trust Protocol v4.9</span>
          </div>
        </div>
      </div>

      {/* Live Threat Defense Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(m => (
          <div
            key={m.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {m.name}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                {m.status}
              </span>
            </div>

            <div>
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {m.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {m.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Anti-Poisoning Crypto Address Scanner */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold tracking-tight">
              Real-Time Crypto Address Poisoning & Clipboard Hijack Detector
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            CLIENT-SIDE AUDIT
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Scammers use address poisoning attacks to trick investors into copying vanity spoofed addresses. Paste any crypto address below to inspect for hidden zero-width injection, collision hazards, and network validity.
        </p>

        <form onSubmit={handleTestAddress} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testAddress}
            onChange={e => setTestAddress(e.target.value)}
            placeholder="Paste destination address (BTC, ETH/ERC20, SOL, TRON/TRC20)..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isAuditing}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Payload...</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Scan Address</span>
              </>
            )}
          </button>
        </form>

        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fade-in ${
              testResult.valid && !testResult.poisonRisk
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-200'
            }`}
          >
            {testResult.valid && !testResult.poisonRisk ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <div className="font-bold">
                {testResult.valid && !testResult.poisonRisk
                  ? `Address Verified Safe (${testResult.network?.toUpperCase()} Network)`
                  : 'Security Hazard or Invalid Address'}
              </div>
              <div className="text-[11px] opacity-90">
                {testResult.warning ||
                  'No hidden zero-width unicode injection or spoofed checksum collision detected. Address is cryptographically compliant.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
