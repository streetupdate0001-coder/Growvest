import React from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Server,
  FileCheck,
  EyeOff,
  Shield,
  Activity,
  Cpu,
  Fingerprint,
  CheckCircle2,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_CERTIFICATE_DATA } from '../../services/certificateGenerator';

export const PublicSecuritySection: React.FC = () => {
  const { t, setIsCertificateModalOpen } = useApp();

  const securityFeatures = [
    {
      icon: Lock,
      title: '256-Bit SSL / TLS 1.3 Bank-Grade Encryption',
      desc: 'All network traffic, API endpoints, and client communications use ECDSA certificates with AES-256-GCM cipher suites, rendering interception mathematically impossible.'
    },
    {
      icon: Shield,
      title: 'FIPS 140-2 Level 3 Cold Storage Vaults',
      desc: '98%+ of all client digital assets are isolated in geographic offline vaults backed by HSM hardware cryptographic enclaves across Switzerland and the UK.'
    },
    {
      icon: EyeOff,
      title: 'Zero-Knowledge Credential Security',
      desc: 'Growvest infrastructure maintains no unencrypted access to client private keys, seed phrases, or raw password credentials.'
    },
    {
      icon: Key,
      title: 'FIDO2 & Hardware Security Keys',
      desc: 'Universal support for hardware authentication (YubiKey, Apple Touch ID, Windows Hello) alongside time-based TOTP 2FA.'
    },
    {
      icon: Server,
      title: 'Segregated & Bankruptcy-Remote Accounts',
      desc: 'Client funds are maintained strictly separate from corporate operating capital under FCA and FINRA standards, and are never rehypothecated or lent.'
    },
    {
      icon: FileCheck,
      title: 'Continuous Penetration Testing & Auditing',
      desc: 'Regular external third-party security audits, automated CI/CD vulnerability scanners, and continuous bug bounty assessments.'
    }
  ];

  const sslSpecs = [
    { label: 'Symmetric Cipher', value: 'AES-256-GCM' },
    { label: 'Key Exchange', value: 'ECDH (X25519) 256-bit' },
    { label: 'Digital Signature', value: 'SHA-384 / RSA-4096' },
    { label: 'Protocol Version', value: 'TLS 1.3 / Strict PFS' },
    { label: 'HSM Enclave Level', value: 'FIPS 140-2 Level 3' },
    { label: 'Regulatory Custody', value: 'FCA & FINRA Standard' }
  ];

  return (
    <section
      id="public-security-section"
      className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Trust Infrastructure & Custodial Enclaves</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
            Investment Level Security Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Security is not an add-on at Growvest; it is the core mathematical foundation of our entire multi-asset infrastructure, operating under strict FCA and FINRA standards.
          </p>
        </div>

        {/* Dedicated 256-Bit SSL Encryption Section with Lock Icon */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <Lock className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      MILITARY-GRADE PROTOCOL
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      INVESTMENT LEVEL SECURITY
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                    256-Bit SSL & Hardware-Backed Enclave Encryption
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    Every data byte traversing the Growvest network is shielded by 256-Bit SSL (AES-256-GCM) with perfect forward secrecy (PFS). Private signing keys reside exclusively within air-gapped Hardware Security Modules (HSM) with zero human operator exposure.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Verify Legal Registration</span>
                </button>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>Active Cryptographic Verification</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Spec Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800/80">
              {sslSpecs.map((spec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">{spec.label}</div>
                  <div className="text-xs font-mono font-bold text-emerald-400">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6 Security Spec Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Comprehensive Custodial & Security Standards
            </h3>
            <span className="text-xs font-mono text-slate-500">ISO 27001 & SOC 2 Audited</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {feat.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

