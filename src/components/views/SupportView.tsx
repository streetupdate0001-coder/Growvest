import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  RefreshCw,
  Compass,
  Phone,
  Bell,
  BellRing,
  Zap,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { smartsuppService, SmartsuppStats } from '../../services/smartsuppService';

export const SupportView: React.FC = () => {
  const { setIsAiAssistantOpen, addNotification, startTour } = useApp();
  const { user } = useAuth();

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('general');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [pushStatus, setPushStatus] = useState<NotificationPermission>('default');
  const [telemetry, setTelemetry] = useState<SmartsuppStats>(smartsuppService.getLiveTelemetry());

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    setPushStatus(smartsuppService.getPushPermissionStatus());
  }, []);

  const handleEnablePush = async () => {
    const res = await smartsuppService.requestPushNotificationPermission();
    setPushStatus(res);
    if (res === 'granted') {
      addNotification({
        type: 'system',
        title: 'Push Notifications Enabled',
        message: 'You will receive instant alerts when a live support agent responds!'
      });
      smartsuppService.triggerAgentResponseNotification(
        'Institutional Advisor Desk',
        'Push notifications enabled. You are now connected to real-time agent updates.'
      );
    }
  };

  const handleOpenSmartsupp = () => {
    smartsuppService.openChat();
  };

  const faqs = [
    {
      q: 'How are client assets safeguarded at GROWVEST?',
      a: 'Client fiat and digital assets are maintained in segregated institutional cold custody utilizing multi-signature MPC (Multi-Party Computation) and hardware security modules (HSMs). Assets are never commingled or lent without explicit customer strategy mandate.'
    },
    {
      q: 'What are the settlement times for deposits and withdrawals?',
      a: 'Crypto deposits typically clear within 2-30 minutes depending on network confirmations. SEPA Instant fiat deposits settle in real-time or within 1 business day. Withdrawals undergo automated 2FA validation and are dispatched immediately to blockchain mempools.'
    },
    {
      q: 'Are there hidden trading spreads or management fees?',
      a: 'No. GROWVEST maintains a strict zero-hidden-fee policy. All platform and network costs are shown before transaction confirmation, with full fee tables published in our Transparency Center.'
    },
    {
      q: 'How do Instant Push Notifications keep me updated?',
      a: 'When an advisor or compliance specialist answers your support thread, a secure browser notification alerts you immediately with the message summary. You do not need to keep the browser tab open to stay informed.'
    },
    {
      q: 'What does the DEMO PLAN label indicate?',
      a: 'Strategies marked DEMO PLAN represent simulated institutional model portfolios used for sandbox backtesting and user evaluation. They carry zero financial liability until formal institutional account execution.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const tid = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicketId(tid);
      addNotification({
        type: 'system',
        title: `Support Ticket Dispatched: #${tid}`,
        message: `Your inquiry regarding "${ticketSubject}" has been assigned to our institutional desk.`
      });
      setTicketSubject('');
      setTicketMessage('');
    }, 1000);
  };

  return (
    <div id="growvest-support-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-xl transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              Institutional Support & Help Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              INSTITUTIONAL 24/7 SLA
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Dedicated human support representatives, instant live advisor chat, and AI financial assistance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-support-start-tour"
            onClick={() => startTour(0)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Compass className="w-4 h-4 text-emerald-500" />
            <span>Platform Tour</span>
          </button>

          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* One-Click Contact & Smartsupp AI Tools Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: One-Click Contact */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm tracking-tight">One-Click Contact</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Your users are a tap away from reaching your support via Telegram or live chat.
            </p>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleOpenSmartsupp}
              className="w-full py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Launch Live Chat Now</span>
            </button>
            <a
              href="https://t.me/Greenvillesfx90"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-xl bg-[#2AABEE] hover:bg-[#229ed9] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Open Telegram Chat Now</span>
            </a>
          </div>
        </div>

        {/* Box 2: Push Notifications */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <BellRing className="w-5 h-5" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                pushStatus === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
                {pushStatus === 'granted' ? 'PUSH ACTIVE' : 'PUSH READY'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Push Notifications</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Keep your visitors in the loop with push notifications when an agent responds. They don’t need to keep the app open to stay updated.
            </p>
          </div>
          <button
            onClick={handleEnablePush}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>{pushStatus === 'granted' ? 'Push Alert Verified' : 'Enable Push Notifications'}</span>
          </button>
        </div>

        {/* Box 3: Run AI tools & Multi-Channel Support */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Enterprise AI & Support Tools</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              One unified setup with full access to your portfolio advisors, ticket history, and real-time response analytics.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
            <span>Average SLA: <strong className="text-emerald-600 dark:text-emerald-400">&lt; 42s</strong></span>
            <span>Satisfaction: <strong className="text-emerald-600 dark:text-emerald-400">99.2%</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Submission Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Submit Support Inquiry</span>
          </h3>

          {submittedTicketId ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Ticket Created: #{submittedTicketId}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                An institutional support representative will review your message within 15 minutes.
              </p>
              <button
                onClick={() => setSubmittedTicketId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs cursor-pointer transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Inquiry Category</label>
                <select
                  value={ticketCategory}
                  onChange={e => setTicketCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs"
                >
                  <option value="general">General Platform Inquiry</option>
                  <option value="deposit">Deposit & Inbound Settlement</option>
                  <option value="withdraw">Withdrawal & Payout Authorization</option>
                  <option value="security">2FA / Security Center Assistance</option>
                  <option value="compliance">KYC / AML Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  placeholder="e.g. Inbound deposit confirmation question"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  value={ticketMessage}
                  onChange={e => setTicketMessage(e.target.value)}
                  placeholder="Describe your inquiry or question with relevant details..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Support Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Institutional FAQs */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {expandedFaq === i && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
