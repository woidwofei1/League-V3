import { Calendar, AlertCircle } from 'lucide-react';
import { PageTransition, Card, PlayerBadge, Skeleton } from '../components';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerName, getPlayerSlug } from '../lib/matches';
import { PLAYER_IDS } from '../lib/profile';

/**
 * Format a date relative to now (Today, Yesterday, X days ago, or date)
 */
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function HistoryPage() {
  const { loading: isLoading, error, matches } = useRivalryData(DEFAULT_TABLE_SLUG);

  return (
    <PageTransition className="min-h-full">
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-display text-text-primary">History</h1>
        <p className="text-body text-text-secondary mt-1">
          All matches played
        </p>
      </header>

      <div className="px-6 space-y-3">
        {/* Loading state */}
        {isLoading && (
          <div className="space-y-3">
            <Skeleton height="72px" className="w-full" />
            <Skeleton height="72px" className="w-full" />
            <Skeleton height="72px" className="w-full" />
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
            <p className="text-body text-text-muted">No matches played yet</p>
            <p className="text-caption text-text-muted mt-1">Start a new match to see it here</p>
          </div>
        )}

        {/* Match list */}
        {!isLoading && !error && matches.map((match) => {
          const winnerSlug = getPlayerSlug(match.winner_player_id);
          const winnerName = getPlayerName(match.winner_player_id);
          const loserName = match.winner_player_id === PLAYER_IDS.bachi
            ? 'Crimebaker'
            : 'Bachi';
          const score = `${match.sets_a_won}–${match.sets_b_won}`;
          
          return (
            <Card key={match.id} variant="surface" padding="md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlayerBadge
                    name={winnerName}
                    accent={winnerSlug === 'bachi' ? 'pink' : 'cyan'}
                  />
                  <span className="text-caption text-text-muted">def.</span>
                  <span className="text-body text-text-secondary">{loserName}</span>
                </div>
                <div className="text-right">
                  <p className="text-body tabular-nums font-semibold text-text-primary">
                    {score}
                  </p>
                  <p className="text-caption text-text-muted flex items-center gap-1 justify-end">
                    <Calendar size={10} />
                    {formatRelativeDate(match.played_at)}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PageTransition>
  );
}
