import React, { useState, useRef } from 'react';
import { X, Upload, Check, Trash2, AlertCircle, Camera, Image as ImageIcon, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ isOpen, onClose }) => {
  const { user, uploadProfilePhoto, removeProfilePhoto } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('contain');
  const [rotation, setRotation] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, WebP, or SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSavePhoto = async () => {
    if (!previewUrl) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      // If image is rotated, apply rotation to canvas; otherwise save high-res full image directly
      let finalDataUrl = previewUrl;

      if (rotation !== 0) {
        const img = new Image();
        img.src = previewUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (rotation === 90 || rotation === 270) {
            canvas.width = img.naturalHeight;
            canvas.height = img.naturalWidth;
          } else {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          }

          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
          finalDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        }
      }

      const result = await uploadProfilePhoto(finalDataUrl);
      if (result.success) {
        setSuccessMessage('Passport & profile photo saved and updated successfully.');
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setErrorMessage(result.error || 'Failed to save photo.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    await removeProfilePhoto();
    setIsUploading(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSuccessMessage('Profile photo removed.');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" id="photo-upload-modal">
      <div className="w-full max-w-lg bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-500" />
              <span>Passport & Profile Photo</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload your official passport photo or portrait — automatically sized to fit.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            id="close-photo-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {!previewUrl ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-emerald-500 rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all bg-slate-50 dark:bg-black/30 hover:bg-emerald-50/20 dark:hover:bg-white/5 group"
              id="photo-dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                onChange={handleFileChange}
                className="hidden"
                id="photo-file-input"
              />
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform shadow-sm">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Upload Passport / Profile Picture
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Click to browse or drag & drop (JPEG, PNG, WebP)
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-white/10 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Auto-fits full photo without required cropping</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Full Image Auto-Fit Preview Frame */}
              <div
                className="relative w-full h-72 sm:h-80 mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 bg-slate-950/90 shadow-2xl flex items-center justify-center p-2"
                id="passport-preview-container"
              >
                <img
                  src={previewUrl}
                  alt="Passport preview"
                  className={`max-w-full max-h-full rounded-xl transition-all duration-200 ${
                    fitMode === 'cover' ? 'w-full h-full object-cover' : 'object-contain'
                  }`}
                  style={{
                    transform: `rotate(${rotation}deg)`
                  }}
                  id="passport-full-image"
                />

                {/* Subtle Watermark Tag */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-400 border border-white/10 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Full Size Fit</span>
                </div>
              </div>

              {/* View & Adjustment Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                {/* Fit Mode Toggle */}
                <div className="flex items-center gap-1 bg-slate-200 dark:bg-black/40 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFitMode('contain')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      fitMode === 'contain'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Full Fit
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitMode('cover')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      fitMode === 'cover'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Fill Frame
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                    title="Rotate photo 90°"
                    id="rotate-photo-btn"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                    id="choose-different-photo-btn"
                  >
                    Choose Different
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-black/30 flex items-center justify-between gap-3">
          <div>
            {user?.avatarUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                id="remove-photo-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Current</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              id="cancel-photo-btn"
            >
              Cancel
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={isUploading}
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
                id="save-photo-btn"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Save & Apply Photo</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

