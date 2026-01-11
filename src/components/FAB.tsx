import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FABProps {
  to?: string;
  onClick?: () => void;
  label?: string;
}

export function FAB({ to = '/match/new', onClick, label = 'Log Match' }: FABProps) {
  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="
        w-16 h-16 rounded-full
        bg-gradient-to-br from-accent-pink to-accent-pink-soft
        flex items-center justify-center
        shadow-glow-pink-strong
        cursor-pointer
        relative
        overflow-hidden
      "
    >
      {/* Pulse animation overlay */}
      <motion.div
        className="absolute inset-0 rounded-full bg-accent-pink"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <Plus size={28} className="text-white relative z-10" strokeWidth={2.5} />
      
      {/* Screen reader label */}
      <span className="sr-only">{label}</span>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="
          fixed z-50
          bottom-[calc(70px+env(safe-area-inset-bottom,0px)+16px)]
          left-1/2 -translate-x-1/2
        "
        aria-label={label}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className="
        fixed z-50
        bottom-[calc(70px+env(safe-area-inset-bottom,0px)+16px)]
        left-1/2 -translate-x-1/2
      "
      aria-label={label}
    >
      {buttonContent}
    </Link>
  );
}
