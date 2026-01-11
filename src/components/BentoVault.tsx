import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingUp, TrendingDown, Calendar, Trophy, X } from 'lucide-react';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

function BentoCard({ children, className = '', onClick, delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className={`glass-panel p-4 cursor-pointer hover:border-white/20 transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Sparkline({ data, color }: { data: Array<{ winner: 'bachi' | 'crimebaker' }>; color: 'cyan' | 'pink' }) {
  const height = 40;
  const width = 100;
  const dotRadius = 4;
  const spacing = width / Math.max(data.length - 1, 1);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {data.map((match, i) => {
        const x = i * spacing;
        const y = height / 2;
        const isWin = (color === 'cyan' && match.winner === 'bachi') || 
                      (color === 'pink' && match.winner === 'crimebaker');
        
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={dotRadius}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={isWin 
              ? (color === 'cyan' ? 'fill-cyan-400' : 'fill-pink-400')
              : 'fill-white/20'
            }
          />
        );
      })}
    </svg>
  );
}

function OdometerCounter({ value, className = '' }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.round(startValue + (value - startValue) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const digits = String(displayValue).padStart(3, '0').split('');

  return (
    <div className={`flex gap-1 ${className}`}>
      {digits.map((digit, i) => (
        <motion.span
          key={i}
          className="inline-block w-10 h-14 bg-white/5 rounded-lg flex items-center justify-center font-mono text-3xl font-bold text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          {digit}
        </motion.span>
      ))}
    </div>
  );
}

function StreakFlame({ count, player }: { count: number; player: 'bachi' | 'crimebaker' | null }) {
  const color = player === 'bachi' ? 'text-cyan-400' : 'text-pink-400';
  
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`${color} animate-flame`}
        style={{ transformOrigin: 'bottom center' }}
      >
        <Flame size={40} fill="currentColor" />
      </motion.div>
      <div>
        <p className="text-4xl font-mono font-bold text-white">{count}</p>
        <p className="text-xs text-white/40 uppercase tracking-wider font-mono">
          {player ? getPlayerDisplayName(player) : 'None'}
        </p>
      </div>
    </div>
  );
}

function DayHeatmap({ matches }: { matches: Array<{ played_at: string; winner: 'bachi' | 'crimebaker' }> }) {
  const dayStats = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const stats = days.map(day => ({ day, bachi: 0, crimebaker: 0, total: 0 }));

    matches.forEach(match => {
      const date = new Date(match.played_at);
      const dayIndex = date.getDay();
      stats[dayIndex][match.winner]++;
      stats[dayIndex].total++;
    });

    return stats;
  }, [matches]);

  const maxTotal = Math.max(...dayStats.map(d => d.total), 1);

  return (
    <div className="grid grid-cols-7 gap-1">
      {dayStats.map((stat, i) => {
        const bachiPct = stat.total > 0 ? (stat.bachi / stat.total) : 0.5;
        const intensity = stat.total / maxTotal;
        
        return (
          <motion.div
            key={stat.day}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-8 h-8 rounded-md"
              style={{
                background: stat.total === 0 
                  ? 'rgba(255,255,255,0.05)'
                  : bachiPct > 0.6 
                    ? `rgba(0, 240, 255, ${0.3 + intensity * 0.7})`
                    : bachiPct < 0.4
                      ? `rgba(255, 0, 255, ${0.3 + intensity * 0.7})`
                      : `rgba(255, 255, 255, ${0.1 + intensity * 0.2})`,
              }}
            />
            <span className="text-[10px] text-white/30 font-mono">{stat.day[0]}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

interface ExpandedCardProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function ExpandedCard({ title, onClose, children }: ExpandedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="glass-panel w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display uppercase text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function BentoVault() {
  const { loading, summary, matches } = useRivalryData(DEFAULT_TABLE_SLUG);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-4 pt-16">
        <div className="grid grid-cols-2 gap-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`glass-panel h-32 ${i === 0 ? 'col-span-2' : ''}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const last10 = summary.last5.slice(0, 10);
  const matchesWithDates = matches.slice(0, 50).map(m => ({
    played_at: m.played_at,
    winner: m.winner_player_id === '550e8400-e29b-41d4-a716-446655440001' ? 'bachi' as const : 'crimebaker' as const,
  }));

  return (
    <div className="min-h-screen bg-black p-4 pt-16 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-display uppercase text-white mb-1">The Vault</h1>
        <p className="text-white/40 font-mono text-sm uppercase tracking-wider">Deep Stats</p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Block 1: The Trend (Large, spans 2 columns) */}
        <BentoCard 
          className="col-span-2" 
          delay={0.1}
          onClick={() => setExpandedCard('trend')}
        >
          <div className="flex items-center gap-2 mb-4">
            {summary.leader === 'bachi' ? (
              <TrendingUp className="text-cyan-400" size={20} />
            ) : (
              <TrendingDown className="text-pink-400" size={20} />
            )}
            <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Last 5 Trend</span>
          </div>
          <Sparkline 
            data={last10.map(r => ({ winner: r.winner }))} 
            color={summary.leader === 'bachi' ? 'cyan' : 'pink'} 
          />
          <div className="flex justify-between mt-4 text-xs text-white/40 font-mono">
            <span>Oldest</span>
            <span>Latest →</span>
          </div>
        </BentoCard>

        {/* Block 2: Current Streak */}
        <BentoCard delay={0.2}>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="text-orange-400" size={16} />
            <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Streak</span>
          </div>
          <StreakFlame 
            count={summary.currentStreak.count} 
            player={summary.currentStreak.player} 
          />
        </BentoCard>

        {/* Block 3: Max Streak */}
        <BentoCard delay={0.25}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="text-yellow-400" size={16} />
            <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Record</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-4xl font-mono font-bold text-white">{summary.longestStreak.count}</p>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono">
                {summary.longestStreak.player ? getPlayerDisplayName(summary.longestStreak.player) : '—'}
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Block 4: Day Heatmap (spans 2 columns) */}
        <BentoCard 
          className="col-span-2" 
          delay={0.3}
          onClick={() => setExpandedCard('heatmap')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-purple-400" size={16} />
            <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Day Dominance</span>
          </div>
          <DayHeatmap matches={matchesWithDates} />
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-cyan-400/60" />
              <span className="text-xs text-white/40 font-mono">Bachi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-pink-400/60" />
              <span className="text-xs text-white/40 font-mono">Crimebaker</span>
            </div>
          </div>
        </BentoCard>

        {/* Block 5: Total Matches (Wide) */}
        <BentoCard className="col-span-2" delay={0.35}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Battles Fought</span>
              <div className="mt-2">
                <OdometerCounter value={summary.totalMatches} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40 font-mono uppercase mb-1">Win Rate</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono text-sm">{summary.winRateBachi.toFixed(0)}%</span>
                  <span className="text-xs text-white/30">Bachi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400 font-mono text-sm">{summary.winRateCrimebaker.toFixed(0)}%</span>
                  <span className="text-xs text-white/30">Crime</span>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Block 6: Bachi Wins */}
        <BentoCard delay={0.4}>
          <div className="text-center">
            <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2">Bachi</p>
            <p className="text-5xl font-mono font-bold text-cyan-400">{summary.bachiWins}</p>
            <p className="text-xs text-white/30 font-mono mt-1">wins</p>
          </div>
        </BentoCard>

        {/* Block 7: Crimebaker Wins */}
        <BentoCard delay={0.45}>
          <div className="text-center">
            <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2">Crimebaker</p>
            <p className="text-5xl font-mono font-bold text-pink-400">{summary.crimebakerWins}</p>
            <p className="text-xs text-white/30 font-mono mt-1">wins</p>
          </div>
        </BentoCard>
      </div>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {expandedCard === 'trend' && (
          <ExpandedCard title="Match Trend" onClose={() => setExpandedCard(null)}>
            <div className="space-y-4">
              <p className="text-white/60 text-sm">
                The last 5 matches, showing who won each game.
              </p>
              <div className="space-y-2">
                {summary.last5.map((match, i) => (
                  <div 
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      match.winner === 'bachi' ? 'bg-cyan-500/10' : 'bg-pink-500/10'
                    }`}
                  >
                    <span className={`font-display uppercase ${
                      match.winner === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
                    }`}>
                      {getPlayerDisplayName(match.winner)}
                    </span>
                    <span className="text-white/30 font-mono text-xs">
                      {new Date(match.played_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ExpandedCard>
        )}

        {expandedCard === 'heatmap' && (
          <ExpandedCard title="Day Dominance" onClose={() => setExpandedCard(null)}>
            <div className="space-y-4">
              <p className="text-white/60 text-sm mb-6">
                Who wins more on each day of the week.
              </p>
              <DayHeatmap matches={matchesWithDates} />
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-cyan-400/60" />
                  <span className="text-sm text-white/60 font-mono">Bachi Dominates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-pink-400/60" />
                  <span className="text-sm text-white/60 font-mono">Crimebaker Dominates</span>
                </div>
              </div>
            </div>
          </ExpandedCard>
        )}
      </AnimatePresence>
    </div>
  );
}
