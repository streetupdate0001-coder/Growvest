import React, { useState } from 'react';
import {
  Building2,
  Globe2,
  ShieldCheck,
  FileText,
  MapPin,
  ExternalLink,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GlobalOffice {
  id: string;
  city: string;
  country: string;
  badge: string;
  jurisdiction: string;
  address: string;
  registration: string;
  regulatoryBody: string;
  phone: string;
  email: string;
  color: string;
}

const GLOBAL_OFFICES: GlobalOffice[] = [
  {
    id: 'london',
    city: 'London City',
    country: 'United Kingdom',
    badge: 'GLOBAL HEADQUARTERS',
    jurisdiction: 'UK Companies House & FCA Compliance Enclave',
    address: '25 Old Broad Street, City of London, EC2N 1HN, United Kingdom',
    registration: 'CRN: 14892011 | MLR 2017 #928414',
    regulatoryBody: 'UK Companies Act 2006 & Financial Conduct Authority Framework',
    phone: '+44 20 7946 0912',
    email: 'london.desk@greeneza.com',
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
  },
  {
    id: 'frankfurt',
    city: 'Frankfurt am Main',
    country: 'Germany / EU Hub',
    badge: 'EUROPEAN CUSTODY HUB',
    jurisdiction: 'BaFin Digital Asset Custody & EU MiCA Standard',
    address: 'Taunusanlage 8, 60329 Frankfurt am Main, Hesse, Germany',
    registration: 'HRB 128940 | EU VAT: DE358190281',
    regulatoryBody: 'European Securities and Markets Authority (ESMA) / MiCA Compliant',
    phone: '+49 69 9500 8820',
    email: 'frankfurt.desk@greeneza.com',
    color: 'border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300'
  },
  {
    id: 'zurich',
    city: 'Zurich Financial District',
    country: 'Switzerland',
    badge: 'COLD STORAGE & WEALTH VAULT',
    jurisdiction: 'FINMA / Swiss DLT Act Segregated Vault',
    address: 'Gotthardstrasse 26, 8002 Zurich, Switzerland',
    registration: 'CHE-419.820.103 SRO VQF Member #100842',
    regulatoryBody: 'Swiss Financial Market Supervisory Authority (FINMA) Enclave',
    phone: '+41 44 211 8800',
    email: 'zurich.vault@greeneza.com',
    color: 'border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300'
  },
  {
    id: 'newyork',
    city: 'New York (One World Trade)',
    country: 'United States',
    badge: 'NORTH AMERICA INSTITUTIONAL',
    jurisdiction: 'FinCEN Money Services Business (MSB)',
    address: 'One World Trade Center, Suite 8500, New York, NY 10007, USA',
    registration: 'FinCEN MSB Reg #31000289141088',
    regulatoryBody: 'U.S. Department of the Treasury / BSA Compliant',
    phone: '+1 212 555 0198',
    email: 'americas@greeneza.com',
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300'
  },
  {
    id: 'singapore',
    city: 'Singapore (Ocean Financial)',
    country: 'Asia-Pacific Hub',
    badge: 'APAC OTC TRADING DESK',
    jurisdiction: 'Monetary Authority of Singapore (MAS) Framework',
    address: '10 Collyer Quay, #28-00 Ocean Financial Centre, Singapore 049315',
    registration: 'UEN: 202391084E',
    regulatoryBody: 'Payment Services Act (PSA) Standard Framework',
    phone: '+65 6712 8900',
    email: 'singapore@greeneza.com',
    color: 'border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300'
  }
];

export const GlobalPresenceHub: React.FC = () => {
  const { setIsCertificateModalOpen, setIsScamAdviserModalOpen } = useApp();
  const [selectedOffice, setSelectedOffice] = useState<string>('london');

  const currentOffice = GLOBAL_OFFICES.find(o => o.id === selectedOffice) || GLOBAL_OFFICES[0];

  return (
    <section
      id="global-presence-hub"
      className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-t border-b border-slate-200 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold uppercase">
            <Globe2 className="w-3.5 h-3.5" />
            Global Institutional Presence
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Regulated Infrastructure Across London, Europe, Zurich & New York
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Operating with strict multi-jurisdictional compliance, segregated cold storage vaults, and 24/7 institutional trading desks worldwide.
          </p>
        </div>

        {/* Global Cities Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {GLOBAL_OFFICES.map(office => {
            const isSelected = selectedOffice === office.id;
            return (
              <button
                key={office.id}
                onClick={() => setSelectedOffice(office.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-400'}`} />
                <span>{office.city}</span>
              </button>
            );
          })}
        </div>

        {/* Highlighted Office Detail Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6 transition-colors">
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${currentOffice.color}`}>
                {currentOffice.badge}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {currentOffice.country}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentOffice.city}
            </h3>
            <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {currentOffice.jurisdiction}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Physical Address</span>
              <div className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {currentOffice.address}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Official Registration</span>
              <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {currentOffice.registration}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentOffice.regulatoryBody}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-1 sm:col-span-2 lg:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Direct Institutional Line</span>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>{currentOffice.phone}</span>
              </div>
              <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                <span>{currentOffice.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
