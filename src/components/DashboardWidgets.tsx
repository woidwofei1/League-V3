import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { getPlayerDisplayName } from '../lib/rivalryData';
import { getPlayerName, getPlayerSlug } from '../lib/matches';
import { useThemeClasses } from '../hooks/usePlayerTheme';
import { PLAYER_IDS } from '../lib/profile';
import { useState } from 'react';

// --- Types ---
interface ChampionBannerProps {
    leaderId: string | null;
    leadMargin: number;
}

interface TaleOfTheTapeProps {
    summary: any;
}

interface HotZoneProps {
    streak: { player: string | null; count: number };
}

// --- Components ---

export function ChampionBanner({ leaderId, leadMargin }: ChampionBannerProps) {
    const themeClasses = useThemeClasses(leaderId === 'crimebaker' ? 'pink' : 'cyan');

    if (!leaderId) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl gaming-border bg-gray-900/80 p-6 mb-6"
        >
            {/* God Rays */}
            <div className="god-rays pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 ${themeClasses.border} bg-black/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                        <Trophy size={32} className={`text-${leaderId === 'crimebaker' ? 'pink-400' : 'cyan-400'} drop-shadow-lg`} />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                Current King
                            </span>
                        </div>
                        <h2 className={`text-3xl font-display uppercase tracking-tighter shimmer-text`} style={{
                            '--theme-primary': leaderId === 'crimebaker' ? '#ec4899' : '#22d3ee'
                        } as any}>
                            {getPlayerDisplayName(leaderId)}
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-white/40 text-xs font-mono uppercase">Lead</span>
                    <span className={`text-4xl font-display ${themeClasses.text} tabular-nums`}>+{leadMargin}</span>
                </div>
            </div>
        </motion.div>
    );
}

export function TaleOfTheTape({ summary }: TaleOfTheTapeProps) {
    const stats = [
        { label: 'Win Rate', bachi: summary.winRateBachi.toFixed(0) + '%', crime: summary.winRateCrimebaker.toFixed(0) + '%' },
        { label: 'Wins', bachi: summary.bachiWins, crime: summary.crimebakerWins },
        { label: 'Avg Pts', bachi: summary.avgPointsBachi, crime: summary.avgPointsCrimebaker },
    ];

    return (
        <div className="gaming-border rounded-xl bg-black/40 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                <span className="text-cyan-400 font-display text-lg">BACHI</span>
                <span className="text-white/40 font-mono text-xs uppercase tracking-widest">Tale of the Tape</span>
                <span className="text-pink-400 font-display text-lg">CRIME</span>
            </div>

            <div className="space-y-6">
                {stats.map((stat, i) => (
                    <div key={stat.label} className="relative">
                        <div className="flex justify-between text-sm font-mono font-bold text-white mb-2 relative z-10 px-1">
                            <span>{stat.bachi}</span>
                            <span className="text-white/30 font-medium text-xs uppercase">{stat.label}</span>
                            <span>{stat.crime}</span>
                        </div>

                        {/* Comparison Bars */}
                        <div className="flex h-2 bg-white/5 rounded-full overflow-hidden relative">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '50%' }}
                                transition={{ delay: 0.1 * i, duration: 1 }}
                                className="h-full bg-cyan-500/50 flex justify-end"
                            >
                                <div className="h-full bg-cyan-400 w-full origin-right" style={{ transform: 'scaleX(0.8)' }} />
                            </motion.div>
                            <div className="w-px bg-black/50 z-10" />
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '50%' }}
                                transition={{ delay: 0.1 * i, duration: 1 }}
                                className="h-full bg-pink-500/50"
                            >
                                <div className="h-full bg-pink-500 w-full origin-left" style={{ transform: 'scaleX(0.8)' }} />
                            </motion.div>
                        </div>

                        {/* Center Line Decoration */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 -translate-x-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function HotZone({ streak }: HotZoneProps) {
    if (streak.count < 2) return null;

    const isBachi = streak.player === 'bachi';

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${isBachi ? 'from-cyan-950/50' : 'from-pink-950/50'
                } to-black border border-white/10 p-1 hot-zone-fire mt-4`}
        >
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500 animate-pulse">
                        <Flame size={24} fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-0.5">Hot Zone</div>
                        <div className={`text-xl font-display uppercase ${isBachi ? 'text-cyan-400' : 'text-pink-400'}`}>
                            {getPlayerDisplayName(streak.player)}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-3xl font-mono font-bold text-white tabular-nums">{streak.count}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Streak</div>
                </div>
            </div>

            {/* Animated Fire Particles Effect (Simple CSS Implementation) */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent blur-sm animate-pulse" />
        </motion.div>
    );
}

export function BattleFeed({ matches }: { matches: any[] }) {
    const [expanded, setExpanded] = useState(false);
    const displayedMatches = expanded ? matches : matches.slice(0, 5);

    const formatRelativeDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));

        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4 px-2">
                <Clock className="text-white/40" size={14} />
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Battle Feed</span>
            </div>

            <div className="space-y-1 relative">
                {/* Connection Line */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-white/5 z-0" />

                <AnimatePresence>
                    {displayedMatches.map((match, i) => {
                        const winnerSlug = getPlayerSlug(match.winner_player_id);
                        const isPink = winnerSlug === 'crimebaker';

                        return (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative z-10 flex items-center group"
                            >
                                {/* Timeline Node */}
                                <div className={`w-8 h-8 rounded-full border-4 border-black flex items-center justify-center shrink-0 z-10 relative ${isPink ? 'bg-pink-500' : 'bg-cyan-500'
                                    }`}>
                                    <span className="text-[10px] font-bold text-black">
                                        {getPlayerName(match.winner_player_id)[0]}
                                    </span>
                                </div>

                                {/* Card */}
                                <div className="ml-3 flex-1 bg-white/5 border border-white/5 rounded p-2 flex items-center justify-between group-hover:bg-white/10 transition-colors">
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold leading-none ${isPink ? 'text-pink-400' : 'text-cyan-400'}`}>
                                            {getPlayerDisplayName(winnerSlug)}
                                        </span>
                                        <span className="text-[10px] text-white/30 uppercase">
                                            def. {match.winner_player_id === PLAYER_IDS.bachi ? 'Crimebaker' : 'Bachi'}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-mono font-bold text-white text-sm">
                                            {match.sets_a_won}-{match.sets_b_won}
                                        </div>
                                        <div className="text-[10px] text-white/30 tabular-nums">
                                            {formatRelativeDate(match.played_at)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {matches.length > 5 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full py-2 flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white transition-colors relative z-10"
                    >
                        {expanded ? (
                            <>Show Less <ChevronUp size={12} /></>
                        ) : (
                            <>View All Battles <ChevronDown size={12} /></>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
