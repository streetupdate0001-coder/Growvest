import React from 'react';
import { Building2, ShieldCheck, MapPin, Mail, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicCompanyInfo: React.FC = () => {
  const { setPublicPage } = useApp();

  return (
    <div className="py-16 bg-slate-50 dark:bg-[#02110c] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Entity & Governance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Company & Business Information
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transparent legal entity details, operational structure, and registered office particulars for GrowvestX Ltd.
          </p>
        </div>

        {/* Core Entity Card */}
        <div className="bg-white dark:bg-[#031911] rounded-2xl border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-8 shadow-xs space-y-8">
          <div className="border-b border-slate-200 dark:border-emerald-950/60 pb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>Official Corporate Identity</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              GrowvestX is an advanced financial technology and wealth management platform providing secure multi-asset portfolio execution and treasury infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1 bg-slate-50 dark:bg-[#02110c] p-4 rounded-xl border border-slate-200/80 dark:border-emerald-950/50">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 block">Legal Entity Name</span>
              <span className="font-semibold text-slate-900 dark:text-white text-base">GrowvestX Ltd.</span>
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-[#02110c] p-4 rounded-xl border border-slate-200/80 dark:border-emerald-950/50">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 block">Registration Jurisdiction</span>
              <span className="font-semibold text-slate-900 dark:text-white text-base">England & Wales</span>
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-[#02110c] p-4 rounded-xl border border-slate-200/80 dark:border-emerald-950/50">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 block">Company Registration Number</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white text-base">14892018</span>
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-[#02110c] p-4 rounded-xl border border-slate-200/80 dark:border-emerald-950/50">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 block">Principal Operations</span>
              <span className="font-semibold text-slate-900 dark:text-white text-base">Financial Technology & Wealth Infrastructure</span>
            </div>
          </div>

          {/* Registered Office */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Registered Headquarters</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#02110c] border border-slate-200 dark:border-emerald-950/50 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              <p className="font-semibold">GrowvestX Ltd.</p>
              <p>200 Aldersgate St, Barbican</p>
              <p>London EC14 4HD, United Kingdom</p>
            </div>
          </div>

          {/* Contact Channels */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Official Communication Channels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#02110c] border border-slate-200 dark:border-emerald-950/50">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">Email Support</div>
                  <a href="mailto:support@growvestx.com" className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline">
                    support@growvestx.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#02110c] border border-slate-200 dark:border-emerald-950/50">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">Direct Telephone</div>
                  <a href="tel:+447900413315" className="font-mono text-slate-900 dark:text-white hover:underline">
                    +44 7900 413315
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Services & Markets */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-emerald-950/60">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Services & Target Markets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-300">
              <div className="space-y-2">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Core Services Provided</span>
                </div>
                <p>
                  Multi-asset digital portfolio allocation, real-time spot price execution, institutional cold custody solutions, and automated yield management protocols.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Serving Markets</span>
                </div>
                <p>
                  Professional allocators, private wealth holders, and institutional clients across the United Kingdom, Europe, and global regulated jurisdictions.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
