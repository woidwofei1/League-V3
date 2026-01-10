import { Link } from 'react-router-dom';
import { TrendingUp, Target, Flame, Award, AlertCircle, Play } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { PageTransition, Card, StatTile, PlayerBadge, Divider, Skeleton, Button } from '../components';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName } from '../lib/rivalryData';

export function StatsPage() {
  const { loading, error, summary, eloSeries } = useRivalryData(DEFAULT_TABLE_SLUG);

  // Get current Elo from the last point in the series
  const currentElo = eloSeries.length > 0 
    ? eloSeries[eloSeries.length - 1] 
    : { bachiElo: 1000, crimebakerElo: 1000 };

  // Prepare last 10 matches data for bar chart
  const last10Data = summary?.last5 
    ? [...summary.last5].reverse().map((r, i) => ({
        match: i + 1,
        winner: r.winner,
        value: 1,
      }))
    : [];

  return (
    <PageTransition className="min-h-full">
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-display text-text-primary">Stats</h1>
        <p className="text-body text-text-secondary mt-1">
          Numbers don't lie
        </p>
      </header>

      <div className="px-6 space-y-6">
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
            <div className="grid grid-cols-2 gap-4">
              <Skeleton height="80px" className="w-full" />
              <Skeleton height="80px" className="w-full" />
            </div>
            <Skeleton height="200px" className="w-full" />
            <Skeleton height="160px" className="w-full" />
          </>
        )}

        {/* Empty state */}
        {!loading && !error && summary && summary.totalMatches === 0 && (
          <div className="text-center py-12">
            <TrendingUp size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-headline text-text-primary mb-2">No stats yet</p>
            <p className="text-body text-text-muted mb-6">Play your first match to see stats and charts!</p>
            <Link to="/t/pink-room-main">
              <Button variant="primary" className="gap-2">
                <Play size={18} fill="currentColor" />
                Start Match
              </Button>
            </Link>
          </div>
        )}

        {/* Stats content */}
        {!loading && !error && summary && summary.totalMatches > 0 && (
          <>
            {/* Overview stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card variant="elevated" padding="md">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-accent-cyan" />
                  <span className="text-caption text-text-muted">Total Matches</span>
                </div>
                <p className="text-stat-large tabular-nums text-text-primary">{summary.totalMatches}</p>
              </Card>
              
              <Card variant="elevated" padding="md">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className={
                    summary.currentStreak.player === 'bachi' ? 'text-accent-pink' : 'text-accent-cyan'
                  } />
                  <span className="text-caption text-text-muted">Current Streak</span>
                </div>
                <p className="text-stat-large tabular-nums text-text-primary">
                  {summary.currentStreak.count > 0 ? `${summary.currentStreak.count}W` : '—'}
                </p>
                <p className="text-caption text-text-secondary">
                  {getPlayerDisplayName(summary.currentStreak.player)}
                </p>
              </Card>
            </div>

            {/* Elo Over Time Chart */}
            <Card variant="glass" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-accent-cyan" />
                <h2 className="text-headline text-text-primary">Elo Over Time</h2>
              </div>
              
              {eloSeries.length > 1 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={eloSeries} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                        axisLine={{ stroke: 'var(--border-subtle)' }}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--bg-surface)', 
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        labelStyle={{ color: 'var(--text-muted)' }}
                      />
                      <ReferenceLine y={1000} stroke="var(--border-subtle)" strokeDasharray="3 3" />
                      <Line 
                        type="monotone" 
                        dataKey="bachiElo" 
                        stroke="var(--accent-pink)" 
                        strokeWidth={2}
                        dot={false}
                        name="Bachi"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="crimebakerElo" 
                        stroke="var(--accent-cyan)" 
                        strokeWidth={2}
                        dot={false}
                        name="Crimebaker"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center border border-dashed border-border-subtle rounded-md">
                  <p className="text-text-muted text-caption">
                    Play more matches to see Elo trends
                  </p>
                </div>
              )}

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent-pink" />
                  <span className="text-caption text-text-secondary">Bachi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent-cyan" />
                  <span className="text-caption text-text-secondary">Crimebaker</span>
                </div>
              </div>
            </Card>

            {/* Recent Results Bar Chart */}
            {last10Data.length > 0 && (
              <Card variant="surface" padding="md">
                <h3 className="text-caption text-text-muted uppercase tracking-wider mb-3">
                  Recent Results
                </h3>
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={last10Data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {last10Data.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.winner === 'bachi' ? 'var(--accent-pink)' : 'var(--accent-cyan)'}
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-caption text-text-muted mt-2 text-center">
                  Pink = Bachi · Cyan = Crimebaker
                </p>
              </Card>
            )}

            <Divider />

            {/* Player stats */}
            <div className="space-y-4">
              <h2 className="text-headline text-text-primary">Player Stats</h2>

              {/* Bachi */}
              <Card variant="surface" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <PlayerBadge name="Bachi" accent="pink" />
                  {summary.leader === 'bachi' && (
                    <div className="flex items-center gap-1 text-accent-pink">
                      <Award size={14} />
                      <span className="text-caption">Leader</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <StatTile 
                    label="Win Rate" 
                    value={`${Math.round(summary.winRateBachi)}%`} 
                    accent={summary.leader === 'bachi' ? 'pink' : undefined}
                  />
                  <StatTile 
                    label="Elo" 
                    value={String(currentElo.bachiElo)} 
                    accent="pink" 
                  />
                  <StatTile 
                    label="Avg Pts" 
                    value={summary.avgPointsBachi.toFixed(1)} 
                  />
                </div>
              </Card>

              {/* Crimebaker */}
              <Card variant="surface" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <PlayerBadge name="Crimebaker" accent="cyan" />
                  {summary.leader === 'crimebaker' && (
                    <div className="flex items-center gap-1 text-accent-cyan">
                      <Award size={14} />
                      <span className="text-caption">Leader</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <StatTile 
                    label="Win Rate" 
                    value={`${Math.round(summary.winRateCrimebaker)}%`}
                    accent={summary.leader === 'crimebaker' ? 'cyan' : undefined}
                  />
                  <StatTile 
                    label="Elo" 
                    value={String(currentElo.crimebakerElo)} 
                    accent="cyan" 
                  />
                  <StatTile 
                    label="Avg Pts" 
                    value={summary.avgPointsCrimebaker.toFixed(1)} 
                  />
                </div>
              </Card>
            </div>

            <Divider />

            {/* Streak stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className={
                    summary.currentStreak.player === 'bachi' ? 'text-accent-pink' : 'text-accent-cyan'
                  } />
                  <span className="text-caption text-text-muted">Current Streak</span>
                </div>
                <p className="text-stat-medium tabular-nums text-text-primary">
                  {summary.currentStreak.count > 0 ? `${summary.currentStreak.count}W` : '—'}
                </p>
                <p className="text-caption text-text-secondary">
                  {getPlayerDisplayName(summary.currentStreak.player)}
                </p>
              </Card>
              
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className={
                    summary.longestStreak.player === 'bachi' ? 'text-accent-pink' : 'text-accent-cyan'
                  } />
                  <span className="text-caption text-text-muted">Longest Streak</span>
                </div>
                <p className="text-stat-medium tabular-nums text-text-primary">
                  {summary.longestStreak.count > 0 ? `${summary.longestStreak.count}W` : '—'}
                </p>
                <p className="text-caption text-text-secondary">
                  {getPlayerDisplayName(summary.longestStreak.player)}
                </p>
              </Card>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
