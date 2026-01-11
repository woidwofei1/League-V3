import { Calendar, AlertCircle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, Card, PlayerBadge, Skeleton, FAB } from '../components';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerName, getPlayerSlug } from '../lib/matches';
import { PLAYER_IDS } from '../lib/profile';

/**
 * Format a date relative to now
 */
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

export function HistoryPage() {
  const { loading: isLoading, error, matches } = useRivalryData(DEFAULT_TABLE_SLUG);

  return (
    <PageTransition className="min-h-full pb-24">
      <header className="px-6 pt-8 pb-4">
        <h1 className="font-display text-display text-text-primary uppercase tracking-wider">
          History
        </h1>
        <p className="text-body text-text-secondary mt-1">
          All matches played
        </p>
      </header>

      <div className="px-6 space-y-3">
        {/* Loading state */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height="80px" className="w-full" />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 bg-accent-danger/10 border border-accent-danger/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-danger flex-shrink-0 mt-0.5" />
            <p className="text-body text-accent-danger">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && matches.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-body text-text-muted">No matches played yet</p>
            <p className="text-caption text-text-muted mt-1">
              Start a new match to see it here
            </p>
          </div>
        )}

        {/* Match list */}
        {!isLoading && !error && matches.map((match, index) => {
          const winnerSlug = getPlayerSlug(match.winner_player_id);
          const winnerName = getPlayerName(match.winner_player_id);
          const loserName = match.winner_player_id === PLAYER_IDS.bachi
            ? 'Crimebaker'
            : 'Bachi';
          const score = `${match.sets_a_won}–${match.sets_b_won}`;
          const isPinkWinner = winnerSlug === 'bachi';
          
          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card 
                variant="surface" 
                padding="md"
                className={`
                  relative overflow-hidden
                  border-l-[3px]
                  ${isPinkWinner 
                    ? 'border-l-accent-pink' 
                    : 'border-l-accent-cyan'
                  }
                `}
              >
                {/* Subtle glow effect */}
                <div 
                  className={`
                    absolute left-0 top-0 bottom-0 w-16 pointer-events-none
                    ${isPinkWinner 
                      ? 'bg-gradient-to-r from-accent-pink/10 to-transparent' 
                      : 'bg-gradient-to-r from-accent-cyan/10 to-transparent'
                    }
                  `}
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PlayerBadge
                      name={winnerName}
                      accent={isPinkWinner ? 'pink' : 'cyan'}
                    />
                    <div>
                      <span className="text-caption text-text-muted">defeated</span>
                      <span className="text-body text-text-secondary ml-1.5">{loserName}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`
                      font-display text-stat-medium tabular-nums
                      ${isPinkWinner ? 'text-accent-pink' : 'text-accent-cyan'}
                    `}>
                      {score}
                    </p>
                    <p className="text-caption text-text-muted flex items-center gap-1 justify-end">
                      <Calendar size={10} />
                      {formatRelativeDate(match.played_at)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {/* Total count */}
        {!isLoading && !error && matches.length > 0 && (
          <div className="text-center py-4">
            <span className="text-caption text-text-muted">
              {matches.length} match{matches.length !== 1 ? 'es' : ''} in history
            </span>
          </div>
        )}
      </div>

      {/* FAB */}
      <FAB to="/match/new" label="Log Match" />
    </PageTransition>
  );
}
