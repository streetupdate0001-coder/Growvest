import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Download,
  FileCheck,
  ExternalLink,
  Copy,
  Check,
  Printer,
  Eye,
  Award,
  Sparkles,
  Lock,
  Building2
} from 'lucide-react';
import {
  OFFICIAL_CERTIFICATE_DATA,
  drawCertificateToCanvas,
  downloadCertificatePNG,
  printCertificate
} from '../../services/certificateGenerator';

interface CertificateCardProps {
  onOpenModal?: () => void;
  variant?: 'compact' | 'full' | 'banner';
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  onOpenModal,
  variant = 'full'
}) => {
  const [copiedReg, setCopiedReg] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (previewCanvasRef.current) {
      drawCertificateToCanvas(previewCanvasRef.current);
    }
  }, []);

  const handleCopyReg = () => {
    navigator.clipboard.writeText(OFFICIAL_CERTIFICATE_DATA.registrationNumber);
    setCopiedReg(true);
    setTimeout(() => setCopiedReg(false), 2000);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      downloadCertificatePNG('GROWVEST_Official_Registration_Certificate_GRZ849201.png');
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div
      id="growvest-official-certificate-card"
      className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/40 shadow-2xl p-6 sm:p-8 text-slate-100 transition-all duration-300 hover:border-amber-400/60"
    >
      {/* Decorative Gold Corner Borders */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400 m-2 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-400 m-2 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-400 m-2 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400 m-2 rounded-br-xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 ring-4 ring-amber-400/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                Official Entity Incorporation
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE & VERIFIED
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-100 tracking-tight">
              Certificate of Registration & Legal Incorporation
            </h3>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold font-mono shadow-md shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer disabled:opacity-75"
            title="Download high-resolution official certificate document"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Preparing...' : 'Download Certificate'}</span>
          </button>

          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold font-mono transition-colors cursor-pointer"
              title="Inspect Full Certificate Details"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Inspect</span>
            </button>
          )}

          <button
            onClick={() => printCertificate()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Certificate Canvas Preview + Legal Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
        {/* Visual Certificate Preview Frame */}
        <div className="lg:col-span-5 relative group cursor-pointer" onClick={onOpenModal}>
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/30 shadow-2xl bg-amber-50/5 p-1 transition-all duration-300 group-hover:border-amber-400/70 group-hover:shadow-amber-500/10">
            {/* Canvas Preview */}
            <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center relative">
              <canvas
                ref={previewCanvasRef}
                className="w-full h-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-102"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-amber-300 text-xs font-bold font-mono backdrop-blur-xs">
                <Eye className="w-6 h-6 text-amber-400" />
                <span>Click to Inspect High-Res Certificate</span>
              </div>
            </div>

            {/* Micro Ribbon Badge */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-amber-400/40 text-[10px] font-mono text-amber-300 flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Registry Stamp</span>
            </div>
          </div>
        </div>

        {/* Legal Entity & Registration Specifications */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Official Registered Entity
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                Incorporated March 14, 2021
              </span>
            </div>

            <div className="text-base sm:text-lg font-bold font-serif text-slate-100">
              {OFFICIAL_CERTIFICATE_DATA.companyName}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Certified by the Registrar of Companies for England and Wales pursuant to the Companies Act 2006. Authorized to operate multi-currency cryptographic asset custody, institutional settlement rails, and automated model strategies.
            </p>
          </div>

          {/* Key Registration Number Highlight Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Reg No Box */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 block">
                  Official Registration No.
                </span>
                <span className="text-sm sm:text-base font-mono font-extrabold text-amber-300">
                  {OFFICIAL_CERTIFICATE_DATA.registrationNumber}
                </span>
              </div>
              <button
                onClick={handleCopyReg}
                className="p-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 transition-colors cursor-pointer"
                title="Copy Registration Number"
              >
                {copiedReg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* CRN & LEI Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                CRN & LEI Identifier
              </span>
              <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                CRN: {OFFICIAL_CERTIFICATE_DATA.crn}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                LEI: {OFFICIAL_CERTIFICATE_DATA.leiCode}
              </div>
            </div>
          </div>

          {/* Corporate Address and Verification Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-emerald-400" />
                Registered Corporate Office
              </span>
              <p className="text-slate-300 text-[11px] leading-snug">
                {OFFICIAL_CERTIFICATE_DATA.registeredAddress}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                Cryptographic Validation Hash
              </span>
              <p className="text-slate-400 font-mono text-[10px] truncate">
                {OFFICIAL_CERTIFICATE_DATA.digitalVerificationHash}
              </p>
            </div>
          </div>

          {/* Bottom Download & Verification Callout */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Directly verifiable by public and institutional users worldwide.</span>
            </div>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Image (.PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
