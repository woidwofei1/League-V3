import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingUp, Calendar, Trophy, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';
import { getPlayerName, getPlayerSlug } from '../lib/matches';
import { PLAYER_IDS } from '../lib/profile';
import { DynamicIsland } from '../components';

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
      className={`glass-panel p-4 ${onClick ? 'cursor-pointer hover:border-white/20' : ''} transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function DashboardPage() {
  const { loading, summary, matches } = useRivalryData(DEFAULT_TABLE_SLUG);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const lastMatchTime = matches[0]?.played_at;

  const displayedMatches = useMemo(() => {
    return showAllHistory ? matches : matches.slice(0, 5);
  }, [matches, showAllHistory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-t-transparent border-white/30 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!summary) return null;

  const leader = summary.leader;
  const themeColor = leader === 'crimebaker' ? 'pink' : 'cyan';

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Epic Header */}
      <div className="relative overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/tabla-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        
        {/* Animated glow */}
        <motion.div
          className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl ${
            leader === 'crimebaker' ? 'bg-pink-500/20' : 'bg-cyan-500/20'
          }`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative px-4 pt-10 pb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-pink-400" />
            <div>
              <h1 className="text-4xl font-display uppercase text-white tracking-tight">Dashboard</h1>
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-1">Live Rivalry Stats</p>
            </div>
          </div>
          
          {/* Quick stat pills */}
          <div className="flex gap-2 mt-4">
            <div className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <span className="text-xs font-mono text-white/60">{summary.totalMatches} matches</span>
            </div>
            {summary.currentStreak.count > 1 && (
              <div className={`px-3 py-1.5 rounded-full border ${
                summary.currentStreak.player === 'bachi' 
                  ? 'bg-cyan-500/10 border-cyan-500/30' 
                  : 'bg-pink-500/10 border-pink-500/30'
              }`}>
                <span className={`text-xs font-mono ${
                  summary.currentStreak.player === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
                }`}>
                  🔥 {summary.currentStreak.count} streak
                </span>
              </div>
            )}
          </div>
        </motion.header>
      </div>

      <div className="px-4 space-y-4">
        {/* VS Scoreboard */}
        <BentoCard className="relative overflow-hidden" delay={0.05}>
          <div className="flex items-center justify-between">
            {/* Bachi */}
            <div className="text-center flex-1">
              <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2">Bachi</p>
              <p className="text-5xl font-display text-cyan-400 tabular-nums">{summary.bachiWins}</p>
            </div>
            
            {/* VS */}
            <div className="px-6">
              <p className="text-white/30 font-display text-xl">VS</p>
            </div>
            
            {/* Crimebaker */}
            <div className="text-center flex-1">
              <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2">Crimebaker</p>
              <p className="text-5xl font-display text-pink-400 tabular-nums">{summary.crimebakerWins}</p>
            </div>
          </div>
          
          {/* Win rate bar */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-white/30 font-mono">{summary.winRateBachi.toFixed(0)}%</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500"
                style={{ 
                  width: '100%',
                  background: `linear-gradient(to right, #22d3ee ${summary.winRateBachi}%, #1e293b ${summary.winRateBachi}%, #1e293b ${100 - summary.winRateCrimebaker}%, #ec4899 ${100 - summary.winRateCrimebaker}%)`
                }}
              />
            </div>
            <span className="text-xs text-white/30 font-mono">{summary.winRateCrimebaker.toFixed(0)}%</span>
          </div>
        </BentoCard>
        
        {/* Leader Badge */}
        {leader && (
          <BentoCard className="relative overflow-hidden" delay={0.08}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  themeColor === 'pink' ? 'bg-pink-500/20' : 'bg-cyan-500/20'
                }`}>
                  <Trophy className={themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'} size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/40 font-mono uppercase tracking-wider">Current King</p>
                  <p className={`text-xl font-display uppercase ${
                    themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'
                  }`}>
                    {getPlayerDisplayName(leader)}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-xl ${
                themeColor === 'pink' ? 'bg-pink-500/20' : 'bg-cyan-500/20'
              }`}>
                <p className={`text-2xl font-mono font-bold ${
                  themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'
                }`}>
                  +{summary.leadMargin}
                </p>
              </div>
            </div>
          </BentoCard>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Streak */}
          <BentoCard delay={0.1}>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="text-orange-400" size={16} />
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Streak</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-mono font-bold text-white">{summary.currentStreak.count}</p>
              <p className={`text-sm font-mono ${
                summary.currentStreak.player === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
              }`}>
                {summary.currentStreak.player ? getPlayerDisplayName(summary.currentStreak.player) : '—'}
              </p>
            </div>
          </BentoCard>

          {/* Record Streak */}
          <BentoCard delay={0.15}>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-yellow-400" size={16} />
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Record</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-mono font-bold text-white">{summary.longestStreak.count}</p>
              <p className={`text-sm font-mono ${
                summary.longestStreak.player === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
              }`}>
                {summary.longestStreak.player ? getPlayerDisplayName(summary.longestStreak.player) : '—'}
              </p>
            </div>
          </BentoCard>
        </div>

        {/* Win Counts */}
        <div className="grid grid-cols-2 gap-3">
          <BentoCard delay={0.2}>
            <div className="text-center">
              <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2">Bachi</p>
              <p className="text-4xl font-mono font-bold text-cyan-400">{summary.bachiWins}</p>
              <p className="text-xs text-white/30 font-mono mt-1">{summary.winRateBachi.toFixed(0)}%</p>
            </div>
          </BentoCard>

          <BentoCard delay={0.25}>
            <div className="text-center">
              <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2">Crimebaker</p>
              <p className="text-4xl font-mono font-bold text-pink-400">{summary.crimebakerWins}</p>
              <p className="text-xs text-white/30 font-mono mt-1">{summary.winRateCrimebaker.toFixed(0)}%</p>
            </div>
          </BentoCard>
        </div>

        {/* Total Matches */}
        <BentoCard delay={0.3}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-emerald-400" size={16} />
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Total Battles</span>
            </div>
            <p className="text-2xl font-mono font-bold text-white">{summary.totalMatches}</p>
          </div>
        </BentoCard>

        {/* History Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-3 mt-6">
            <Clock className="text-white/40" size={16} />
            <h2 className="text-lg font-display uppercase text-white">Recent Matches</h2>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {displayedMatches.map((match, index) => {
                const winnerSlug = getPlayerSlug(match.winner_player_id);
                const winnerName = getPlayerName(match.winner_player_id);
                const loserName = match.winner_player_id === PLAYER_IDS.bachi
                  ? 'Crimebaker'
                  : 'Bachi';
                const score = `${match.sets_a_won}–${match.sets_b_won}`;
                const isPinkWinner = winnerSlug === 'crimebaker';
                
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.02 }}
                    className={`glass-panel p-3 border-l-2 ${
                      isPinkWinner ? 'border-l-pink-500' : 'border-l-cyan-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isPinkWinner ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {winnerName[0]}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{winnerName}</p>
                          <p className="text-white/40 text-xs">beat {loserName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono font-bold ${
                          isPinkWinner ? 'text-pink-400' : 'text-cyan-400'
                        }`}>{score}</p>
                        <p className="text-white/30 text-xs font-mono flex items-center gap-1 justify-end">
                          <Calendar size={10} />
                          {formatRelativeDate(match.played_at)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Show More/Less Button */}
            {matches.length > 5 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="w-full py-3 glass-panel flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                {showAllHistory ? (
                  <>
                    <ChevronUp size={16} />
                    <span className="text-sm font-mono uppercase tracking-wider">Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    <span className="text-sm font-mono uppercase tracking-wider">
                      Show All ({matches.length})
                    </span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Dynamic Island Nav */}
      <DynamicIsland lastMatchTime={lastMatchTime} />
    </div>
  );
}
