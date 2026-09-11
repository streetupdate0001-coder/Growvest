import React from 'react';
import { OFFICIAL_CERTIFICATE_DATA } from '../../services/certificateGenerator';
import { ShieldCheck, Award, Lock } from 'lucide-react';

interface OfficialCertificateDocumentProps {
  className?: string;
}

export const OfficialCertificateDocument: React.FC<OfficialCertificateDocumentProps> = ({
  className = ''
}) => {
  return (
    <div
      id="vector-official-certificate-document"
      className={`relative w-full max-w-4xl mx-auto aspect-[1.414/1] bg-[#fbfaf6] text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 md:p-12 border-8 border-[#c5a059] flex flex-col justify-between overflow-hidden font-serif select-none ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(197, 160, 89, 0.15)'
      }}
    >
      {/* Inner Green Security Border */}
      <div className="absolute inset-2 sm:inset-3 border-2 border-[#0f3d2e] rounded-xl pointer-events-none" />

      {/* Ornate Corner Elements */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#c5a059] pointer-events-none" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#c5a059] pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#c5a059] pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#c5a059] pointer-events-none" />

      {/* Watermark Crest */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
        <div className="w-96 h-96 rounded-full border-8 border-[#0f3d2e] flex items-center justify-center text-9xl font-bold">
          G
        </div>
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 text-center space-y-1.5 pt-1 sm:pt-2">
        {/* Crest */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-[#0a2e22] border-2 sm:border-4 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold text-xl sm:text-2xl shadow-md">
          <span>G</span>
        </div>

        <div className="tracking-[0.2em] uppercase text-xs sm:text-sm md:text-base font-bold text-[#0a2e22]">
          GROWVEST GLOBAL TECHNOLOGIES
        </div>

        <div className="text-[9px] sm:text-[11px] md:text-xs text-[#7a6a4f] tracking-wider uppercase font-semibold">
          REGISTRAR OF COMPANIES & FINANCIAL JURISDICTION
        </div>

        {/* Divider with diamond */}
        <div className="flex items-center justify-center gap-2 py-1">
          <div className="h-px w-24 sm:w-36 bg-[#c5a059]" />
          <div className="w-2 h-2 rotate-45 bg-[#c5a059]" />
          <div className="h-px w-24 sm:w-36 bg-[#c5a059]" />
        </div>

        {/* Certificate Title */}
        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0a2e22] tracking-tight">
          CERTIFICATE OF INCORPORATION
        </h1>
        <p className="text-[10px] sm:text-xs text-[#8c6b2d] font-bold tracking-wider uppercase">
          AND OFFICIAL REGISTRATION OF ENTITY
        </p>
      </div>

      {/* Center Body & Company Name Frame */}
      <div className="relative z-10 space-y-2 sm:space-y-3 text-center my-auto py-2">
        <p className="text-[10px] sm:text-xs md:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
          This is to certify that under the Companies Act & Financial Services Regulatory Register, the institution named herein is duly incorporated, legally certified, and recognized in continuous good standing:
        </p>

        {/* Company Registration Plaque */}
        <div className="bg-[#f8f5eb] border border-[#d4af37] rounded-xl p-2.5 sm:p-4 max-w-2xl mx-auto shadow-inner space-y-1">
          <div className="text-xs sm:text-base md:text-lg font-bold text-[#064e3b] tracking-normal">
            {OFFICIAL_CERTIFICATE_DATA.companyName}
          </div>
          <div className="text-[11px] sm:text-sm md:text-base font-mono font-extrabold text-[#b45309]">
            OFFICIAL REGISTRATION NUMBER: {OFFICIAL_CERTIFICATE_DATA.registrationNumber}
          </div>
          <div className="text-[9px] sm:text-[11px] font-sans font-semibold text-slate-600">
            CRN: {OFFICIAL_CERTIFICATE_DATA.crn} &nbsp;•&nbsp; LEI: {OFFICIAL_CERTIFICATE_DATA.leiCode}
          </div>
        </div>

        {/* Key Corporate Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-left max-w-2xl mx-auto text-[9px] sm:text-xs pt-1 sm:pt-2">
          <div className="space-y-0.5">
            <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Incorporation Date
            </span>
            <p className="font-semibold text-slate-900">{OFFICIAL_CERTIFICATE_DATA.incorporationDate}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Standing Status
            </span>
            <p className="font-bold text-emerald-700">{OFFICIAL_CERTIFICATE_DATA.status}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Jurisdiction & Law
            </span>
            <p className="text-slate-800 leading-snug">England & Wales & Swiss FINMA Architecture</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Registered Office
            </span>
            <p className="text-slate-800 leading-snug truncate">{OFFICIAL_CERTIFICATE_DATA.registeredAddress}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Seal + Real Signatures */}
      <div className="relative z-10 grid grid-cols-12 items-end pt-2 sm:pt-4 border-t border-[#d4af37]/40">
        {/* Left: Wax Seal */}
        <div className="col-span-4 flex items-center gap-2 sm:gap-3">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0">
            {/* Ribbon Tails */}
            <div className="absolute -bottom-2 sm:-bottom-3 left-2 w-3 sm:w-4 h-6 sm:h-8 bg-[#991b1b] transform -rotate-12" />
            <div className="absolute -bottom-2 sm:-bottom-3 right-2 w-3 sm:w-4 h-6 sm:h-8 bg-[#991b1b] transform rotate-12" />

            {/* Embossed Gold Seal Disc */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#fef08a] via-[#d4af37] to-[#854d0e] border-2 border-[#713f12] flex flex-col items-center justify-center text-center shadow-lg p-1 text-[#451a03]">
              <span className="text-[5px] sm:text-[7px] font-bold tracking-tighter uppercase leading-none">REGISTRATION</span>
              <span className="text-[7px] sm:text-[10px] font-extrabold tracking-tight">GROWVEST</span>
              <span className="text-[5px] sm:text-[6px] font-mono leading-none">SEAL 2021</span>
            </div>
          </div>

          <div className="hidden sm:block text-[8px] sm:text-[9px] text-slate-600 font-mono leading-tight">
            <div>OFFICIALLY ARCHIVED</div>
            <div className="text-emerald-700 font-bold">VERIFIED SEAL</div>
          </div>
        </div>

        {/* Center & Right: Real Executive Signatures */}
        <div className="col-span-8 grid grid-cols-2 gap-2 sm:gap-5 text-center">
          {/* Signature 1: Registrar General */}
          <div className="space-y-1">
            <div className="h-10 sm:h-14 flex items-center justify-center px-1">
              <svg viewBox="0 0 220 64" className="w-full h-full max-h-14 overflow-visible" style={{ filter: 'drop-shadow(0 1px 1px rgba(8,28,59,0.18))' }}>
                <defs>
                  <linearGradient id="inkGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#081c3b" />
                    <stop offset="50%" stopColor="#0c254e" />
                    <stop offset="100%" stopColor="#06162d" />
                  </linearGradient>
                </defs>
                {/* Capital 'A' with expansive entry loop and authentic downstroke pressure */}
                <path
                  d="M 18 42 C 22 46 26 40 28 32 C 30 22 33 12 37 8 C 39 6 42 7 43 11 C 45 20 48 33 50 44 C 51 47 48 48 45 47 C 38 45 32 46 29 44 C 27 42 32 38 41 36 C 50 34 54 35 58 37"
                  fill="none"
                  stroke="url(#inkGrad1)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* 'listair' connected cursive calligraphy */}
                <path
                  d="M 58 37 C 62 26 65 14 67 9 C 68 7 70 8 70 12 C 70 22 71 34 73 41 C 74 44 77 36 79 32 C 81 28 84 27 86 31 C 88 35 88 41 90 41 C 92 41 94 34 97 30 C 99 27 101 28 102 32 C 104 38 104 42 107 41 C 109 40 110 32 113 29 C 115 27 117 29 117 33 C 117 38 118 41 121 40"
                  fill="none"
                  stroke="url(#inkGrad1)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* 'Montgomery' sweeping double-arch M and cursive tail */}
                <path
                  d="M 124 41 C 127 34 130 18 132 11 C 133 8 136 8 137 13 C 140 24 142 36 144 41 C 145 43 147 40 150 25 C 153 14 156 10 158 13 C 160 18 162 31 164 39 C 165 42 168 36 171 31 C 174 27 177 28 178 33 C 180 39 181 40 184 37 C 187 31 190 28 193 32 C 196 38 196 41 200 39 C 204 35 207 31 210 35 C 212 38 210 44 205 47 C 198 50 188 51 180 49"
                  fill="none"
                  stroke="url(#inkGrad1)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Master Calligraphic Underline Paraph with end loop & ink-lift flick */}
                <path
                  d="M 15 52 C 55 56 110 55 165 50 C 185 48 205 45 214 41 C 218 39 216 34 210 34 C 202 34 194 38 178 44"
                  fill="none"
                  stroke="url(#inkGrad1)"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Authentic Pen Lift Dots & T-bar */}
                <circle cx="86" cy="22" r="1.4" fill="#081c3b" />
                <circle cx="102" cy="21" r="1.4" fill="#081c3b" />
                <path d="M 92 27 L 103 26" stroke="#081c3b" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="border-t-2 border-slate-700/70 pt-0.5 sm:pt-1">
              <p className="text-[9px] sm:text-xs font-bold text-slate-900 font-serif">Sir Alistair Montgomery, CBE</p>
              <p className="text-[7px] sm:text-[9px] text-slate-600 font-sans font-medium">Registrar General of Companies</p>
            </div>
          </div>

          {/* Signature 2: Chief Compliance Officer */}
          <div className="space-y-1">
            <div className="h-10 sm:h-14 flex items-center justify-center px-1">
              <svg viewBox="0 0 220 64" className="w-full h-full max-h-14 overflow-visible" style={{ filter: 'drop-shadow(0 1px 1px rgba(9,31,66,0.18))' }}>
                <defs>
                  <linearGradient id="inkGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#091f42" />
                    <stop offset="50%" stopColor="#0f2b5a" />
                    <stop offset="100%" stopColor="#081833" />
                  </linearGradient>
                </defs>
                {/* Aristocratic cursive Capital 'E' with upper and lower loops */}
                <path
                  d="M 24 24 C 22 18 26 10 34 8 C 42 6 48 10 46 16 C 44 21 38 24 33 25 C 40 25 48 27 49 33 C 51 40 43 47 34 47 C 26 47 21 42 22 36 C 23 30 29 27 36 26"
                  fill="none"
                  stroke="url(#inkGrad2)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* 'lena' smooth cursive connective sequence */}
                <path
                  d="M 44 38 C 50 28 55 14 58 9 C 60 7 62 8 61 13 C 60 22 59 34 62 42 C 64 45 68 37 72 32 C 75 28 78 30 77 35 C 76 40 76 43 79 43 C 82 43 85 35 88 30 C 91 26 94 28 94 33 C 94 39 96 42 99 41 C 103 39 106 33 109 30 C 112 28 114 31 113 36 C 112 41 114 43 118 41"
                  fill="none"
                  stroke="url(#inkGrad2)"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Bold soaring Capital 'V' and 'ance' flourish */}
                <path
                  d="M 124 24 C 127 20 131 19 133 23 C 136 31 139 42 142 47 C 144 50 146 47 150 33 C 154 18 159 9 162 7 C 164 6 165 9 164 15 C 162 26 161 38 164 43 C 166 45 170 38 174 32 C 177 28 180 29 180 34 C 180 40 182 43 186 42 C 190 40 193 33 196 30 C 199 27 202 29 201 34 C 200 40 203 44 208 41 C 213 37 217 31 220 27"
                  fill="none"
                  stroke="url(#inkGrad2)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Confident Registrar Underline Paraph */}
                <path
                  d="M 22 53 C 70 56 130 55 185 49 C 200 47 212 44 218 40"
                  fill="none"
                  stroke="url(#inkGrad2)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="border-t-2 border-slate-700/70 pt-0.5 sm:pt-1">
              <p className="text-[9px] sm:text-xs font-bold text-slate-900 font-serif">Dr. Elena Vance, LL.M.</p>
              <p className="text-[7px] sm:text-[9px] text-slate-600 font-sans font-medium">Chief Regulatory & Compliance Officer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Footnote */}
      <div className="relative z-10 text-[7px] sm:text-[8px] font-mono text-slate-500 text-center pt-1 truncate">
        IMMUTABLE PROOF: {OFFICIAL_CERTIFICATE_DATA.digitalVerificationHash}
      </div>
    </div>
  );
};
