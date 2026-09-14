import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

export const PublicTermsPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 dark:bg-[#02110c] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: September 14, 2026 • GrowvestX Ltd. (Reg No: 14892018)
          </p>
        </div>

        <div className="bg-white dark:bg-[#031911] rounded-2xl border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the GrowvestX platform, operated by GrowvestX Ltd. (Registered in England & Wales, Company Reg No: 14892018), with registered office at 200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom, you agree to be bound by these Terms & Conditions. If you do not agree, you must immediately discontinue use of the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Eligibility & Account Registration</h2>
            <p>
              Users must be at least 18 years of age and possess full legal capacity to enter into binding financial agreements. You agree to provide accurate identification and complete mandatory KYC/AML compliance verification procedures prior to accessing active trading and custody services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Services & Risk Acknowledgment</h2>
            <p>
              GrowvestX provides institutional wealth management technology, portfolio allocation tools, and digital asset custody solutions. Digital asset and financial markets carry inherent volatility and risk of capital loss. You acknowledge sole responsibility for all investment decisions executed through your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law principles. Any legal disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Information</h2>
            <p>
              For legal inquiries or notices, please contact us at <a href="mailto:support@growvestx.com" className="text-emerald-600 dark:text-emerald-400 font-mono hover:underline">support@growvestx.com</a> or via mail at our London headquarters.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
