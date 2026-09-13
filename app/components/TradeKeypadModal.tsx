import React, { useState } from 'react';
import { X, ArrowLeft, Check, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface TradeKeypadModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: number;
  onSuccessRedirect?: () => void;
}

export const TradeKeypadModal: React.FC<TradeKeypadModalProps> = ({
  isOpen,
  onClose,
  availableBalance = 145485.00,
  onSuccessRedirect
}) => {
  const [amountStr, setAmountStr] = useState('4747.0');
  const [isTakeProfitActive, setIsTakeProfitActive] = useState(true);
  const [leverage, setLeverage] = useState<'2x' | '5x' | '10x'>('2x');
  const [isSuccessView, setIsSuccessView] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (char: string) => {
    if (char === 'backspace') {
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (char === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr((prev) => prev + '.');
      }
      return;
    }
    if (amountStr === '0') {
      setAmountStr(char);
    } else {
      if (amountStr.length < 9) {
        setAmountStr((prev) => prev + char);
      }
    }
  };

  const handlePercentage = (pct: number) => {
    const val = (availableBalance * pct).toFixed(1);
    setAmountStr(val);
  };

  const handleOpenPosition = () => {
    setIsSuccessView(true);
  };

  const handleResetAndClose = () => {
    setIsSuccessView(false);
    onClose();
  };

  const handleViewPosition = () => {
    setIsSuccessView(false);
    onClose();
    if (onSuccessRedirect) {
      onSuccessRedirect();
    }
  };

  const parsedAmount = parseFloat(amountStr) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#F4F6F9] rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[95vh] text-slate-900">
        
        {/* ============================================================ */}
        {/* VIEW 1: SUCCESS CONFIRMATION RECEIPT (Screen 6: invest 6.jpg) */}
        {/* ============================================================ */}
        {isSuccessView ? (
          <div className="p-6 sm:p-7 flex flex-col items-center text-center space-y-5">
            {/* Top Close */}
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cyan Scalloped / Starburst Badge with Checkmark */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#00ACEE] flex items-center justify-center shadow-lg shadow-[#00ACEE]/30 text-white">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Successfully
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your Short BTC position has been opened successfully.
              </p>
            </div>

            {/* Receipt Breakdown Card (Screen 6 details) */}
            <div className="w-full rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 space-y-3 text-xs shadow-xs text-left">
              {/* Asset Row */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 font-bold text-sm">
                    ₿
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block">Short BTC</span>
                    <span className="text-[10px] text-slate-400 font-mono">Perpetual Contract</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 text-sm block">
                    ${parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-rose-500 font-bold font-mono">Short 2x</span>
                </div>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Entry Price</span>
                  <span className="font-bold text-slate-800">$54,542.14</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Leverage</span>
                  <span className="font-bold text-slate-800">{leverage}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Liquidation Price</span>
                  <span className="font-bold text-rose-600">$54,754.00</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Take Profit</span>
                  <span className="font-bold text-emerald-600">$545,585.47</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Margin Used</span>
                  <span className="font-bold text-slate-800">${parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Fee</span>
                  <span className="font-bold text-slate-800">$0.18</span>
                </div>
                <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-100">
                  <span>Date</span>
                  <span className="font-bold text-slate-600">Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={handleViewPosition}
                className="w-full py-3.5 rounded-2xl bg-[#00ACEE] hover:bg-[#009bd7] text-white font-bold text-sm shadow-md shadow-[#00ACEE]/30 active:scale-[0.98] transition-all cursor-pointer"
              >
                View Position
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                Continue Trading
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW 2: TRADING KEYPAD (Screen 5: invest 5.jpg)               */
          /* ============================================================ */
          <div className="p-5 sm:p-6 space-y-4">
            {/* Top Bar: Back, Title "Short BTC", Close */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 font-bold text-xs">
                  ₿
                </div>
                <h3 className="font-black text-slate-900 text-base">Short BTC</h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Available Balance Pill */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono font-bold text-slate-600 shadow-xs">
                ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} Available
              </span>
            </div>

            {/* Big Amount Display with Blinking Cursor */}
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center font-mono font-black text-4xl sm:text-5xl text-slate-900 tracking-tight">
                <span>${amountStr}</span>
                <span className="w-[3px] h-9 sm:h-11 bg-[#00ACEE] animate-pulse ml-0.5" />
              </div>
            </div>

            {/* Two Cards: Leverage & Auto Closes (exact layout in invest 5.jpg) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Leverage Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Leverage</span>
                  <span className="text-[11px] font-mono text-slate-500">Liquidation $54,754</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLeverage(leverage === '2x' ? '5x' : leverage === '5x' ? '10x' : '2x')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs cursor-pointer"
                >
                  {leverage}
                </button>
              </div>

              {/* Auto Closes Card with Cyan Toggle */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Auto Closes</span>
                  <span className="text-[11px] font-mono text-slate-500">TP $14,541.14</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTakeProfitActive(!isTakeProfitActive)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    isTakeProfitActive ? 'bg-[#00ACEE]' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      isTakeProfitActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Percentage Pills: 25%, 50%, 75%, Max */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '25%', val: 0.25 },
                { label: '50%', val: 0.5 },
                { label: '75%', val: 0.75 },
                { label: 'Max', val: 1.0 }
              ].map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => handlePercentage(pill.val)}
                  className="py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-mono font-bold text-slate-700 shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Numeric Keypad (1-9, ., 0, backspace) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => {
                const isBackspace = key === 'backspace';
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeyPress(key)}
                    className="h-12 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200/80 shadow-xs flex items-center justify-center font-mono text-lg font-bold text-slate-800 transition-all cursor-pointer"
                  >
                    {isBackspace ? (
                      <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                        <line x1="18" y1="9" x2="12" y2="15" />
                        <line x1="12" y1="9" x2="18" y2="15" />
                      </svg>
                    ) : (
                      key
                    )}
                  </button>
                );
              })}
            </div>

            {/* Open Short Button (Vivid Cyan) */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleOpenPosition}
                className="w-full py-3.5 rounded-2xl bg-[#00ACEE] hover:bg-[#009bd7] text-white font-black text-sm shadow-lg shadow-[#00ACEE]/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Open Short</span>
              </button>

              {/* Footer Risk Disclosure */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <span>Risk Disclosure</span>
                <span>•</span>
                <span>$0.15 Fee</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
