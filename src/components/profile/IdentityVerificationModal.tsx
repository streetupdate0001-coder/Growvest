import React, { useState, useRef } from 'react';
import { X, ShieldCheck, Upload, Check, AlertCircle, FileText, Lock, Sparkles, CheckCircle2, RotateCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CountrySelector } from '../common/CountrySelector';

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({ isOpen, onClose }) => {
  const { user, submitVerification } = useAuth();
  const [docType, setDocType] = useState<'passport' | 'id_card' | 'driving_license'>('passport');
  const [docNumber, setDocNumber] = useState('');
  const [issuingCountry, setIssuingCountry] = useState(user?.country || '');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) {
      setError('Please provide document identification number.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const result = await submitVerification(docType, docNumber, issuingCountry, filePreview || undefined);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1200);
    } else {
      setError('Verification submission encountered an error.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" id="kyc-verification-modal">
      <div className="w-full max-w-lg bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-colors flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Identity Verification (KYC)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Institutional regulatory compliance & document review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Verification submitted and approved by automated compliance engine!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Document Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'passport', label: 'Passport' },
                { id: 'id_card', label: 'National ID' },
                { id: 'driving_license', label: 'Driving License' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setDocType(item.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    docType === item.id
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-black/40 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Number</label>
              <input
                type="text"
                placeholder="e.g. X1829402"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Issuing Country</label>
              <CountrySelector
                value={issuingCountry}
                mode="country"
                onChange={(c) => setIssuingCountry(c.name)}
              />
            </div>
          </div>

          {/* Upload Box with Full-Fit Display */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Upload Official {docType === 'passport' ? 'Passport' : docType === 'id_card' ? 'National ID' : 'Driver License'} Scan
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!filePreview && !fileName ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 dark:bg-black/30 hover:bg-emerald-50/20 dark:hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Click to upload official passport / ID scan
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  PDF, JPEG, PNG • Auto-fits full document cleanly
                </p>
              </div>
            ) : filePreview ? (
              <div className="space-y-2">
                <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 bg-slate-950 p-2 flex items-center justify-center">
                  <img
                    src={filePreview}
                    alt="Passport preview"
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[10px] font-semibold bg-black/70 hover:bg-black text-white rounded-lg backdrop-blur-sm border border-white/10 transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>
                  <div className="absolute bottom-2.5 left-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-white/10">
                    Full Document Visible
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Attached file: <strong className="text-slate-700 dark:text-slate-300">{fileName}</strong>
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-emerald-500 hover:underline font-medium"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
            <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              Your personal identity data is encrypted at rest using AES-256 and processed strictly in accordance with GDPR and Swiss FINMA privacy regulations.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Submit Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

