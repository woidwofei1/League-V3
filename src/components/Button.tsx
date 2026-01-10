import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
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
    bg-gradient-to-r from-accent-pink to-[#d91a6a]
    text-white font-semibold
    shadow-[0_0_20px_var(--accent-pink-glow),0_4px_12px_rgba(0,0,0,0.4)]
    hover:shadow-[0_0_28px_var(--accent-pink-glow),0_4px_16px_rgba(0,0,0,0.5)]
    hover:brightness-110
    active:brightness-95
  `,
  secondary: `
    bg-bg-glass backdrop-blur-sm
    text-text-primary
    border border-border-subtle/60
    hover:bg-bg-surface hover:border-border-active
  `,
  ghost: `
    bg-transparent text-text-secondary
    hover:text-text-primary hover:bg-bg-surface/50
  `,
  danger: `
    bg-accent-danger/10 text-accent-danger
    border border-accent-danger/30
    hover:bg-accent-danger/20 hover:border-accent-danger/50
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
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
      transition={{ duration: 0.08 }}
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-xl font-medium
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
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
