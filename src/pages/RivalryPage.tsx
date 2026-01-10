import { Trophy, TrendingUp, Flame } from 'lucide-react';
import { PageTransition, Card, PlayerBadge, StatTile, Divider } from '../components';

export function RivalryPage() {
  return (
    <PageTransition className="min-h-full">
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-display text-text-primary">Rivalry</h1>
        <p className="text-body text-text-secondary mt-1">
          The eternal battle
        </p>
      </header>

      <div className="px-6 space-y-6">
        {/* Leader card */}
        <Card variant="elevated" padding="lg" className="relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-accent-pink" />
              <span className="text-caption text-text-muted uppercase tracking-wider">
                Current Leader
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <PlayerBadge name="Bachi" accent="pink" isLeader />
              <StatTile label="Lead" value="+3" accent="pink" size="lg" />
            </div>
          </div>
        </Card>

        {/* Head to head */}
        <Card variant="surface" padding="lg">
          <h2 className="text-headline text-text-primary mb-4">Head to Head</h2>
          
          <div className="flex items-center justify-between">
            <div className="text-center">
              <PlayerBadge name="Bachi" accent="pink" />
              <p className="text-stat-large tabular-nums text-accent-pink mt-2">13</p>
            </div>
            
            <div className="text-center">
              <span className="text-caption text-text-muted">WINS</span>
            </div>
            
            <div className="text-center">
              <PlayerBadge name="Crimebaker" accent="cyan" />
              <p className="text-stat-large tabular-nums text-accent-cyan mt-2">10</p>
            </div>
          </div>
        </Card>

        <Divider />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={16} className="text-accent-pink" />
              <span className="text-caption text-text-muted">Current Streak</span>
            </div>
            <p className="text-stat-medium tabular-nums text-text-primary">5W</p>
            <p className="text-caption text-text-secondary">Bachi</p>
          </Card>
          
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-accent-cyan" />
              <span className="text-caption text-text-muted">Longest Streak</span>
            </div>
            <p className="text-stat-medium tabular-nums text-text-primary">8W</p>
            <p className="text-caption text-text-secondary">Crimebaker</p>
          </Card>
        </div>

        {/* Last 5 placeholder */}
        <Card variant="surface" padding="md">
          <h3 className="text-caption text-text-muted uppercase tracking-wider mb-3">
            Last 5 Matches
          </h3>
          <div className="flex gap-2">
            {['W', 'W', 'L', 'W', 'W'].map((result, i) => (
              <div
                key={i}
                className={`
                  flex-1 h-10 rounded-sm flex items-center justify-center
                  text-body font-bold
                  ${result === 'W'
                    ? 'bg-accent-success/20 text-accent-success'
                    : 'bg-accent-danger/20 text-accent-danger'
                  }
                `}
              >
                {result}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
