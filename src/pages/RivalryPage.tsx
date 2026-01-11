import { Trophy, AlertCircle } from 'lucide-react';
import { 
  PageTransition, 
  Skeleton, 
  ChampionHero,
  ScoreboardArena,
  StatStrip,
  LiveFeed,
  FightFAB,
} from '../components';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';

export function RivalryPage() {
  const { loading: isLoading, error, summary: stats } = useRivalryData(DEFAULT_TABLE_SLUG);

  // Prepare LiveFeed data
  const liveFeedMatches = stats?.last5.map(result => ({
    winner: getPlayerDisplayName(result.winner),
    score: '3-1', // We'd need to store this in the data
    winnerSlug: result.winner as 'bachi' | 'crimebaker',
  })) ?? [];

  return (
    <PageTransition className="min-h-full pb-28">
      <div className="max-w-md mx-auto px-4 pt-4">
        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton height="180px" className="w-full" />
            <Skeleton height="160px" className="w-full" />
            <Skeleton height="60px" className="w-full" />
            <Skeleton height="200px" className="w-full" />
          </div>
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
          <div className="text-center py-16">
            <Trophy size={64} className="text-text-muted mx-auto mb-6" />
            <p className="text-xl text-white mb-2 font-display">No Battles Yet</p>
            <p className="text-sm text-slate-400">
              Tap FIGHT to start the rivalry!
            </p>
          </div>
        )}

        {/* Main Arena Content */}
        {!isLoading && !error && stats && stats.totalMatches > 0 && (
          <div className="space-y-4">
            {/* Champion Hero - Top prominence */}
            {stats.leader && (
              <ChampionHero
                championName={getPlayerDisplayName(stats.leader)}
                leadCount={stats.leadMargin}
                accent={stats.leader === 'bachi' ? 'pink' : 'cyan'}
              />
            )}

            {/* Tied state */}
            {!stats.leader && (
              <div className="glass-panel py-8 text-center">
                <p className="font-display text-3xl text-white mb-2">IT'S A TIE!</p>
                <p className="text-sm text-slate-400">Who will break the deadlock?</p>
              </div>
            )}

            {/* Scoreboard Arena */}
            <ScoreboardArena
              player1={{
                name: 'Bachi',
                wins: stats.bachiWins,
                accent: 'cyan',
              }}
              player2={{
                name: 'Crimebaker',
                wins: stats.crimebakerWins,
                accent: 'pink',
              }}
            />

            {/* Stat Strip */}
            <StatStrip
              streakCount={stats.currentStreak.count}
              streakHolder={getPlayerDisplayName(stats.currentStreak.player)}
              maxStreak={stats.longestStreak.count}
              maxStreakHolder={getPlayerDisplayName(stats.longestStreak.player)}
            />

            {/* Live Feed */}
            {liveFeedMatches.length > 0 && (
              <LiveFeed matches={liveFeedMatches} maxItems={5} />
            )}

            {/* Total matches */}
            <div className="text-center py-4">
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                {stats.totalMatches} battle{stats.totalMatches !== 1 ? 's' : ''} fought
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FIGHT FAB */}
      <FightFAB to="/match/new" label="FIGHT" />
    </PageTransition>
  );
}
