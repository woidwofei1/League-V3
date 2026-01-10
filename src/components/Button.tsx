import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-accent-pink text-white
    shadow-glow-pink
    hover:brightness-110
  `,
  secondary: `
    bg-bg-surface text-text-primary
    border border-border-subtle
    hover:border-border-active hover:bg-bg-elevated
  `,
  ghost: `
    bg-transparent text-text-secondary
    hover:text-text-primary hover:bg-bg-surface
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  md: 'px-4 py-2.5 text-body',
  lg: 'px-6 py-3.5 text-body font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-sm font-medium
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
