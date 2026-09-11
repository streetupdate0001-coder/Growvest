/**
 * Voice Notification & Auditory Security Alerts Service
 * Utilizes the browser's native Web Speech API (SpeechSynthesis) and Web Audio API
 * to vocalize critical portfolio security warnings, market volatility spikes, and asset threshold triggers.
 */

export type VoiceAlertSensitivity = 'high' | 'medium' | 'low';

export const SENSITIVITY_THRESHOLDS: Record<VoiceAlertSensitivity, { label: string; percent: number; desc: string }> = {
  high: { label: 'High (≥1.0%)', percent: 1.0, desc: 'Notifies on frequent minor swings & volatility' },
  medium: { label: 'Standard (≥2.5%)', percent: 2.5, desc: 'Balanced notifications on notable moves' },
  low: { label: 'Conservative (≥5.0%)', percent: 5.0, desc: 'Alerts only on major market breakouts or dumps' }
};

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
};

// Optional subtle acoustic telemetry beep before speaking
export const playAcousticChime = (type: 'alert' | 'success' | 'warning' = 'alert') => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (type === 'alert') {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    } else if (type === 'warning') {
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.setValueAtTime(349.23, ctx.currentTime + 0.1); // F4
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    } else {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (_e) {
    // AudioContext blocked or not allowed until user interaction
  }
};

/**
 * Reads aloud text with the Web Speech API
 */
export const speakTextWithWebSpeech = (
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    lang?: string;
    withChime?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
  }
): boolean => {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Web Speech API is not supported in this environment.');
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterances

    if (options?.withChime !== false) {
      playAcousticChime('alert');
    }

    // Clean markdown, symbols, and formatting for clean natural speech
    const cleanedText = text
      .replace(/[*#_`]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\$([0-9,.]+)/g, '$1 dollars')
      .replace(/%/g, ' percent')
      .replace(/BTC/g, 'Bitcoin')
      .replace(/ETH/g, 'Ethereum')
      .replace(/SOL/g, 'Solana')
      .replace(/USDT/g, 'Tether')
      .replace(/USDC/g, 'USD Coin')
      .replace(/XRP/g, 'Ripple')
      .replace(/ADA/g, 'Cardano')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = options?.rate ?? 1.02;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.lang = options?.lang ?? 'en-US';

    // Find preferred natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferredVoice =
        voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')) && v.lang.startsWith('en')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0];
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) {
      utterance.onend = options.onEnd;
      utterance.onerror = options.onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Error invoking SpeechSynthesis:', err);
    if (options?.onEnd) options.onEnd();
    return false;
  }
};

/**
 * Format a market volatility voice alert string
 */
export const formatMarketMovementAlert = (
  name: string,
  symbol: string,
  change24h: number,
  price: number,
  currency: string = 'USD'
): string => {
  const direction = change24h >= 0 ? 'increased' : 'dropped';
  const formattedPrice = price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const absChange = Math.abs(change24h).toFixed(1);
  return `Critical Portfolio Alert: ${name} has ${direction} by ${absChange} percent, currently trading at ${formattedPrice} ${currency}. Volatility threshold triggered.`;
};

/**
 * Format general portfolio balance change voice alert string
 */
export const formatPortfolioChangeAlert = (
  deltaPercent: number,
  currentValueUsd: number,
  currency: string = 'USD'
): string => {
  const direction = deltaPercent >= 0 ? 'gained' : 'decreased';
  const absPercent = Math.abs(deltaPercent).toFixed(1);
  const formattedValue = currentValueUsd.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return `Portfolio Alert: Your total portfolio valuation has ${direction} by ${absPercent} percent to ${formattedValue} ${currency}.`;
};
