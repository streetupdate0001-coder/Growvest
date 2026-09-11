import React from 'react';

/**
 * Global SVG Sprite Sheet for Growvest
 * Houses reusable SVG symbol definitions across the application to ensure
 * consistent iconography, zero layout shift, and optimal bundle performance.
 */
export const SvgSprite: React.FC = () => {
  return (
    <svg
      id="growvest-svg-sprite"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'none', position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        {/* Growvest Gold Gradient */}
        <linearGradient id="spriteGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="60%" stopColor="#FFC300" />
          <stop offset="100%" stopColor="#E5A800" />
        </linearGradient>

        {/* Growvest Emerald Gradient */}
        <linearGradient id="spriteEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Growvest Dark Obsidian Badge */}
        <linearGradient id="spriteBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1914" />
          <stop offset="100%" stopColor="#040c09" />
        </linearGradient>
      </defs>

      {/* 1. Brand Mark: Geometric 'G' Monogram */}
      <symbol id="growvest-icon-mark" viewBox="0 0 512 512">
        <rect width="512" height="512" rx="116" fill="url(#spriteBgGrad)" />
        <rect x="12" y="12" width="488" height="488" rx="104" fill="none" stroke="#FFD700" strokeWidth="14" strokeOpacity="0.85" />
        <rect x="28" y="28" width="456" height="456" rx="88" fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.7" />
        <path
          d="M 370 172 C 338 134 290 120 242 120 C 168 120 114 180 114 256 C 114 332 168 392 242 392 C 312 392 364 346 376 276 L 242 276 L 242 224 L 396 224 L 396 276 C 380 366 316 424 242 424 C 150 424 82 350 82 256 C 82 162 150 88 242 88 C 304 88 360 108 402 152 Z"
          fill="url(#spriteGoldGrad)"
          stroke="#FFFBEB"
          strokeWidth="4"
          strokeOpacity="0.4"
        />
        <path
          d="M 268 276 L 320 224 L 372 276"
          fill="none"
          stroke="#10b981"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="396" cy="120" r="30" fill="#FFD700" stroke="#D97706" strokeWidth="6" />
        <circle cx="396" cy="120" r="14" fill="#FFFFFF" opacity="0.8" />
      </symbol>

      {/* 2. Security Shield */}
      <symbol id="growvest-icon-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" stroke="#10b981" strokeWidth="2" />
      </symbol>

      {/* 3. Hardware Lock */}
      <symbol id="growvest-icon-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </symbol>

      {/* 4. Multi-Asset Wallet */}
      <symbol id="growvest-icon-wallet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        <circle cx="18" cy="14" r="1" fill="#FFC300" />
      </symbol>

      {/* 5. Trending Growth Chart */}
      <symbol id="growvest-icon-trending" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </symbol>

      {/* 6. Verified Audit Checkmark */}
      <symbol id="growvest-icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </symbol>

      {/* 7. Institutional Star */}
      <symbol id="growvest-icon-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </symbol>

      {/* 8. Notification Bell */}
      <symbol id="growvest-icon-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </symbol>

      {/* 9. Global Jurisdiction Network */}
      <symbol id="growvest-icon-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </symbol>

      {/* 10. Copy to Clipboard */}
      <symbol id="growvest-icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </symbol>

      {/* 11. Private Client Profile */}
      <symbol id="growvest-icon-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </symbol>

      {/* 12. Chevron Down */}
      <symbol id="growvest-icon-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </symbol>

      {/* 13. Institutional Search */}
      <symbol id="growvest-icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" x2="16.65" y1="21" y2="16.65" />
      </symbol>

      {/* 14. Algorithmic AI Sparkles */}
      <symbol id="growvest-icon-sparkles" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" fill="url(#spriteGoldGrad)" stroke="none" />
      </symbol>

      {/* 15. Outflow / Withdrawal Arrow */}
      <symbol id="growvest-icon-arrow-up-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </symbol>

      {/* 16. Inflow / Deposit Arrow */}
      <symbol id="growvest-icon-arrow-down-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="17" y1="7" x2="7" y2="17" />
        <polyline points="17 17 7 17 7 7" />
      </symbol>
    </svg>
  );
};
