import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { getPlayerDisplayName, getPlayerImage } from '../lib/rivalryData';
import { getPlayerTheme } from '../hooks/usePlayerTheme';

export function DashboardPage() {
  const navigate = useNavigate();
  const { loading, summary } = useRivalryData(DEFAULT_TABLE_SLUG);

  if (loading || !summary) {
    return (
      <div className="h-screen w-full bg-midnight flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-neon-cyan/30 rounded-full animate-spin" />
      </div>
    );
  }

  // Determine Leader and Challenger
  // If no matches, default leader to Bachi (or handle gracefully)
  const leaderId = summary.leader || 'bachi';
  const challengerId = leaderId === 'bachi' ? 'crimebaker' : 'bachi';

  const isBachiLeader = leaderId === 'bachi';

  // Theme colors
  const leaderColor = isBachiLeader ? 'text-neon-cyan' : 'text-neon-pink';
  const challengerColor = isBachiLeader ? 'text-neon-pink' : 'text-neon-cyan';

  return (
    <div className="relative h-screen w-full overflow-hidden bg-midnight">

      {/* --- LAYER 1: THE KING (Top 65%) --- */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
        className="absolute top-0 right-0 w-full h-[65%] clip-path-diagonal-top bg-gradient-to-br from-slate-900 to-midnight z-10 overflow-hidden"
      >
        {/* Background Image (Leader) */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 grayscale"
          style={{ backgroundImage: `url(${getPlayerImage(leaderId)})` }}
        />
        {/* Color Overlay */}
        <div className={`absolute inset-0 ${isBachiLeader ? 'bg-cyan-900/30' : 'bg-pink-900/30'} mix-blend-overlay`} />

        {/* Content */}
        <div className="absolute bottom-16 right-6 text-right z-20">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`inline-block px-4 py-1 mb-2 transform -skew-x-12 ${isBachiLeader ? 'bg-neon-cyan text-black' : 'bg-neon-pink text-white'}`}
          >
            <span className="font-bold text-sm tracking-widest uppercase">
              KING (+{summary.leadMargin})
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-6xl md:text-8xl font-display font-black uppercase tracking-tighter text-white drop-shadow-[0_0_30px_${isBachiLeader ? 'rgba(0,240,255,0.6)' : 'rgba(255,0,255,0.6)'}]`}
          >
            {getPlayerDisplayName(leaderId)}
          </motion.h1>
        </div>
      </motion.div>

      {/* --- LAYER 2: THE CHALLENGER (Bottom 40%) --- */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
        className="absolute bottom-0 left-0 w-full h-[40%] clip-path-diagonal-bottom bg-slate-950 z-0 overflow-hidden"
      >
        {/* Background Image (Challenger) - Subtle */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10 grayscale scale-110"
          style={{ backgroundImage: `url(${getPlayerImage(challengerId)})` }}
        />

        {/* Content */}
        <div className="absolute top-12 left-6 text-left z-20">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-6xl font-display font-bold uppercase text-slate-500/80"
          >
            {getPlayerDisplayName(challengerId)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-slate-600 font-mono text-sm tracking-[0.2em] uppercase mt-2"
          >
            HUNTING THE THRONE
          </motion.p>
        </div>
      </motion.div>

      {/* --- LAYER 3: THE TRIGGER (Center) --- */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/arena')}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:translate-y-[-20%] z-50 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_white] hover:shadow-[0_0_60px_#00f0ff] transition-shadow duration-300"
      >
        <span className="text-black font-display font-black text-2xl tracking-tighter">VS</span>
      </motion.button>
    </div>
  );
}
