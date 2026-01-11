import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';
import { DynamicIsland } from './DynamicIsland';

// Helper to format relative time (for match history)
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function FaceOffScreen() {
  const { loading, summary, error, matches, eloSeries } = useRivalryData(DEFAULT_TABLE_SLUG);

  const lastMatchTime = matches[0]?.played_at;
  const leader = summary?.leader ?? null;
  const themeColor = leader === 'crimebaker' ? 'pink' : 'cyan';

  // Get current Elo (or default 1000)
  const currentBachiElo = eloSeries.length > 0 ? eloSeries[eloSeries.length - 1].bachiElo : 1000;
  const currentCrimebakerElo = eloSeries.length > 0 ? eloSeries[eloSeries.length - 1].crimebakerElo : 1000;





  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(/tabla-bg.png)' }}
        />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-white/30 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-500 font-mono text-sm mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 text-white rounded-full font-mono text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const isTied = summary.leadMargin === 0;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: 'url(/home-bg.jpg)' }}
        animate={{ scale: [1, 1.05, 1], y: [0, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${themeColor === 'pink' ? 'from-pink-950/50' : 'from-cyan-950/50'
        } via-black/80 to-black`} />

      {/* Animated glow */}
      <motion.div
        className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${themeColor === 'pink' ? 'bg-pink-500/20' : 'bg-cyan-500/20'
          }`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 pt-8 pb-24">

        {/* TABLA Logo Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-6 relative"
        >
          {/* Logo Image */}
          <motion.img
            src="/logo.png"
            alt="TABLA"
            className="h-48 w-auto object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* VS Scoreboard - Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col justify-center"
        >
          {/* Main VS Display */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Bachi */}
              <div className="text-center flex-1">
                {/* Profile Image */}
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 blur-xl opacity-50" />
                  <img
                    src="/bachi-profile.jpg"
                    alt="Bachi"
                    className="absolute inset-0 w-full h-full object-cover border-2 border-cyan-500/50 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                    style={{ objectPosition: '50% 0%', transform: 'scale(1.8)' }}
                  />
                </div>
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-1">Bachi</p>
                <p className="text-cyan-400 font-mono text-xs font-bold mb-2 tracking-wider">ELO {currentBachiElo}</p>
                <p className="text-5xl font-display text-cyan-400 tabular-nums"
                  style={{ textShadow: '0 0 40px rgba(34, 211, 238, 0.5)' }}>
                  {summary.bachiWins}
                </p>
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center px-2">
                <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <span className="text-white/20 font-display text-xl my-1">VS</span>
                <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>

              {/* Crimebaker */}
              <div className="text-center flex-1">
                {/* Profile Image */}
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-pink-700 blur-xl opacity-50" />
                  <img
                    src="/crime-profile.jpg"
                    alt="Crimebaker"
                    className="absolute inset-0 w-full h-full object-cover border-2 border-pink-500/50 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                    style={{ objectPosition: '50% 0%', transform: 'scale(1.8)' }}
                  />
                </div>
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-1">Crimebaker</p>
                <p className="text-pink-400 font-mono text-xs font-bold mb-2 tracking-wider">ELO {currentCrimebakerElo}</p>
                <p className="text-5xl font-display text-pink-400 tabular-nums"
                  style={{ textShadow: '0 0 40px rgba(236, 72, 153, 0.5)' }}>
                  {summary.crimebakerWins}
                </p>
              </div>
            </div>

            {/* Win Rate Bar */}
            <div className="max-w-xs mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-cyan-400/60 font-mono">{summary.winRateBachi.toFixed(0)}%</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                    style={{ width: `${summary.winRateBachi}%` }}
                  />
                </div>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-pink-500 to-pink-400 ml-auto"
                    style={{ width: `${summary.winRateCrimebaker}%` }}
                  />
                </div>
                <span className="text-xs text-pink-400/60 font-mono">{summary.winRateCrimebaker.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Leader Card */}
          {!isTied && leader && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`glass-panel p-5 mx-auto max-w-sm border ${themeColor === 'pink' ? 'border-pink-500/30' : 'border-cyan-500/30'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${themeColor === 'pink' ? 'bg-pink-500/20' : 'bg-cyan-500/20'
                  }`}>
                  <Trophy className={themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'} size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Current King</p>
                  <p className={`text-2xl font-display uppercase ${themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'
                    }`}>
                    {getPlayerDisplayName(leader)}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-xl ${themeColor === 'pink' ? 'bg-pink-500/20' : 'bg-cyan-500/20'
                  }`}>
                  <p className={`text-xl font-mono font-bold ${themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'
                    }`}>
                    +{summary.leadMargin}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tied State - Sports Broadcast Style */}
          {isTied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative mx-auto max-w-xs"
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-white to-pink-500 rounded-xl"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%' }}
              />

              {/* Inner content */}
              <div className="relative bg-black rounded-xl overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-cyan-500 via-yellow-400 to-pink-500" />

                <div className="px-6 py-4 text-center">
                  {/* DEUCE Label */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-500/50" />
                    <span className="text-yellow-400 font-mono text-xs uppercase tracking-[0.3em]">Live</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-yellow-500/50" />
                  </div>

                  <motion.h2
                    className="text-4xl font-display text-white uppercase tracking-wider"
                    animate={{ textShadow: ['0 0 20px rgba(255,255,255,0.3)', '0 0 40px rgba(255,255,255,0.6)', '0 0 20px rgba(255,255,255,0.3)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    DEUCE
                  </motion.h2>

                  <p className="text-white/50 font-mono text-xs mt-2 uppercase tracking-widest">
                    {summary.bachiWins} - {summary.crimebakerWins}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Streak Info */}
          {summary.currentStreak.count > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-6"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${summary.currentStreak.player === 'bachi'
                ? 'bg-cyan-500/10 border border-cyan-500/30'
                : 'bg-pink-500/10 border border-pink-500/30'
                }`}>
                <TrendingUp size={16} className={
                  summary.currentStreak.player === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
                } />
                <span className={`font-mono text-sm ${summary.currentStreak.player === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
                  }`}>
                  {getPlayerDisplayName(summary.currentStreak.player)} on {summary.currentStreak.count} streak
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Match History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest">Recent Battles</h3>
            <span className="text-white/30 font-mono text-xs">{matches.length} total</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {matches.slice(0, 10).map((match, index) => {
              const isBachiWinner = match.winner_player_id === 'c3d4e5f6-a7b8-9012-cdef-123456789012';
              const winnerName = isBachiWinner ? 'Bachi' : 'Crimebaker';
              const winnerColor = isBachiWinner ? 'text-cyan-400' : 'text-pink-400';
              const bgColor = isBachiWinner ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-pink-500/5 border-pink-500/20';
              const matchDate = new Date(match.played_at);
              const timeAgo = getTimeAgo(matchDate);

              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`flex items-center justify-between p-3 rounded-xl border ${bgColor}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isBachiWinner ? 'bg-cyan-400' : 'bg-pink-400'}`} />
                    <span className={`font-display uppercase ${winnerColor}`}>{winnerName}</span>
                    <span className="text-white/30 font-mono text-xs">won</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white/40 font-mono text-xs">{match.points_a_total}-{match.points_b_total}</span>
                    <span className="text-white/20 font-mono text-xs ml-2">{timeAgo}</span>
                  </div>
                </motion.div>
              );
            })}

            {matches.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/30 font-mono text-sm">No battles yet</p>
                <p className="text-white/20 font-mono text-xs mt-1">Start your first match!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <DynamicIsland lastMatchTime={lastMatchTime} />
    </div>
  );
}
