import { Link } from 'react-router-dom';
import { Zap, MapPin, Play, CircleDot } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, Card, Button, Divider } from '../components';

// Subtle pulsing glow animation for sports vibe
const glowPulse = {
  animate: {
    opacity: [0.15, 0.25, 0.15],
    scale: [1, 1.05, 1],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export function NewMatchPage() {
  return (
    <PageTransition className="min-h-full flex flex-col">
      {/* Centered container for phone viewport */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
        
        {/* Arena Header */}
        <header className="px-5 pt-8 pb-6 text-center">
          <div className="inline-flex items-center gap-2 text-accent-pink mb-3">
            <Zap size={14} className="animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              New Match
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-text-secondary mb-3">
            <MapPin size={14} />
            <span className="text-sm">Pink Room · Main Table</span>
          </div>
          <div className="inline-block px-4 py-1.5 rounded-full bg-bg-surface border border-border-subtle">
            <span className="text-sm text-text-muted">
              Best of 5 · First to 11
            </span>
          </div>
        </header>

        {/* Scoreboard Card - The Centerpiece */}
        <div className="flex-1 px-5 flex flex-col justify-center py-4">
          <Card
            variant="elevated"
            padding="none"
            className="relative overflow-hidden"
          >
            {/* Anticipation glow effects with pulse */}
            <motion.div
              className="absolute -top-24 -left-24 w-48 h-48 bg-accent-pink/20 blur-3xl rounded-full"
              animate={glowPulse.animate}
              transition={glowPulse.transition}
            />
            <motion.div
              className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-cyan/20 blur-3xl rounded-full"
              animate={glowPulse.animate}
              transition={{ ...glowPulse.transition, delay: 1.5 }}
            />

            {/* Player 1 - Bachi */}
            <div className="relative px-6 py-7 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-accent-pink shadow-glow-pink" />
                <span className="text-2xl text-text-primary font-bold">
                  Bachi
                </span>
              </div>
              <div className="text-5xl tabular-nums text-text-muted/40 font-extrabold">
                –
              </div>
            </div>

            {/* VS Divider */}
            <div className="relative">
              <Divider />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-5 bg-bg-elevated text-xs text-text-muted font-bold tracking-[0.2em] uppercase">
                  VS
                </span>
              </div>
            </div>

            {/* Player 2 - Crimebaker */}
            <div className="relative px-6 py-7 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-accent-cyan shadow-glow-cyan" />
                <span className="text-2xl text-text-primary font-bold">
                  Crimebaker
                </span>
              </div>
              <div className="text-5xl tabular-nums text-text-muted/40 font-extrabold">
                –
              </div>
            </div>
          </Card>

          {/* Match State Panel */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card variant="glass" padding="md" className="mt-5 text-center">
              <div className="flex items-center justify-center gap-2 text-accent-cyan">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <CircleDot size={18} />
                </motion.div>
                <span className="text-base font-semibold">Match Ready</span>
              </div>
              <p className="text-sm text-text-muted mt-1">
                Tap Start to begin scoring
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Primary CTA Zone - with safe area spacing */}
        <div className="px-5 pt-4 pb-6" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}>
          <Link to="/match/new" className="block">
            <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
              <Button variant="primary" size="lg" fullWidth className="gap-2 h-14 text-base">
                <Play size={22} fill="currentColor" />
                Start Match
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
