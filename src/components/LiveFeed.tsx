import { motion } from 'framer-motion';

interface MatchResult {
  winner: string;
  score: string;
  winnerSlug: 'bachi' | 'crimebaker';
}

interface LiveFeedProps {
  matches: MatchResult[];
  maxItems?: number;
}

export function LiveFeed({ matches, maxItems = 5 }: LiveFeedProps) {
  const displayMatches = matches.slice(0, maxItems);

  if (displayMatches.length === 0) {
    return (
      <div className="glass-panel p-4 text-center">
        <p className="text-sm text-slate-500">No matches yet</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <h3 className="text-xs text-slate-400 uppercase tracking-widest">
          Live Feed
        </h3>
      </div>

      <div className="space-y-0">
        {displayMatches.map((match, index) => {
          const opacity = 1 - (index * 0.15);
          const isNeon = match.winnerSlug === 'crimebaker';

          return (
            <motion.div
              key={index}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              style={{ opacity }}
            >
              <span className={`
                font-semibold text-sm
                ${isNeon ? 'text-neon' : 'text-white'}
              `}>
                {match.winner}
              </span>
              <span className={`
                font-mono text-sm font-bold
                ${isNeon ? 'text-neon' : 'text-accent-cyan'}
              `}>
                {match.score}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Fade overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)'
        }}
      />
    </div>
  );
}
