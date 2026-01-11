import { motion } from 'framer-motion';

interface ChampionHeroProps {
  championName: string;
  leadCount: number;
  accent?: 'pink' | 'cyan';
}

export function ChampionHero({ championName, leadCount, accent = 'pink' }: ChampionHeroProps) {
  const isPositiveLead = leadCount > 0;
  const leadDisplay = isPositiveLead ? `+${leadCount}` : leadCount === 0 ? 'TIED' : `${leadCount}`;

  return (
    <motion.div 
      className="relative text-center py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background glow effect */}
      <div 
        className={`
          absolute inset-0 blur-3xl opacity-30
          ${accent === 'pink' ? 'bg-neon' : 'bg-accent-cyan'}
        `}
        style={{ transform: 'scale(0.8)' }}
      />
      
      {/* Crown */}
      <motion.div
        className="text-5xl mb-2"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        👑
      </motion.div>

      {/* Champion Name */}
      <motion.h2
        className={`
          font-display text-5xl uppercase text-white tracking-wider
          ${accent === 'pink' ? 'text-glow' : 'text-glow-cyan'}
        `}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {championName}
      </motion.h2>

      {/* Lead Badge */}
      <motion.div
        className={`
          inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full
          ${accent === 'pink' 
            ? 'bg-neon/20 text-neon border border-neon' 
            : 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan'
          }
        `}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <span className="font-heading text-sm uppercase tracking-widest">Current King</span>
        <span className="font-mono font-bold">({leadDisplay})</span>
      </motion.div>
    </motion.div>
  );
}
