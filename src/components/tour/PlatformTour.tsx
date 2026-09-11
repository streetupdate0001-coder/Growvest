import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Lock,
  Layers,
  ArrowDownLeft
} from 'lucide-react';
import { useApp, AppTab } from '../../context/AppContext';
import { PLATFORM_TOUR_STEPS } from './tourSteps';
import { TourStep, TourPlacement } from '../../types';

interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export const PlatformTour: React.FC = () => {
  const {
    isTourOpen,
    tourCurrentStep,
    setTourCurrentStep,
    completeTour,
    closeTour,
    setActiveTab,
    setIsAiAssistantOpen,
    setDepositModalOpen,
    setIsLangModalOpen
  } = useApp();

  const [targetRect, setTargetRect] = useState<ElementPosition | null>(null);
  const [tooltipPlacement, setTooltipPlacement] = useState<TourPlacement>('bottom');
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [isPositionReady, setIsPositionReady] = useState(false);

  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData: TourStep | undefined = PLATFORM_TOUR_STEPS[tourCurrentStep];
  const totalSteps = PLATFORM_TOUR_STEPS.length;
  const isFirstStep = tourCurrentStep === 0;
  const isLastStep = tourCurrentStep === totalSteps - 1;

  // Auto-switch tab if step requires it
  useEffect(() => {
    if (!isTourOpen || !currentStepData) return;
    if (currentStepData.requiredTab) {
      setActiveTab(currentStepData.requiredTab as AppTab);
    }
  }, [isTourOpen, tourCurrentStep, currentStepData, setActiveTab]);

  // Recalculate target element position
  const updateTargetPosition = useCallback(() => {
    if (!isTourOpen || !currentStepData) {
      setTargetRect(null);
      setIsPositionReady(false);
      return;
    }

    // Attempt primary selector, then fallback
    let el = document.querySelector(currentStepData.targetSelector) as HTMLElement | null;
    if (!el && currentStepData.fallbackSelector) {
      el = document.querySelector(currentStepData.fallbackSelector) as HTMLElement | null;
    }

    if (el) {
      // Ensure element is visible
      const rect = el.getBoundingClientRect();
      
      // If element is not in view or partially hidden, scroll it smoothly into view
      const isOutOfView =
        rect.top < 60 ||
        rect.bottom > window.innerHeight - 60 ||
        rect.left < 0 ||
        rect.right > window.innerWidth;

      if (isOutOfView) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }

      // Add a brief delay if scrolling, then grab exact bounding box
      const updatedRect = el.getBoundingClientRect();
      const padding = 8;
      
      setTargetRect({
        top: Math.max(0, updatedRect.top - padding),
        left: Math.max(0, updatedRect.left - padding),
        width: updatedRect.width + padding * 2,
        height: updatedRect.height + padding * 2,
        bottom: updatedRect.bottom + padding,
        right: updatedRect.right + padding
      });

      // Calculate best placement
      let placement = currentStepData.placement || 'bottom';
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // On small screens, prefer bottom or centered placement
      if (viewportWidth < 768) {
        if (updatedRect.top > viewportHeight / 2) {
          placement = 'top';
        } else {
          placement = 'bottom';
        }
      } else {
        // Desktop auto-adjustment if requested placement doesn't fit
        if (placement === 'right' && updatedRect.right + 380 > viewportWidth) {
          placement = 'bottom';
        } else if (placement === 'bottom' && updatedRect.bottom + 280 > viewportHeight) {
          placement = 'top';
        } else if (placement === 'left' && updatedRect.left - 380 < 0) {
          placement = 'right';
        }
      }

      setTooltipPlacement(placement);
      setIsPositionReady(true);
    } else {
      // If no element found in DOM (e.g. initial load), center in viewport
      const defaultWidth = Math.min(window.innerWidth - 32, 400);
      const defaultHeight = 220;
      setTargetRect({
        top: window.innerHeight / 2 - defaultHeight / 2,
        left: window.innerWidth / 2 - defaultWidth / 2,
        width: defaultWidth,
        height: defaultHeight,
        bottom: window.innerHeight / 2 + defaultHeight / 2,
        right: window.innerWidth / 2 + defaultWidth / 2
      });
      setTooltipPlacement('bottom');
      setIsPositionReady(true);
    }
  }, [isTourOpen, currentStepData]);

  // Listen to window resizes and scroll events
  useEffect(() => {
    if (!isTourOpen) return;

    updateTargetPosition();
    const timer = setTimeout(updateTargetPosition, 100);

    const handleResizeOrScroll = () => {
      updateTargetPosition();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [isTourOpen, tourCurrentStep, updateTargetPosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isTourOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTour();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, tourCurrentStep, isLastStep]);

  if (!isTourOpen && !isCompletedModalOpen) return null;

  const handleNext = () => {
    if (isLastStep) {
      completeTour();
      setIsCompletedModalOpen(true);
    } else {
      setTourCurrentStep(tourCurrentStep + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setTourCurrentStep(tourCurrentStep - 1);
    }
  };

  const handleStepSelect = (index: number) => {
    setTourCurrentStep(index);
  };

  const handleAction = () => {
    if (!currentStepData) return;

    if (currentStepData.actionType === 'navigate_tab' && currentStepData.targetTab) {
      setActiveTab(currentStepData.targetTab as AppTab);
    } else if (currentStepData.actionType === 'open_ai') {
      setIsAiAssistantOpen(true);
    } else if (currentStepData.actionType === 'open_deposit') {
      setDepositModalOpen(true);
    } else if (currentStepData.actionType === 'open_lang') {
      setIsLangModalOpen(true);
    }
  };

  // Tooltip position calculator
  const getTooltipStyles = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed'
      };
    }

    const cardWidth = Math.min(window.innerWidth - 32, 420);
    const margin = 16;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile positioning: pinned at bottom or top of viewport for best thumb accessibility
      if (tooltipPlacement === 'top') {
        return {
          position: 'fixed',
          top: Math.max(16, targetRect.top - 290),
          left: '50%',
          transform: 'translateX(-50%)',
          width: cardWidth,
          maxWidth: 'calc(100vw - 32px)'
        };
      }
      return {
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: cardWidth,
        maxWidth: 'calc(100vw - 32px)'
      };
    }

    // Desktop placement
    switch (tooltipPlacement) {
      case 'right': {
        const topPos = Math.min(
          Math.max(20, targetRect.top + targetRect.height / 2 - 140),
          window.innerHeight - 340
        );
        return {
          position: 'fixed',
          top: topPos,
          left: targetRect.right + margin,
          width: cardWidth
        };
      }
      case 'left': {
        const topPos = Math.min(
          Math.max(20, targetRect.top + targetRect.height / 2 - 140),
          window.innerHeight - 340
        );
        return {
          position: 'fixed',
          top: topPos,
          left: Math.max(16, targetRect.left - cardWidth - margin),
          width: cardWidth
        };
      }
      case 'top': {
        const leftPos = Math.min(
          Math.max(16, targetRect.left + targetRect.width / 2 - cardWidth / 2),
          window.innerWidth - cardWidth - 16
        );
        return {
          position: 'fixed',
          bottom: window.innerHeight - targetRect.top + margin,
          left: leftPos,
          width: cardWidth
        };
      }
      case 'bottom':
      default: {
        const leftPos = Math.min(
          Math.max(16, targetRect.left + targetRect.width / 2 - cardWidth / 2),
          window.innerWidth - cardWidth - 16
        );
        return {
          position: 'fixed',
          top: Math.min(targetRect.bottom + margin, window.innerHeight - 340),
          left: leftPos,
          width: cardWidth
        };
      }
    }
  };

  return (
    <div id="growvest-platform-tour-overlay" className="fixed inset-0 z-50 pointer-events-auto">
      {/* 1. Backdrop with Spotlight Hole */}
      {isTourOpen && targetRect && isPositionReady && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300"
          style={{ width: '100vw', height: '100vh' }}
        >
          <defs>
            <mask id="tour-spotlight-mask">
              {/* White background covers everything */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Black rounded rectangle cuts out the spotlight area */}
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="16"
                ry="16"
                fill="black"
              />
            </mask>
          </defs>
          {/* Masked Darkened Canvas */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(2, 6, 23, 0.75)"
            mask="url(#tour-spotlight-mask)"
            className="backdrop-blur-[2px]"
          />
        </svg>
      )}

      {/* 2. Highlight Halo around active DOM element */}
      {isTourOpen && targetRect && isPositionReady && (
        <div
          style={{
            position: 'fixed',
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: '16px',
            pointerEvents: 'none'
          }}
          className="ring-2 sm:ring-4 ring-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all duration-300 animate-pulse"
        />
      )}

      {/* 3. Interactive Tooltip Card */}
      <AnimatePresence mode="wait">
        {isTourOpen && currentStepData && isPositionReady && (
          <motion.div
            key={currentStepData.id}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2 }}
            style={getTooltipStyles()}
            ref={tooltipRef}
            className="z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 flex flex-col gap-4 font-sans select-none"
          >
            {/* Top Bar: Badge, Step Indicator & Close */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{currentStepData.badge}</span>
                </span>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  Step {tourCurrentStep + 1} of {totalSteps}
                </span>
              </div>

              <button
                onClick={closeTour}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Exit Platform Tour (Esc)"
                aria-label="Exit Tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((tourCurrentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100">
                {currentStepData.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Tip Box */}
            {currentStepData.tip && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{currentStepData.tip}</span>
              </div>
            )}

            {/* Step Dots & Interactive Actions */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                {PLATFORM_TOUR_STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStepSelect(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === tourCurrentStep
                        ? 'w-5 bg-emerald-500'
                        : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                    title={`Jump to Step ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Optional Quick Action (e.g. Try this Feature) */}
              {currentStepData.actionText && (
                <button
                  onClick={handleAction}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline cursor-pointer"
                >
                  <span>{currentStepData.actionText}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Bottom Controls: Previous, Next, Finish */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 gap-2">
              <button
                onClick={handlePrev}
                disabled={isFirstStep}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isFirstStep
                    ? 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={closeTour}
                  className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Skip Tour
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white dark:text-slate-950 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <span>{isLastStep ? 'Finish Tour' : 'Next Step'}</span>
                  {isLastStep ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Completion Congratulations Modal */}
      <AnimatePresence>
        {isCompletedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 text-slate-900 dark:text-slate-100 relative overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Completion Icon */}
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>

              {/* Heading & Subtitle */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100">
                  You're Ready to Experience GROWVEST
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You have completed the full navigation tour. You can replay this interactive guide at any time from the User Menu, Sidebar, or Support Center.
                </p>
              </div>

              {/* Quick Launchpad Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs font-semibold">
                <button
                  onClick={() => {
                    setIsCompletedModalOpen(false);
                    setDepositModalOpen(true);
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer flex items-center gap-2.5 group"
                >
                  <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-slate-800 dark:text-slate-100 group-hover:text-emerald-500">Deposit Funds</div>
                    <div className="text-[10px] text-slate-400 font-normal">Crypto & SEPA</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsCompletedModalOpen(false);
                    setActiveTab('markets');
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer flex items-center gap-2.5 group"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-slate-800 dark:text-slate-100 group-hover:text-emerald-500">Explore Markets</div>
                    <div className="text-[10px] text-slate-400 font-normal">Live Sparklines</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsCompletedModalOpen(false);
                    setIsAiAssistantOpen(true);
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer flex items-center gap-2.5 group"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-slate-800 dark:text-slate-100 group-hover:text-emerald-500">AI Copilot</div>
                    <div className="text-[10px] text-slate-400 font-normal">Portfolio Advice</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsCompletedModalOpen(false);
                    setActiveTab('security');
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer flex items-center gap-2.5 group"
                >
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-slate-800 dark:text-slate-100 group-hover:text-emerald-500">Security Vault</div>
                    <div className="text-[10px] text-slate-400 font-normal">Enable 2FA</div>
                  </div>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsCompletedModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white dark:text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
              >
                Enter GROWVEST Workspace
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
