import { useState, useEffect, useMemo } from 'react';
import { User, MapPin, LogOut, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { 
  PageTransition, 
  Card, 
  PlayerBadge, 
  Button, 
  Skeleton, 
  BadgeCard,
  calculateBadges,
  FAB,
} from '../components';
import type { BadgeType } from '../components';
import { getMyProfile, type Profile } from '../lib/profile';
import { signOut } from '../lib/auth';
import { supabase } from '../lib/supabaseClient';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Get rivalry data for stats
  const { summary, eloSeries } = useRivalryData(DEFAULT_TABLE_SLUG);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id ?? null);
        const profileData = await getMyProfile();
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleResetSession = async () => {
    if (!confirm('This will sign you out and clear your local session. Continue?')) {
      return;
    }
    setIsSigningOut(true);
    try {
      await signOut();
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to sign out:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      setIsSigningOut(false);
    }
  };

  const playerName = profile?.player?.display_name ?? 'Unknown';
  const playerSlug = profile?.player?.slug;
  const isPlayerBachi = playerSlug === 'bachi';

  // Calculate player-specific stats
  const playerStats = useMemo(() => {
    if (!summary) return null;
    
    const wins = isPlayerBachi ? summary.bachiWins : summary.crimebakerWins;
    const losses = isPlayerBachi ? summary.crimebakerWins : summary.bachiWins;
    const winRate = isPlayerBachi ? summary.winRateBachi : summary.winRateCrimebaker;
    const avgPoints = isPlayerBachi ? summary.avgPointsBachi : summary.avgPointsCrimebaker;
    const isLeader = summary.leader === (isPlayerBachi ? 'bachi' : 'crimebaker');
    const isOnStreak = summary.currentStreak.player === (isPlayerBachi ? 'bachi' : 'crimebaker');
    const currentStreak = isOnStreak ? summary.currentStreak.count : 0;

    return { wins, losses, winRate, avgPoints, isLeader, currentStreak };
  }, [summary, isPlayerBachi]);

  // Calculate earned badges
  const earnedBadges = useMemo<BadgeType[]>(() => {
    if (!playerStats) return [];
    return calculateBadges({
      currentStreak: playerStats.currentStreak,
      isLeader: playerStats.isLeader,
      totalMatches: playerStats.wins + playerStats.losses,
      winRate: playerStats.winRate,
    });
  }, [playerStats]);

  // Get current Elo from series
  const currentElo = useMemo(() => {
    if (eloSeries.length === 0) return 1000;
    const latest = eloSeries[eloSeries.length - 1];
    return isPlayerBachi ? latest.bachiElo : latest.crimebakerElo;
  }, [eloSeries, isPlayerBachi]);

  // Prepare Elo chart data for this player only
  const playerEloData = useMemo(() => {
    return eloSeries.map((point) => ({
      date: point.date,
      elo: isPlayerBachi ? point.bachiElo : point.crimebakerElo,
    }));
  }, [eloSeries, isPlayerBachi]);

  return (
    <PageTransition className="min-h-full pb-24">
      <header className="px-6 pt-8 pb-4">
        <h1 className="font-display text-display text-text-primary uppercase tracking-wider">
          Profile
        </h1>
        <p className="text-body text-text-secondary mt-1">
          Your identity in the rivalry
        </p>
      </header>

      <div className="px-6 space-y-6">
        {/* Loading state */}
        {isLoading && (
          <>
            <Skeleton height="160px" className="w-full" />
            <Skeleton height="100px" className="w-full" />
            <Skeleton height="200px" className="w-full" />
          </>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="p-4 bg-accent-danger/10 border border-accent-danger/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-danger flex-shrink-0 mt-0.5" />
            <p className="text-body text-accent-danger">{error}</p>
          </div>
        )}

        {/* Profile content */}
        {!isLoading && !error && profile && (
          <>
            {/* Player Card */}
            <Card variant="elevated" padding="lg" className="relative overflow-hidden">
              <motion.div 
                className={`
                  absolute top-0 right-0 w-40 h-40 blur-3xl rounded-full 
                  -translate-y-1/2 translate-x-1/2
                  ${isPlayerBachi ? 'bg-accent-pink/20' : 'bg-accent-cyan/20'}
                `}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className={isPlayerBachi ? 'text-accent-pink' : 'text-accent-cyan'} />
                  <span className="text-label uppercase tracking-widest text-text-muted">
                    Playing As
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <PlayerBadge
                    name={playerName}
                    accent={isPlayerBachi ? 'pink' : 'cyan'}
                    isLeader={playerStats?.isLeader}
                  />
                  {playerStats?.isLeader && (
                    <span className={`
                      text-caption font-semibold px-2 py-0.5 rounded-full
                      ${isPlayerBachi ? 'bg-accent-pink/20 text-accent-pink' : 'bg-accent-cyan/20 text-accent-cyan'}
                    `}>
                      Champion
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            {playerStats && (
              <div className="grid grid-cols-4 gap-3">
                <Card variant="glass" padding="sm" className="text-center">
                  <p className="font-display text-stat-medium text-text-primary">{playerStats.wins}</p>
                  <p className="text-caption text-text-muted">Wins</p>
                </Card>
                <Card variant="glass" padding="sm" className="text-center">
                  <p className="font-display text-stat-medium text-text-primary">{playerStats.losses}</p>
                  <p className="text-caption text-text-muted">Losses</p>
                </Card>
                <Card variant="glass" padding="sm" className="text-center">
                  <p className={`font-display text-stat-medium ${isPlayerBachi ? 'text-accent-pink' : 'text-accent-cyan'}`}>
                    {currentElo}
                  </p>
                  <p className="text-caption text-text-muted">Elo</p>
                </Card>
                <Card variant="glass" padding="sm" className="text-center">
                  <p className="font-display text-stat-medium text-text-primary">
                    {Math.round(playerStats.winRate)}%
                  </p>
                  <p className="text-caption text-text-muted">Win %</p>
                </Card>
              </div>
            )}

            {/* Badges Section */}
            <Card variant="surface" padding="md">
              <h3 className="font-heading text-headline text-text-primary uppercase tracking-wide mb-3">
                Badges
              </h3>
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {earnedBadges.map((badge) => (
                    <BadgeCard key={badge} type={badge} size="sm" showDescription={false} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-caption text-text-muted">
                    Keep playing to earn badges!
                  </p>
                </div>
              )}
            </Card>

            {/* Elo Progression Chart */}
            {playerEloData.length > 1 && (
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className={isPlayerBachi ? 'text-accent-pink' : 'text-accent-cyan'} />
                  <h3 className="font-heading text-headline text-text-primary uppercase tracking-wide">
                    Elo Progression
                  </h3>
                </div>
                
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={playerEloData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: 'var(--text-muted)', fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tick={{ fill: 'var(--text-muted)', fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                        width={35}
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
                      <Line 
                        type="monotone" 
                        dataKey="elo" 
                        stroke={isPlayerBachi ? 'var(--accent-pink)' : 'var(--accent-cyan)'}
                        strokeWidth={2}
                        dot={false}
                        name="Elo"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Venue Card */}
            <Card variant="surface" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-accent-cyan" />
                <span className="text-label uppercase tracking-widest text-text-muted">
                  Home Table
                </span>
              </div>
              <p className="font-heading text-headline text-text-primary">Pink Room Main</p>
              <p className="text-body text-text-secondary">Innsbruck</p>
            </Card>

            {/* Dev/Settings Section */}
            <div className="pt-4 border-t border-border-subtle">
              <p className="text-label uppercase tracking-widest text-text-muted mb-3">
                Session
              </p>
              
              <Card variant="glass" padding="sm" className="mb-3">
                <p className="text-caption text-text-muted">User ID</p>
                <p className="text-xs font-mono text-text-secondary break-all">
                  {userId ?? 'Unknown'}
                </p>
              </Card>

              <Button
                variant="danger"
                fullWidth
                onClick={handleResetSession}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut size={16} className="mr-2" />
                    Reset Session
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {/* No profile state */}
        {!isLoading && !error && !profile && (
          <div className="text-center py-12">
            <User size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-body text-text-muted">No profile found</p>
            <p className="text-caption text-text-muted mt-1">
              Try refreshing the page.
            </p>
          </div>
        )}
      </div>

      {/* FAB */}
      <FAB to="/match/new" label="Log Match" />
    </PageTransition>
  );
}
