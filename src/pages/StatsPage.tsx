import { TrendingUp, Target, Percent, Award } from 'lucide-react';
import { PageTransition, Card, StatTile, PlayerBadge, Divider } from '../components';

export function StatsPage() {
  return (
    <PageTransition className="min-h-full">
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-display text-text-primary">Stats</h1>
        <p className="text-body text-text-secondary mt-1">
          Numbers don't lie
        </p>
      </header>

      <div className="px-6 space-y-6">
        {/* Overview stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card variant="elevated" padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-accent-cyan" />
              <span className="text-caption text-text-muted">Total Matches</span>
            </div>
            <p className="text-stat-large tabular-nums text-text-primary">23</p>
          </Card>
          
          <Card variant="elevated" padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Percent size={16} className="text-accent-pink" />
              <span className="text-caption text-text-muted">Rivalry Age</span>
            </div>
            <p className="text-stat-medium tabular-nums text-text-primary">14d</p>
          </Card>
        </div>

        <Divider />

        {/* Player stats */}
        <div className="space-y-4">
          <h2 className="text-headline text-text-primary">Player Stats</h2>

          {/* Bachi */}
          <Card variant="surface" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <PlayerBadge name="Bachi" accent="pink" />
              <div className="flex items-center gap-1 text-accent-pink">
                <Award size={14} />
                <span className="text-caption">Leader</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatTile label="Win Rate" value="57%" accent="pink" />
              <StatTile label="Elo" value="1542" accent="cyan" />
              <StatTile label="Avg Pts" value="8.4" />
            </div>
          </Card>

          {/* Crimebaker */}
          <Card variant="surface" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <PlayerBadge name="Crimebaker" accent="cyan" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatTile label="Win Rate" value="43%" />
              <StatTile label="Elo" value="1458" accent="cyan" />
              <StatTile label="Avg Pts" value="7.9" />
            </div>
          </Card>
        </div>

        <Divider />

        {/* Elo chart placeholder */}
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-accent-cyan" />
            <h2 className="text-headline text-text-primary">Elo Over Time</h2>
          </div>
          
          {/* Placeholder chart */}
          <div className="h-40 flex items-center justify-center border border-dashed border-border-subtle rounded-md">
            <p className="text-text-muted text-caption">
              Chart coming with Supabase data
            </p>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
