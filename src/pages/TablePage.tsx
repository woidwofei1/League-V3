import { Link, useParams } from 'react-router-dom';
import { MapPin, Play, Swords } from 'lucide-react';
import { PageTransition, Button, Card, PlayerBadge, StatTile, Divider } from '../components';

export function TablePage() {
  const { tableSlug } = useParams<{ tableSlug: string }>();

  // Format table name from slug
  const tableName = tableSlug
    ?.split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') ?? 'Table';

  return (
    <PageTransition className="min-h-full">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-2 text-text-secondary mb-2">
          <MapPin size={16} />
          <span className="text-caption">Innsbruck</span>
        </div>
        <h1 className="text-display text-text-primary">{tableName}</h1>
        <p className="text-body text-text-secondary mt-1">
          Ready for battle
        </p>
      </header>

      {/* Main content */}
      <div className="px-6 space-y-6">
        {/* Primary CTA */}
        <Link to={`/match/new?table=${tableSlug}`}>
          <Button variant="primary" size="lg" fullWidth className="gap-2">
            <Play size={20} />
            Start Match
          </Button>
        </Link>

        {/* Secondary CTA */}
        <Link to="/rivalry">
          <Button variant="secondary" size="lg" fullWidth className="gap-2">
            <Swords size={20} />
            View Rivalry
          </Button>
        </Link>

        <Divider className="my-8" />

        {/* Rivalry preview card */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-headline text-text-primary mb-4">
            Current Rivalry
          </h2>

          {/* Players */}
          <div className="flex items-center justify-between mb-6">
            <PlayerBadge name="Bachi" accent="pink" isLeader />
            <span className="text-caption text-text-muted">VS</span>
            <PlayerBadge name="Crimebaker" accent="cyan" />
          </div>

          {/* Stats preview */}
          <div className="grid grid-cols-3 gap-4">
            <StatTile label="Matches" value="23" />
            <StatTile label="Leader" value="Bachi" accent="pink" />
            <StatTile label="Lead" value="+3" accent="pink" />
          </div>
        </Card>

        {/* Recent form placeholder */}
        <Card variant="glass" padding="md">
          <h3 className="text-caption text-text-muted uppercase tracking-wider mb-3">
            Last 5 Matches
          </h3>
          <div className="flex gap-2">
            {['W', 'W', 'L', 'W', 'W'].map((result, i) => (
              <div
                key={i}
                className={`
                  w-8 h-8 rounded-sm flex items-center justify-center
                  text-caption font-bold
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
