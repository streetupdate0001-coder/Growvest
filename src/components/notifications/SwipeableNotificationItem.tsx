import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import {
  Shield,
  History,
  Bell,
  CheckCircle2,
  Trash2,
  Mail,
  MailOpen,
  ArrowRight,
  ExternalLink,
  Lock,
  DollarSign,
  AlertTriangle,
  Info,
  Volume2
} from 'lucide-react';
import { AppNotification } from '../../types';
import { speakTextWithWebSpeech } from '../../services/voiceAlerts';

interface SwipeableNotificationItemProps {
  notification: AppNotification;
  onDismiss: (id: string) => void;
  onToggleRead: (id: string) => void;
  onNavigate?: (tab: string) => void;
  isRtl?: boolean;
}

export const SwipeableNotificationItem: React.FC<SwipeableNotificationItemProps> = ({
  notification,
  onDismiss,
  onToggleRead,
  onNavigate,
  isRtl = false
}) => {
  const [isDismissing, setIsDismissing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'none' | 'left' | 'right'>('none');
  const [isPastDismissThreshold, setIsPastDismissThreshold] = useState(false);
  const [isPastReadThreshold, setIsPastReadThreshold] = useState(false);
  const isDraggingRef = useRef(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vocalText = `${notification.title}. ${notification.message}`;
    speakTextWithWebSpeech(vocalText, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
  };

  // Motion value tracking horizontal drag offset
  const x = useMotionValue(0);

  // Thresholds
  const DISMISS_THRESHOLD = -110;
  const READ_THRESHOLD = 90;

  // Background transformations for left swipe (Dismiss / Delete)
  const deleteBgOpacity = useTransform(x, [-180, -90, 0], [1, 0.85, 0]);
  const deleteIconScale = useTransform(x, [-180, -110, -50, 0], [1.25, 1.1, 0.9, 0.7]);
  const deleteTextOpacity = useTransform(x, [-150, -80, 0], [1, 0.7, 0]);

  // Background transformations for right swipe (Toggle Read)
  const readBgOpacity = useTransform(x, [0, 70, 150], [0, 0.85, 1]);
  const readIconScale = useTransform(x, [0, 40, 90, 150], [0.7, 0.9, 1.1, 1.25]);
  const readTextOpacity = useTransform(x, [0, 60, 120], [0, 0.7, 1]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDrag = (_: any, info: PanInfo) => {
    const currentX = info.offset.x;
    if (currentX < -20) {
      setSwipeDirection('left');
      setIsPastDismissThreshold(currentX <= DISMISS_THRESHOLD);
    } else if (currentX > 20) {
      setSwipeDirection('right');
      setIsPastReadThreshold(currentX >= READ_THRESHOLD);
    } else {
      setSwipeDirection('none');
      setIsPastDismissThreshold(false);
      setIsPastReadThreshold(false);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);

    const currentX = info.offset.x;
    const velocityX = info.velocity.x;

    // Trigger Dismiss on fast flick or past threshold
    if (currentX <= DISMISS_THRESHOLD || (velocityX < -400 && currentX < -40)) {
      setIsDismissing(true);
      onDismiss(notification.id);
      return;
    }

    // Trigger Read / Unread toggle on right swipe
    if (currentX >= READ_THRESHOLD || (velocityX > 400 && currentX > 40)) {
      onToggleRead(notification.id);
    }

    // Reset indicator states
    setSwipeDirection('none');
    setIsPastDismissThreshold(false);
    setIsPastReadThreshold(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    // If was dragging, do not trigger item click
    if (isDraggingRef.current) return;
    if (!notification.read) {
      onToggleRead(notification.id);
    }
    if (notification.linkTab && onNavigate) {
      onNavigate(notification.linkTab);
    }
  };

  // Type-specific icon and style configuration
  const getTypeConfig = () => {
    switch (notification.type) {
      case 'security':
        return {
          icon: <Shield className="w-4 h-4" />,
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          badgeText: 'SECURITY',
          badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
        };
      case 'transaction':
        return {
          icon: <History className="w-4 h-4" />,
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          badgeText: 'TRANSACTION',
          badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
        };
      case 'verification':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
          badgeText: 'KYC & IDENTITY',
          badgeBg: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30'
        };
      case 'market':
        return {
          icon: <DollarSign className="w-4 h-4" />,
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          badgeText: 'MARKET TELEMETRY',
          badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
        };
      case 'system':
      default:
        return {
          icon: <Bell className="w-4 h-4" />,
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
          badgeText: 'SYSTEM NOTICE',
          badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
        scale: 0.92,
        transition: { duration: 0.28, ease: 'easeInOut' }
      }}
      className="relative rounded-2xl overflow-hidden select-none touch-pan-y group"
    >
      {/* 1. Underlay for Swipe Left: DISMISS / DELETE (Red Canvas) */}
      <motion.div
        style={{ opacity: deleteBgOpacity }}
        className={`absolute inset-0 flex items-center justify-end px-5 rounded-2xl transition-colors ${
          isPastDismissThreshold ? 'bg-rose-600 dark:bg-rose-700' : 'bg-rose-500/90 dark:bg-rose-600/90'
        }`}
      >
        <div className="flex items-center gap-2.5 text-white font-mono">
          <motion.span
            style={{ opacity: deleteTextOpacity }}
            className="text-xs font-bold uppercase tracking-wider hidden sm:inline"
          >
            {isPastDismissThreshold ? 'Release to Dismiss' : 'Dismiss'}
          </motion.span>
          <motion.div
            style={{ scale: deleteIconScale }}
            className="p-2 rounded-xl bg-white/20 border border-white/30 backdrop-blur-xs flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* 2. Underlay for Swipe Right: MARK READ / UNREAD (Emerald Canvas) */}
      <motion.div
        style={{ opacity: readBgOpacity }}
        className={`absolute inset-0 flex items-center justify-start px-5 rounded-2xl transition-colors ${
          isPastReadThreshold ? 'bg-emerald-600 dark:bg-emerald-700' : 'bg-emerald-500/90 dark:bg-emerald-600/90'
        }`}
      >
        <div className="flex items-center gap-2.5 text-white font-mono">
          <motion.div
            style={{ scale: readIconScale }}
            className="p-2 rounded-xl bg-white/20 border border-white/30 backdrop-blur-xs flex items-center justify-center"
          >
            {notification.read ? (
              <Mail className="w-4 h-4 text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-white" />
            )}
          </motion.div>
          <motion.span
            style={{ opacity: readTextOpacity }}
            className="text-xs font-bold uppercase tracking-wider hidden sm:inline"
          >
            {isPastReadThreshold
              ? notification.read
                ? 'Release to Mark Unread'
                : 'Release to Mark Read'
              : notification.read
              ? 'Mark as Unread'
              : 'Mark as Read'}
          </motion.span>
        </div>
      </motion.div>

      {/* 3. Foreground Draggable Notification Card */}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -140, right: 140 }}
        dragElastic={0.25}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ x }}
        onClick={handleClick}
        animate={{ x: isDismissing ? -400 : 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        className={`relative z-10 p-4 sm:p-5 rounded-2xl border transition-colors cursor-grab active:cursor-grabbing ${
          !notification.read
            ? 'bg-white dark:bg-slate-900 border-emerald-500/40 shadow-xs dark:shadow-lg dark:shadow-emerald-950/20'
            : 'bg-slate-50/90 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900/80 shadow-xs'
        }`}
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          {/* Main Content Area */}
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {/* Category Icon */}
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform group-hover:scale-105 ${config.bg}`}
            >
              {config.icon}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              {/* Header tags & Title */}
              <div className="flex flex-wrap items-center gap-2">
                {!notification.read && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${config.badgeBg}`}
                >
                  {config.badgeText}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {new Date(notification.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}{' '}
                  • {new Date(notification.timestamp).toLocaleDateString()}
                </span>
              </div>

              {/* Notification Title */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight leading-snug break-words">
                {notification.title}
              </h3>

              {/* Notification Message */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl break-words">
                {notification.message}
              </p>
            </div>
          </div>

          {/* Right Action & Quick Controls (Desktop Hover & Mobile Fallback) */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
            {notification.linkTab && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  if (!notification.read) onToggleRead(notification.id);
                  if (onNavigate) onNavigate(notification.linkTab!);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {/* Desktop Quick Hover Action Buttons */}
            <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleSpeak}
                title="Vocalize Alert (Web Speech API)"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isSpeaking
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/20 text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onToggleRead(notification.id);
                }}
                title={notification.read ? 'Mark as Unread' : 'Mark as Read'}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {notification.read ? (
                  <Mail className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </button>

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setIsDismissing(true);
                  onDismiss(notification.id);
                }}
                title="Dismiss Notification"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Swipe Affordance Bar (Mobile Pill Indicator) */}
        <div className="sm:hidden flex items-center justify-center pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] font-mono text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1.5 opacity-60">
            <span>← Swipe to dismiss</span>
            <span>•</span>
            <span>Swipe to read →</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
