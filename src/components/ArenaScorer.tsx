import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trophy, Zap } from 'lucide-react';
import { getPlayerDisplayName } from '../lib/rivalryData';

interface SetScore {
  bachi: number;
  crimebaker: number;
}

interface ArenaScorerProps {
  onMatchComplete?: (sets: SetScore[], winner: 'bachi' | 'crimebaker') => void;
}

const WINNING_SCORE = 11;
const SETS_TO_WIN = 3;

export function ArenaScorer({ onMatchComplete }: ArenaScorerProps) {
  const navigate = useNavigate();
  const [currentSet, setCurrentSet] = useState<SetScore>({ bachi: 0, crimebaker: 0 });
  const [sets, setSets] = useState<SetScore[]>([]);
  const [setsWon, setSetsWon] = useState({ bachi: 0, crimebaker: 0 });
  const [history, setHistory] = useState<Array<{ player: 'bachi' | 'crimebaker'; set: number }>>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [showSetWin, setShowSetWin] = useState<'bachi' | 'crimebaker' | null>(null);
  const [matchWinner, setMatchWinner] = useState<'bachi' | 'crimebaker' | null>(null);
  const [lastScorer, setLastScorer] = useState<'bachi' | 'crimebaker' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = useCallback((type: 'tap' | 'setWin' | 'matchWin') => {
    if (!('vibrate' in navigator)) return;
    const patterns = {
      tap: [40],
      setWin: [50, 50, 100],
      matchWin: [100, 50, 100, 50, 200],
    };
    navigator.vibrate(patterns[type]);
  }, []);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  }, []);

  const checkSetWin = useCallback((score: SetScore): 'bachi' | 'crimebaker' | null => {
    const { bachi, crimebaker } = score;
    if (bachi >= WINNING_SCORE && bachi - crimebaker >= 2) return 'bachi';
    if (crimebaker >= WINNING_SCORE && crimebaker - bachi >= 2) return 'crimebaker';
    if (bachi >= 10 && crimebaker >= 10) {
      if (bachi - crimebaker >= 2) return 'bachi';
      if (crimebaker - bachi >= 2) return 'crimebaker';
    }
    return null;
  }, []);

  const scorePoint = useCallback((player: 'bachi' | 'crimebaker') => {
    if (matchWinner) return;

    triggerHaptic('tap');
    triggerShake();
    setLastScorer(player);

    const newScore = {
      ...currentSet,
      [player]: currentSet[player] + 1,
    };

    setCurrentSet(newScore);
    setHistory(prev => [...prev, { player, set: sets.length }]);

    const setWinner = checkSetWin(newScore);
    if (setWinner) {
      triggerHaptic('setWin');
      setShowSetWin(setWinner);
      
      const newSetsWon = {
        ...setsWon,
        [setWinner]: setsWon[setWinner] + 1,
      };
      setSetsWon(newSetsWon);
      setSets(prev => [...prev, newScore]);

      if (newSetsWon[setWinner] >= SETS_TO_WIN) {
        triggerHaptic('matchWin');
        setMatchWinner(setWinner);
        onMatchComplete?.(sets.concat(newScore), setWinner);
      } else {
        setTimeout(() => {
          setShowSetWin(null);
          setCurrentSet({ bachi: 0, crimebaker: 0 });
        }, 1500);
      }
    }
  }, [currentSet, sets, setsWon, matchWinner, triggerHaptic, triggerShake, checkSetWin, onMatchComplete]);

  const undoLastPoint = useCallback(() => {
    if (history.length === 0 || matchWinner) return;
    triggerHaptic('tap');
    
    const lastAction = history[history.length - 1];
    if (lastAction.set === sets.length) {
      setCurrentSet(prev => ({
        ...prev,
        [lastAction.player]: Math.max(0, prev[lastAction.player] - 1),
      }));
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history, sets.length, matchWinner, triggerHaptic]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Swipe for undo
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX - e.changedTouches[0].clientX > 100) undoLastPoint();
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [undoLastPoint]);

  const isDeuce = currentSet.bachi >= 10 && currentSet.crimebaker >= 10;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 bg-black z-[200] overflow-hidden ${isShaking ? 'animate-shake' : ''}`}
    >
      {/* Table background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/tabla-bg.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      
      {/* Animated score glow background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          lastScorer === 'bachi' ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-cyan-500/30 to-transparent" />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          lastScorer === 'crimebaker' ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-pink-500/30 to-transparent" />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-between">
          <button onClick={handleClose} className="p-3 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <X size={20} />
          </button>
          
          {/* Arena Title + Set */}
          <div className="text-center">
            <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Arena</p>
            <p className="text-white/60 font-mono text-sm">Set {sets.length + 1}</p>
          </div>

          <button 
            onClick={undoLastPoint}
            disabled={history.length === 0 || !!matchWinner}
            className="p-3 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
        
        {/* Sets Score Pills */}
        <div className="flex justify-center gap-3 mt-4">
          <div className="flex items-center gap-1">
            {[...Array(SETS_TO_WIN)].map((_, i) => (
              <div 
                key={`bachi-${i}`} 
                className={`w-3 h-3 rounded-full transition-all ${
                  i < setsWon.bachi ? 'bg-cyan-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <span className="text-white/30 font-mono text-xs">-</span>
          <div className="flex items-center gap-1">
            {[...Array(SETS_TO_WIN)].map((_, i) => (
              <div 
                key={`crime-${i}`} 
                className={`w-3 h-3 rounded-full transition-all ${
                  i < setsWon.crimebaker ? 'bg-pink-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* BACHI Zone (Top) */}
      <motion.button
        className="absolute top-0 left-0 right-0 h-[45%] flex flex-col items-center justify-center pt-24"
        onPointerDown={(e) => {
          e.preventDefault();
          scorePoint('bachi');
        }}
        whileTap={{ backgroundColor: 'rgba(34, 211, 238, 0.1)' }}
        disabled={!!matchWinner}
      >
        <motion.div
          key={`bachi-${currentSet.bachi}`}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-center"
        >
          <p className="text-white/30 font-display text-lg uppercase tracking-widest mb-2">
            {getPlayerDisplayName('bachi')}
          </p>
          <p className="text-[120px] sm:text-[140px] font-display text-cyan-400 leading-none tabular-nums"
             style={{ textShadow: '0 0 60px rgba(34, 211, 238, 0.5)' }}>
            {currentSet.bachi}
          </p>
        </motion.div>
      </motion.button>

      {/* Center Divider */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-40 pointer-events-none">
        <div className="relative">
          {/* Glowing line */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          {/* VS Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div 
              className="w-16 h-16 rounded-full bg-black border-2 border-white/20 flex items-center justify-center"
              animate={{ 
                boxShadow: isDeuce 
                  ? ['0 0 20px rgba(255,255,255,0.3)', '0 0 40px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.3)']
                  : '0 0 20px rgba(255,255,255,0.1)'
              }}
              transition={{ duration: 1, repeat: isDeuce ? Infinity : 0 }}
            >
              {isDeuce ? (
                <Zap size={24} className="text-yellow-400" />
              ) : (
                <span className="font-display text-white/50 text-lg">VS</span>
              )}
            </motion.div>
          </div>
          
          {/* Deuce indicator */}
          {isDeuce && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 -translate-x-1/2 top-12 text-yellow-400 font-mono text-xs uppercase tracking-widest"
            >
              Deuce!
            </motion.p>
          )}
        </div>
      </div>

      {/* CRIMEBAKER Zone (Bottom) */}
      <motion.button
        className="absolute bottom-0 left-0 right-0 h-[45%] flex flex-col items-center justify-center pb-24"
        onPointerDown={(e) => {
          e.preventDefault();
          scorePoint('crimebaker');
        }}
        whileTap={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}
        disabled={!!matchWinner}
      >
        <motion.div
          key={`crimebaker-${currentSet.crimebaker}`}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-center"
        >
          <p className="text-[120px] sm:text-[140px] font-display text-pink-400 leading-none tabular-nums"
             style={{ textShadow: '0 0 60px rgba(236, 72, 153, 0.5)' }}>
            {currentSet.crimebaker}
          </p>
          <p className="text-white/30 font-display text-lg uppercase tracking-widest mt-2">
            {getPlayerDisplayName('crimebaker')}
          </p>
        </motion.div>
      </motion.button>

      {/* Bottom hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-0 right-0 text-center z-50"
      >
        <p className="text-white/20 font-mono text-xs uppercase tracking-widest">
          Tap to score · Swipe ← to undo
        </p>
      </motion.div>

      {/* Set Win Overlay */}
      <AnimatePresence>
        {showSetWin && !matchWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center"
          >
            <div className={`absolute inset-0 ${
              showSetWin === 'bachi' ? 'bg-cyan-900/80' : 'bg-pink-900/80'
            } backdrop-blur-sm`} />
            
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative text-center"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
              >
                <p className={`text-7xl font-display uppercase tracking-tight ${
                  showSetWin === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
                }`} style={{ textShadow: '0 0 40px currentColor' }}>
                  {getPlayerDisplayName(showSetWin)}
                </p>
                <p className="text-white/60 font-mono text-2xl mt-4 uppercase tracking-widest">
                  Set {sets.length}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Win Overlay */}
      <AnimatePresence>
        {matchWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[70] flex items-center justify-center"
          >
            {/* Explosive background */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 2 }}
              transition={{ duration: 0.5 }}
              className={`absolute w-full h-full ${
                matchWinner === 'bachi' 
                  ? 'bg-gradient-radial from-cyan-500/50 to-transparent' 
                  : 'bg-gradient-radial from-pink-500/50 to-transparent'
              }`}
            />
            
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            
            <div className="relative z-10 text-center px-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 ${
                  matchWinner === 'bachi' ? 'bg-cyan-500' : 'bg-pink-500'
                }`}
                style={{ boxShadow: '0 0 60px currentColor' }}
              >
                <Trophy size={56} className="text-black" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-6xl sm:text-7xl font-display uppercase tracking-tight text-white mb-4"
                style={{ textShadow: '0 0 40px rgba(255,255,255,0.5)' }}
              >
                {getPlayerDisplayName(matchWinner)}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-3xl font-display uppercase tracking-widest ${
                  matchWinner === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
                }`}
              >
                Wins!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8"
              >
                <p className="text-white/40 font-mono text-xl uppercase tracking-wider mb-8">
                  {setsWon.bachi} - {setsWon.crimebaker}
                </p>
                
                <button
                  onClick={handleClose}
                  className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-display uppercase tracking-wider text-lg rounded-2xl transition-all active:scale-95"
                >
                  Exit Arena
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
