import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const PublicRiskDisclosurePage: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 dark:bg-[#02110c] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Risk Warning</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Risk Disclosure Statement
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            GrowvestX Ltd. (Reg No: 14892018) • Investment Risk Notice
          </p>
        </div>

        <div className="bg-white dark:bg-[#031911] rounded-2xl border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. General Financial Risk</h2>
            <p>
              Trading and investing in digital assets, equities, foreign exchange, and alternative financial instruments involves substantial risk of loss and is not suitable for every investor. Asset values can fluctuate widely, and users may lose more than their initial capital deposit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. No Guaranteed Returns</h2>
            <p>
              Past performance of any portfolio model, trading strategy, or automated yield protocol is no guarantee of future results. Simulated or backtested metrics do not represent actual trading performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Autonomous Investor Responsibility</h2>
            <p>
              GrowvestX provides execution technology and portfolio management interfaces. All investment decisions are made solely by the user. Clients should carefully evaluate their financial standing and risk appetite before allocating capital.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
