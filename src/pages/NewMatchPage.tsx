import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Minus, Trophy, Check, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, Button, VictoryOverlay } from '../components';
import { insertMatch, PINK_ROOM_TABLE_ID } from '../lib/matches';
import { PLAYER_IDS } from '../lib/profile';

// Haptic feedback helper
function haptic(duration = 10) {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  } catch {
    // Silently fail
  }
}

// ============ Types ============
type Player = 'bachi' | 'crimebaker';

interface SetScore {
  bachi: number;
  crimebaker: number;
  winner: Player | null;
}

interface MatchState {
  sets: SetScore[];
  activeSetIndex: number;
  matchWinner: Player | null;
  isStarted: boolean;
}

// ============ Constants ============
const POINTS_TO_WIN_SET = 11;
const SETS_TO_WIN_MATCH = 3;
const TOTAL_SETS = 5;

const PLAYER_CONFIG = {
  bachi: { name: 'Bachi', accent: 'pink' as const },
  crimebaker: { name: 'Crimebaker', accent: 'cyan' as const },
} as const;

// ============ Helpers ============
function createInitialState(): MatchState {
  return {
    sets: Array.from({ length: TOTAL_SETS }, () => ({
      bachi: 0,
      crimebaker: 0,
      winner: null,
    })),
    activeSetIndex: 0,
    matchWinner: null,
    isStarted: false,
  };
}

function countSetWins(sets: SetScore[], player: Player): number {
  return sets.filter((s) => s.winner === player).length;
}

// ============ Components ============

// Large score control button (48x48, premium feel)
function ScoreButton({
  onClick,
  disabled,
  variant,
  accent,
}: {
  onClick: () => void;
  disabled: boolean;
  variant: 'plus' | 'minus';
  accent: 'pink' | 'cyan';
}) {
  const isPlus = variant === 'plus';
  
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.08 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-14 h-14 rounded-xl flex items-center justify-center
        transition-all duration-150 select-none
        disabled:opacity-20 disabled:cursor-not-allowed
        ${isPlus
          ? accent === 'pink'
            ? 'bg-accent-pink/20 hover:bg-accent-pink/30 active:bg-accent-pink/40'
            : 'bg-accent-cyan/20 hover:bg-accent-cyan/30 active:bg-accent-cyan/40'
          : 'bg-bg-elevated hover:bg-bg-surface active:bg-bg-primary'
        }
      `}
    >
      {isPlus ? (
        <Plus size={24} className={accent === 'pink' ? 'text-accent-pink' : 'text-accent-cyan'} strokeWidth={2.5} />
      ) : (
        <Minus size={24} className="text-text-muted" strokeWidth={2} />
      )}
    </motion.button>
  );
}

// Compact set dots for player
function SetDots({ sets, player }: { sets: SetScore[]; player: Player }) {
  const accent = PLAYER_CONFIG[player].accent;
  const wins = sets.filter(s => s.winner === player).length;
  
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${i < wins
              ? accent === 'pink'
                ? 'bg-accent-pink shadow-[0_0_6px_var(--accent-pink)]'
                : 'bg-accent-cyan shadow-[0_0_6px_var(--accent-cyan)]'
              : 'bg-text-muted/20'
            }
          `}
        />
      ))}
    </div>
  );
}

// Player scoring block - the core UI unit
function PlayerBlock({
  player,
  score,
  sets,
  isWinner,
  isMatchComplete,
  onIncrement,
  onDecrement,
  isStarted,
}: {
  player: Player;
  score: number;
  sets: SetScore[];
  isWinner: boolean;
  isMatchComplete: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  isStarted: boolean;
}) {
  const config = PLAYER_CONFIG[player];
  const isScoreDisabled = isMatchComplete || !isStarted;
  const accent = config.accent;
  
  return (
    <div className="py-6 px-4">
      {/* Player name + set dots */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            accent === 'pink' ? 'bg-accent-pink' : 'bg-accent-cyan'
          }`} />
          <span className={`text-lg font-semibold ${
            isWinner 
              ? accent === 'pink' ? 'text-accent-pink' : 'text-accent-cyan'
              : 'text-text-secondary'
          }`}>
            {config.name}
          </span>
          {isWinner && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Trophy size={18} className={accent === 'pink' ? 'text-accent-pink' : 'text-accent-cyan'} />
            </motion.div>
          )}
        </div>
        <SetDots sets={sets} player={player} />
      </div>

      {/* Score row: - [SCORE] + */}
      <div className="flex items-center justify-center gap-4">
        <ScoreButton
          onClick={onDecrement}
          disabled={isScoreDisabled || score === 0}
          variant="minus"
          accent={accent}
        />
        
        <motion.div
          key={`${player}-${score}`}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className={`
            w-24 text-center tabular-nums font-black
            ${isStarted ? 'text-[72px] leading-none' : 'text-6xl'}
            ${isStarted
              ? isWinner
                ? accent === 'pink' ? 'text-accent-pink' : 'text-accent-cyan'
                : 'text-text-primary'
              : 'text-text-muted/30'
            }
          `}
        >
          {isStarted ? score : '–'}
        </motion.div>
        
        <ScoreButton
          onClick={onIncrement}
          disabled={isScoreDisabled}
          variant="plus"
          accent={accent}
        />
      </div>
    </div>
  );
}

// ============ Main Component ============
export function NewMatchPage() {
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchState>(createInitialState);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);

  const bachiSetWins = countSetWins(match.sets, 'bachi');
  const crimebakerSetWins = countSetWins(match.sets, 'crimebaker');
  const currentSet = match.sets[match.activeSetIndex];
  const isMatchComplete = match.matchWinner !== null;

  // Start match
  const handleStart = useCallback(() => {
    setMatch((prev) => ({ ...prev, isStarted: true }));
  }, []);

  // Score increment with haptic feedback
  const handleScore = useCallback((player: Player, delta: number) => {
    haptic(delta > 0 ? 15 : 8); // Stronger for increment
    
    setMatch((prev) => {
      if (prev.matchWinner || !prev.isStarted) return prev;

      const sets = [...prev.sets];
      const activeSet = { ...sets[prev.activeSetIndex] };
      
      // Apply delta
      const newScore = Math.max(0, activeSet[player] + delta);
      activeSet[player] = newScore;
      sets[prev.activeSetIndex] = activeSet;

      // Check for set win
      if (newScore >= POINTS_TO_WIN_SET && activeSet.winner === null) {
        activeSet.winner = player;
        sets[prev.activeSetIndex] = activeSet;
        haptic(30); // Set win haptic

        // Check for match win
        const playerSetWins = countSetWins(sets, player);
        if (playerSetWins >= SETS_TO_WIN_MATCH) {
          // Show victory overlay
          setTimeout(() => setShowVictory(true), 200);
          return {
            ...prev,
            sets,
            matchWinner: player,
          };
        }

        // Advance to next set
        const nextSetIndex = prev.activeSetIndex + 1;
        if (nextSetIndex < TOTAL_SETS) {
          return {
            ...prev,
            sets,
            activeSetIndex: nextSetIndex,
          };
        }
      }

      return { ...prev, sets };
    });
  }, []);

  // Finish match - save to Supabase
  const handleFinish = useCallback(async () => {
    if (!match.matchWinner) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Calculate totals from all sets
      const pointsATotal = match.sets.reduce((sum, s) => sum + s.bachi, 0);
      const pointsBTotal = match.sets.reduce((sum, s) => sum + s.crimebaker, 0);

      await insertMatch({
        table_id: PINK_ROOM_TABLE_ID,
        player_a_id: PLAYER_IDS.bachi,
        player_b_id: PLAYER_IDS.crimebaker,
        winner_player_id: match.matchWinner === 'bachi' ? PLAYER_IDS.bachi : PLAYER_IDS.crimebaker,
        sets_a_won: bachiSetWins,
        sets_b_won: crimebakerSetWins,
        points_a_total: pointsATotal,
        points_b_total: pointsBTotal,
      });

      navigate('/history');
    } catch (err) {
      console.error('Failed to save match:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save match');
    } finally {
      setIsSaving(false);
    }
  }, [match, bachiSetWins, crimebakerSetWins, navigate]);

  return (
    <PageTransition className="min-h-full flex flex-col">
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
        
        {/* Compact Header */}
        <header className="px-5 pt-6 pb-3 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className={`text-sm font-bold uppercase tracking-widest ${
              isMatchComplete ? 'text-accent-pink' : 'text-text-muted'
            }`}>
              {isMatchComplete 
                ? 'Match Complete' 
                : match.isStarted 
                  ? `Set ${match.activeSetIndex + 1} of 5`
                  : 'New Match'
              }
            </span>
          </div>
          
          {/* Set score indicator */}
          {match.isStarted && (
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">Bachi</span>
                <span className="text-lg font-bold tabular-nums text-accent-pink">{bachiSetWins}</span>
              </div>
              <span className="text-text-muted/40">—</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tabular-nums text-accent-cyan">{crimebakerSetWins}</span>
                <span className="text-sm text-text-muted">Crimebaker</span>
              </div>
            </div>
          )}
          
          {!match.isStarted && (
            <p className="text-sm text-text-muted">Best of 5 · First to 11</p>
          )}
        </header>

        {/* Scoreboard - The Centerpiece */}
        <div className="flex-1 px-4 flex flex-col justify-center">
          <div className="bg-bg-surface rounded-2xl overflow-hidden shadow-card relative">
            
            {/* Ambient glow */}
            <motion.div
              className="absolute -top-20 -left-20 w-40 h-40 bg-accent-pink/10 blur-3xl rounded-full pointer-events-none"
              animate={{ opacity: match.matchWinner === 'bachi' ? [0.2, 0.4, 0.2] : 0.1 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
            />
            <motion.div
              className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent-cyan/10 blur-3xl rounded-full pointer-events-none"
              animate={{ opacity: match.matchWinner === 'crimebaker' ? [0.2, 0.4, 0.2] : 0.1 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
            />

            {/* Player 1 - Bachi */}
            <PlayerBlock
              player="bachi"
              score={currentSet?.bachi ?? 0}
              sets={match.sets}
              isWinner={match.matchWinner === 'bachi'}
              isMatchComplete={isMatchComplete}
              onIncrement={() => handleScore('bachi', 1)}
              onDecrement={() => handleScore('bachi', -1)}
              isStarted={match.isStarted}
            />

            {/* Center divider */}
            <div className="relative h-px bg-border-subtle mx-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-3 bg-bg-surface text-[10px] text-text-muted/50 font-bold tracking-widest">
                  VS
                </span>
              </div>
            </div>

            {/* Player 2 - Crimebaker */}
            <PlayerBlock
              player="crimebaker"
              score={currentSet?.crimebaker ?? 0}
              sets={match.sets}
              isWinner={match.matchWinner === 'crimebaker'}
              isMatchComplete={isMatchComplete}
              onIncrement={() => handleScore('crimebaker', 1)}
              onDecrement={() => handleScore('crimebaker', -1)}
              isStarted={match.isStarted}
            />
          </div>

          {/* Winner indicator (subtle, since VictoryOverlay shows the big celebration) */}
          <AnimatePresence>
            {isMatchComplete && !showVictory && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <Trophy
                    size={24}
                    className={match.matchWinner === 'bachi' ? 'text-accent-pink' : 'text-accent-cyan'}
                  />
                  <span className={`font-display text-xl ${
                    match.matchWinner === 'bachi' ? 'text-accent-pink' : 'text-accent-cyan'
                  }`}>
                    {PLAYER_CONFIG[match.matchWinner!].name} Wins!
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Zone */}
        <div className="px-5 pt-4 pb-6" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}>
          {/* Save error message */}
          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-accent-danger/10 border border-accent-danger/30 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-accent-danger flex-shrink-0 mt-0.5" />
              <p className="text-caption text-accent-danger">{saveError}</p>
            </motion.div>
          )}

          {!match.isStarted ? (
            <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.08 }}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="gap-2 h-14 text-base"
                onClick={handleStart}
              >
                <Play size={22} fill="currentColor" />
                Start Match
              </Button>
            </motion.div>
          ) : isMatchComplete ? (
            <motion.div whileTap={isSaving ? {} : { scale: 0.98 }} transition={{ duration: 0.08 }}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="gap-2 h-14 text-base"
                onClick={handleFinish}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={22} />
                    Finish Match
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <div className="h-14 flex items-center justify-center">
              <span className="text-sm text-text-muted/60">First to 11 wins the set</span>
            </div>
          )}
        </div>
      </div>

      {/* Victory Celebration Overlay */}
      {match.matchWinner && (
        <VictoryOverlay
          winner={PLAYER_CONFIG[match.matchWinner].name}
          accent={match.matchWinner === 'bachi' ? 'pink' : 'cyan'}
          isVisible={showVictory}
          onComplete={() => setShowVictory(false)}
          duration={3500}
        />
      )}
    </PageTransition>
  );
}
