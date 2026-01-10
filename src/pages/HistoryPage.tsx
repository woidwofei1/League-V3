import { Calendar } from 'lucide-react';
import { PageTransition, Card, PlayerBadge, Skeleton } from '../components';

export function HistoryPage() {
  // Placeholder match data
  const matches = [
    { id: 1, winner: 'Bachi', loser: 'Crimebaker', score: '3-1', date: 'Today' },
    { id: 2, winner: 'Bachi', loser: 'Crimebaker', score: '3-2', date: 'Yesterday' },
    { id: 3, winner: 'Crimebaker', loser: 'Bachi', score: '3-0', date: '2 days ago' },
    { id: 4, winner: 'Bachi', loser: 'Crimebaker', score: '3-1', date: '3 days ago' },
    { id: 5, winner: 'Bachi', loser: 'Crimebaker', score: '3-2', date: '4 days ago' },
  ];

  return (
    <PageTransition className="min-h-full">
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-display text-text-primary">History</h1>
        <p className="text-body text-text-secondary mt-1">
          All matches played
        </p>
      </header>

      <div className="px-6 space-y-3">
        {matches.map((match) => (
          <Card key={match.id} variant="surface" padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlayerBadge
                  name={match.winner}
                  accent={match.winner === 'Bachi' ? 'pink' : 'cyan'}
                />
                <span className="text-caption text-text-muted">def.</span>
                <span className="text-body text-text-secondary">{match.loser}</span>
              </div>
              <div className="text-right">
                <p className="text-body tabular-nums font-semibold text-text-primary">
                  {match.score}
                </p>
                <p className="text-caption text-text-muted flex items-center gap-1 justify-end">
                  <Calendar size={10} />
                  {match.date}
                </p>
              </div>
            </div>
          </Card>
        ))}

        {/* Loading skeleton placeholder */}
        <div className="space-y-3 opacity-50">
          <Skeleton height="60px" className="w-full" />
          <Skeleton height="60px" className="w-full" />
        </div>

        <p className="text-center text-caption text-text-muted py-4">
          More match history coming with Supabase integration
        </p>
      </div>
    </PageTransition>
  );
}
