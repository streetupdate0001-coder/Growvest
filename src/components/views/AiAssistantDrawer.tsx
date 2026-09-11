import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Zap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bell,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: {
    type: 'market_search' | 'alert_set' | 'navigate';
    label: string;
    tab?: string;
    query?: string;
  };
}

const QUICK_PROMPTS = [
  'What does GROWVEST do?',
  'How to follow up with clients on unlisted questions?',
  'How do deposits and withdrawals work?',
  'Explain Investment Strategies & Yield',
  'How do internal transfers work?'
];

export const AiAssistantDrawer: React.FC = () => {
  const {
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    setActiveTab,
    setPublicPage,
    addNotification,
    currentCurrency
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your GROWVEST Financial AI Assistant. You can type or tap the microphone 🎙️ to issue voice commands like "Search Bitcoin market" or "Set alert for ETH at $3,500".',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Web Speech API States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, interimTranscript]);

  // Voice synthesis helper
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch (_e) {
      // Ignored if browser speech blocked
    }
  };

  // Process voice commands locally for Instant Actions (Markets & Alerts & Navigation)
  const processVoiceCommand = async (rawTranscript: string) => {
    const text = rawTranscript.trim();
    if (!text) return;

    const lower = text.toLowerCase();

    // 1. Alert Command Detection: "set alert for bitcoin at 95000" or "alert me if eth reaches 3500"
    const alertMatch = lower.match(/(?:set alert|price alert|alert me)(?:\s+for)?\s+([a-zA-Z\s]+)(?:\s+(?:at|to|reaches|hits|above|below|is))?\s+\$?([0-9,.]+k?)/i);
    if (alertMatch) {
      const asset = alertMatch[1].trim();
      const targetPrice = alertMatch[2].trim();

      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: 'user',
        text: `🎙️ "${text}"`,
        timestamp: new Date().toISOString()
      };

      const replyText = `🎯 Price alert successfully configured for ${asset.toUpperCase()} at ${targetPrice.toUpperCase()} ${currentCurrency}. We will notify you instantly when the market reaches this threshold.`;

      addNotification({
        type: 'market',
        title: `Price Alert Configured: ${asset.toUpperCase()}`,
        message: `Notification rule active for target benchmark ${targetPrice} ${currentCurrency}.`,
        linkTab: 'markets'
      });

      const assistantMsg: ChatMessage = {
        id: `reply_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toISOString(),
        action: {
          type: 'alert_set',
          label: 'View Active Alerts & Markets',
          tab: 'markets'
        }
      };

      setMessages(prev => [...prev, userMsg, assistantMsg]);
      speakText(replyText);
      setVoiceNotice(`Alert set for ${asset} at ${targetPrice}`);
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    // 2. Market Search Voice Command: "search bitcoin market" or "look up solana" or "find xrp"
    const searchMatch = lower.match(/(?:search|find|lookup|look up|check price of|show me|track)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:market|coin|crypto|price))?$/i);
    if (searchMatch && !lower.startsWith('what is') && !lower.startsWith('how')) {
      const query = searchMatch[1].replace(/market|price|coin|crypto/gi, '').trim();

      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: 'user',
        text: `🎙️ "${text}"`,
        timestamp: new Date().toISOString()
      };

      const replyText = `🔍 Searching live spot markets and real-time order books for "${query.toUpperCase()}". Click below to jump straight to the asset ticker.`;

      const assistantMsg: ChatMessage = {
        id: `reply_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toISOString(),
        action: {
          type: 'market_search',
          label: `Open ${query.toUpperCase()} Market Data`,
          tab: 'markets',
          query
        }
      };

      setMessages(prev => [...prev, userMsg, assistantMsg]);
      speakText(replyText);
      setVoiceNotice(`Found market for: ${query}`);
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    // 3. Navigation Voice Command: "go to portfolio", "open dashboard", "view activity"
    if (lower.includes('go to') || lower.includes('open') || lower.includes('show')) {
      if (lower.includes('portfolio')) {
        handleNavAndReply(text, 'portfolio', 'Navigating directly to your Institutional Portfolio workspace.');
        return;
      }
      if (lower.includes('market')) {
        handleNavAndReply(text, 'markets', 'Opening Digital Asset Markets & Price discovery.');
        return;
      }
      if (lower.includes('activity') || lower.includes('history')) {
        handleNavAndReply(text, 'activity', 'Opening your Transaction Ledger and Activity logs.');
        return;
      }
      if (lower.includes('security')) {
        handleNavAndReply(text, 'security', 'Opening the Security Center & 2FA controls.');
        return;
      }
      if (lower.includes('dashboard') || lower.includes('home')) {
        handleNavAndReply(text, 'dashboard', 'Opening your Executive Dashboard.');
        return;
      }
    }

    // 4. Default: Query Gemini AI Assistant with spoken query
    handleSendMessage(text);
  };

  const handleNavAndReply = (userPrompt: string, tabName: any, replyText: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: `🎙️ "${userPrompt}"`,
      timestamp: new Date().toISOString()
    };
    const assistantMsg: ChatMessage = {
      id: `reply_${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toISOString(),
      action: {
        type: 'navigate',
        label: `Go to ${tabName.toUpperCase()}`,
        tab: tabName
      }
    };
    setActiveTab(tabName);
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    speakText(replyText);
  };

  // Toggle Voice Recording
  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech Recognition is not supported on this browser. Try Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setInterimTranscript(currentText);

        if (event.results[0].isFinal) {
          setIsListening(false);
          setInterimTranscript('');
          processVoiceCommand(currentText);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (_e) {
      setIsListening(false);
    }
  };

  const generateDomainFallback = (query: string): { text: string; action?: ChatMessage['action'] } => {
    const q = query.toLowerCase();

    if (q.includes('what') && (q.includes('site') || q.includes('do') || q.includes('greeneza') || q.includes('platform'))) {
      return {
        text: `🏛️ **GROWVEST Institutional Fintech Ecosystem**

GROWVEST is a multi-asset financial platform and digital asset wealth management ecosystem (UK Registered Company #14892011).

**Core Services & Workflows:**
• **Institutional Vaults**: Multi-chain segregated cold storage addresses (USDT, BTC, ETH, SOL, USDC) for inbound deposits with automatic 1-confirmation validation.
• **Wealth Strategies**: Curated Quantitative Yield, Balanced Growth, and Fixed Income portfolios with automated daily ROI accrual.
• **Instant P2P Internal Transfers**: 0% fee instant balance transfers between registered accounts using Email or Account ID.
• **Secure Outbound Withdrawals**: Cold-enclave batch disbursement protected by mandatory 2FA.
• **Tier 1 & Tier 2 KYC**: Identity verification enabling unlimited institutional limits.
• **24/7 Client Advisory Desk**: Integrated live chat, smart triggers, and dedicated compliance escalation.`,
        action: {
          type: 'navigate',
          label: 'Explore Investment Strategies',
          tab: 'invest'
        }
      };
    }

    if (q.includes('follow up') || q.includes('unlisted') || q.includes('custom') || q.includes('client') || q.includes('ask question')) {
      return {
        text: `📋 **Client Follow-Up Protocol for Custom & Unlisted Inquiries**

When a client asks a specialized question not covered in the standard dashboard guides (e.g., bespoke institutional OTC limits, corporate onboarding, inheritance/estate transfer, audited tax statements, custom staking terms, or API credentials):

**Recommended 4-Step Follow-Up Process:**
1. **Record Details**: Note the client's registered Email address and unique Account ID.
2. **Open Priority Ticket**: Direct the client to the **Support Center** to submit a high-priority support ticket with any relevant attachments.
3. **Escalate to Senior Desk**:
   • **General Support**: \`support@greeneza.com\`
   • **Compliance & Institutional**: \`compliance@greeneza.com\`
   • **Executive Telegram Desk (UK)**: \`+44 79 0041 3315\`
4. **SLA Assurance**: Reassure the client that institutional requests undergo compliance review with a turnaround under **2 business hours**.`,
        action: {
          type: 'navigate',
          label: 'Open Support Center',
          tab: 'support'
        }
      };
    }

    if (q.includes('transfer')) {
      return {
        text: `⚡ **Internal User Transfers (0% Fee)**

You can send funds instantly to any registered GROWVEST user using their registered Email address or unique Account ID.
• **Instant Settlement**: Transferred balances reflect immediately with 0 blockchain network fees.
• **Verification**: Recipient verification is checked in real-time before debiting your available balance.
• **Ledger Security**: Every transfer generates an audited transaction hash visible in your Activity log.`,
        action: {
          type: 'navigate',
          label: 'Go to Executive Dashboard',
          tab: 'dashboard'
        }
      };
    }

    if (q.includes('deposit') || q.includes('withdraw')) {
      return {
        text: `💳 **Deposits & Withdrawals Overview**

• **Deposits**: Navigate to the Deposit modal from your Dashboard. Select your desired cryptocurrency (USDT TRC20, BTC SegWit, ETH ERC20, SOL) and copy the company deposit vault address or scan the QR code.
• **Withdrawals**: Protected by 2FA authentication and processed through our cold enclave batch disbursement system within 15-60 minutes.`,
        action: {
          type: 'navigate',
          label: 'Go to Activity Ledger',
          tab: 'activity'
        }
      };
    }

    return {
      text: `GROWVEST safeguards client assets using AES-256 encryption, segregated institutional custody, and zero-trust policies. You can consult our live advisors or submit a priority ticket in the Support Center 24/7. How else may I assist you?`,
      action: {
        type: 'navigate',
        label: 'Open Support Center',
        tab: 'support'
      }
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          conversationHistory: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!res.ok) {
        throw new Error('AI service response error.');
      }

      const data = await res.json();
      const assistantReply: ChatMessage = {
        id: `reply_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I am ready to assist with your portfolio questions.',
        timestamp: new Date().toISOString()
      };

      // Add contextual action buttons if the reply mentions support or specific areas
      const replyLower = assistantReply.text.toLowerCase();
      if (replyLower.includes('support ticket') || replyLower.includes('support center')) {
        assistantReply.action = { type: 'navigate', label: 'Open Support Center', tab: 'support' };
      } else if (replyLower.includes('kyc') || replyLower.includes('identity verification')) {
        assistantReply.action = { type: 'navigate', label: 'Go to KYC Verification', tab: 'security' };
      } else if (replyLower.includes('investment plan') || replyLower.includes('portfolio strategy')) {
        assistantReply.action = { type: 'navigate', label: 'Explore Investment Plans', tab: 'invest' };
      }

      setMessages(prev => [...prev, assistantReply]);
      speakText(assistantReply.text);
    } catch (_err) {
      const fallback = generateDomainFallback(query);
      const fallbackReply: ChatMessage = {
        id: `reply_err_${Date.now()}`,
        sender: 'assistant',
        text: fallback.text,
        timestamp: new Date().toISOString(),
        action: fallback.action
      };
      setMessages(prev => [...prev, fallbackReply]);
      speakText(fallbackReply.text);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAiAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsAiAssistantOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Slide-over Panel */}
      <motion.aside
        aria-label="GROWVEST AI Assistant"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        id="growvest-ai-assistant-drawer"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between text-slate-900 dark:text-slate-100 z-10 transition-colors"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
                GROWVEST AI
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  VOICE & CORE
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Institutional Voice Assistant & Market AI</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Text-to-Speech Toggle */}
            <button
              onClick={() => {
                setTtsEnabled(prev => !prev);
                if (ttsEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              title={ttsEnabled ? 'Mute AI Voice Responses' : 'Enable AI Voice Responses'}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                ttsEnabled
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsAiAssistantOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Feedback Banner if active */}
        {voiceNotice && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{voiceNotice}</span>
          </div>
        )}

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map(m => {
            const isBot = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isBot
                      ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3 rounded-2xl max-w-[84%] leading-relaxed ${
                    isBot
                      ? 'bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs'
                      : 'bg-emerald-500 text-white font-medium shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Interactive Action Button if triggered by Voice / Command */}
                  {m.action && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                      <button
                        onClick={() => {
                          if (m.action?.tab) {
                            setActiveTab(m.action.tab as any);
                            setIsAiAssistantOpen(false);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[11px] font-bold hover:bg-emerald-600 transition-colors shadow-xs cursor-pointer"
                      >
                        {m.action.type === 'market_search' && <Search className="w-3 h-3" />}
                        {m.action.type === 'alert_set' && <Bell className="w-3 h-3" />}
                        {m.action.type === 'navigate' && <ExternalLink className="w-3 h-3" />}
                        <span>{m.action.label}</span>
                      </button>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] font-mono mt-1 ${
                      isBot ? 'text-slate-400 dark:text-slate-500' : 'text-emerald-100 text-right'
                    }`}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Listening Live Transcript Banner */}
          {isListening && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 space-y-1.5 animate-pulse">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Listening for voice commands...</span>
                </div>
                <button
                  onClick={toggleListening}
                  className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                >
                  Stop
                </button>
              </div>
              <p className="text-xs italic font-mono bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg text-slate-800 dark:text-slate-200 min-h-7">
                {interimTranscript || 'Say: "Search Bitcoin market" or "Set alert for ETH at 3500"...'}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs py-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span>Analyzing financial parameters...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Command Examples & Prompts */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2 transition-colors">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <Mic className="w-3 h-3 text-emerald-500" />
              <span>Voice Commands Supported</span>
            </div>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400">Web Speech API</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => processVoiceCommand('Search Bitcoin market')}
              className="text-[10px] px-2 py-0.8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-mono cursor-pointer"
            >
              🎙️ "Search Bitcoin market"
            </button>
            <button
              onClick={() => processVoiceCommand('Set alert for Ethereum at $3,500')}
              className="text-[10px] px-2 py-0.8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-mono cursor-pointer"
            >
              🎙️ "Set alert for ETH at 3500"
            </button>
            <button
              onClick={() => processVoiceCommand('Go to Portfolio')}
              className="text-[10px] px-2 py-0.8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-mono cursor-pointer"
            >
              🎙️ "Go to Portfolio"
            </button>
          </div>
        </div>

        {/* Input Bar with Speech Recognition Mic */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop Listening' : 'Use Voice Commands (Web Speech API)'}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-lg shadow-rose-500/30'
                  : speechSupported
                  ? 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-50 cursor-not-allowed border-transparent'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={isListening ? 'Listening to voice...' : 'Type or speak to GROWVEST AI...'}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:border-emerald-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">
            AI Voice Commands: Market Search • Price Alerts • Workspace Navigation
          </div>
        </div>
      </motion.aside>
    </div>
  );
};

