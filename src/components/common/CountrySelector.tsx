import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import { ALL_COUNTRIES, CountryInfo, POPULAR_COUNTRY_CODES } from '../../services/countries';

interface CountrySelectorProps {
  value: string; // Dial code e.g. '+234' or country name
  onChange: (country: CountryInfo) => void;
  mode?: 'code' | 'country'; // Whether to display/select phone dial code or full country name
  disabled?: boolean;
  className?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  mode = 'code',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Find currently selected country
  const selectedCountry =
    mode === 'code'
      ? ALL_COUNTRIES.find((c) => c.code === value) || ALL_COUNTRIES[0]
      : ALL_COUNTRIES.find((c) => c.name.toLowerCase() === (value || '').toLowerCase()) ||
        ALL_COUNTRIES.find((c) => c.code === value) ||
        ALL_COUNTRIES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredCountries = ALL_COUNTRIES.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.iso.toLowerCase().includes(q)
    );
  });

  const popularCountries = ALL_COUNTRIES.filter((c) =>
    POPULAR_COUNTRY_CODES.includes(c.code)
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
          isOpen ? 'ring-2 ring-emerald-500/40 border-emerald-500' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          {mode === 'code' ? (
            <span className="font-mono font-bold">{selectedCountry.code}</span>
          ) : (
            <span className="truncate">{selectedCountry.name}</span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover / Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 mt-1.5 w-72 sm:w-80 max-w-[90vw] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Search Header */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code (+234, +1, UK...)"
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* List options */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {!searchQuery && (
              <div className="px-3 py-1.5 bg-slate-100/60 dark:bg-slate-950/40 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                Popular Jurisdictions
              </div>
            )}

            {!searchQuery &&
              popularCountries.map((c) => {
                const isSelected =
                  mode === 'code' ? selectedCountry.code === c.code : selectedCountry.name === c.name;
                return (
                  <button
                    key={`popular-${c.iso}-${c.code}`}
                    type="button"
                    onClick={() => {
                      onChange(c);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      isSelected ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                      {c.code}
                    </span>
                  </button>
                );
              })}

            <div className="px-3 py-1.5 bg-slate-100/60 dark:bg-slate-950/40 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              All Countries ({filteredCountries.length})
            </div>

            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                No matching country found.
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected =
                  mode === 'code' ? selectedCountry.code === c.code : selectedCountry.name === c.name;
                return (
                  <button
                    key={`${c.iso}-${c.code}`}
                    type="button"
                    onClick={() => {
                      onChange(c);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      isSelected ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                        {c.code}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
