import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { Trophy, TrendingUp, User, LogOut, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useTrashTalk } from '../contexts/TrashTalkContext';
import { supabase } from '../lib/supabaseClient';
import { signOut } from '../lib/auth';
import { getMyProfile, PLAYER_IDS, type Profile } from '../lib/profile';
// Profile page with player-specific hero image

export function BentoProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Determine which player based on profile
  const isBachi = profile?.player_id === PLAYER_IDS.bachi;
  const isCrimebaker = profile?.player_id === PLAYER_IDS.crimebaker;
  const playerName = isBachi ? 'Bachi' : isCrimebaker ? 'Crimebaker' : 'Unknown';
  const playerImage = isBachi ? '/bachi-profile.jpg' : '/crime-profile.jpg';
  const playerColor = isBachi ? 'cyan' : 'pink';

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted) {
          setUserId(data.user?.id ?? null);
        }
        // Load profile
        const profileData = await getMyProfile();
        if (mounted && profileData) {
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Auth load error:", err);
      }
    }
    loadUser();
    return () => { mounted = false; };
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

  const { loading, summary, eloSeries } = useRivalryData(DEFAULT_TABLE_SLUG);
  const trashTalk = useTrashTalk();
  const { isEnabled, setEnabled } = trashTalk || { isEnabled: false, setEnabled: () => { } };

  // Simple Sparkline Component for Profile
  const EloGraph = () => {
    if (eloSeries.length < 2) return null;

    const width = 300;
    const height = 60; // Slightly taller for profile
    const padding = 5;

    // Find min/max for scaling
    const elos = eloSeries.flatMap(d => [d.bachiElo, d.crimebakerElo]);
    const minElo = Math.min(...elos, 950);
    const maxElo = Math.max(...elos, 1050);
    const range = maxElo - minElo || 1;

    // Scale helpers
    const getX = (i: number) => (i / (eloSeries.length - 1)) * (width - padding * 2) + padding;
    const getY = (elo: number) => height - ((elo - minElo) / range) * (height - padding * 2) - padding;

    // Generate paths
    const bachiPath = eloSeries.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.bachiElo)}`).join(' ');
    const crimePath = eloSeries.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.crimebakerElo)}`).join(' ');

    return (
      <div className="w-full max-w-xs mx-auto mt-4 mb-2 opacity-90">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 overflow-visible">
          {/* Bachi Line */}
          <motion.path
            d={bachiPath}
            fill="none"
            stroke="#22d3ee" // cyan-400
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            filter="drop-shadow(0 0 4px rgba(34, 211, 238, 0.4))"
          />
          {/* Crimebaker Line */}
          <motion.path
            d={crimePath}
            fill="none"
            stroke="#f472b6" // pink-400
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            filter="drop-shadow(0 0 4px rgba(244, 114, 182, 0.4))"
          />
        </svg>
        <div className="flex justify-between text-[10px] font-mono text-white/20 mt-2 uppercase tracking-wider">
          <span>Elo History</span>
          <span>Last {eloSeries.length} games</span>
        </div>
      </div>
    );
  };

  if (loading || !summary) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-cyan-400/30 rounded-full animate-spin" />
      </div>
    );
  }

  const leader = summary.leader;
  const themeColor = leader === 'crimebaker' ? 'pink' : 'cyan';

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pb-24">
      {/* Background Effects */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(/tabla-bg.png)' }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${themeColor === 'pink' ? 'from-pink-950/30' : 'from-cyan-950/30'
        } via-black/80 to-black`} />

      {/* Animated glow */}
      <motion.div
        className={`absolute top-20 right-0 w-64 h-64 rounded-full blur-3xl ${themeColor === 'pink' ? 'bg-pink-500/10' : 'bg-cyan-500/10'
          }`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 pt-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-display text-white uppercase tracking-tight">Profile</h1>
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Your Stats</p>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setEnabled(!isEnabled)}
            className={`p-3 rounded-full transition-all ${isEnabled
              ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
              : 'bg-white/5 border border-white/10 text-white/40'
              }`}
          >
            {isEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </motion.div>

        {/* Player Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8"
        >
          {/* Background glow */}
          <div className={`absolute inset-0 rounded-3xl ${playerColor === 'cyan'
            ? 'bg-gradient-to-br from-cyan-500/30 to-transparent'
            : 'bg-gradient-to-br from-pink-500/30 to-transparent'
            } blur-2xl`} />

          {/* Main image container */}
          <div className={`relative overflow-hidden rounded-3xl border-2 ${playerColor === 'cyan' ? 'border-cyan-500/40' : 'border-pink-500/40'
            }`}>
            <img
              src={playerImage}
              alt={playerName}
              className="w-full h-64 object-cover"
              style={{ objectPosition: '50% 30%' }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className={`text-4xl font-display uppercase tracking-tight ${playerColor === 'cyan' ? 'text-cyan-400' : 'text-pink-400'
                }`} style={{ textShadow: `0 0 30px ${playerColor === 'cyan' ? 'rgba(34,211,238,0.5)' : 'rgba(236,72,153,0.5)'}` }}>
                {playerName}
              </p>
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-1">
                ID: {userId ? userId.slice(0, 8) + '...' : 'Loading...'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Player Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* VS Header */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Bachi */}
            <div className="text-center flex-1">
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">Bachi</p>
              <p className="text-5xl font-display text-cyan-400 tabular-nums"
                style={{ textShadow: '0 0 30px rgba(34, 211, 238, 0.4)' }}>
                {summary.bachiWins}
              </p>
              <p className="text-cyan-400/60 font-mono text-sm mt-1">{summary.winRateBachi.toFixed(0)}%</p>
            </div>

            {/* Divider */}
            <div className="flex flex-col items-center">
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <span className="text-white/20 font-display text-lg my-1">VS</span>
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>

            {/* Crimebaker */}
            <div className="text-center flex-1">
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">Crimebaker</p>
              <p className="text-5xl font-display text-pink-400 tabular-nums"
                style={{ textShadow: '0 0 30px rgba(236, 72, 153, 0.4)' }}>
                {summary.crimebakerWins}
              </p>
              <p className="text-pink-400/60 font-mono text-sm mt-1">{summary.winRateCrimebaker.toFixed(0)}%</p>
            </div>
          </div>

          {/* Elo Graph */}
          <EloGraph />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {/* Total Matches */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
            <p className="text-2xl font-display text-white tabular-nums">{summary.totalMatches}</p>
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Battles</p>
          </div>

          {/* Lead */}
          <div className={`rounded-2xl p-4 border text-center ${leader === 'bachi'
            ? 'bg-cyan-500/10 border-cyan-500/20'
            : 'bg-pink-500/10 border-pink-500/20'
            }`}>
            <p className={`text-2xl font-display tabular-nums ${leader === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
              }`}>+{summary.leadMargin}</p>
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Lead</p>
          </div>

          {/* Streak */}
          <div className={`rounded-2xl p-4 border text-center ${summary.currentStreak.player === 'bachi'
            ? 'bg-cyan-500/10 border-cyan-500/20'
            : summary.currentStreak.player === 'crimebaker'
              ? 'bg-pink-500/10 border-pink-500/20'
              : 'bg-white/5 border-white/5'
            }`}>
            <div className="flex items-center justify-center gap-1">
              <TrendingUp size={16} className={
                summary.currentStreak.player === 'bachi' ? 'text-cyan-400' :
                  summary.currentStreak.player === 'crimebaker' ? 'text-pink-400' :
                    'text-white/40'
              } />
              <p className={`text-2xl font-display tabular-nums ${summary.currentStreak.player === 'bachi' ? 'text-cyan-400' :
                summary.currentStreak.player === 'crimebaker' ? 'text-pink-400' :
                  'text-white/40'
                }`}>{summary.currentStreak.count}</p>
            </div>
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Streak</p>
          </div>
        </motion.div>

        {/* Current King Card */}
        {leader && summary.leadMargin > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-5 rounded-2xl border mb-8 ${leader === 'bachi'
              ? 'bg-cyan-500/5 border-cyan-500/20'
              : 'bg-pink-500/5 border-pink-500/20'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${leader === 'bachi' ? 'bg-cyan-500/20' : 'bg-pink-500/20'
                }`}>
                <Trophy className={leader === 'bachi' ? 'text-cyan-400' : 'text-pink-400'} size={24} />
              </div>
              <div className="flex-1">
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Current King</p>
                <p className={`text-xl font-display uppercase ${leader === 'bachi' ? 'text-cyan-400' : 'text-pink-400'
                  }`}>
                  {leader === 'bachi' ? 'Bachi' : 'Crimebaker'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Session Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-2xl p-5 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-3">
            <User className="text-white/40" size={16} />
            <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Session</span>
          </div>
          <p className="text-xs text-white/20 font-mono break-all mb-4">
            {userId ? userId.slice(0, 8) + '...' + userId.slice(-4) : 'Unknown'}
          </p>

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
        </motion.div>

      </div>
    </div>
  );
}
