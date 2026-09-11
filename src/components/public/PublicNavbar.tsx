import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, ArrowRight, ShieldCheck, ChevronDown, FileCheck, HelpCircle, Mail, Shield, Star, Scan } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useApp, PublicPage } from '../../context/AppContext';

export const PublicNavbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    setAuthModalOpen,
    setAuthModalMode,
    publicPage,
    setPublicPage,
    setIsScamAdviserModalOpen,
    t
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary visible header navigation links with live translation
  const primaryNavLinks: { id: PublicPage; label: string }[] = [
    { id: 'home', label: t('nav.home', 'Home') },
    { id: 'markets', label: t('nav.markets', 'Market') },
    { id: 'about', label: t('nav.about', 'About') },
    { id: 'how-it-works', label: t('nav.howItWorks', 'How It Works') }
  ];

  // Dropdown menu links with live translation
  const dropdownNavLinks: { id: PublicPage; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'reviews',
      label: t('nav.reviews', 'Trust & Reviews'),
      desc: 'Trustpilot 4.9★ & ScamAdviser 89/100 (95% Trusted)',
      icon: Star
    },
    {
      id: 'transparency',
      label: t('nav.transparency', 'Transparency'),
      desc: 'Proof of reserves & institutional disclosures',
      icon: FileCheck
    },
    {
      id: 'faq',
      label: t('nav.faq', 'FAQ'),
      desc: 'Common questions & account guides',
      icon: HelpCircle
    },
    {
      id: 'contact',
      label: t('nav.contact', 'Contact'),
      desc: '24/7 institutional support & global desks',
      icon: Mail
    },
    {
      id: 'security',
      label: t('nav.security', 'Security'),
      desc: 'Bank-grade cold custody & insurance',
      icon: Shield
    }
  ];

  const isDropdownActive = dropdownNavLinks.some(link => link.id === publicPage);

  const handleNavClick = (pageId: PublicPage) => {
    setPublicPage(pageId);
    setIsMobileNavOpen(false);
    setIsDropdownOpen(false);
    // Smooth scroll to top when changing page or view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
    setIsMobileNavOpen(false);
  };

  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
    setIsMobileNavOpen(false);
  };

  return (
    <header
      id="growvest-public-header"
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-900 shadow-xs'
          : 'bg-white/80 dark:bg-black/80 backdrop-blur-xs border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Brand Logo + Desktop Nav */}
        <div className="flex items-center gap-6 xl:gap-8">
          <BrandLogo
            size="md"
            onClick={() => handleNavClick('home')}
            className="transition-opacity hover:opacity-90 cursor-pointer"
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-2">
            {primaryNavLinks.map(link => {
              const isActive = publicPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-700 dark:text-neutral-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Dropdown Tab for Transparency, FAQ, Contact */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-dropdown-toggle"
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                  isDropdownActive || isDropdownOpen
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-700 dark:text-neutral-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
                }`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span>MORE</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
              </button>

              {/* Desktop Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  id="nav-dropdown-menu"
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 mb-1 border-b border-slate-100 dark:border-neutral-800">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                      Platform Resources
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dropdownNavLinks.map(item => {
                      const Icon = item.icon;
                      const isActive = publicPage === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`dropdown-link-${item.id}`}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer group ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'hover:bg-slate-50 dark:hover:bg-neutral-900 text-slate-800 dark:text-neutral-200'
                          }`}
                        >
                          <div className={`p-2 rounded-lg mt-0.5 ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold tracking-wide">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-neutral-400 leading-tight mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Controls: Theme, Login, Register */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            id="public-btn-theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 border border-slate-200 dark:border-neutral-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Log In Button */}
          <button
            id="public-btn-login"
            onClick={handleOpenLogin}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-neutral-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900 border border-slate-200 dark:border-neutral-800 transition-all cursor-pointer"
          >
            {t('nav.login', 'Log In')}
          </button>

          {/* Create Account Primary Action */}
          <button
            id="public-btn-register"
            onClick={handleOpenRegister}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98"
          >
            <span>{t('nav.register', 'Create Account')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Header Controls: Theme + Hamburger */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />}
          </button>

          <button
            id="public-mobile-menu-btn"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 border border-slate-200 dark:border-neutral-800"
            aria-label="Open Navigation Menu"
          >
            {isMobileNavOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Classic Mobile Dropdown Navigation Menu */}
      {isMobileNavOpen && (
        <div
          id="public-mobile-nav-panel"
          className="md:hidden border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-black px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fade-in"
        >
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Main Menu
            </div>
            {primaryNavLinks.map(link => {
              const isActive = publicPage === link.id;
              return (
                <button
                  key={`mobile-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-colors text-left ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}

            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1 border-t border-slate-100 dark:border-neutral-800">
              More & Support
            </div>
            {dropdownNavLinks.map(link => {
              const Icon = link.icon;
              const isActive = publicPage === link.id;
              return (
                <button
                  key={`mobile-dropdown-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold transition-colors text-left ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-neutral-800/80 space-y-2">
            <button
              onClick={handleOpenLogin}
              className="w-full py-3 rounded-xl text-center text-sm font-bold text-slate-800 dark:text-neutral-200 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 cursor-pointer"
            >
              {t('nav.login', 'Log In')}
            </button>
            <button
              onClick={handleOpenRegister}
              className="w-full py-3 rounded-xl text-center text-sm font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs cursor-pointer"
            >
              {t('nav.register', 'Create Account')}
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Regulated Institutional Financial Standards
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

