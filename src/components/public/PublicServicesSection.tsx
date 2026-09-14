import React from 'react';
import { Layers, ShieldCheck, TrendingUp, Lock, ArrowRight, Zap, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicServicesSection: React.FC = () => {
  const { setAuthModalOpen, setAuthModalMode } = useApp();

  const services = [
    {
      title: 'Institutional Portfolio Allocation',
      desc: 'Diversified asset models categorized by risk parameters (Conservative, Balanced, Growth) engineered for steady compound yield.',
      icon: TrendingUp
    },
    {
      title: 'Secure Cold Custody Infrastructure',
      desc: 'Multi-party computation (MPC) and segregated hardware security modules ensuring absolute protection of digital assets.',
      icon: Lock
    },
    {
      title: 'Real-Time Spot Market Execution',
      desc: 'Deep institutional liquidity aggregation across spot pairs, cryptocurrencies, and commodities with zero hidden markups.',
      icon: Zap
    },
    {
      title: 'Global Treasury & Settlement',
      desc: 'Streamlined fiat and crypto settlement channels with 24/7 compliance auditing and transparent record keeping.',
      icon: Globe
    }
  ];

  return (
    <div className="py-16 bg-slate-50 dark:bg-[#02110c] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Institutional Wealth Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Our Core Services & Capabilities
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            GrowvestX provides institutional-grade wealth management, secure execution, and advanced portfolio technology designed for modern capital allocators.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={i} className="bg-white dark:bg-[#031911] rounded-2xl border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-emerald-950/40">
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>Deploy Capital in this Tier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
