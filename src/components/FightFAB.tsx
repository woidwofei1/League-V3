import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FightFABProps {
  to: string;
  label?: string;
}

export function FightFAB({ to, label = 'FIGHT' }: FightFABProps) {
  return (
    <Link to={to}>
      <motion.button
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          px-8 py-4 rounded-full
          bg-neon text-black font-black uppercase tracking-wider
          shadow-[0_0_20px_#ff00ff,0_0_40px_#ff00ff50]
          hover:shadow-[0_0_30px_#ff00ff,0_0_60px_#ff00ff80]
          transition-shadow duration-300
          text-lg
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {label}
      </motion.button>
    </Link>
  );
}
