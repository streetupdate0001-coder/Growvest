import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicFaqSection: React.FC = () => {
  const { t } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: t('faq.q1', 'What is GROWVEST and who is it designed for?'),
      a: t(
        'faq.a1',
        'GROWVEST is an international digital asset and capital platform engineered for private individuals, family offices, and institutional investors seeking secure, transparent portfolio execution without black-box intermediaries.'
      )
    },
    {
      q: t('faq.q2', 'How are client funds safeguarded?'),
      a: t(
        'faq.a2',
        'Client capital is held in segregated accounts. Digital assets are secured in offline multi-signature cold storage vaults backed by hardware security modules (HSMs). We enforce strict 1:1 reserve backing without rehypothecation.'
      )
    },
    {
      q: t('faq.q3', 'What fees does GROWVEST charge?'),
      a: t(
        'faq.a3',
        'We charge 0.00% on inbound bank wire and digital asset deposits. Outbound withdrawals incur only exact on-chain network costs or nominal bank clearing fees. Portfolio strategies feature transparent annual management fees detailed in our fee schedule.'
      )
    },
    {
      q: t('faq.q4', 'How long do deposits and withdrawals take to clear?'),
      a: t(
        'faq.a4',
        'Digital asset transactions clear within required blockchain network confirmations (typically 5–20 minutes). Bank wire deposits via SEPA or SWIFT are processed within 1 to 2 business days.'
      )
    },
    {
      q: t('faq.q5', 'Is account verification mandatory?'),
      a: t(
        'faq.a5',
        'Yes. In compliance with international AML (Anti-Money Laundering) and KYC (Know Your Customer) regulations, all accounts undergo identity verification to ensure platform security and regulatory compliance.'
      )
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="public-faq-section"
      className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono uppercase font-bold tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Answers & Clarifications</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('faq.subtitle', 'Clear, verified answers to common questions about GROWVEST services.')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-slate-50/80 dark:bg-slate-900/80 border-emerald-500/40 shadow-xs'
                    : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
