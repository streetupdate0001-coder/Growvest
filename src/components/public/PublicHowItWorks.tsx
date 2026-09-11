import React from 'react';
import { UserCheck, Wallet, LineChart, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicHowItWorks: React.FC = () => {
  const { setAuthModalOpen, setAuthModalMode, t } = useApp();

  const steps = [
    {
      num: '01',
      icon: UserCheck,
      title: t('howItWorks.step1.title', '1. Verified Registration'),
      desc: t(
        'howItWorks.step1.desc',
        'Create your secure account in minutes with multi-factor authentication and tiered identity verification.'
      ),
      tag: 'FIDO2 / 2FA'
    },
    {
      num: '02',
      icon: Wallet,
      title: t('howItWorks.step2.title', '2. Direct Capital Funding'),
      desc: t(
        'howItWorks.step2.desc',
        'Fund your account securely via international SEPA/SWIFT bank wire or major blockchain digital assets with 0% platform deposit fees.'
      ),
      tag: '0.00% Deposit Fee'
    },
    {
      num: '03',
      icon: LineChart,
      title: t('howItWorks.step3.title', '3. Execute & Monitor'),
      desc: t(
        'howItWorks.step3.desc',
        'Allocate capital into disciplined investment strategies, monitor live balances, and initiate verifiable withdrawals anytime.'
      ),
      tag: 'Instant Settlement'
    }
  ];

  return (
    <section
      id="public-how-it-works-section"
      className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono uppercase font-bold tracking-wider">
            Process & Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {t('howItWorks.title', 'How GROWVEST Works')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t(
              'howItWorks.subtitle',
              'Three straightforward steps to establish your institutional digital asset account.'
            )}
          </p>
        </div>

        {/* 3 Clear Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-colors group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-700 group-hover:text-emerald-500 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {step.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Step {i + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              setAuthModalMode('register');
              setAuthModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <span>Get Started in Under 3 Minutes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
