import { useState, useEffect, useMemo } from 'react';
import { User, MapPin, LogOut, Loader2, Trophy, Flame, Target, TrendingUp, Zap } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { DynamicIsland, calculateBadges, BadgeCard } from '../components';
import type { BadgeType } from '../components';
import { getMyProfile, type Profile } from '../lib/profile';
import { signOut } from '../lib/auth';
import { supabase } from '../lib/supabaseClient';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function BentoCard({ children, className = '', delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass-panel p-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function BentoProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { summary, eloSeries, matches } = useRivalryData(DEFAULT_TABLE_SLUG);
  const lastMatchTime = matches[0]?.played_at;

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

  const handleSignOut = async () => {
    if (!confirm('Sign out and clear session?')) return;
    setIsSigningOut(true);
    try {
      await signOut();
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to sign out:', err);
      setIsSigningOut(false);
    }
  };

  const playerName = profile?.player?.display_name ?? 'Unknown';
  const playerSlug = profile?.player?.slug;
  const isPlayerBachi = playerSlug === 'bachi';
  const themeColor = isPlayerBachi ? 'cyan' : 'pink';

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

  const earnedBadges = useMemo<BadgeType[]>(() => {
    if (!playerStats) return [];
    return calculateBadges({
      currentStreak: playerStats.currentStreak,
      isLeader: playerStats.isLeader,
      totalMatches: playerStats.wins + playerStats.losses,
      winRate: playerStats.winRate,
    });
  }, [playerStats]);

  const currentElo = useMemo(() => {
    if (eloSeries.length === 0) return 1000;
    const latest = eloSeries[eloSeries.length - 1];
    return isPlayerBachi ? latest.bachiElo : latest.crimebakerElo;
  }, [eloSeries, isPlayerBachi]);

  const playerEloData = useMemo(() => {
    return eloSeries.map((point) => ({
      date: point.date,
      elo: isPlayerBachi ? point.bachiElo : point.crimebakerElo,
    }));
  }, [eloSeries, isPlayerBachi]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-white/30 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="glass-panel p-6 text-center max-w-sm">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-white/60 underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-8 pb-4"
      >
        <h1 className="text-3xl font-display uppercase text-white mb-1">Profile</h1>
        <p className="text-white/40 font-mono text-sm uppercase tracking-wider">Your Rivalry Identity</p>
      </motion.header>

      <div className="px-4 space-y-3">
        {/* Player Identity Card - Large */}
        <BentoCard className="relative overflow-hidden" delay={0.05}>
          <div 
            className={`absolute inset-0 ${
              themeColor === 'pink' 
                ? 'bg-gradient-to-br from-pink-500/20 via-transparent to-transparent' 
                : 'bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent'
            }`}
          />
          <div className="relative flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display ${
              themeColor === 'pink' ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'
            }`}>
              {playerName[0]}
            </div>
            <div className="flex-1">
              <p className={`text-2xl font-display uppercase ${
                themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'
              }`}>
                {playerName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {playerStats?.isLeader && (
                  <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded-full ${
                    themeColor === 'pink' ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    Champion
                  </span>
                )}
                <span className="text-white/40 text-xs font-mono uppercase">
                  {playerStats?.wins ?? 0}W - {playerStats?.losses ?? 0}L
                </span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Stats Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {/* Wins */}
          <BentoCard delay={0.1}>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className={themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'} size={16} />
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Wins</span>
            </div>
            <p className="text-4xl font-mono font-bold text-white">{playerStats?.wins ?? 0}</p>
          </BentoCard>

          {/* Win Rate */}
          <BentoCard delay={0.15}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-emerald-400" size={16} />
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Win Rate</span>
            </div>
            <p className="text-4xl font-mono font-bold text-white">
              {Math.round(playerStats?.winRate ?? 0)}%
            </p>
          </BentoCard>

          {/* Current Streak */}
          <BentoCard delay={0.2}>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="text-orange-400" size={16} />
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Streak</span>
            </div>
            <p className="text-4xl font-mono font-bold text-white">{playerStats?.currentStreak ?? 0}</p>
          </BentoCard>

          {/* Elo */}
          <BentoCard delay={0.25}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className={themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'} size={16} />
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Elo</span>
            </div>
            <p className={`text-4xl font-mono font-bold ${
              themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'
            }`}>{currentElo}</p>
          </BentoCard>
        </div>

        {/* Elo Chart */}
        {playerEloData.length > 1 && (
          <BentoCard delay={0.3}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className={themeColor === 'pink' ? 'text-pink-400' : 'text-cyan-400'} size={16} />
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Elo Progression</span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={playerEloData}>
                  <Line 
                    type="monotone" 
                    dataKey="elo" 
                    stroke={themeColor === 'pink' ? '#f472b6' : '#22d3ee'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>
        )}

        {/* Badges */}
        <BentoCard delay={0.35}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="text-yellow-400" size={16} />
            <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Badges</span>
          </div>
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {earnedBadges.map((badge) => (
                <BadgeCard key={badge} type={badge} size="sm" showDescription={false} />
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm text-center py-4">Keep playing to earn badges!</p>
          )}
        </BentoCard>

        {/* Home Table */}
        <BentoCard delay={0.4}>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-purple-400" size={16} />
            <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Home Table</span>
          </div>
          <p className="text-white font-medium">Pink Room Main</p>
          <p className="text-white/40 text-sm">Innsbruck</p>
        </BentoCard>

        {/* Session Info */}
        <BentoCard delay={0.45} className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="text-white/40" size={16} />
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Session</span>
            </div>
          </div>
          <p className="text-xs text-white/30 font-mono break-all mb-4">{userId ?? 'Unknown'}</p>
          
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center gap-2 text-red-400 transition-colors disabled:opacity-50"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-mono uppercase tracking-wider">Signing out...</span>
              </>
            ) : (
              <>
                <LogOut size={16} />
                <span className="text-sm font-mono uppercase tracking-wider">Sign Out</span>
              </>
            )}
          </button>
        </BentoCard>
      </div>

      {/* Dynamic Island Nav */}
      <DynamicIsland lastMatchTime={lastMatchTime} />
    </div>
  );
}
