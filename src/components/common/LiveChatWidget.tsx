import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Clock,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Bell,
  BellRing,
  Bot,
  Zap,
  Volume2,
  RefreshCw,
  Send as TelegramIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { smartsuppService, SmartsuppStats } from '../../services/smartsuppService';

interface ChatMessage {
  id: string;
  sender: 'advisor' | 'user' | 'system';
  text: string;
  timestamp: string;
  actionType?: 'telegram' | 'whatsapp' | 'deposit' | 'invest' | 'faq' | 'push';
  agentName?: string;
}

const TELEGRAM_NUMBER = '447900413315'; // +44 79 0041 3315
const TELEGRAM_DISPLAY = '+44 79 0041 3315';

export const LiveChatWidget: React.FC = () => {
  const { t, setDepositModalOpen, setActiveTab, setIsAiAssistantOpen, addNotification } = useApp();
  const { user, isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveChatTab] = useState<'chat' | 'telegram' | 'smartsupp_tools'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showIdleTooltip, setShowIdleTooltip] = useState(false);
  const [pushStatus, setPushStatus] = useState<NotificationPermission>('default');
  const [pushBannerDismissed, setPushBannerDismissed] = useState(false);
  const [aiMode, setAiMode] = useState<boolean>(true);
  const [telemetry, setTelemetry] = useState<SmartsuppStats>(smartsuppService.getLiveTelemetry());

  const lastActivityRef = useRef<number>(Date.now());
  const hasTriggeredIdleRef = useRef<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg_init_1',
      sender: 'advisor',
      agentName: 'Marcus Lindberg (Senior Advisor)',
      text: `Hello ${user?.firstName ? user.firstName : 'there'}! Welcome to GROWVEST 24/7 Institutional Live Support. How can we assist you with investment strategies, deposits, or account verification today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Idle tracking for proactive welcome message (> 30s idle on dashboard)
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

    const idleInterval = setInterval(() => {
      if (hasTriggeredIdleRef.current || isOpen) return;

      const idleDurationMs = Date.now() - lastActivityRef.current;
      // Trigger after 30 seconds of inactivity
      if (idleDurationMs >= 30000) {
        hasTriggeredIdleRef.current = true;
        const name = user?.firstName || 'there';
        const welcomeText = `👋 Hello ${name}! We noticed you've been reviewing your dashboard. Would you like quick assistance selecting an investment strategy, verifying your account, or funding your wallet?`;

        const idleMsg: ChatMessage = {
          id: `msg_idle_${Date.now()}`,
          sender: 'advisor',
          agentName: 'Marcus Lindberg (Senior Advisor)',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, idleMsg]);
        setHasUnread(true);
        setShowIdleTooltip(true);

        smartsuppService.triggerAgentResponseNotification(
          'Marcus Lindberg (Senior Advisor)',
          `Hi ${name}! Can I assist you with your dashboard portfolio or deposits?`
        );
      }
    }, 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(idleInterval);
    };
  }, [isOpen, user]);

  // Initialize Smartsupp on mount
  useEffect(() => {
    smartsuppService.init();
    setPushStatus(smartsuppService.getPushPermissionStatus());

    if (isAuthenticated && user) {
      smartsuppService.identifyUser({
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        balanceUsd: 0,
        accountStatus: user.accountStatus,
        country: user.country
      });
    }

    const unsubscribe = smartsuppService.on((event, data) => {
      if (event === 'notification-clicked' || event === 'chat:opened') {
        setIsOpen(true);
        setShowIdleTooltip(false);
      }
      if (event === 'message:received' && data) {
        setMessages(prev => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            sender: 'advisor',
            agentName: data.agent?.name || 'Senior Advisor',
            text: data.text || 'Thank you for waiting, I am checking this for you now.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (!isOpen) setHasUnread(true);
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated, user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages, isTyping]);

  const handleEnablePush = async () => {
    const res = await smartsuppService.requestPushNotificationPermission();
    setPushStatus(res);
    if (res === 'granted') {
      addNotification({
        type: 'system',
        title: 'Push Notifications Active',
        message: 'You will now receive instant push alerts whenever an advisor replies!'
      });
      // Fire a confirmation test notification
      smartsuppService.triggerAgentResponseNotification(
        'Smartsupp Live Desk',
        'Push notifications enabled! You will now stay updated even when the app is closed.'
      );
    }
  };

  const openTelegram = (customText?: string) => {
    const defaultText = customText || (
      isAuthenticated && user
        ? `Hello GreenEza Support Desk, I am ${user.firstName} ${user.lastName} (${user.email}). I would like to inquire about investment strategies and deposit assistance.`
        : `Hello GreenEza Support Desk, I would like to inquire about your investment portfolios and deposit options.`
    );
    const encoded = encodeURIComponent(defaultText);
    // Link directly to Telegram with international phone number +44 79 0041 3315
    const url = `https://t.me/+${TELEGRAM_NUMBER}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Smart institutional auto-responder & agent response simulation
    setTimeout(() => {
      let reply = "Thank you for reaching out to GreenEza Smartsupp Support. An institutional advisor is reviewing your request.";
      const lower = text.toLowerCase();

      if (lower.includes('deposit') || lower.includes('proof') || lower.includes('payment') || lower.includes('screenshot') || lower.includes('fund')) {
        reply = "For deposits: You can transfer funds to our company vault address and attach your payment receipt/screenshot directly in the 'Deposit Funds' modal. Once attached, our financial desk verifies transactions rapidly within 15–30 minutes.";
      } else if (lower.includes('invest') || lower.includes('strategy') || lower.includes('yield') || lower.includes('plan') || lower.includes('roi')) {
        reply = "GROWVEST offers diversified algorithmic strategies ranging from Liquid Short-Term Alpha to Multi-Strategy Growth (12.4% - 24.8% p.a.). You can allocate capital directly via the 'Invest' tab or connect with an advisor on Telegram.";
      } else if (lower.includes('withdraw') || lower.includes('payout') || lower.includes('cashout')) {
        reply = "Withdrawals are processed securely from segregated cold-storage enclaves with strict multi-sig oversight, typically confirmed within 15-45 minutes after two-factor authorization.";
      } else if (lower.includes('telegram') || lower.includes('whatsapp') || lower.includes('human') || lower.includes('agent') || lower.includes('call') || lower.includes('talk')) {
        reply = "You can chat directly with your dedicated Senior Wealth Specialist on Telegram (+44 79 0041 3315) for instant 1-on-1 assistance. Click the blue Telegram button above!";
      } else if (lower.includes('smartsupp') || lower.includes('notification') || lower.includes('push')) {
        reply = "Smartsupp push notifications are active! When an advisor responds, you receive an immediate browser alert so you never miss an update, even if you close the tab.";
      } else {
        reply = "Thank you for your message. Our Senior Portfolio Desk is on standby to assist you with any questions regarding deposits, portfolios, or identity verification.";
      }

      const agentReply: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'advisor',
        agentName: 'Marcus Lindberg (Senior Advisor)',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentReply]);
      setIsTyping(false);

      // Trigger Web Push Notification if app is in background or permission is granted
      smartsuppService.triggerAgentResponseNotification('Marcus Lindberg', reply);
    }, 850);
  };

  const sendQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (prompt.includes('deposit')) {
        reply = "To deposit: Open the 'Deposit Funds' window, choose your crypto network (BTC, ETH, USDT, SOL), send to the generated company vault, and attach your transaction screenshot for rapid settlement.";
      } else if (prompt.includes('invest')) {
        reply = "To invest: Navigate to the 'Invest' tab to explore our vetted portfolios, or connect with our executive advisor on Telegram (+44 79 0041 3315) for institutional guidance.";
      } else if (prompt.includes('verification') || prompt.includes('KYC')) {
        reply = "Identity verification is available in your Profile under KYC Tier-1 & Tier-2. You can upload proof of identity and address for elevated transaction limits.";
      } else {
        reply = "We are here to assist! Would you like to chat directly with our Senior Portfolio Desk on Telegram for immediate confirmation?";
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg_a_${Date.now()}`,
          sender: 'advisor',
          agentName: 'Elena Rostova (Compliance Desk)',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
      smartsuppService.triggerAgentResponseNotification('Elena Rostova', reply);
    }, 800);
  };

  return (
    <>
      {/* 1. One-Click Contact Floating Launcher & Proactive Idle Bubble */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 pointer-events-none">
          {/* Proactive Idle Welcome Bubble */}
          {showIdleTooltip && (
            <div className="pointer-events-auto p-3.5 max-w-xs bg-white dark:bg-[#121216] text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-300 relative text-left">
              <button
                onClick={() => setShowIdleTooltip(false)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Senior Advisory Desk</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug">
                Need guidance setting up your portfolio, funding your account, or checking daily yield?
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowIdleTooltip(false);
                    setIsOpen(true);
                    smartsuppService.openChat();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#ff4d38] hover:bg-[#e03e2a] text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                >
                  Chat with Advisor
                </button>
                <button
                  onClick={() => setShowIdleTooltip(false)}
                  className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <button
            id="smartsupp-one-click-trigger"
            onClick={() => {
              setShowIdleTooltip(false);
              setIsOpen(true);
              smartsuppService.openChat();
            }}
            className="pointer-events-auto p-3.5 sm:p-4 rounded-full bg-[#121216] hover:bg-[#1c1c22] text-white shadow-2xl shadow-black/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2.5 group border border-white/20"
            title="One-Click Contact: Tap to reach 24/7 Smartsupp Live Support"
            aria-label="Open Smartsupp Live Support Chat"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff4d38] rounded-full border-2 border-[#121216] animate-pulse" />
            </div>
            <span className="hidden sm:inline-block font-bold text-xs tracking-wide text-slate-100">
              Live Support
            </span>
            {hasUnread && (
              <span className="absolute -top-1.5 -left-1.5 px-2 py-0.5 rounded-full bg-[#ff4d38] text-white text-[10px] font-black border-2 border-[#121216] animate-bounce">
                1
              </span>
            )}
          </button>
        </div>
      )}

      {/* 2. Smartsupp Live Chat Window */}
      {isOpen && (
        <div
          id="smartsupp-live-chat-modal"
          className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-50 w-full sm:w-[410px] h-[100dvh] sm:h-[620px] max-h-[100dvh] sm:max-h-[85vh] bg-white dark:bg-[#121216] border-0 sm:border border-slate-200 dark:border-white/10 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-slate-900 dark:bg-[#0c0c10] text-white border-b border-slate-800 dark:border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-emerald-400 font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight text-white">Smartsupp Support</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-white/10 text-emerald-300 border border-white/10">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span>Average response:</span>
                  <span className="font-mono text-emerald-300 font-bold">&lt; 1 min</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-header Navigation: Live Chat vs Telegram vs AI Tools */}
          <div className="grid grid-cols-3 p-1.5 bg-slate-100 dark:bg-[#0c0c10] border-b border-slate-200 dark:border-white/10 shrink-0 text-xs font-semibold">
            <button
              onClick={() => setActiveChatTab('chat')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-[#1c1c22] text-emerald-600 dark:text-emerald-400 shadow-xs font-bold border border-transparent dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat</span>
            </button>

            <button
              onClick={() => setActiveChatTab('telegram')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'telegram'
                  ? 'bg-white dark:bg-[#1c1c22] text-sky-500 dark:text-sky-400 shadow-xs font-bold border border-transparent dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TelegramIcon className="w-3.5 h-3.5 text-sky-500" />
              <span>Telegram</span>
            </button>

            <button
              onClick={() => setActiveChatTab('smartsupp_tools')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'smartsupp_tools'
                  ? 'bg-white dark:bg-[#1c1c22] text-emerald-600 dark:text-emerald-400 shadow-xs font-bold border border-transparent dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Tools</span>
            </button>
          </div>

          {/* TAB 1: Live Chat Conversation */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-[#121216]">
              {/* Push Notification Banner */}
              {pushStatus !== 'granted' && !pushBannerDismissed && (
                <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-start justify-between gap-2.5 shrink-0 text-left">
                  <div className="flex items-start gap-2 text-xs">
                    <BellRing className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Enable Push Notifications
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                        Keep updated when an agent responds. No need to keep the app open!
                      </p>
                      <button
                        onClick={handleEnablePush}
                        className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors cursor-pointer shadow-xs"
                      >
                        <Bell className="w-3 h-3" />
                        <span>Allow Push Alerts</span>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setPushBannerDismissed(true)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                {messages.map(msg => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      {!isUser && msg.agentName && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mb-1 ml-1 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{msg.agentName}</span>
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs shadow-md shadow-emerald-500/20'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 italic py-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Advisor is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="px-3 py-2 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#121216] shrink-0 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
                <button
                  onClick={() => sendQuickPrompt('How do I submit proof for my deposit?')}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-[#1c1c22] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  Deposit Assistance
                </button>
                <button
                  onClick={() => sendQuickPrompt('What are the high-yield investment options?')}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-[#1c1c22] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  Investment Plans
                </button>
                <button
                  onClick={() => sendQuickPrompt('How long does KYC verification take?')}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-[#1c1c22] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  KYC Verification
                </button>
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white dark:bg-[#121216] border-t border-slate-200 dark:border-white/10 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Type message to live advisor..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-white/30"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-[#ff4d38] hover:bg-[#e03e2a] disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Telegram Hotline */}
          {activeTab === 'telegram' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-[#121216] text-slate-800 dark:text-slate-200 text-xs">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2 text-center">
                <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30">
                  <TelegramIcon className="w-6 h-6 ml-0.5" />
                </div>
                <h4 className="font-bold text-sm text-sky-800 dark:text-sky-300">
                  Telegram Direct Desk
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Direct encrypted connection with our Senior Portfolio Desk on Telegram. Instant messaging, deposit confirmation, and 24/7 dedicated assistance.
                </p>
                <div className="pt-2 font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {TELEGRAM_DISPLAY}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => openTelegram('Hello! I would like priority assistance with depositing to my account.')}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 hover:border-sky-500 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">Deposit & Wire Verification</div>
                    <div className="text-[11px] text-slate-500">Send screenshot and get rapid approval</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-sky-500 shrink-0" />
                </button>

                <button
                  onClick={() => openTelegram('Hello! I would like institutional portfolio guidance for high-yield allocations.')}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 hover:border-sky-500 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">Custom Strategy Allocation</div>
                    <div className="text-[11px] text-slate-500">Speak directly with Head of Trading</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-sky-500 shrink-0" />
                </button>
              </div>

              <button
                onClick={() => openTelegram()}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-500/30 transition-colors cursor-pointer"
              >
                <TelegramIcon className="w-4 h-4" />
                <span>Open Telegram Chat Now</span>
              </button>
            </div>
          )}

          {/* TAB 3: Enterprise AI Tools & Statistics */}
          {activeTab === 'smartsupp_tools' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-[#121216] text-slate-800 dark:text-slate-200 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">Enterprise AI & Support Engine</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Unified omnichannel access to your portfolio advisors, real-time ticket desk, and automated intelligence tools.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-center font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10">
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{telemetry.averageResponseTimeSeconds}s</div>
                    <div className="text-[10px] text-slate-500">Avg SLA Response</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{telemetry.pushNotificationsDelivered}</div>
                    <div className="text-[10px] text-slate-500">Pushes Delivered</div>
                  </div>
                </div>
              </div>

              {/* Push notification settings */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1c1c22] border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span>Push Notification Service</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {pushStatus === 'granted' ? 'Enabled' : 'Pending Permission'}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Keep visitors in the loop with instant alerts when an agent responds. No need to keep the app open to stay updated.
                </p>
                <button
                  onClick={handleEnablePush}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-100 dark:bg-black/40 hover:bg-white/10 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>{pushStatus === 'granted' ? 'Send Test Push Alert' : 'Enable Push Notifications'}</span>
                </button>
              </div>

              {/* AI Assistant Drawer Trigger */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsAiAssistantOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-[#ff4d38] hover:bg-[#e03e2a] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#ff4d38]/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Interactive AI Copilot</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
