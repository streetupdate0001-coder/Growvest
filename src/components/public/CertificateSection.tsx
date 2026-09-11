import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Download,
  FileCheck,
  ExternalLink,
  CheckCircle2,
  Building2,
  Lock,
  Globe2
} from 'lucide-react';
import { CertificateCard } from './CertificateCard';
import { CertificateModal } from './CertificateModal';
import { OFFICIAL_CERTIFICATE_DATA } from '../../services/certificateGenerator';

export const CertificateSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="growvest-certificate-section"
      className="py-16 sm:py-20 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 border-t border-slate-800 relative overflow-hidden"
    >
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Corporate Governance & Official Registration</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-100 tracking-tight">
            Official Certificate of Registration
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Growvest is officially incorporated and certified under company registration number{' '}
            <span className="text-amber-300 font-mono font-bold">
              #{OFFICIAL_CERTIFICATE_DATA.registrationNumber}
            </span>
            . All new visitors and institutional clients can inspect, verify, and download our official registration certificate below.
          </p>
        </div>

        {/* The Certificate Showcase Card */}
        <div className="max-w-5xl mx-auto">
          <CertificateCard onOpenModal={() => setIsModalOpen(true)} />
        </div>

        {/* 3 Pillars of Regulatory Standing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
              <Building2 className="w-4 h-4" />
              <span>Registered Corporate Entity</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Incorporated under England & Wales company laws (CRN: {OFFICIAL_CERTIFICATE_DATA.crn}) with full compliance records publicly archived.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Segregated Custody</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Client digital holdings and fiat balances are legally segregated in cold storage vaults and never encumbered for operational expenses.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-bold font-mono">
              <Globe2 className="w-4 h-4" />
              <span>International LEI Identifier</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Assigned Legal Entity Identifier (LEI: {OFFICIAL_CERTIFICATE_DATA.leiCode}) for transparent cross-border institutional clearing.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <CertificateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
