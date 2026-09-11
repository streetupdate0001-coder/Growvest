import React from 'react';
import {
  Globe,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowUp,
  Award,
  Download,
  Eye,
  FileText,
  Building,
  Mail,
  Phone,
  Server,
  Key,
  Shield,
  Activity,
  Star
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useApp, PublicPage } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../services/i18n';
import { downloadCertificatePNG, OFFICIAL_CERTIFICATE_DATA } from '../../services/certificateGenerator';

export const PublicFooter: React.FC = () => {
  const {
    currentLanguage,
    setIsLangModalOpen,
    setPublicPage,
    setAuthModalOpen,
    setAuthModalMode,
    setIsCertificateModalOpen,
    setIsScamAdviserModalOpen,
    t
  } = useApp();

  const currentLangObj =
    SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleNav = (page: PublicPage) => {
    setPublicPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="growvest-public-footer"
      className="bg-[#081210] text-slate-300 border-t border-emerald-950/60 transition-colors"
    >
      {/* 1. Dedicated 256-Bit SSL Encryption & Investment-Level Security Banner with Lock Icon */}
      <div className="border-b border-emerald-950/60 bg-gradient-to-r from-[#06331d] via-[#0a1f18] to-[#06331d] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  256-Bit SSL & TLS 1.3 Bank-Grade Encryption
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  INVESTMENT LEVEL SECURITY
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                All client communications, transactions, and cryptographic ledger states are protected with military-grade AES-256 GCM encryption and cold enclave custody.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f211b] border border-emerald-900/40 text-slate-200">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>FIPS 140-2 Level 3 HSM</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f211b] border border-emerald-900/40 text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Zero-Trust Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Top Tier: Brand, Description, Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Brand Information & Official Regulatory Registration */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <BrandLogo size="md" themeMode="dark" showTagline />
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              Growvest (GROWVEST Global Technologies Inc.) is an international financial technology and multi-asset capital management platform registered with FCA and FINRA standards.
            </p>

            {/* Official Registration & Regulatory Compliance Callout Box */}
            <div className="p-4 rounded-2xl bg-[#0e1c18] border border-amber-500/30 text-xs space-y-3 max-w-sm shadow-md">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-[11px]">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>REGULATORY REGISTRATION</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  FCA & FINRA REGISTERED
                </span>
              </div>
              
              <div className="font-mono text-[11px] text-slate-200">
                Reg No: <span className="text-amber-300 font-bold">{OFFICIAL_CERTIFICATE_DATA.registrationNumber}</span>
              </div>
              
              <div className="text-[10px] text-slate-300 space-y-1 font-mono">
                <div>CRN: {OFFICIAL_CERTIFICATE_DATA.crn} • LEI: {OFFICIAL_CERTIFICATE_DATA.leiCode}</div>
                <div className="text-emerald-400 font-bold">FCA Ref: 948201 • FINRA CRD: #319402</div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142621] hover:bg-[#1a332c] text-slate-200 text-[11px] font-mono font-semibold transition-colors cursor-pointer border border-emerald-900/40"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect</span>
                </button>
                <button
                  onClick={() => downloadCertificatePNG()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-mono font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Operational Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0e1c18] border border-emerald-900/40 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-mono text-[11px]">
                {t('footer.allSystems', 'All Platform Systems Operational')}
              </span>
            </div>

            {/* Language Selector in Footer */}
            <div className="pt-1">
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0e1c18] hover:bg-[#152923] border border-emerald-900/40 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Language: {currentLangObj.name} ({currentLangObj.nativeName})</span>
              </button>
            </div>
          </div>

          {/* Col 3: Platform Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-slate-200">
              {t('footer.platform', 'Platform')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('markets')}
                  className="hover:text-white text-slate-300 transition-colors cursor-pointer"
                >
                  Live Markets & Feeds
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="hover:text-white text-slate-300 transition-colors cursor-pointer"
                >
                  Realistic Return Models
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('security')}
                  className="hover:text-white text-slate-300 transition-colors cursor-pointer"
                >
                  256-Bit SSL Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsScamAdviserModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ScamAdviser Audit: 89/100 (95% Safe)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reviews')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5 fill-[#00b67a] text-[#00b67a]" />
                  <span>Trustpilot 4.9★ (3,420+ Reviews)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('transparency')}
                  className="hover:text-white text-slate-300 transition-colors cursor-pointer"
                >
                  Transparency & Solvency
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>FCA / Registration Certificate</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
                >
                  Open Institutional Account
                </button>
              </li>
              <li>
                <a
                  href="#/login"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Direct Client Sign-In Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Verified Offices */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-slate-200">
              {t('footer.company', 'Company & Offices')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white text-slate-300 transition-colors cursor-pointer"
                >
                  About Us (Leadership & Compliance)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white text-slate-300 transition-colors cursor-pointer"
                >
                  Official Office Locations
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white text-slate-300 transition-colors cursor-pointer"
                >
                  Institutional Contact Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="hover:text-white text-slate-300 transition-colors cursor-pointer"
                >
                  FAQ & Clarifications
                </button>
              </li>
              <li>
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#privacy';
                  }}
                  className="hover:text-emerald-400 text-slate-300 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#terms';
                  }}
                  className="hover:text-emerald-400 text-slate-300 transition-colors cursor-pointer"
                >
                  Terms of Service & Custody
                </a>
              </li>
              <li>
                <div className="pt-2 text-[11px] text-slate-300 space-y-1.5 font-sans">
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>London: 25 Canada Square, Canary Wharf, London, E14 5LQ</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>New York: 1 World Trade Center, Suite 8500, New York, NY 10007</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Support Contact & Legal */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-slate-200">
              Direct Contact & Support
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#0e1c18] border border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href="mailto:support@growvest.com" className="hover:text-emerald-400 font-mono text-[11px]">
                    support@growvest.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href="tel:+442079460912" className="hover:text-emerald-400 font-mono text-[11px]">
                    +44 20 7946 0912 (UK)
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href="tel:+12125550198" className="hover:text-emerald-400 font-mono text-[11px]">
                    +1 (212) 555-0198 (US)
                  </a>
                </div>
              </div>

              <div className="pt-2 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FCA Registered & Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cold Vault Custody Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Risk Disclaimer & Corporate Registration Footer Footnote */}
        <div className="p-5 rounded-2xl bg-[#0e1c18] border border-emerald-900/40 text-[11px] text-slate-300 leading-relaxed space-y-2 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-bold text-slate-200 uppercase tracking-wider font-mono">
              Regulatory Registration & Legal Disclosure
            </div>
            <div className="font-mono text-[10px] text-amber-400">
              REG NO: #{OFFICIAL_CERTIFICATE_DATA.registrationNumber} • CRN: {OFFICIAL_CERTIFICATE_DATA.crn}
            </div>
          </div>
          <p>
            Growvest (GROWVEST Global Technologies Inc.) operates in accordance with standard regulatory disclosures. Digital assets, cryptocurrencies, and derivative financial instruments involve market risk. Historical performance benchmarks do not guarantee future returns.
          </p>
        </div>

        {/* Bottom Bar: Copyright, Language, & Back to Top */}
        <div className="pt-8 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-3 flex-wrap">
              <span>© 2026 Growvest / GROWVEST Global Technologies Inc. All rights reserved.</span>
              <button
                id="public-bottom-bar-lang-btn"
                onClick={() => setIsLangModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e1c18] hover:bg-[#152923] border border-emerald-900/50 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                title={`Translate site (Current: ${currentLangObj.name})`}
              >
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>{currentLangObj.flag}</span>
                <span className="font-mono uppercase font-bold text-white">{currentLanguage}</span>
                <span className="hidden sm:inline text-slate-400">({currentLangObj.name})</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2.5 flex-wrap">
              <span>{OFFICIAL_CERTIFICATE_DATA.companyName}</span>
              <span>•</span>
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#privacy';
                }}
                className="hover:text-emerald-400 underline underline-offset-2 transition-colors cursor-pointer text-slate-300"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#terms';
                }}
                className="hover:text-emerald-400 underline underline-offset-2 transition-colors cursor-pointer text-slate-300"
              >
                Terms of Service
              </a>
              <span>•</span>
              <span>256-Bit SSL Encryption</span>
              <span>•</span>
              <span>Segregated Cold Storage</span>
            </div>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

