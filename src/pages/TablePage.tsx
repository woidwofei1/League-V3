import { Link, useParams } from 'react-router-dom';
import { MapPin, Play, Swords, Trophy, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, Button, Card, PlayerBadge, StatTile, Skeleton } from '../components';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';

export function TablePage() {
  const { tableSlug = DEFAULT_TABLE_SLUG } = useParams<{ tableSlug: string }>();
  const { loading, error, table, summary } = useRivalryData(tableSlug);

  // Use table name or format from slug as fallback
  const tableName = table?.name ?? tableSlug
    ?.split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') ?? 'Table';

  // Use venue info with city fallback
  const venueName = table?.venue_city 
    ? `${table.venue_name}, ${table.venue_city}`
    : table?.venue_name ?? 'Pink Room';

  return (
    <PageTransition className="min-h-full flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-text-secondary mb-2">
          <MapPin size={14} />
          <span className="text-sm">{venueName}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-text-primary">{tableName}</h1>
        <p className="text-base text-text-secondary mt-1">
          {summary && summary.totalMatches > 0 
            ? `${summary.totalMatches} matches played`
            : 'Ready for battle'}
        </p>
      </header>

      {/* Main content */}
      <div className="flex-1 px-6 space-y-5">
        
        {/* Hero CTA - Start Match */}
        <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.08 }}>
          <Link to={`/match/new?table=${tableSlug}`} className="block">
            <Button variant="primary" size="lg" fullWidth className="h-16 text-lg font-bold gap-3">
              <Play size={24} fill="currentColor" />
              Start Match
            </Button>
          </Link>
        </motion.div>

        {/* Secondary CTA */}
        <Link to="/rivalry" className="block">
          <Button variant="secondary" size="lg" fullWidth className="gap-2">
            <Swords size={18} />
            View Full Rivalry
          </Button>
        </Link>

        {/* Error state */}
        {error && (
          <div className="p-4 bg-accent-danger/10 border border-accent-danger/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-danger flex-shrink-0 mt-0.5" />
            <p className="text-body text-accent-danger">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <>
            <Skeleton height="180px" className="w-full" />
            <Skeleton height="80px" className="w-full" />
          </>
        )}

        {/* Rivalry preview card - with dynamic data */}
        {!loading && !error && summary && (
          <>
            <Card 
              variant="elevated" 
              padding="lg"
              className="relative overflow-hidden"
            >
              {/* Subtle ambient based on leader */}
              <div className={`absolute -top-16 -right-16 w-32 h-32 blur-3xl rounded-full pointer-events-none ${
                summary.leader === 'bachi' ? 'bg-accent-pink/10' : 
                summary.leader === 'crimebaker' ? 'bg-accent-cyan/10' : 'bg-accent-pink/10'
              }`} />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={16} className={summary.leader === 'crimebaker' ? 'text-accent-cyan' : 'text-accent-pink'} />
                  <h2 className="text-lg font-bold text-text-primary">
                    Current Rivalry
                  </h2>
                </div>

                {/* Players */}
                <div className="flex items-center justify-between mb-5">
                  <PlayerBadge 
                    name="Bachi" 
                    accent="pink" 
                    isLeader={summary.leader === 'bachi'} 
                  />
                  <span className="text-xs text-text-muted font-bold tracking-widest">VS</span>
                  <PlayerBadge 
                    name="Crimebaker" 
                    accent="cyan" 
                    isLeader={summary.leader === 'crimebaker'}
                  />
                </div>

                {/* Stats preview */}
                {summary.totalMatches > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    <StatTile label="Matches" value={String(summary.totalMatches)} />
                    <StatTile 
                      label="Leader" 
                      value={summary.leader ? getPlayerDisplayName(summary.leader) : 'Tied'} 
                      accent={summary.leader === 'bachi' ? 'pink' : summary.leader === 'crimebaker' ? 'cyan' : undefined}
                    />
                    <StatTile 
                      label="Lead" 
                      value={summary.leadMargin > 0 ? `+${summary.leadMargin}` : '0'} 
                      accent={summary.leader === 'bachi' ? 'pink' : summary.leader === 'crimebaker' ? 'cyan' : undefined}
                    />
                  </div>
                ) : (
                  <p className="text-body text-text-muted text-center py-2">
                    No matches played yet. Start one above!
                  </p>
                )}
              </div>
            </Card>

            {/* Recent form - only show if there are matches */}
            {summary.last5.length > 0 && (
              <Card variant="glass" padding="md">
                <h3 className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
                  Last {summary.last5.length} Match{summary.last5.length !== 1 ? 'es' : ''}
                </h3>
                <div className="flex gap-2">
                  {summary.last5.map((result, i) => (
                    <div
                      key={i}
                      className={`
                        flex-1 h-9 rounded-lg flex items-center justify-center
                        text-sm font-bold
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
      
      {/* Bottom spacer for nav */}
      <div className="h-4" />
    </PageTransition>
  );
}
