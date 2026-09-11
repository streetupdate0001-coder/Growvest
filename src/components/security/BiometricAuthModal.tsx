import React, { useState, useEffect } from 'react';
import {
  Scan,
  Fingerprint,
  ShieldCheck,
  X,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  method?: 'face_id' | 'touch_id' | 'passkey';
  targetAreaName?: string;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  method = 'face_id',
  targetAreaName = 'Institutional Portfolio Vault'
}) => {
  const [authStage, setAuthStage] = useState<'idle' | 'scanning' | 'analyzing' | 'success' | 'failed'>('idle');
  const [activeMethod, setActiveMethod] = useState<'face_id' | 'touch_id' | 'pin'>(
    method === 'touch_id' ? 'touch_id' : 'face_id'
  );
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Play subtle synthetic audio feedback
  const playSound = (type: 'scan' | 'success' | 'error') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'scan') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(160, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (_e) {
      // Audio context disabled or blocked - safe ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      setAuthStage('idle');
      setPinCode('');
      setPinError(null);
      setActiveMethod(method === 'touch_id' ? 'touch_id' : 'face_id');

      // Auto-start scanning simulation upon open
      const startTimer = setTimeout(() => {
        handleTriggerScan();
      }, 400);

      return () => clearTimeout(startTimer);
    }
  }, [isOpen, method]);

  if (!isOpen) return null;

  const handleTriggerScan = () => {
    setAuthStage('scanning');
    playSound('scan');

    setTimeout(() => {
      setAuthStage('analyzing');
      setTimeout(() => {
        setAuthStage('success');
        playSound('success');

        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      }, 800);
    }, 1200);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length < 4) {
      setPinError('Please enter at least a 4-digit device PIN passcode.');
      return;
    }

    setAuthStage('analyzing');
    playSound('scan');

    setTimeout(() => {
      setAuthStage('success');
      playSound('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div
      id="biometric-auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all animate-fade-in"
    >
      <div
        id="biometric-auth-modal-dialog"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative text-center text-slate-900 dark:text-slate-100"
      >
        {/* Close Button */}
        <button
          id="biometric-modal-close-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Hardware Enclave Attestation
          </span>
        </div>

        {/* Title & Target Area */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100">
            Biometric Security Verification
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Simulated local device verification required to access{' '}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{targetAreaName}</span>.
          </p>
        </div>

        {/* Biometric Interactive Scanner Graphic */}
        {activeMethod !== 'pin' ? (
          <div className="py-4 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Outer Pulsing Rings */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-700 ${
                  authStage === 'scanning'
                    ? 'border-2 border-emerald-500/60 animate-ping'
                    : authStage === 'success'
                    ? 'border-2 border-emerald-500 scale-105 bg-emerald-500/10'
                    : 'border border-slate-200 dark:border-slate-800'
                }`}
              />
              <div
                className={`absolute -inset-2 rounded-full transition-all duration-500 ${
                  authStage === 'scanning'
                    ? 'border border-emerald-400/40 animate-pulse'
                    : 'border-transparent'
                }`}
              />

              {/* Core Icon / Sensor */}
              <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  authStage === 'success'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : authStage === 'scanning'
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {authStage === 'success' ? (
                  <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                ) : activeMethod === 'face_id' ? (
                  <div className="relative flex items-center justify-center">
                    <Scan className="w-12 h-12 stroke-[1.8]" />
                    {authStage === 'scanning' && (
                      <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-xs shadow-emerald-400 animate-bounce" />
                    )}
                  </div>
                ) : (
                  <Fingerprint
                    className={`w-12 h-12 stroke-[1.8] ${
                      authStage === 'scanning' ? 'animate-pulse text-emerald-400' : ''
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Status Message */}
            <div className="space-y-1">
              <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1.5">
                {authStage === 'scanning' && (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                    <span>Scanning {activeMethod === 'face_id' ? 'Face ID Matrix' : 'Touch ID Sensor'}...</span>
                  </>
                )}
                {authStage === 'analyzing' && (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span>Verifying Secure Cryptographic Signature...</span>
                  </>
                )}
                {authStage === 'success' && (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Biometric Identity Confirmed!
                  </span>
                )}
                {authStage === 'idle' && (
                  <span>Ready for Device Authentication</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {authStage === 'success'
                  ? 'Access Granted. Unlocking segregated portfolio vault.'
                  : 'Look at your camera or place your finger on the sensor to authenticate.'}
              </p>
            </div>

            {/* Trigger Button if idle/failed */}
            {authStage === 'idle' && (
              <button
                type="button"
                id="biometric-trigger-auth-btn"
                onClick={handleTriggerScan}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {activeMethod === 'face_id' ? <Scan className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                <span>Scan {activeMethod === 'face_id' ? 'Face ID' : 'Touch ID'} Now</span>
              </button>
            )}
          </div>
        ) : (
          /* PIN Passcode Fallback */
          <form onSubmit={handlePinSubmit} className="space-y-4 py-2 text-left">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Device Backup PIN Passcode
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinCode}
                onChange={e => {
                  setPinCode(e.target.value);
                  setPinError(null);
                }}
                placeholder="Enter 4-8 digit device PIN (e.g. 1234)"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono tracking-widest text-center focus:border-emerald-500 focus:outline-none"
              />
              {pinError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              id="biometric-pin-submit-btn"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Authenticate with Device PIN</span>
            </button>
          </form>
        )}

        {/* Method Switcher Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveMethod('face_id');
                setAuthStage('idle');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeMethod === 'face_id'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Face ID
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMethod('touch_id');
                setAuthStage('idle');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeMethod === 'touch_id'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Touch ID
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveMethod(prev => (prev === 'pin' ? 'face_id' : 'pin'))}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
          >
            {activeMethod === 'pin' ? 'Use Biometrics' : 'Use Device PIN'}
          </button>
        </div>
      </div>
    </div>
  );
};
