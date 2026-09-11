import React from 'react';

export type GrowvestIconName =
  | 'mark'
  | 'shield'
  | 'lock'
  | 'wallet'
  | 'trending'
  | 'check'
  | 'star'
  | 'bell'
  | 'globe'
  | 'copy'
  | 'user'
  | 'chevron-down'
  | 'search'
  | 'sparkles'
  | 'arrow-up-right'
  | 'arrow-down-left';

export interface GrowvestIconProps extends React.SVGProps<SVGSVGElement> {
  name: GrowvestIconName;
  size?: number | string;
  className?: string;
}

/**
 * GrowvestIcon Component
 * Renders high-performance vector icons referencing the global SVG Sprite sheet.
 */
export const GrowvestIcon: React.FC<GrowvestIconProps> = ({
  name,
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      className={`shrink-0 inline-block align-middle transition-colors ${className}`}
      aria-hidden="true"
      {...props}
    >
      <use href={`#growvest-icon-${name}`} />
    </svg>
  );
};
