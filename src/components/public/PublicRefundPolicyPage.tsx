import React from 'react';
import { RefreshCw } from 'lucide-react';

export const PublicRefundPolicyPage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 dark:bg-[#02110c] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500/20">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Policy Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            GrowvestX Ltd. (Reg No: 14892018)
          </p>
        </div>

        <div className="bg-white dark:bg-[#031911] rounded-2xl border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Deposit and Withdrawal Terms</h2>
            <p>
              Funds deposited into a GrowvestX account remain the property of the client and can be withdrawn in accordance with standard withdrawal protocols, subject to AML/KYC security clearance and active investment lockup periods (if any).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Investment Plan Cancellations</h2>
            <p>
              Active portfolio investment allocations operate under agreed terms. Early termination of certain institutional yield strategies may incur administrative or network gas fee deductions as explicitly disclosed upon allocation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Support Assistance</h2>
            <p>
              For questions regarding transaction status or withdrawal processing, contact our support desk at <a href="mailto:support@growvestx.com" className="text-emerald-600 dark:text-emerald-400 font-mono hover:underline">support@growvestx.com</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
