import { useMemo } from 'react';
import { PLAYER_IDS } from '../lib/profile';

export type ThemeColor = 'pink' | 'cyan' | 'neutral';

interface UsePlayerThemeOptions {
    leaderId?: string | null;
    winnerId?: string | null;
    playerId?: string | null;
    defaultTheme?: ThemeColor;
}

/**
 * Determines the theme color based on a player's identity (leader, winner, or specific player).
 * Centralizes the "Bachi = Cyan, Crimebaker = Pink" logic.
 */
export function usePlayerTheme({
    leaderId,
    winnerId,
    playerId,
    defaultTheme = 'neutral'
}: UsePlayerThemeOptions): ThemeColor {

    return useMemo(() => {
        // Priority: Winner > Leader > Specific Player
        const targetId = winnerId || leaderId || playerId;

        if (!targetId) return defaultTheme;

        if (targetId === PLAYER_IDS.bachi) return 'cyan';
        if (targetId === PLAYER_IDS.crimebaker) return 'pink';

        return defaultTheme;
    }, [leaderId, winnerId, playerId, defaultTheme]);
}

/**
 * Returns Tailwind classes for texts/bgs based on the theme.
 */
export function useThemeClasses(theme: ThemeColor) {
    return useMemo(() => {
        switch (theme) {
            case 'pink':
                return {
                    text: 'text-pink-400',
                    bg: 'bg-pink-500',
                    bgSoft: 'bg-pink-500/10',
                    border: 'border-pink-500',
                    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                };
            case 'cyan':
                return {
                    text: 'text-cyan-400',
                    bg: 'bg-cyan-500',
                    bgSoft: 'bg-cyan-500/10',
                    border: 'border-cyan-500',
                    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                };
            default:
                return {
                    text: 'text-white',
                    bg: 'bg-white',
                    bgSoft: 'bg-white/5',
                    border: 'border-white/20',
                    glow: ''
                };
        }
    }, [theme]);
}

/**
 * Non-hook helper to get theme from ID
 */
export function getPlayerTheme(playerId: string | null): ThemeColor {
    if (playerId === PLAYER_IDS.bachi || playerId === 'bachi') return 'cyan';
    if (playerId === PLAYER_IDS.crimebaker || playerId === 'crimebaker') return 'pink';
    return 'neutral';
}
