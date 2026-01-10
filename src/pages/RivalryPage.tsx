import { Trophy, TrendingUp, Flame, AlertCircle } from 'lucide-react';
import { PageTransition, Card, PlayerBadge, StatTile, Divider, Skeleton } from '../components';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';

export function RivalryPage() {
  const { loading: isLoading, error, summary: stats } = useRivalryData(DEFAULT_TABLE_SLUG);

  return (
    <PageTransition className="min-h-full">
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-display text-text-primary">Rivalry</h1>
        <p className="text-body text-text-secondary mt-1">
          The eternal battle
        </p>
      </header>

      <div className="px-6 space-y-6">
        {/* Loading state */}
        {isLoading && (
          <>
            <Skeleton height="120px" className="w-full" />
            <Skeleton height="140px" className="w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton height="100px" className="w-full" />
              <Skeleton height="100px" className="w-full" />
            </div>
            <Skeleton height="80px" className="w-full" />
          </>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 bg-accent-danger/10 border border-accent-danger/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-danger flex-shrink-0 mt-0.5" />
            <p className="text-body text-accent-danger">{error}</p>
          </div>
        )}

        {/* No matches yet */}
        {!isLoading && !error && stats && stats.totalMatches === 0 && (
          <div className="text-center py-12">
            <Trophy size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-body text-text-muted">No matches played yet</p>
            <p className="text-caption text-text-muted mt-1">Play your first match to start the rivalry!</p>
          </div>
        )}

        {/* Stats content */}
        {!isLoading && !error && stats && stats.totalMatches > 0 && (
          <>
            {/* Leader card */}
            <Card variant="elevated" padding="lg" className="relative overflow-hidden">
              {/* Glow effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 ${
                stats.leader === 'bachi' ? 'bg-accent-pink/10' : 'bg-accent-cyan/10'
              }`} />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={20} className={stats.leader === 'bachi' ? 'text-accent-pink' : 'text-accent-cyan'} />
                  <span className="text-caption text-text-muted uppercase tracking-wider">
                    {stats.leader ? 'Current Leader' : 'Tied!'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  {stats.leader ? (
                    <>
                      <PlayerBadge
                        name={getPlayerDisplayName(stats.leader)}
                        accent={stats.leader === 'bachi' ? 'pink' : 'cyan'}
                        isLeader
                      />
                      <StatTile
                        label="Lead"
                        value={`+${stats.leadMargin}`}
                        accent={stats.leader === 'bachi' ? 'pink' : 'cyan'}
                        size="lg"
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
                      <PlayerBadge name="Bachi" accent="pink" />
                      <span className="text-headline text-text-muted">=</span>
                      <PlayerBadge name="Crimebaker" accent="cyan" />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Head to head */}
            <Card variant="surface" padding="lg">
              <h2 className="text-headline text-text-primary mb-4">Head to Head</h2>
              
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <PlayerBadge name="Bachi" accent="pink" />
                  <p className="text-stat-large tabular-nums text-accent-pink mt-2">{stats.bachiWins}</p>
                </div>
                
                <div className="text-center">
                  <span className="text-caption text-text-muted">WINS</span>
                </div>
                
                <div className="text-center">
                  <PlayerBadge name="Crimebaker" accent="cyan" />
                  <p className="text-stat-large tabular-nums text-accent-cyan mt-2">{stats.crimebakerWins}</p>
                </div>
              </div>
            </Card>

            <Divider />

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className={
                    stats.currentStreak.player === 'bachi' ? 'text-accent-pink' : 'text-accent-cyan'
                  } />
                  <span className="text-caption text-text-muted">Current Streak</span>
                </div>
                <p className="text-stat-medium tabular-nums text-text-primary">
                  {stats.currentStreak.count > 0 ? `${stats.currentStreak.count}W` : '—'}
                </p>
                <p className="text-caption text-text-secondary">
                  {getPlayerDisplayName(stats.currentStreak.player)}
                </p>
              </Card>
              
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className={
                    stats.longestStreak.player === 'bachi' ? 'text-accent-pink' : 'text-accent-cyan'
                  } />
                  <span className="text-caption text-text-muted">Longest Streak</span>
                </div>
                <p className="text-stat-medium tabular-nums text-text-primary">
                  {stats.longestStreak.count > 0 ? `${stats.longestStreak.count}W` : '—'}
                </p>
                <p className="text-caption text-text-secondary">
                  {getPlayerDisplayName(stats.longestStreak.player)}
                </p>
              </Card>
            </div>

            {/* Last 5 */}
            {stats.last5.length > 0 && (
              <Card variant="surface" padding="md">
                <h3 className="text-caption text-text-muted uppercase tracking-wider mb-3">
                  Last {stats.last5.length} Match{stats.last5.length !== 1 ? 'es' : ''}
                </h3>
                <div className="flex gap-2">
                  {stats.last5.map((result, i) => (
                    <div
                      key={i}
                      className={`
                        flex-1 h-10 rounded-sm flex items-center justify-center
                        text-body font-bold
                        ${result.winner === 'bachi'
                          ? 'bg-accent-pink/20 text-accent-pink'
                          : 'bg-accent-cyan/20 text-accent-cyan'
                        }
                      `}
                      title={getPlayerDisplayName(result.winner)}
                    >
                      {result.winner === 'bachi' ? 'B' : 'C'}
                    </div>
                  ))}
                </div>
                <p className="text-caption text-text-muted mt-2 text-center">
                  B = Bachi · C = Crimebaker
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
