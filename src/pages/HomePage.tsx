import { Link } from 'react-router-dom';
import { MapPin, Trophy, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, Button, Card, PlayerBadge, StatTile, Skeleton } from '../components';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';

export function HomePage() {
  const { loading, summary } = useRivalryData(DEFAULT_TABLE_SLUG);

  return (
    <PageTransition className="min-h-full flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo / Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-display-lg text-text-primary uppercase tracking-wider mb-2">
            Pink Room
            <span className="block text-accent-pink" style={{ textShadow: '0 0 30px var(--accent-pink-glow)' }}>
              Rivalry
            </span>
          </h1>
          <p className="text-body text-text-secondary">
            Table tennis. Two rivals. One throne.
          </p>
        </motion.div>

        {/* Venue card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm mb-6"
        >
          <Card variant="elevated">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-accent-pink/10">
                <MapPin size={20} className="text-accent-pink" />
              </div>
              <div>
                <h2 className="font-heading text-headline text-text-primary">Pink Room</h2>
                <p className="text-caption text-text-secondary">
                  Innsbruck · Main Table
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Current Leader preview - REAL DATA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm mb-8"
        >
          {loading ? (
            <Skeleton height="120px" className="w-full" />
          ) : summary && summary.totalMatches > 0 ? (
            <Card variant="glass">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy 
                    size={20} 
                    className={summary.leader === 'bachi' ? 'text-accent-pink' : 'text-accent-cyan'} 
                  />
                  <span className="text-label uppercase tracking-widest text-text-muted">
                    {summary.leader ? 'Current Leader' : 'Tied!'}
                  </span>
                </div>
                {summary.leader && (
                  <PlayerBadge 
                    name={getPlayerDisplayName(summary.leader)} 
                    accent={summary.leader === 'bachi' ? 'pink' : 'cyan'} 
                    isLeader 
                  />
                )}
              </div>
              <div className="mt-4 flex gap-6">
                <StatTile 
                  label="Lead" 
                  value={summary.leadMargin > 0 ? `+${summary.leadMargin}` : '—'} 
                  accent={summary.leader === 'bachi' ? 'pink' : 'cyan'} 
                />
                <StatTile 
                  label="Streak" 
                  value={summary.currentStreak.count > 0 ? `${summary.currentStreak.count}W` : '—'} 
                  accent={summary.currentStreak.player === 'bachi' ? 'pink' : 'cyan'} 
                />
                <StatTile 
                  label="Matches" 
                  value={String(summary.totalMatches)} 
                />
              </div>
            </Card>
          ) : (
            <Card variant="glass" className="text-center py-6">
              <Play size={32} className="text-accent-pink mx-auto mb-2" />
              <p className="text-body text-text-secondary">No matches yet</p>
              <p className="text-caption text-text-muted">Start the rivalry!</p>
            </Card>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm space-y-3"
        >
          <Link to="/match/new" className="block">
            <Button variant="primary" size="lg" fullWidth className="gap-2">
              <Play size={20} fill="currentColor" />
              New Match
            </Button>
          </Link>
          <Link to="/rivalry" className="block">
            <Button variant="secondary" size="lg" fullWidth>
              View Rivalry
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-caption text-text-muted">
        Best of 5 · First to 11 · Trust Mode
      </footer>
    </PageTransition>
  );
}
