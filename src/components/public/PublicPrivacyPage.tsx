import React from 'react';
import { Shield, Lock } from 'lucide-react';

export const PublicPrivacyPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 dark:bg-[#02110c] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: September 14, 2026 • GrowvestX Ltd. (Reg No: 14892018)
          </p>
        </div>

        <div className="bg-white dark:bg-[#031911] rounded-2xl border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Introduction</h2>
            <p>
              GrowvestX Ltd. (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to protecting your personal data in compliance with UK GDPR and applicable data protection standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Information We Collect</h2>
            <p>
              We collect information necessary to provide secure financial services, including identity verification documents (KYC), contact details (email, phone, address), and transaction metadata necessary for regulatory compliance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Security of Data</h2>
            <p>
              All personal data and institutional credentials are encrypted using AES-256 protocols and stored within secure secure enclaves. We never sell or share user data with third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Contact Privacy Officer</h2>
            <p>
              For any privacy-related requests or inquiries, contact our compliance team at <a href="mailto:support@growvestx.com" className="text-emerald-600 dark:text-emerald-400 font-mono hover:underline">support@growvestx.com</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
