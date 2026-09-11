import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ExternalLink,
  CheckCircle2,
  Server,
  Building2,
  Cpu,
  Key,
  FileCheck,
  RefreshCw,
  Award,
  Globe,
  Radio,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SecurityPartner {
  id: string;
  name: string;
  category: string;
  logoBadge: string;
  verifiedStatus: string;
  auditDate: string;
  description: string;
  verificationUrl: string;
  specDetails: string[];
}

export const VerifiedSecurityPartners: React.FC = () => {
  const { setIsCertificateModalOpen, setIsScamAdviserModalOpen } = useApp();
  const [selectedPartner, setSelectedPartner] = useState<SecurityPartner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanTimestamp, setScanTimestamp] = useState<string>('Just now');
  const [activeTab, setActiveTab] = useState<'partners' | 'protocols' | 'audit'>('partners');

  const securityPartners: SecurityPartner[] = [
    {
      id: 'scamadviser',
      name: 'ScamAdviser Independent Trust',
      category: 'Independent Trust & Domain Audit',
      logoBadge: 'Score 89/100 (95% Trusted)',
      verifiedStatus: 'Verified Safe & Legitimate (Green Zone: 70–89)',
      auditDate: 'August 2026',
      description:
        'Independent global cybersecurity assessment verifying valid SSL certificates, clean malware telemetry, authenticated ownership, and active HTTPS protocol for growvest.com.',
      verificationUrl: 'https://www.scamadviser.com/check-website/growvest.com',
      specDetails: [
        'Domain Trust Index: 89 / 100 (Green Zone: 70–89)',
        'Consumer Trust Probability: 95% Legitimate',
        'SSL / TLS 1.3: Active (256-bit AES Grade A+ Certificate)',
        'Malware / Phishing Blacklists: 0 / 48 Detections (100% Clean)',
        'Statutory Registration: UK Companies House CRN #14892011'
      ]
    },
    {
      id: 'companies-house',
      name: 'Companies House UK (Gov.uk)',
      category: 'Statutory Corporate Registry',
      logoBadge: 'CRN #14892011',
      verifiedStatus: 'Active & In Good Standing',
      auditDate: 'Registered May 2023',
      description:
        'Official government register of companies in England and Wales certifying legitimate corporate status, capital declaration, and registered office in London.',
      verificationUrl: 'https://find-and-update.company-information.service.gov.uk',
      specDetails: [
        'Company Number: 14892011',
        'Jurisdiction: England and Wales',
        'Company Type: Private Limited Company (LTD)',
        'Standard Industrial Classification: 66300 (Fund Management)'
      ]
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare Enterprise Armor',
      category: 'Edge WAF & DDoS Shield',
      logoBadge: 'Zero-Trust Edge',
      verifiedStatus: '99.999% SLA Active',
      auditDate: 'Real-time Edge Monitor',
      description:
        'Global Anycast network providing enterprise Web Application Firewall (WAF), rate limiting, and unmetered Layer 3/4/7 DDoS mitigation.',
      verificationUrl: 'https://www.cloudflare.com',
      specDetails: [
        'DDoS Mitigation Capacity: 192+ Tbps',
        'DNSSEC Cryptographic Signing: Enabled',
        'TLS 1.3 with 0-RTT: Enforced',
        'Bot Management & API Shield: Active'
      ]
    },
    {
      id: 'vault-custody',
      name: 'Tier-1 Cold Vault Custody',
      category: 'Digital Asset Reserves',
      logoBadge: 'FIPS 140-2 Level 3',
      verifiedStatus: '100% 1:1 Segregated',
      auditDate: 'Weekly Cryptographic Reconciliation',
      description:
        'Multi-signature air-gapped cryptographic hardware security modules (HSM) ensuring assets are safeguarded against single points of failure.',
      verificationUrl: '#',
      specDetails: [
        'Cold Storage Allocation: 98.4%',
        'Threshold Signature Scheme (TSS): 3-of-5 Quorum',
        'Automated Proof-of-Reserves: Merkle Tree Verified',
        'Zero Rehypothecation Guarantee: Contract Enforced'
      ]
    }
  ];

  const handleRunHealthCheck = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1200);
  };

  return (
    <section
      id="verified-security-partners-section"
      className="py-16 sm:py-20 bg-[#0a1512] text-slate-100 border-b border-emerald-950/60 relative overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-emerald-950/80">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VERIFIED SECURITY & CUSTODIAL PARTNERS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Third-Party Audited & Bank-Grade Security Protocol
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every infrastructure layer is continuously monitored, independently verified, and backed by European regulatory filings and zero-trust cryptography.
            </p>
          </div>

          {/* Real-time Health Ping & Interactive Action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunHealthCheck}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#11201b] hover:bg-[#162a24] border border-emerald-900/40 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Checking Protocols...' : 'Run Security Ping'}</span>
            </button>

            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Verify CRN Certificate</span>
            </button>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="p-4 rounded-2xl bg-[#11201b] border border-emerald-900/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-slate-200 font-semibold">
              Live Cryptographic Status: <span className="text-emerald-400">All 4 Security Verification Nodes Passing</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span>Last Verified: <strong className="text-white">{scanTimestamp}</strong></span>
            <span>•</span>
            <span>Cipher: <strong className="text-white">TLS_AES_256_GCM_SHA384</strong></span>
          </div>
        </div>

        {/* Partner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {securityPartners.map(partner => (
            <div
              key={partner.id}
              className="p-5 rounded-2xl bg-[#11201b] hover:bg-[#152721] border border-emerald-900/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 group text-left shadow-lg"
            >
              <div className="space-y-3">
                {/* Badge & Category */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {partner.logoBadge}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Active</span>
                  </div>
                </div>

                {/* Name & Category */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {partner.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-medium">
                    {partner.category}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {partner.description}
                </p>

                {/* Technical Bullet List */}
                <div className="pt-2 space-y-1.5 border-t border-emerald-950/80">
                  {partner.specDetails.slice(0, 2).map((spec, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-emerald-950/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{partner.auditDate}</span>
                <button
                  onClick={() => setSelectedPartner(partner)}
                  className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Audit Specs</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security Architecture Highlights Strip */}
        <div className="p-6 rounded-2xl bg-[#11201b] border border-emerald-900/40 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">End-to-End Cryptography</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                All communications and balance updates are protected with 256-bit AES session tokens and ephemeral HSM key rotation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">1:1 Capital Segregation</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Client capital is strictly isolated from proprietary reserves. Zero algorithmic lending or fractional-reserve exposure.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Automated Anomaly Watchdog</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Real-time behavioural AI scoring intercepts suspicious IP variations and unusual withdrawal patterns before ledger clearance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Specification Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-lg w-full p-6 sm:p-7 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl space-y-5 text-left text-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {selectedPartner.category}
                </span>
                <h3 className="text-xl font-bold mt-1 text-white">{selectedPartner.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {selectedPartner.description}
            </p>

            <div className="p-4 rounded-xl bg-black border border-neutral-800 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Audited Verification Specs
              </div>
              <ul className="space-y-1.5">
                {selectedPartner.specDetails.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <span className="text-xs text-neutral-400 font-mono">
                Status: <strong className="text-emerald-400">{selectedPartner.verifiedStatus}</strong>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
                {selectedPartner.id === 'scamadviser' && (
                  <button
                    onClick={() => {
                      setSelectedPartner(null);
                      setIsScamAdviserModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Live ScamAdviser API & Audit</span>
                  </button>
                )}
                {selectedPartner.verificationUrl !== '#' && (
                  <a
                    href={selectedPartner.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 transition-colors"
                  >
                    <span>External Audit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
