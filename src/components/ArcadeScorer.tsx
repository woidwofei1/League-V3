import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check } from 'lucide-react';
import { getPlayerDisplayName } from '../lib/rivalryData';

interface SetScore {
  bachi: number;
  crimebaker: number;
}

interface ArcadeScorerProps {
  onMatchComplete?: (sets: SetScore[], winner: 'bachi' | 'crimebaker') => void;
}

const WINNING_SCORE = 11;
const SETS_TO_WIN = 3;

export function ArcadeScorer({ onMatchComplete }: ArcadeScorerProps) {
  const navigate = useNavigate();
  const [currentSet, setCurrentSet] = useState<SetScore>({ bachi: 0, crimebaker: 0 });
  const [sets, setSets] = useState<SetScore[]>([]);
  const [setsWon, setSetsWon] = useState({ bachi: 0, crimebaker: 0 });
  const [history, setHistory] = useState<Array<{ player: 'bachi' | 'crimebaker'; set: number }>>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [showSetWin, setShowSetWin] = useState<'bachi' | 'crimebaker' | null>(null);
  const [matchWinner, setMatchWinner] = useState<'bachi' | 'crimebaker' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = useCallback((type: 'tap' | 'setWin' | 'matchWin') => {
    if (!('vibrate' in navigator)) return;
    const patterns = {
      tap: [30],
      setWin: [50, 50, 100],
      matchWin: [100, 50, 100, 50, 200],
    };
    navigator.vibrate(patterns[type]);
  }, []);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  const checkSetWin = useCallback((score: SetScore): 'bachi' | 'crimebaker' | null => {
    const { bachi, crimebaker } = score;
    
    // Normal win at 11 with 2+ point lead
    if (bachi >= WINNING_SCORE && bachi - crimebaker >= 2) return 'bachi';
    if (crimebaker >= WINNING_SCORE && crimebaker - bachi >= 2) return 'crimebaker';
    
    // Deuce scenario (both at 10+)
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

    const newScore = {
      ...currentSet,
      [player]: currentSet[player] + 1,
    };

    setCurrentSet(newScore);
    setHistory(prev => [...prev, { player, set: sets.length }]);

    // Check for set win
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

      // Check for match win
      if (newSetsWon[setWinner] >= SETS_TO_WIN) {
        triggerHaptic('matchWin');
        setMatchWinner(setWinner);
        onMatchComplete?.(sets.concat(newScore), setWinner);
      } else {
        // Reset for next set after animation
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
    
    // Only undo if it's from the current set
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

  // Handle swipe left for undo
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      if (diff > 100) {
        undoLastPoint();
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [undoLastPoint]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 bg-black z-[200] ${isShaking ? 'animate-shake' : ''}`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
        <button 
          onClick={handleClose}
          className="p-2 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        {/* Sets Score */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-cyan-400 font-mono text-xl font-bold">{setsWon.bachi}</span>
          </div>
          <span className="text-white/30 font-mono text-sm">SETS</span>
          <div className="text-center">
            <span className="text-pink-400 font-mono text-xl font-bold">{setsWon.crimebaker}</span>
          </div>
        </div>

        <button 
          onClick={undoLastPoint}
          disabled={history.length === 0 || !!matchWinner}
          className="p-2 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {/* BACHI Zone (Top) */}
      <motion.button
        className="absolute top-0 left-0 right-0 h-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-cyan-950/50 to-transparent active:from-cyan-900/70"
        onTouchStart={() => scorePoint('bachi')}
        onClick={() => scorePoint('bachi')}
        whileTap={{ scale: 0.98 }}
        disabled={!!matchWinner}
      >
        <motion.div
          key={currentSet.bachi}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-8xl sm:text-9xl font-mono font-bold text-cyan-400 text-glow-cyan">
            {currentSet.bachi}
          </p>
          <p className="text-cyan-500/50 font-display text-2xl uppercase tracking-widest mt-2">
            {getPlayerDisplayName('bachi')}
          </p>
        </motion.div>
      </motion.button>

      {/* Center Divider */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-40 pointer-events-none">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-black text-white/30 font-mono text-xs uppercase tracking-widest">
          Set {sets.length + 1}
        </div>
      </div>

      {/* CRIMEBAKER Zone (Bottom) */}
      <motion.button
        className="absolute bottom-0 left-0 right-0 h-1/2 flex flex-col items-center justify-center bg-gradient-to-t from-pink-950/50 to-transparent active:from-pink-900/70"
        onTouchStart={() => scorePoint('crimebaker')}
        onClick={() => scorePoint('crimebaker')}
        whileTap={{ scale: 0.98 }}
        disabled={!!matchWinner}
      >
        <motion.div
          key={currentSet.crimebaker}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-pink-500/50 font-display text-2xl uppercase tracking-widest mb-2">
            {getPlayerDisplayName('crimebaker')}
          </p>
          <p className="text-8xl sm:text-9xl font-mono font-bold text-pink-400 text-glow">
            {currentSet.crimebaker}
          </p>
        </motion.div>
      </motion.button>

      {/* Swipe hint */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-white/20 font-mono text-xs uppercase tracking-widest">
          ← Swipe to Undo
        </p>
      </motion.div>

      {/* Set Win Overlay */}
      <AnimatePresence>
        {showSetWin && !matchWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className={`text-6xl font-display uppercase tracking-tight ${
                  showSetWin === 'bachi' ? 'text-cyan-400 text-glow-cyan' : 'text-pink-400 text-glow'
                }`}>
                  {getPlayerDisplayName(showSetWin)}
                </p>
                <p className="text-white/50 font-mono text-xl mt-2 uppercase">
                  Takes Set {sets.length}
                </p>
              </motion.div>
            </div>
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
            {/* Shatter effect background */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 ${
                matchWinner === 'bachi' 
                  ? 'bg-gradient-to-br from-cyan-500 to-cyan-900' 
                  : 'bg-gradient-to-br from-pink-500 to-pink-900'
              }`}
            />
            
            <div className="relative z-10 text-center p-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  matchWinner === 'bachi' ? 'bg-cyan-500' : 'bg-pink-500'
                }`}
              >
                <Check size={48} className="text-black" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-5xl sm:text-6xl font-display uppercase tracking-tight mb-4 ${
                  matchWinner === 'bachi' ? 'text-cyan-400 text-glow-cyan' : 'text-pink-400 text-glow'
                }`}
              >
                {getPlayerDisplayName(matchWinner)} Wins!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/50 font-mono text-lg uppercase tracking-wider mb-8"
              >
                {setsWon.bachi} - {setsWon.crimebaker}
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={handleClose}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-mono uppercase tracking-wider rounded-full transition-colors"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
