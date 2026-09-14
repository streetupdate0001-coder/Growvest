import React, { useState } from 'react';
import {
  Globe2,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Award,
  Activity,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_CERTIFICATE_DATA } from '../../services/certificateGenerator';

interface HubLocation {
  id: string;
  city: string;
  region: string;
  badge: string;
  role: string;
  address: string;
  registration: string;
  regulatoryBody: string;
  phone: string;
  email: string;
  latency: string;
  colorBorder: string;
}

const REGULATED_HUBS: HubLocation[] = [
  {
    id: 'london',
    city: 'London',
    region: 'United Kingdom',
    badge: 'GLOBAL HEADQUARTERS',
    role: 'UK Corporate Governance & FCA Enclave',
    address: '200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom',
    registration: `CRN: ${OFFICIAL_CERTIFICATE_DATA.crn} | MLR 2017 #928414`,
    regulatoryBody: 'UK Companies Act 2006 & Financial Conduct Authority Framework',
    phone: '+44 7900 413315',
    email: 'support@growvestx.com',
    latency: '11ms',
    colorBorder: 'border-emerald-500/40'
  },
  {
    id: 'europe',
    city: 'Europe (London Hub)',
    region: 'United Kingdom / EU',
    badge: 'EUROPEAN CUSTODY HUB',
    role: 'BaFin Digital Asset Custody & EU MiCA Standard',
    address: '200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom',
    registration: 'HRB 128940 | EU VAT: DE358190281',
    regulatoryBody: 'European Securities and Markets Authority (ESMA) / MiCA Compliant',
    phone: '+44 7900 413315',
    email: 'support@growvestx.com',
    latency: '14ms',
    colorBorder: 'border-blue-500/40'
  },
  {
    id: 'zurich',
    city: 'Zurich (London Hub)',
    region: 'United Kingdom / Switzerland',
    badge: 'ALPINE COLD STORAGE VAULT',
    role: 'FINMA / Swiss DLT Act Segregated Vault',
    address: '200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom',
    registration: 'CHE-419.820.103 | SRO VQF Member #100842',
    regulatoryBody: 'Swiss Financial Market Supervisory Authority (FINMA) Enclave',
    phone: '+44 7900 413315',
    email: 'support@growvestx.com',
    latency: '16ms',
    colorBorder: 'border-purple-500/40'
  },
  {
    id: 'newyork',
    city: 'New York (London Hub)',
    region: 'United Kingdom / US',
    badge: 'US INSTITUTIONAL DESK',
    role: 'FinCEN Money Services Business (MSB)',
    address: '200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom',
    registration: 'FinCEN MSB Reg #31000289141088',
    regulatoryBody: 'U.S. Department of the Treasury / Bank Secrecy Act Compliant',
    phone: '+44 7900 413315',
    email: 'support@growvestx.com',
    latency: '22ms',
    colorBorder: 'border-amber-500/40'
  }
];

export const RegulatedInfrastructureSection: React.FC = () => {
  const { setIsCertificateModalOpen, setPublicPage } = useApp();
  const [activeHub, setActiveHub] = useState<string>('london');

  return (
    <section
      id="regulated-infrastructure-section"
      className="py-16 sm:py-24 bg-slate-50 dark:bg-[#020e09] text-slate-900 dark:text-white border-b border-slate-200 dark:border-emerald-950/70 transition-colors"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Multi-Jurisdictional Framework</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Regulated Infrastructure Across London, Europe, Zurich & New York
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Operating under strict fiduciary, custody, and AML/CTF mandates across major financial hubs to ensure bankruptcy-remote asset safety.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#062017] hover:bg-slate-100 dark:hover:bg-[#092e21] border border-slate-300 dark:border-emerald-900/50 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Inspect Official Certificates</span>
            </button>
          </div>
        </div>

        {/* 4 Hubs Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REGULATED_HUBS.map((hub) => {
            const isSelected = activeHub === hub.id;
            return (
              <div
                key={hub.id}
                onClick={() => setActiveHub(hub.id)}
                className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white dark:bg-[#05251a] border-emerald-500 shadow-xl dark:shadow-emerald-950/50 scale-[1.02]'
                    : 'bg-white/70 dark:bg-[#041912] border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/40 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  {/* Status & Latency */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {hub.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      <Activity className="w-3 h-3 text-emerald-500" />
                      <span>{hub.latency}</span>
                    </span>
                  </div>

                  {/* Hub Name */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span>{hub.city}</span>
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {hub.region}
                    </div>
                  </div>

                  {/* Role / Jurisdiction Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {hub.role}
                  </p>

                  {/* Details Box */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#02130c] border border-slate-200/80 dark:border-emerald-950/80 space-y-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400">Reg: </span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{hub.registration}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Framework: </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{hub.regulatoryBody}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-sans pt-1">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{hub.address}</span>
                  </div>
                </div>

                {/* Direct Contact Footer */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-emerald-950/80 flex items-center justify-between text-xs font-mono">
                  <a
                    href={`tel:${hub.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{hub.phone}</span>
                  </a>

                  <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                    24/7 Desk
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Regulatory Footnote Banner */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#041a13] border border-slate-200 dark:border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                Fiduciary Segregation Guarantee
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                Client capital is segregated in bankruptcy-remote legal structures under UK and Swiss law. No rehypothecation.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setPublicPage('security')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View Security & Custody Whitepaper</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
