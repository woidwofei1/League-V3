import type { ReactNode, HTMLAttributes } from 'react';

type CardVariant = 'surface' | 'glass' | 'elevated';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  surface: `
    bg-bg-surface/90 backdrop-blur-sm
    border-border-subtle/50
    shadow-[0_2px_8px_rgba(0,0,0,0.3)]
  `,
  glass: `
    bg-bg-glass backdrop-blur-lg
    border-border-subtle/40
    shadow-[0_4px_16px_rgba(0,0,0,0.2)]
  `,
  elevated: `
    bg-bg-elevated/95 backdrop-blur-sm
    border-border-subtle/30
    shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_1px_rgba(255,255,255,0.05)_inset]
  `,
};

const paddingStyles: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  variant = 'surface',
  children,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
