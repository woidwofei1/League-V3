import { supabase } from './supabaseClient';
import { PLAYER_IDS } from './profile';

// Known table ID from seed data
export const PINK_ROOM_TABLE_ID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

// ============ Types ============

export interface Match {
  id: string;
  table_id: string;
  player_a_id: string;
  player_b_id: string;
  winner_player_id: string;
  sets_a_won: number;
  sets_b_won: number;
  points_a_total: number;
  points_b_total: number;
  played_at: string;
  created_by_user_id: string;
  created_at: string;
}

export interface MatchInsert {
  table_id: string;
  player_a_id: string;
  player_b_id: string;
  winner_player_id: string;
  sets_a_won: number;
  sets_b_won: number;
  points_a_total: number;
  points_b_total: number;
}

export interface RivalryStats {
  bachiWins: number;
  crimebakerWins: number;
  totalMatches: number;
  leader: 'bachi' | 'crimebaker' | null;
  leadMargin: number;
  currentStreak: {
    player: 'bachi' | 'crimebaker' | null;
    count: number;
  };
  longestStreak: {
    player: 'bachi' | 'crimebaker' | null;
    count: number;
  };
  last5: Array<{
    winner: 'bachi' | 'crimebaker';
    played_at: string;
  }>;
}

// ============ Functions ============

/**
 * Insert a new match result.
 * Uses auth.uid() automatically for created_by_user_id via default.
 */
export async function insertMatch(match: MatchInsert): Promise<Match> {
  const { data, error } = await supabase
    .from('matches')
    .insert(match)
    .select()
    .single();

  if (error) {
    console.error('Insert match error:', error);
    throw new Error(error.message || 'Failed to save match');
  }

  return data;
}

/**
 * List recent matches for the Pink Room table.
 */
export async function listRecentMatches(limit = 25): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('table_id', PINK_ROOM_TABLE_ID)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('List matches error:', error);
    throw new Error(error.message || 'Failed to load matches');
  }

  return data ?? [];
}

/**
 * Compute rivalry stats from all matches.
 */
export async function getRivalryStats(): Promise<RivalryStats> {
  const matches = await listRecentMatches(100); // Get more for streak calculation

  const bachiId = PLAYER_IDS.bachi;
  const crimebakerId = PLAYER_IDS.crimebaker;

  let bachiWins = 0;
  let crimebakerWins = 0;

  // Count wins
  for (const match of matches) {
    if (match.winner_player_id === bachiId) {
      bachiWins++;
    } else if (match.winner_player_id === crimebakerId) {
      crimebakerWins++;
    }
  }

  // Determine leader
  let leader: 'bachi' | 'crimebaker' | null = null;
  if (bachiWins > crimebakerWins) {
    leader = 'bachi';
  } else if (crimebakerWins > bachiWins) {
    leader = 'crimebaker';
  }

  const leadMargin = Math.abs(bachiWins - crimebakerWins);

  // Calculate current streak (matches are ordered by played_at DESC)
  const currentStreak = { player: null as 'bachi' | 'crimebaker' | null, count: 0 };
  if (matches.length > 0) {
    const firstWinner = matches[0].winner_player_id === bachiId ? 'bachi' : 'crimebaker';
    currentStreak.player = firstWinner;
    currentStreak.count = 1;

    for (let i = 1; i < matches.length; i++) {
      const winner = matches[i].winner_player_id === bachiId ? 'bachi' : 'crimebaker';
      if (winner === currentStreak.player) {
        currentStreak.count++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak (need to scan in chronological order)
  let longestStreak = { player: null as 'bachi' | 'crimebaker' | null, count: 0 };
  if (matches.length > 0) {
    const chronological = [...matches].reverse();
    let tempStreak = { player: null as 'bachi' | 'crimebaker' | null, count: 0 };

    for (const match of chronological) {
      const winner = match.winner_player_id === bachiId ? 'bachi' : 'crimebaker';
      
      if (winner === tempStreak.player) {
        tempStreak.count++;
      } else {
        // Check if previous streak was the longest
        if (tempStreak.count > longestStreak.count) {
          longestStreak = { ...tempStreak };
        }
        tempStreak = { player: winner, count: 1 };
      }
    }
    
    // Check final streak
    if (tempStreak.count > longestStreak.count) {
      longestStreak = { ...tempStreak };
    }
  }

  // Last 5 results
  const last5 = matches.slice(0, 5).map((match) => ({
    winner: match.winner_player_id === bachiId ? 'bachi' as const : 'crimebaker' as const,
    played_at: match.played_at,
  }));

  return {
    bachiWins,
    crimebakerWins,
    totalMatches: matches.length,
    leader,
    leadMargin,
    currentStreak,
    longestStreak,
    last5,
  };
}

/**
 * Helper: Get player display name from ID
 */
export function getPlayerName(playerId: string): string {
  if (playerId === PLAYER_IDS.bachi) return 'Bachi';
  if (playerId === PLAYER_IDS.crimebaker) return 'Crimebaker';
  return 'Unknown';
}

/**
 * Helper: Get player slug from ID
 */
export function getPlayerSlug(playerId: string): 'bachi' | 'crimebaker' | null {
  if (playerId === PLAYER_IDS.bachi) return 'bachi';
  if (playerId === PLAYER_IDS.crimebaker) return 'crimebaker';
  return null;
}
