import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  DollarSign
} from 'lucide-react';
import { InteractiveYieldCalculator } from './InteractiveYieldCalculator';
import { BankLevelSecuritySection } from './BankLevelSecuritySection';
import { PublicMarketOverview } from './PublicMarketOverview';
import { CertificateCard } from './CertificateCard';
import { CertificateModal } from './CertificateModal';
import { useApp } from '../../context/AppContext';

export type PublicTabKey = 'calculator' | 'markets' | 'security' | 'certificate';

export const PublicInteractiveTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PublicTabKey>('calculator');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setAuthModalOpen, setAuthModalMode, t } = useApp();

  const tabs = [
    {
      id: 'calculator' as PublicTabKey,
      label: 'Yield Calculator',
      icon: <Sliders className="w-4 h-4" />,
      badge: 'Interactive'
    },
    {
      id: 'markets' as PublicTabKey,
      label: 'Live Markets',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      badge: 'Real-Time'
    },
    {
      id: 'security' as PublicTabKey,
      label: 'Bank Security',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      badge: '256-Bit Cold Vault'
    },
    {
      id: 'certificate' as PublicTabKey,
      label: 'Official Registration',
      icon: <Award className="w-4 h-4 text-amber-500" />,
      badge: 'CRN #14892011'
    }
  ];

  return (
    <section id="interactive-features-hub" className="py-12 sm:py-16 bg-[#f4faf7] dark:bg-[#0a1512] border-b border-slate-200/80 dark:border-emerald-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
            <span>PLATFORM EXPLORER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Platform Features & Solvency
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Select a tab below to simulate yield, verify 5-star Trustpilot reviews, or inspect cold storage security.
          </p>
        </div>

        {/* Sleek Interactive Tabs Navigation Bar */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-white dark:bg-[#11201b] border border-slate-200 dark:border-emerald-900/40 shadow-sm max-w-full overflow-x-auto">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162a24]'
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`hidden md:inline text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-[#0a1613] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display Area */}
        <div className="transition-all duration-300">
          {activeTab === 'calculator' && (
            <div className="animate-fade-in">
              <InteractiveYieldCalculator />
            </div>
          )}

          {activeTab === 'markets' && (
            <div className="animate-fade-in">
              <PublicMarketOverview />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <BankLevelSecuritySection />
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="animate-fade-in space-y-6 max-w-4xl mx-auto pt-4">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                  OFFICIAL REGISTRATION #14892011
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Certificate of Incorporation
                </h3>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  Click to inspect the verified Registrar of Companies document for England & Wales.
                </p>
              </div>
              <CertificateCard onOpenModal={() => setIsModalOpen(true)} />
            </div>
          )}
        </div>
      </div>

      {/* Global Certificate Modal */}
      <CertificateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
