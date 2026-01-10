import { supabase } from './supabaseClient';

// Known player IDs from seed data
export const PLAYER_IDS = {
  bachi: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
  crimebaker: 'd4e5f6a7-b8c9-0123-def0-234567890123',
} as const;

// Known venue ID from seed data
export const PINK_ROOM_VENUE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

export interface Player {
  id: string;
  slug: string;
  display_name: string;
  venue_id: string;
}

export interface Profile {
  id: string;
  user_id: string;
  player_id: string;
  venue_id: string;
  created_at: string;
  player?: Player;
}

/**
 * Get the current user's profile with player info.
 * Returns null if no profile exists.
 */
export async function getMyProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      player:players(*)
    `)
    .eq('user_id', user.id)
    .single();

  if (error) {
    // No profile found is not an error for our use case
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Create or update a profile for the current user, selecting a player.
 * Uses upsert so the same user can switch players or re-enter from any device.
 * Multiple users can select the same player (no exclusive claim).
 */
export async function createMyProfile(playerId: string): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        user_id: user.id,
        player_id: playerId,
        venue_id: PINK_ROOM_VENUE_ID,
      },
      { onConflict: 'user_id' }
    )
    .select(`
      *,
      player:players(*)
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get all players at the Pink Room venue.
 */
export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('venue_id', PINK_ROOM_VENUE_ID);

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Get all players (all are always available since there's no exclusive claim).
 */
export async function getAvailablePlayers(): Promise<Player[]> {
  return getPlayers();
}
