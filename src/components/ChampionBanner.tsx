import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChampionBannerProps {
  name: string;
  accent: 'pink' | 'cyan';
  leadMargin?: number;
  subtitle?: string;
}

export function ChampionBanner({ 
  name, 
  accent, 
  leadMargin, 
  subtitle = 'Current Champion' 
}: ChampionBannerProps) {
  const isPink = accent === 'pink';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        relative overflow-hidden
        rounded-2xl
        border-2 ${isPink ? 'border-accent-pink' : 'border-accent-cyan'}
        bg-bg-surface/80 backdrop-blur-lg
        p-6 text-center
        ${isPink ? 'shadow-glow-pink' : 'shadow-glow-cyan'}
      `}
    >
      {/* Animated glow background */}
      <motion.div
        className={`
          absolute inset-0 
          ${isPink 
            ? 'bg-gradient-radial from-accent-pink/20 via-transparent to-transparent' 
            : 'bg-gradient-radial from-accent-cyan/20 via-transparent to-transparent'
          }
        `}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ 
          background: isPink 
            ? 'radial-gradient(circle at 50% 50%, rgba(255,0,255,0.15) 0%, transparent 70%)' 
            : 'radial-gradient(circle at 50% 50%, rgba(0,240,255,0.15) 0%, transparent 70%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-label uppercase tracking-widest text-text-muted">
            {subtitle}
          </span>
        </div>
        
        {/* Champion Name */}
        <h2 
          className={`
            font-display text-display-lg uppercase tracking-wider
            ${isPink ? 'text-accent-pink' : 'text-accent-cyan'}
          `}
          style={{
            textShadow: isPink 
              ? '0 0 30px var(--accent-pink-glow)' 
              : '0 0 30px var(--accent-cyan-glow)'
          }}
        >
          {name}
        </h2>
        
        {/* Crown */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-3"
        >
          <Crown 
            size={40} 
            className={isPink ? 'text-accent-pink mx-auto' : 'text-accent-cyan mx-auto'}
            style={{
              filter: isPink 
                ? 'drop-shadow(0 0 10px var(--accent-pink-glow))' 
                : 'drop-shadow(0 0 10px var(--accent-cyan-glow))'
            }}
          />
        </motion.div>
        
        {/* Lead margin */}
        {leadMargin !== undefined && leadMargin > 0 && (
          <div className={`
            mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full
            ${isPink ? 'bg-accent-pink/20 text-accent-pink' : 'bg-accent-cyan/20 text-accent-cyan'}
            text-caption font-semibold
          `}>
            +{leadMargin} lead
          </div>
        )}
      </div>
    </motion.div>
  );
}
