import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Trophy, TrendingUp } from 'lucide-react';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';
import { DynamicIsland } from './DynamicIsland';

export function FaceOffScreen() {
  const navigate = useNavigate();
  const { loading, summary, error, matches } = useRivalryData(DEFAULT_TABLE_SLUG);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const lastMatchTime = matches[0]?.played_at;
  const leader = summary?.leader ?? null;
  const themeColor = leader === 'crimebaker' ? 'pink' : 'cyan';

  const triggerHaptic = useCallback((pattern: 'light' | 'heavy' | 'success') => {
    if (!('vibrate' in navigator)) return;
    const patterns = { light: [10], heavy: [50], success: [30, 50, 30, 50, 100] };
    navigator.vibrate(patterns[pattern]);
  }, []);

  const handleHoldStart = useCallback(() => {
    setIsHolding(true);
    setHoldProgress(0);
    triggerHaptic('light');

    const startTime = Date.now();
    const holdDuration = 600;

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      setHoldProgress(Math.min((elapsed / holdDuration) * 100, 100));
    }, 16);

    holdTimerRef.current = window.setTimeout(() => {
      triggerHaptic('success');
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      navigate('/match/new');
    }, holdDuration);
  }, [navigate, triggerHaptic]);

  const handleHoldEnd = useCallback(() => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
    if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
  }, []);

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
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url(/tabla-bg.png)' }}
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
      <div className="relative z-10 min-h-screen flex flex-col px-6 pt-10 pb-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-2">
            <Swords className="text-white/40" size={20} />
            <span className="text-white/40 font-mono text-xs uppercase tracking-widest">Pink Room Rivalry</span>
          </div>
          <div className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            <span className="text-xs font-mono text-white/60">{summary.totalMatches} battles</span>
          </div>
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
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* Bachi */}
              <div className="text-center">
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">Bachi</p>
                <p className="text-7xl font-display text-cyan-400 tabular-nums"
                  style={{ textShadow: '0 0 40px rgba(34, 211, 238, 0.5)' }}>
                  {summary.bachiWins}
                </p>
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center">
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <span className="text-white/20 font-display text-2xl my-2">VS</span>
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>

              {/* Crimebaker */}
              <div className="text-center">
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">Crimebaker</p>
                <p className="text-7xl font-display text-pink-400 tabular-nums"
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

          {/* Tied State */}
          {isTied && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-5 mx-auto max-w-sm text-center"
            >
              <p className="text-2xl font-display text-white uppercase mb-2">Deadlock</p>
              <p className="text-white/40 font-mono text-sm">The rivalry is perfectly balanced</p>
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

        {/* Fight Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4 mt-8"
        >
          <motion.button
            className="relative"
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            onTouchCancel={handleHoldEnd}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button */}
            <div
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${isHolding ? 'bg-white scale-110' : 'bg-white/90'
                }`}
              style={{
                boxShadow: isHolding
                  ? '0 0 60px rgba(255, 255, 255, 0.8)'
                  : '0 0 30px rgba(255, 255, 255, 0.3)',
              }}
            >
              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="46"
                  fill="none"
                  stroke={themeColor === 'pink' ? '#ec4899' : '#22d3ee'}
                  strokeWidth="4"
                  strokeDasharray={`${holdProgress * 2.89} 289`}
                  className="transition-all duration-75"
                />
              </svg>
              <Swords size={28} className="text-black relative z-10" />
            </div>
          </motion.button>

          <p className={`text-white/40 font-mono text-xs uppercase tracking-widest transition-opacity ${isHolding ? 'opacity-0' : 'opacity-100'
            }`}>
            Hold to Enter Arena
          </p>
        </motion.div>
      </div>

      {/* Navigation */}
      <DynamicIsland lastMatchTime={lastMatchTime} />
    </div>
  );
}
