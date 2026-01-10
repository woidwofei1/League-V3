import { Link } from 'react-router-dom';
import { MapPin, Trophy } from 'lucide-react';
import { PageTransition, Button, Card, PlayerBadge, StatTile } from '../components';

export function HomePage() {
  return (
    <PageTransition className="min-h-full flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-display text-text-primary mb-2">
            Pink Room
            <span className="block text-accent-pink">Rivalry</span>
          </h1>
          <p className="text-body text-text-secondary">
            Table tennis. Two rivals. One throne.
          </p>
        </div>

        {/* Venue card */}
        <Card variant="elevated" className="w-full max-w-sm mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-accent-pink/10">
              <MapPin size={20} className="text-accent-pink" />
            </div>
            <div>
              <h2 className="text-headline text-text-primary">Pink Room</h2>
              <p className="text-caption text-text-secondary">
                Innsbruck · Main Table
              </p>
            </div>
          </div>
        </Card>

        {/* Current Leader preview */}
        <Card variant="glass" className="w-full max-w-sm mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={20} className="text-accent-pink" />
              <span className="text-caption text-text-muted uppercase tracking-wider">
                Current Leader
              </span>
            </div>
            <PlayerBadge name="Bachi" accent="pink" isLeader />
          </div>
          <div className="mt-4 flex gap-6">
            <StatTile label="Lead" value="+3" accent="pink" />
            <StatTile label="Streak" value="5W" accent="cyan" />
          </div>
        </Card>

        {/* CTAs */}
        <div className="w-full max-w-sm space-y-3">
          <Link to="/t/pink-room-main" className="block">
            <Button variant="primary" size="lg" fullWidth>
              Enter Table
            </Button>
          </Link>
          <Link to="/rivalry" className="block">
            <Button variant="secondary" size="lg" fullWidth>
              View Rivalry
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-caption text-text-muted">
        Best of 5 · First to 11 · Trust Mode
      </footer>
    </PageTransition>
  );
}
