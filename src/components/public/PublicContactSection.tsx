import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Building,
  Send,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Clock,
  Lock,
  Award,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_CERTIFICATE_DATA } from '../../services/certificateGenerator';

export const PublicContactSection: React.FC = () => {
  const { t, setIsCertificateModalOpen } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Institutional Onboarding',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section
      id="public-contact-section"
      className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
            <Mail className="w-3.5 h-3.5" />
            <span>Institutional Relations & Compliance • FCA & FINRA Registered</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Contact Growvest Global Desks
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Our institutional desk, compliance officers, and 24/7 technical support representatives are ready to assist with account onboarding, institutional liquidity, API access, and operational queries.
          </p>
        </div>

        {/* Global Offices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* London Global HQ */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                UK REGISTERED HQ
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">London Headquarters</h3>
              <p className="text-xs text-slate-500 font-mono">FCA Regulatory Jurisdiction</p>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Level 32, 25 Canada Square, Canary Wharf, London, E14 5LQ, United Kingdom</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="tel:+442079460912" className="font-mono text-slate-900 dark:text-slate-200 hover:text-emerald-500 font-semibold">
                  +44 20 7946 0912
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="mailto:london.desk@growvest.com" className="font-mono text-slate-900 dark:text-slate-200 hover:text-emerald-500 font-semibold">
                  london.desk@growvest.com
                </a>
              </div>
            </div>
          </div>

          {/* New York Americas Hub */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                AMERICAS DESK
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">New York Institutional Hub</h3>
              <p className="text-xs text-slate-500 font-mono">FINRA Standards Compliance</p>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>One World Trade Center, Suite 8500, New York, NY 10007, United States</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+12125550198" className="font-mono text-slate-900 dark:text-slate-200 hover:text-amber-500 font-semibold">
                  +1 (212) 555-0198
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:ny.compliance@growvest.com" className="font-mono text-slate-900 dark:text-slate-200 hover:text-amber-500 font-semibold">
                  ny.compliance@growvest.com
                </a>
              </div>
            </div>
          </div>

          {/* Zurich Operations Hub */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                VAULT & ENCLAVE
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Zurich Cold Vaults</h3>
              <p className="text-xs text-slate-500 font-mono">Deep Custodial Infrastructure</p>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Bahnhofstrasse 45, 8001 Zurich, Switzerland</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-500 shrink-0" />
                <a href="tel:+41442110984" className="font-mono text-slate-900 dark:text-slate-200 hover:text-teal-500 font-semibold">
                  +41 44 211 0984
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                <a href="mailto:support@growvest.com" className="font-mono text-slate-900 dark:text-slate-200 hover:text-teal-500 font-semibold">
                  support@growvest.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Institutional Contacts & Certificate */}
          <div className="lg:col-span-5 space-y-6">
            {/* Regulatory Standing & Certificate Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-500 font-mono font-bold text-xs">
                  <Award className="w-4 h-4" />
                  <span>REGULATORY REGISTRATION</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  FCA & FINRA REGISTERED
                </span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                Growvest is registered under registration number <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">#{OFFICIAL_CERTIFICATE_DATA.registrationNumber}</span>.
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
                <div>CRN: {OFFICIAL_CERTIFICATE_DATA.crn} • LEI: {OFFICIAL_CERTIFICATE_DATA.leiCode}</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">FCA Ref: #948201 • FINRA CRD: #319402</div>
              </div>
              <button
                onClick={() => setIsCertificateModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-mono transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Official Certificate</span>
              </button>
            </div>

            {/* Direct Email Contacts Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Direct Contact Lines
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">24/7 Verified Communication</p>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
                <div>General & Support: <a href="mailto:support@growvest.com" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">support@growvest.com</a></div>
                <div>Compliance & Legal: <a href="mailto:compliance@growvest.com" className="text-slate-900 dark:text-slate-200 font-semibold hover:underline">compliance@growvest.com</a></div>
                <div>Institutional Onboarding: <a href="mailto:institutional@growvest.com" className="text-slate-900 dark:text-slate-200 font-semibold hover:underline">institutional@growvest.com</a></div>
                <div className="pt-1 text-[11px] text-slate-500">
                  UK: <a href="tel:+442079460912" className="text-slate-900 dark:text-slate-200 font-semibold hover:underline">+44 20 7946 0912</a> • US: <a href="tel:+12125550198" className="text-slate-900 dark:text-slate-200 font-semibold hover:underline">+1 (212) 555-0198</a>
                </div>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>All communications and documents are protected under 256-bit SSL encryption and strict privacy protocols.</span>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    {t('contact.sent', 'Thank you. Your inquiry has been routed to our compliance desk.')} An institutional officer will respond within 15 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'Institutional Onboarding', message: '' });
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        {t('contact.formName', 'Full Name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alexander Wright"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        {t('contact.formEmail', 'Business / Direct Email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="a.wright@capitalcorp.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {t('contact.formSubject', 'Department / Subject')} *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    >
                      <option value="Institutional Onboarding">Institutional Onboarding & Custody</option>
                      <option value="FCA & FINRA Inquiries">FCA & FINRA Regulatory Compliance</option>
                      <option value="Treasury Allocation">Corporate Treasury & Realistic Returns</option>
                      <option value="API & High-Volume Access">API & High-Frequency Liquidity Access</option>
                      <option value="General Information">General Support Inquiries</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {t('contact.formMessage', 'Message Details')} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your entity, inquiry, or operational question..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <span>Transmitting Encrypted Payload...</span>
                    ) : (
                      <>
                        <span>{t('contact.send', 'Transmit Message')}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

