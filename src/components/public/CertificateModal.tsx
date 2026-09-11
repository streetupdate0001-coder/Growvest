import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Award,
  Building2,
  ExternalLink,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import {
  OFFICIAL_CERTIFICATE_DATA,
  drawCertificateToCanvas,
  downloadCertificatePNG,
  printCertificate
} from '../../services/certificateGenerator';
import { OfficialCertificateDocument } from './OfficialCertificateDocument';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedReg, setCopiedReg] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<'vector' | 'canvas'>('vector');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Render certificate on canvas after modal is mounted
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          drawCertificateToCanvas(canvasRef.current);
        }
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      id="growvest-certificate-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold font-serif text-slate-100">
                  Growvest Official Certificate of Incorporation
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  REG # {OFFICIAL_CERTIFICATE_DATA.registrationNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Registrar of Companies for England and Wales • CRN: {OFFICIAL_CERTIFICATE_DATA.crn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold font-mono shadow-md transition-all cursor-pointer disabled:opacity-75"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download (.PNG)'}</span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={() => printCertificate()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Close Certificate Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 bg-slate-950/40">
          {/* Zoom and Document Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-medium">Official Reg:</span>
              <span className="text-amber-300 font-bold">{OFFICIAL_CERTIFICATE_DATA.registrationNumber}</span>
              <button
                onClick={handleCopyReg}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                title="Copy Registration Number"
              >
                {copiedReg ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedReg ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setViewMode('vector')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  viewMode === 'vector'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Vector Document
              </button>
              <button
                onClick={() => setViewMode('canvas')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  viewMode === 'canvas'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hi-Res Canvas
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(0.7, prev - 0.15))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-400 text-[11px] w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(1.6, prev + 0.15))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Rendered Certificate Preview Container */}
          <div className="w-full overflow-x-auto rounded-2xl border-2 border-amber-500/40 bg-slate-950 p-2 sm:p-4 shadow-inner flex justify-center">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="w-full max-w-4xl"
            >
              {viewMode === 'vector' ? (
                <OfficialCertificateDocument />
              ) : (
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-4xl h-auto rounded-xl shadow-2xl border border-amber-400/30"
                />
              )}
            </div>
          </div>

          {/* Legal Audit & Registry Record Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Entity Legal Name
              </span>
              <p className="font-bold text-slate-100 font-serif text-sm">
                {OFFICIAL_CERTIFICATE_DATA.companyName}
              </p>
              <span className="text-[10px] text-emerald-400 font-mono">Incorporated 2021</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Official Registration
              </span>
              <p className="font-mono font-bold text-amber-300 text-sm">
                {OFFICIAL_CERTIFICATE_DATA.registrationNumber}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">CRN: {OFFICIAL_CERTIFICATE_DATA.crn}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                LEI Financial Identifier
              </span>
              <p className="font-mono text-slate-200 text-xs truncate">
                {OFFICIAL_CERTIFICATE_DATA.leiCode}
              </p>
              <span className="text-[10px] text-slate-400">Global GLEIF Database</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Registry Standing
              </span>
              <p className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Active & Good Standing
              </p>
              <span className="text-[10px] text-slate-400">Fully Solvent & Regulated</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash Verification Footnote */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Immutable Ledger Hash Verification:</span>
            </div>
            <p className="text-amber-300/80 break-all">
              {OFFICIAL_CERTIFICATE_DATA.digitalVerificationHash}
            </p>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Official certificate issued under seal. Verified and public for all new clients.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold font-mono shadow-md transition-all cursor-pointer"
            >
              {isDownloading ? 'Downloading Certificate...' : 'Download Official Certificate (.PNG)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
