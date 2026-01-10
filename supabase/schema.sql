-- =============================================
-- Pink Room Rivalry - Database Schema
-- =============================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABLES
-- =============================================

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tables (ping pong tables at venues)
CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(venue_id, slug)
);

-- Players
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(venue_id, slug)
);

-- Profiles (links auth.users to selected player)
-- Note: player_id is NOT unique - multiple users can select the same player
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Matches (game results)
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  player_a_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  player_b_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  winner_player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  sets_a_won INT NOT NULL CHECK (sets_a_won >= 0),
  sets_b_won INT NOT NULL CHECK (sets_b_won >= 0),
  points_a_total INT NOT NULL CHECK (points_a_total >= 0),
  points_b_total INT NOT NULL CHECK (points_b_total >= 0),
  played_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_tables_venue_id ON tables(venue_id);
CREATE INDEX IF NOT EXISTS idx_players_venue_id ON players(venue_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_player_id ON profiles(player_id);
CREATE INDEX IF NOT EXISTS idx_matches_table_id ON matches(table_id);
CREATE INDEX IF NOT EXISTS idx_matches_played_at ON matches(played_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------
-- Venues policies (read-only for authenticated users)
-- ---------------------------------------------
CREATE POLICY "Authenticated users can read venues"
  ON venues FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------------------------------
-- Tables policies (read-only for authenticated users)
-- ---------------------------------------------
CREATE POLICY "Authenticated users can read tables"
  ON tables FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------------------------------
-- Players policies (read-only for authenticated users)
-- ---------------------------------------------
CREATE POLICY "Authenticated users can read players"
  ON players FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------------------------------
-- Profiles policies
-- ---------------------------------------------

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own profile (to switch players)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------
-- Matches policies
-- ---------------------------------------------

-- Authenticated users can read all matches
CREATE POLICY "Authenticated users can read matches"
  ON matches FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert matches (must be the creator)
CREATE POLICY "Authenticated users can insert own matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (created_by_user_id = auth.uid());
