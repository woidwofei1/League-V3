import { supabase } from './supabaseClient';
import { PLAYER_IDS } from './profile';
import type { Match } from './matches';

// ============ Types ============

export interface RivalrySummary {
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
  avgPointsBachi: number;
  avgPointsCrimebaker: number;
  winRateBachi: number;
  winRateCrimebaker: number;
}

export interface EloDataPoint {
  date: string;
  bachiElo: number;
  crimebakerElo: number;
  matchIndex: number;
}

export interface TableInfo {
  id: string;
  slug: string;
  name: string;
  venue_name: string;
  venue_city: string;
}

// ============ Data Fetching ============

/**
 * Fetch matches for a specific table by slug.
 * Returns matches in descending order (most recent first).
 */
export async function fetchMatchesForTable(tableSlug: string, limit = 100): Promise<Match[]> {
  // First get the table ID from slug
  const { data: tableData, error: tableError } = await supabase
    .from('tables')
    .select('id')
    .eq('slug', tableSlug)
    .single();

  if (tableError) {
    if (tableError.code === 'PGRST116') {
      // Table not found
      return [];
    }
    throw new Error(tableError.message || 'Failed to find table');
  }

  // Fetch matches for this table
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('table_id', tableData.id)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message || 'Failed to load matches');
  }

  return data ?? [];
}

/**
 * Fetch table info by slug.
 */
export async function fetchTableBySlug(tableSlug: string): Promise<TableInfo | null> {
  const { data, error } = await supabase
    .from('tables')
    .select(`
      id,
      slug,
      name,
      venue:venues(name, city)
    `)
    .eq('slug', tableSlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message || 'Failed to load table');
  }

  // Handle venue which may be an array or single object depending on the join
  const venue = Array.isArray(data.venue) ? data.venue[0] : data.venue;
  const venueData = venue as { name: string; city: string } | null;
  
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    venue_name: venueData?.name ?? 'Unknown Venue',
    venue_city: venueData?.city ?? '',
  };
}

// ============ Computed Data ============

/**
 * Compute rivalry summary from matches.
 * Assumes matches are in descending order (most recent first).
 */
export function computeRivalrySummary(matches: Match[]): RivalrySummary {
  const bachiId = PLAYER_IDS.bachi;
  const crimebakerId = PLAYER_IDS.crimebaker;

  let bachiWins = 0;
  let crimebakerWins = 0;
  let bachiTotalPoints = 0;
  let crimebakerTotalPoints = 0;

  // Count wins and points
  for (const match of matches) {
    if (match.winner_player_id === bachiId) {
      bachiWins++;
    } else if (match.winner_player_id === crimebakerId) {
      crimebakerWins++;
    }

    // Sum points (Bachi is always player_a, Crimebaker is player_b in our setup)
    if (match.player_a_id === bachiId) {
      bachiTotalPoints += match.points_a_total;
      crimebakerTotalPoints += match.points_b_total;
    } else {
      bachiTotalPoints += match.points_b_total;
      crimebakerTotalPoints += match.points_a_total;
    }
  }

  const totalMatches = matches.length;

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

  // Average points
  const avgPointsBachi = totalMatches > 0 ? bachiTotalPoints / totalMatches : 0;
  const avgPointsCrimebaker = totalMatches > 0 ? crimebakerTotalPoints / totalMatches : 0;

  // Win rates
  const winRateBachi = totalMatches > 0 ? (bachiWins / totalMatches) * 100 : 0;
  const winRateCrimebaker = totalMatches > 0 ? (crimebakerWins / totalMatches) * 100 : 0;

  return {
    bachiWins,
    crimebakerWins,
    totalMatches,
    leader,
    leadMargin,
    currentStreak,
    longestStreak,
    last5,
    avgPointsBachi,
    avgPointsCrimebaker,
    winRateBachi,
    winRateCrimebaker,
  };
}

/**
 * Compute Elo rating series over time.
 * Both players start at 1000.
 * Uses standard Elo formula with K-factor of 32.
 */
export function computeEloSeries(matches: Match[]): EloDataPoint[] {
  if (matches.length === 0) return [];

  const bachiId = PLAYER_IDS.bachi;
  const K = 32; // K-factor

  // Process in chronological order
  const chronological = [...matches].reverse();
  
  let bachiElo = 1000;
  let crimebakerElo = 1000;
  
  const series: EloDataPoint[] = [
    {
      date: 'Start',
      bachiElo: 1000,
      crimebakerElo: 1000,
      matchIndex: 0,
    },
  ];

  chronological.forEach((match, index) => {
    const bachiWon = match.winner_player_id === bachiId;

    // Expected scores
    const expectedBachi = 1 / (1 + Math.pow(10, (crimebakerElo - bachiElo) / 400));
    const expectedCrimebaker = 1 - expectedBachi;

    // Actual scores
    const actualBachi = bachiWon ? 1 : 0;
    const actualCrimebaker = bachiWon ? 0 : 1;

    // Update Elo ratings
    bachiElo = Math.round(bachiElo + K * (actualBachi - expectedBachi));
    crimebakerElo = Math.round(crimebakerElo + K * (actualCrimebaker - expectedCrimebaker));

    // Format date for display
    const date = new Date(match.played_at);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    series.push({
      date: dateStr,
      bachiElo,
      crimebakerElo,
      matchIndex: index + 1,
    });
  });

  return series;
}

// ============ Helpers ============

/**
 * Get player display name from slug.
 */
export function getPlayerDisplayName(player: 'bachi' | 'crimebaker' | null): string {
  if (player === 'bachi') return 'Bachi';
  if (player === 'crimebaker') return 'Crimebaker';
  return '—';
}
