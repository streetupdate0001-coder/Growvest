import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones } from 'lucide-react';

export const PublicCustomerSupportPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 dark:bg-[#02110c] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500/20">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Customer Support Center
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our dedicated institutional and private client support team is available around the clock to assist with inquiries, account verification, and technical guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#031911] rounded-2xl border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Email Support Desk</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Response time: &lt; 2 hours for verified clients.
            </p>
            <a href="mailto:support@growvestx.com" className="font-mono text-sm text-emerald-600 dark:text-emerald-400 hover:underline block">
              support@growvestx.com
            </a>
          </div>

          <div className="bg-white dark:bg-[#031911] rounded-2xl border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Direct Phone Line</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Available Monday to Friday, 08:00 - 18:00 GMT.
            </p>
            <a href="tel:+447900413315" className="font-mono text-sm text-slate-900 dark:text-white hover:underline block font-semibold">
              +44 7900 413315
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-[#031911] rounded-2xl border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-bold">Headquarters Office</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            GrowvestX Ltd. (Reg No: 14892018)<br />
            200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom
          </p>
        </div>

      </div>
    </div>
  );
};
