import React from 'react';
import {
  TrendingUp,
  Briefcase,
  ShieldCheck,
  History,
  Compass,
  Bell,
  Lock,
  Headphones,
  Zap,
  Globe2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeaturesSection: React.FC = () => {
  const { setActiveTab } = useApp();

  const features = [
    {
      icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
      title: 'Institutional Portfolio Tracking',
      desc: 'Real-time multi-asset valuation, asset allocation ratios, and automated performance charts across fiat & crypto holdings.',
      tab: 'portfolio'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      title: 'Live Market Intelligence',
      desc: 'Accurate price discovery feeds, 24-hour volume analysis, 7-day sparklines, and custom asset watchlists.',
      tab: 'markets'
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      title: 'Zero-Trust Account Security',
      desc: 'Hardware token & TOTP 2FA, active session monitoring, device fingerprinting, and granular audit log history.',
      tab: 'security'
    },
    {
      icon: <History className="w-5 h-5 text-emerald-500" />,
      title: 'Verifiable Activity Ledger',
      desc: 'Complete transaction history with unique immutable reference IDs, detailed settlement status, and exportable statements.',
      tab: 'activity'
    },
    {
      icon: <Compass className="w-5 h-5 text-emerald-500" />,
      title: 'Model Portfolio Strategies',
      desc: 'Diversified institutional asset models categorized by risk parameters (Conservative, Balanced, Growth) labeled as DEMO PLAN.',
      tab: 'invest'
    },
    {
      icon: <Bell className="w-5 h-5 text-emerald-500" />,
      title: 'Real-Time Notification Hub',
      desc: 'Instant notifications for security events, login detections, transaction confirmations, and platform updates.',
      tab: 'notifications'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: 'Security Center & Scoring',
      desc: 'Actionable security score posture, recovery code generation, session revocation, and password strength policies.',
      tab: 'security'
    },
    {
      icon: <Headphones className="w-5 h-5 text-emerald-500" />,
      title: '24/7 AI Guide & Support Desk',
      desc: 'Instant platform guidance via the Growvest AI Assistant and secure human support ticket ticketing.',
      tab: 'support'
    }
  ];

  return (
    <section id="growvest-features-section" className="py-16 bg-white dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Institutional Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Engineered for Precision, Security, & Scale
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every layer of the Growvest platform adheres to international banking standards and digital asset governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab(item.tab as any)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all cursor-pointer group hover:-translate-y-1 shadow-xs dark:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center mb-4 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                {item.icon}
              </div>

              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
