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
  Star,
  ExternalLink
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
      className="bg-[#02120b] text-slate-300 border-t border-emerald-950/70 transition-colors"
    >
      {/* 1. 256-Bit SSL Encryption & Bank-Grade Security Header Banner */}
      <div className="border-b border-emerald-950/70 bg-gradient-to-r from-[#032014] via-[#052b1b] to-[#032014] py-4 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
                  INVESTMENT LEVEL CUSTODY
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Protected by FIPS 140-2 Level 3 hardware security modules, multi-party computation (MPC), and segregated cold storage in London and Zurich.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#041a12] border border-emerald-900/50 text-slate-200">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>FIPS 140-2 L3 HSM</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#041a12] border border-emerald-900/50 text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Zero-Trust Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Container: Max Width 1400px */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 space-y-14">
        
        {/* Top Brand & Regulatory Callout Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-emerald-950/70">
          <div className="space-y-3 max-w-xl text-left">
            <BrandLogo size="md" themeMode="dark" showTagline />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Growvest (growvestx.com) operates institutional digital asset custody and multi-asset capital allocation infrastructure across London, Frankfurt, Zurich, and New York.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Certificate Inspection Box */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#052217] border border-amber-500/30 text-xs flex items-center gap-3 shadow-md">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <div className="font-mono text-[11px] text-amber-300 font-bold">
                  UK REGISTRATION #{OFFICIAL_CERTIFICATE_DATA.registrationNumber}
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  CRN: {OFFICIAL_CERTIFICATE_DATA.crn} • FinCEN: #31000289141088
                </div>
              </div>
              <button
                onClick={() => setIsCertificateModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-mono font-bold transition-all cursor-pointer shrink-0"
              >
                Inspect
              </button>
            </div>

            {/* Language Selector */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#041a12] hover:bg-[#072d1f] border border-emerald-900/50 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Language: {currentLangObj.name}</span>
            </button>
          </div>
        </div>

        {/* EXACT 4-COLUMN FOOTER: Product, Company, Legal, Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left">
          
          {/* COLUMN 1: PRODUCT */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Product</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('markets')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Multi-Asset Market Feeds
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Algorithmic Yield Strategies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('security')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Segregated Cold Storage Custody
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('transparency')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Real-Time Proof of Reserves
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
                  href="#dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#dashboard';
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Live Investor Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: COMPANY */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Company</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About Growvest (growvestx.com)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Executive Leadership & Governance
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Global Infrastructure Hubs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('security')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  FIPS 140-2 Level 3 HSM Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reviews')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5 fill-[#00b67a] text-[#00b67a]" />
                  <span>Trustpilot Reviews (4.9★)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsScamAdviserModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ScamAdviser Audit (89/100)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: LEGAL */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Legal & Compliance</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>UK Companies House (CRN: 14892011)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  FinCEN MSB Registration (#31000289141088)
                </button>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#terms';
                  }}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Terms of Custody & Service
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#privacy';
                  }}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Privacy & Data Protection Policy
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleNav('transparency')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Anti-Money Laundering (AML/CFT)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('transparency')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Risk & Solvency Disclosures
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Contact & Desks</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#041a12] border border-emerald-900/50 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href="mailto:support@growvestx.com" className="hover:text-emerald-400 font-mono text-[11px]">
                    support@growvestx.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href="tel:+447900413315" className="hover:text-emerald-400 font-mono text-[11px]">
                    +44 7900 413315
                  </a>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1.5 pt-1 font-sans">
                <div className="flex items-start gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#041a12] border border-emerald-900/50 text-[11px] font-mono text-emerald-400 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Global Desks Operational</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Exact Company Registration Details */}
        <div className="pt-8 border-t border-emerald-950/70 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="space-y-1 text-center lg:text-left leading-relaxed">
            <div>
              <strong className="text-white font-bold">GrowvestX Ltd.</strong>{' '}
              Office Address: 200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom.{' '}
              Email: <a href="mailto:support@growvestx.com" className="text-emerald-400 hover:underline">support@growvestx.com</a>{' '}
              Phone: <a href="tel:+447900413315" className="text-emerald-400 hover:underline">+44 7900 413315</a>{' '}
              Company Reg NO: <span className="text-emerald-400 font-bold">14892018</span>{' '}
              We are Registered in England & Wales.
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <span>© 2026 GrowvestX Ltd.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#041a12] hover:bg-[#072d1f] text-slate-300 hover:text-white transition-colors ml-2 cursor-pointer"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
