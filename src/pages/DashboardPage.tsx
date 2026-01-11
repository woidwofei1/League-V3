import { motion } from 'framer-motion';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { usePlayerTheme, useThemeClasses } from '../hooks/usePlayerTheme';
import { ChampionBanner, TaleOfTheTape, HotZone, BattleFeed } from '../components/DashboardWidgets';

export function DashboardPage() {
  const { loading, summary, matches } = useRivalryData(DEFAULT_TABLE_SLUG);

  // Determine current "King" theme
  const leaderTheme = usePlayerTheme({ leaderId: summary?.leader });
  const themeClasses = useThemeClasses(leaderTheme);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center pt-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-white/30 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="min-h-full pb-24">
      {/* Epic Header */}
      <div className="relative overflow-hidden mb-6">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/tabla-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/40 via-transparent to-bg-primary" />

        {/* Animated glow */}
        <motion.div
          className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30 ${themeClasses.bg}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative px-4 pt-10 pb-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-1 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-pink-400`} />
            <div>
              <h1 className="text-4xl font-display uppercase tracking-tight text-white">Dashboard</h1>
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-1">Live Rivalry Stats</p>
            </div>
          </div>
        </motion.header>
      </div>

      <div className="px-4">
        {/* 1. Champion Spotlight */}
        <ChampionBanner
          leaderId={summary.leader}
          leadMargin={summary.leadMargin}
        />

        {/* 2. Hot Zone Streak (Only shows if streak > 1) */}
        <HotZone streak={summary.currentStreak} />

        {/* 3. Tale of the Tape */}
        <div className="mt-6">
          <TaleOfTheTape summary={summary} />
        </div>

        {/* 4. Battle Feed */}
        <BattleFeed matches={matches} />
      </div>
    </div>
  );
}
