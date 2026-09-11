import { TourStep } from '../../types';

export const PLATFORM_TOUR_STEPS: TourStep[] = [
  {
    id: 'step-welcome',
    targetSelector: '#growvest-navbar',
    fallbackSelector: '#growvest-dashboard-view',
    title: 'Welcome to GROWVEST Global Enclave',
    badge: 'Platform Tour • 1/8',
    description:
      'Experience institutional-grade multi-asset management, real-time cryptocurrency feeds, segregated custodial ledger security, and automated quantitative investment strategies.',
    tip: 'Tip: You can navigate this tour using your keyboard arrow keys [← / →] or jump directly to any step.',
    placement: 'bottom',
    actionText: 'Go to Dashboard',
    actionType: 'navigate_tab',
    targetTab: 'dashboard'
  },
  {
    id: 'step-balance-ledger',
    targetSelector: '#sidebar-balance-card',
    fallbackSelector: '#dashboard-metric-total-nav',
    title: 'Segregated Balance & Net Asset Value',
    badge: 'Capital Ledger • 2/8',
    description:
      'Monitor your Total Net Asset Value (NAV), liquid unencumbered available cash, and actively deployed algorithmic yield capital with live market marking and zero commingling.',
    tip: 'Your portfolio balances are automatically converted to your selected display currency in real time.',
    placement: 'right',
    requiredTab: 'dashboard'
  },
  {
    id: 'step-quick-actions',
    targetSelector: '#sidebar-quick-actions',
    fallbackSelector: '#dashboard-quick-deposit-btn',
    title: 'Instant Multi-Chain & Fiat Operations',
    badge: 'Capital Flow • 3/8',
    description:
      'Seamlessly initiate inbound deposits and outbound withdrawals via SEPA Instant, Wire Transfer, and multi-network crypto rails (BTC, ETH, USDT, SOL, BNB, USDC) with automated cryptographic confirmation.',
    tip: 'Instant settlement addresses and QR codes are generated with multi-signature cold storage protections.',
    placement: 'right',
    actionText: 'View Deposit Channels',
    actionType: 'open_deposit'
  },
  {
    id: 'step-markets',
    targetSelector: '#sidebar-link-markets',
    fallbackSelector: '#nav-tab-markets',
    title: 'Live Global Markets & Trend Sparklines',
    badge: 'Asset Discovery • 4/8',
    description:
      'Track 24-hour volume changes, interactive Recharts sparkline trends, real-time depth, and global market capitalizations across major digital asset pairs and indices.',
    tip: 'Hover over the interactive mini sparklines in the table to inspect exact historical price points.',
    placement: 'right',
    actionText: 'Open Markets View',
    actionType: 'navigate_tab',
    targetTab: 'markets'
  },
  {
    id: 'step-invest',
    targetSelector: '#sidebar-link-invest',
    fallbackSelector: '#nav-tab-invest',
    title: 'Algorithmic Yield & Strategies',
    badge: 'Yield Engine • 5/8',
    description:
      'Deploy capital into institutional investment portfolios ranging from Green Energy Infrastructure to High-Frequency Arbitrage with verified audited daily yields.',
    tip: 'Review historical performance, lockup terms, and risk profiles before allocating capital.',
    placement: 'right',
    actionText: 'Explore Yield Plans',
    actionType: 'navigate_tab',
    targetTab: 'invest'
  },
  {
    id: 'step-ai-assistant',
    targetSelector: '#btn-nav-ai-assistant',
    fallbackSelector: '#btn-nav-ai-assistant',
    title: 'GROWVEST AI Copilot & Analyst',
    badge: 'AI Intelligence • 6/8',
    description:
      'Access 24/7 AI-driven portfolio diagnostic reports, scenario stress tests, market sentiment summaries, and institutional investment guidance at any time.',
    tip: 'Click the AI Guide button at any time to open the intelligent sidebar copilot drawer.',
    placement: 'bottom',
    actionText: 'Launch AI Copilot',
    actionType: 'open_ai'
  },
  {
    id: 'step-currency-lang',
    targetSelector: '#btn-curr-selector',
    fallbackSelector: '#btn-lang-selector',
    title: 'Indicative Currencies & 40+ Languages',
    badge: 'Localization • 7/8',
    description:
      'Seamlessly switch between 12+ indicative global fiat currencies (USD, EUR, GBP, CHF, CAD, AUD, JPY, SGD, AED, etc.) and complete multilingual translations with RTL support.',
    tip: 'All transactions settle securely in USD/Asset while conversions provide real-time indicative valuation.',
    placement: 'bottom',
    actionText: 'Select Currency',
    actionType: 'open_currency'
  },
  {
    id: 'step-security',
    targetSelector: '#sidebar-link-security',
    fallbackSelector: '#btn-user-profile-menu',
    title: 'Institutional Security & Audit Vault',
    badge: 'Security & 2FA • 8/8',
    description:
      'Manage Time-based One-Time Password (TOTP) 2FA, review active sessions and device IPs, view tamper-evident immutable audit logs, and complete Tier-1 identity verification.',
    tip: 'Enable Google Authenticator 2FA in the Security Center to unlock unlimited high-volume withdrawals.',
    placement: 'right',
    actionText: 'Visit Security Center',
    actionType: 'navigate_tab',
    targetTab: 'security'
  }
];
