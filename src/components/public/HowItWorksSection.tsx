import React from 'react';
import { UserCheck, Shield, Wallet, PieChart, Activity, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HowItWorksSection: React.FC = () => {
  const { setAuthModalOpen, setAuthModalMode } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Create Account',
      desc: 'Sign up with your personal information, strong credentials, and configure your preferred locale and display currency.',
      icon: <UserCheck className="w-5 h-5 text-emerald-500" />
    },
    {
      step: '02',
      title: 'Verify Identity',
      desc: 'Complete standard KYC verification to unlock institutional limits and ensure AML regulatory compliance.',
      icon: <Shield className="w-5 h-5 text-emerald-500" />
    },
    {
      step: '03',
      title: 'Fund Account',
      desc: 'Deposit via SEPA Instant, bank wire, or supported digital asset networks with verified gateway settlement.',
      icon: <Wallet className="w-5 h-5 text-emerald-500" />
    },
    {
      step: '04',
      title: 'Select Portfolio Strategy',
      desc: 'Choose from transparent model portfolios based on your objective risk profile and asset preferences.',
      icon: <PieChart className="w-5 h-5 text-emerald-500" />
    },
    {
      step: '05',
      title: 'Monitor Performance',
      desc: 'Track live valuations, rebalancing triggers, and export detailed audit reports from your unified dashboard.',
      icon: <Activity className="w-5 h-5 text-emerald-500" />
    }
  ];

  return (
    <section id="growvest-how-it-works-section" className="py-16 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Onboarding Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            How GROWVEST Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            A streamlined 5-step institutional onboarding framework. We prioritize security and compliance at every step.
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative group shadow-xs dark:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-700 group-hover:text-emerald-500/40 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400/80 font-mono">
                <span>Verified Step</span>
              </div>
            </div>
          ))}
        </div>

        {/* No Guaranteed Returns Notice */}
        <div className="mt-10 p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto text-xs text-slate-600 dark:text-slate-400 shadow-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-300">Transparent Governance:</span> GROWVEST does not promise or guarantee fixed returns. All asset allocations involve real market volatility.
        </div>
      </div>
    </section>
  );
};
