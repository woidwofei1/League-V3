import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface VictoryOverlayProps {
  winner: string;
  accent: 'pink' | 'cyan';
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

const CONFETTI_COLORS = [
  '#FF00FF', // pink
  '#00F0FF', // cyan
  '#FF33FF', // light pink
  '#00FF88', // green
  '#FFD93D', // yellow
  '#FFFFFF', // white sparkle
];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 0.3,
    rotation: Math.random() * 360,
    size: 4 + Math.random() * 10,
  }));
}

export function VictoryOverlay({
  winner,
  accent,
  isVisible,
  onComplete,
  duration = 3000
}: VictoryOverlayProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const isPink = accent === 'pink';

  // Generate confetti when visible
  useEffect(() => {
    if (isVisible) {
      setConfetti(generateConfetti(80));

      // Trigger screen shake via CSS class on body
      document.body.classList.add('animate-shake');
      setTimeout(() => document.body.classList.remove('animate-shake'), 500);

      // Strong haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }

      // Auto-dismiss
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-bg-primary/95 backdrop-blur-sm flex items-center justify-center"
          onClick={onComplete}
        >
          {/* Confetti container */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{
                  y: -20,
                  x: `${piece.x}vw`,
                  rotate: piece.rotation,
                  opacity: 1
                }}
                animate={{
                  y: '110vh',
                  rotate: piece.rotation + 720,
                  opacity: 0
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: piece.delay,
                  ease: 'linear'
                }}
                className="absolute"
                style={{
                  width: piece.size,
                  height: piece.size,
                  backgroundColor: piece.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            ))}
          </div>

          {/* Victory content */}
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.1
            }}
            className="text-center relative z-10"
          >
            {/* Trophy */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="mb-4"
            >
              <Trophy
                size={80}
                className={isPink ? 'text-accent-pink mx-auto' : 'text-accent-cyan mx-auto'}
                style={{
                  filter: isPink
                    ? 'drop-shadow(0 0 30px var(--accent-pink-glow))'
                    : 'drop-shadow(0 0 30px var(--accent-cyan-glow))'
                }}
              />
            </motion.div>

            {/* Winner name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`
                font-display text-display-lg uppercase tracking-wider
                ${isPink ? 'text-accent-pink' : 'text-accent-cyan'}
              `}
              style={{
                textShadow: isPink
                  ? '0 0 40px var(--accent-pink-glow)'
                  : '0 0 40px var(--accent-cyan-glow)'
              }}
            >
              {winner}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-headline text-text-secondary mt-2"
            >
              WINS!
            </motion.p>

            {/* Tap to dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1 }}
              className="text-caption text-text-muted mt-8"
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
