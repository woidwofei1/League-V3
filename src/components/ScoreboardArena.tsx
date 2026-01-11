import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Player {
  name: string;
  wins: number;
  accent: 'pink' | 'cyan';
}

interface ScoreboardArenaProps {
  player1: Player;
  player2: Player;
}

export function ScoreboardArena({ player1, player2 }: ScoreboardArenaProps) {
  const total = player1.wins + player2.wins;
  const p1Percent = total > 0 ? (player1.wins / total) * 100 : 50;
  const p2Percent = total > 0 ? (player2.wins / total) * 100 : 50;

  const [animatedP1, setAnimatedP1] = useState(0);
  const [animatedP2, setAnimatedP2] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 20;
    const stepTime = duration / steps;
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnimatedP1(Math.round((step / steps) * player1.wins));
      setAnimatedP2(Math.round((step / steps) * player2.wins));
      if (step >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [player1.wins, player2.wins]);

  return (
    <div className="glass-panel p-6">
      {/* Score Display */}
      <div className="flex items-center justify-center gap-4">
        {/* Player 1 */}
        <div className="flex-1 text-center">
          <p className="font-display text-lg uppercase text-slate-400 mb-1">
            {player1.name}
          </p>
          <motion.p
            key={player1.wins}
            className={`
              font-mono text-6xl font-bold tabular-nums
              ${player1.accent === 'pink' ? 'text-neon text-glow' : 'text-accent-cyan text-glow-cyan'}
            `}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {animatedP1}
          </motion.p>
        </div>

        {/* VS Divider */}
        <div className="relative">
          <motion.span
            className="font-display text-2xl text-neon text-glow"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            VS
          </motion.span>
        </div>

        {/* Player 2 */}
        <div className="flex-1 text-center">
          <p className="font-display text-lg uppercase text-slate-400 mb-1">
            {player2.name}
          </p>
          <motion.p
            key={player2.wins}
            className={`
              font-mono text-6xl font-bold tabular-nums
              ${player2.accent === 'pink' ? 'text-neon text-glow' : 'text-accent-cyan text-glow-cyan'}
            `}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {animatedP2}
          </motion.p>
        </div>
      </div>

      {/* Health Bar */}
      <div className="mt-6">
        <div className="health-bar">
          <div className="flex h-full">
            <motion.div
              className="bg-slate-500"
              initial={{ width: 0 }}
              animate={{ width: `${p1Percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.div
              className="bg-neon shadow-[0_0_15px_#ff00ff]"
              initial={{ width: 0 }}
              animate={{ width: `${p2Percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>{Math.round(p1Percent)}%</span>
          <span>{Math.round(p2Percent)}%</span>
        </div>
      </div>
    </div>
  );
}
