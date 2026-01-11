import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';

interface PlayerData {
  slug: 'bachi' | 'crimebaker';
  name: string;
  wins: number;
  isLeader: boolean;
}

export function FaceOffScreen() {
  const navigate = useNavigate();
  const { loading, summary, error } = useRivalryData(DEFAULT_TABLE_SLUG);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const leader = summary?.leader ?? null;
  const challenger = leader === 'bachi' ? 'crimebaker' : leader === 'crimebaker' ? 'bachi' : null;

  const leaderData: PlayerData | null = leader ? {
    slug: leader,
    name: getPlayerDisplayName(leader),
    wins: leader === 'bachi' ? summary!.bachiWins : summary!.crimebakerWins,
    isLeader: true,
  } : null;

  const challengerData: PlayerData | null = challenger ? {
    slug: challenger,
    name: getPlayerDisplayName(challenger),
    wins: challenger === 'bachi' ? summary!.bachiWins : summary!.crimebakerWins,
    isLeader: false,
  } : null;

  const triggerHaptic = useCallback((pattern: 'light' | 'heavy' | 'success') => {
    if (!('vibrate' in navigator)) return;
    const patterns = {
      light: [10],
      heavy: [50],
      success: [30, 50, 30, 50, 100],
    };
    navigator.vibrate(patterns[pattern]);
  }, []);

  const handleHoldStart = useCallback(() => {
    setIsHolding(true);
    setHoldProgress(0);
    triggerHaptic('light');

    const startTime = Date.now();
    const holdDuration = 800;

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / holdDuration) * 100, 100);
      setHoldProgress(progress);
    }, 16);

    holdTimerRef.current = window.setTimeout(() => {
      triggerHaptic('success');
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      navigate('/match/new');
    }, holdDuration);
  }, [navigate, triggerHaptic]);

  const handleHoldEnd = useCallback(() => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handleSwipeUp = useCallback(() => {
    triggerHaptic('light');
    navigate('/stats');
  }, [navigate, triggerHaptic]);

  if (loading) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-t-transparent border-white/30 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Loading Arena...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-500 font-mono text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/10 text-white rounded-full font-mono text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isTied = !leader || summary?.leadMargin === 0;
  const themeColor = leader === 'crimebaker' ? 'pink' : 'cyan';
  const leaderBgClass = themeColor === 'pink' ? 'bg-pink-900' : 'bg-cyan-900';
  const leaderAccentClass = themeColor === 'pink' ? 'bg-pink-500' : 'bg-cyan-500';

  return (
    <motion.div 
      className="relative h-screen w-full overflow-hidden bg-black select-none touch-none"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.y < -100) {
          handleSwipeUp();
        }
      }}
    >
      {/* Background Gradient based on leader */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 ${
          isTied ? 'bg-gradient-to-br from-slate-900 to-black' :
          themeColor === 'pink' 
            ? 'bg-gradient-to-br from-pink-950 via-pink-900/30 to-black' 
            : 'bg-gradient-to-br from-cyan-950 via-cyan-900/30 to-black'
        }`}
      />

      {/* THE KING (Top Section) - 65% height */}
      <AnimatePresence mode="wait">
        {leaderData && !isTied && (
          <motion.div 
            key={leaderData.slug}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className={`absolute top-0 right-0 w-full h-[65%] clip-diagonal-bottom ${leaderBgClass}`}
          >
            {/* Avatar/Color Overlay */}
            <div 
              className={`absolute inset-0 ${
                themeColor === 'pink' 
                  ? 'bg-gradient-to-br from-pink-500/20 via-pink-900/40 to-transparent' 
                  : 'bg-gradient-to-br from-cyan-500/20 via-cyan-900/40 to-transparent'
              } mix-blend-overlay`}
            />
            
            {/* King Info */}
            <div className="absolute bottom-16 right-6 text-right z-10">
              <motion.h1 
                className="text-6xl sm:text-7xl md:text-8xl font-display text-white tracking-tight uppercase text-glow-theme-strong"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {leaderData.name}
              </motion.h1>
              <motion.div 
                className={`inline-block ${leaderAccentClass} text-black font-bold px-4 py-1.5 text-xl -skew-x-12 mt-3`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <span className="inline-block skew-x-12">
                  KING (+{summary?.leadMargin ?? 0})
                </span>
              </motion.div>
            </div>

            {/* Win Count */}
            <motion.div 
              className="absolute top-8 right-6 text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-1">Victories</p>
              <p className="text-5xl font-mono font-bold text-white/80">{leaderData.wins}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE UNDERDOG (Bottom Section) - 40% height */}
      <AnimatePresence mode="wait">
        {challengerData && !isTied && (
          <motion.div 
            key={challengerData.slug}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-0 left-0 w-full h-[40%] bg-slate-900/90 z-10 clip-diagonal-top backdrop-blur-sm"
          >
            <div className="absolute top-16 left-6 z-10">
              <motion.h2 
                className="text-4xl sm:text-5xl font-display text-slate-500 uppercase tracking-tight"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {challengerData.name}
              </motion.h2>
              <motion.p 
                className="text-slate-600 font-mono text-sm mt-2 uppercase tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Chasing the Crown
              </motion.p>
            </div>

            {/* Challenger Win Count */}
            <motion.div 
              className="absolute bottom-8 left-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-slate-600 font-mono text-xs uppercase tracking-widest mb-1">Wins</p>
              <p className="text-3xl font-mono font-bold text-slate-500">{challengerData.wins}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TIED STATE */}
      {isTied && summary && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-display text-white uppercase mb-4">
              Deadlock
            </h1>
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest mb-8">
              {summary.bachiWins} - {summary.crimebakerWins}
            </p>
            <div className="flex gap-8 justify-center">
              <div className="text-center">
                <p className="text-cyan-400 font-display text-2xl">Bachi</p>
                <p className="text-slate-500 font-mono text-sm">{summary.bachiWins} wins</p>
              </div>
              <div className="text-3xl text-slate-600 font-display">VS</div>
              <div className="text-center">
                <p className="text-pink-400 font-display text-2xl">Crimebaker</p>
                <p className="text-slate-500 font-mono text-sm">{summary.crimebakerWins} wins</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* VS TRIGGER BUTTON (Center) */}
      <motion.button
        className={`absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 group cursor-pointer`}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onTouchCancel={handleHoldEnd}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Outer glow ring */}
          <div 
            className={`absolute inset-0 rounded-full animate-glow-pulse ${
              isHolding ? 'opacity-100' : 'opacity-60'
            }`}
            style={{
              width: '96px',
              height: '96px',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
            }}
          />
          
          {/* Main button */}
          <div 
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
              isHolding 
                ? 'bg-white scale-110' 
                : 'bg-white/95 hover:bg-white'
            }`}
            style={{
              boxShadow: isHolding 
                ? '0 0 60px rgba(255, 255, 255, 0.6), 0 0 100px var(--theme-primary-glow)'
                : '0 0 40px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Hold progress ring */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="var(--theme-primary)"
                strokeWidth="4"
                strokeDasharray={`${holdProgress * 2.89} 289`}
                className="transition-all duration-75"
              />
            </svg>
            
            <span className="font-display text-black text-2xl relative z-10">VS</span>
          </div>
        </div>

        {/* Hold instruction */}
        <motion.span 
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono uppercase tracking-widest whitespace-nowrap"
          animate={{ opacity: isHolding ? 0 : 1 }}
        >
          Hold to Fight
        </motion.span>
      </motion.button>

      {/* Swipe Up Indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-1 bg-white/20 rounded-full mb-2" />
        <p className="text-white/30 font-mono text-xs uppercase tracking-widest">Stats</p>
      </motion.div>

      {/* Total Matches Badge */}
      {summary && (
        <motion.div 
          className="absolute top-6 left-6 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="glass-panel px-4 py-2">
            <p className="text-white/40 font-mono text-xs uppercase tracking-wider">
              {summary.totalMatches} Battles
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
