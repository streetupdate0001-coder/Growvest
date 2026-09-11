import React, { useId } from 'react';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark-only' | 'text-only';
  className?: string;
  themeMode?: 'auto' | 'light' | 'dark';
  onClick?: () => void;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  themeMode = 'auto',
  onClick,
  showTagline = false
}) => {
  const uniqueId = useId().replace(/:/g, '');

  // Dimension mappings - enhanced for clear optical visibility and prominence
  const markDimensions = {
    xs: { box: 26 },
    sm: { box: 34 },
    md: { box: 42 },
    lg: { box: 52 },
    xl: { box: 64 }
  };

  const textStyles = {
    xs: 'text-sm font-black tracking-tight',
    sm: 'text-lg sm:text-xl font-black tracking-tight',
    md: 'text-xl sm:text-2xl font-black tracking-tight',
    lg: 'text-2xl sm:text-3xl font-black tracking-tight',
    xl: 'text-3xl sm:text-4xl font-black tracking-tight'
  };

  const taglineStyles = {
    xs: 'text-[7.5px] tracking-[0.24em]',
    sm: 'text-[8.5px] tracking-[0.26em]',
    md: 'text-[9.5px] tracking-[0.28em]',
    lg: 'text-[11px] tracking-[0.30em]',
    xl: 'text-[12px] tracking-[0.32em]'
  };

  const { box } = markDimensions[size];

  // Theme-aware text coloring with guaranteed high-contrast fallbacks
  const textClass =
    themeMode === 'dark'
      ? 'text-white'
      : themeMode === 'light'
      ? 'text-slate-950'
      : 'text-slate-950 dark:text-white';

  const subTextClass =
    themeMode === 'dark'
      ? 'text-emerald-400'
      : themeMode === 'light'
      ? 'text-emerald-700'
      : 'text-emerald-700 dark:text-emerald-400';

  // High-clarity, self-contained SVG emblem with rich gradients and sharp edges
  const renderMark = () => {
    const goldGradId = `gv-gold-${uniqueId}`;
    const bgGradId = `gv-bg-${uniqueId}`;
    const emeraldGradId = `gv-emerald-${uniqueId}`;

    return (
      <svg
        width={box}
        height={box}
        viewBox="0 0 512 512"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
        aria-hidden="true"
        style={{
          filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.25))'
        }}
      >
        <defs>
          {/* Luminous Gold Gradient */}
          <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="25%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#FFB700" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Deep Obsidian-Emerald Shield Background */}
          <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a231b" />
            <stop offset="60%" stopColor="#061611" />
            <stop offset="100%" stopColor="#020806" />
          </linearGradient>

          {/* Vivid Emerald Gradient for Growth Chevron */}
          <linearGradient id={emeraldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Outer Squircle Container with Soft Bevel */}
        <rect
          width="512"
          height="512"
          rx="116"
          fill={`url(#${bgGradId})`}
        />

        {/* High-Visibility Golden Rim */}
        <rect
          x="12"
          y="12"
          width="488"
          height="488"
          rx="104"
          fill="none"
          stroke="#FFD700"
          strokeWidth="14"
          strokeOpacity="0.85"
        />

        {/* Inner Neon Emerald Guide Stroke */}
        <rect
          x="28"
          y="28"
          width="456"
          height="456"
          rx="88"
          fill="none"
          stroke={`url(#${emeraldGradId})`}
          strokeWidth="8"
          strokeOpacity="0.75"
        />

        {/* Iconic Geometric 'G' Monogram in Brilliant Gold */}
        <path
          d="M 370 172 C 338 134 290 120 242 120 C 168 120 114 180 114 256 C 114 332 168 392 242 392 C 312 392 364 346 376 276 L 242 276 L 242 224 L 396 224 L 396 276 C 380 366 316 424 242 424 C 150 424 82 350 82 256 C 82 162 150 88 242 88 C 304 88 360 108 402 152 Z"
          fill={`url(#${goldGradId})`}
          stroke="#FFFBEB"
          strokeWidth="4"
          strokeOpacity="0.4"
        />

        {/* Vibrant Growth Chevron Arrow Accent */}
        <path
          d="M 268 276 L 320 224 L 372 276"
          fill="none"
          stroke={`url(#${emeraldGradId})`}
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Signature Golden Wealth Node */}
        <circle
          cx="396"
          cy="120"
          r="30"
          fill="#FFE600"
          stroke="#D97706"
          strokeWidth="6"
        />
        <circle
          cx="396"
          cy="120"
          r="14"
          fill="#FFFFFF"
          opacity="0.8"
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {variant !== 'text-only' && renderMark()}

      {variant !== 'mark-only' && (
        <div className="flex flex-col text-left leading-none">
          <span className={`font-sans ${textStyles[size]} ${textClass} font-black transition-colors inline-flex items-baseline`}>
            <span className={`font-sans font-black tracking-tight ${textClass} transition-colors drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_1px_8px_rgba(255,255,255,0.18)]`}>
              Growvest
            </span>
            {/* Precision Optical Gold Dot (#FFC300) with subtle ambient luminescence */}
            <span
              className="inline-block rounded-full bg-[#FFC300] ml-[0.1em] align-baseline shrink-0"
              style={{
                width: '0.24em',
                height: '0.24em',
                transform: 'translateY(-0.06em)',
                boxShadow: '0 0 10px rgba(255, 195, 0, 0.85)'
              }}
              aria-hidden="true"
            />
          </span>
          {showTagline && (
            <span className={`font-mono uppercase font-bold mt-1 ${taglineStyles[size]} ${subTextClass}`}>
              GLOBAL WEALTH PLATFORM
            </span>
          )}
        </div>
      )}
    </div>
  );
};
