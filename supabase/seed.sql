-- =============================================
-- Pink Room Rivalry - Seed Data
-- =============================================

-- Insert Pink Room venue
INSERT INTO venues (id, slug, name, city)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'pink-room',
  'Pink Room',
  'Innsbruck'
) ON CONFLICT (slug) DO NOTHING;

-- Insert main table at Pink Room
INSERT INTO tables (id, venue_id, slug, name)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'pink-room-main',
  'Pink Room Main'
) ON CONFLICT (venue_id, slug) DO NOTHING;

-- Insert the two rival players
INSERT INTO players (id, venue_id, slug, display_name)
VALUES 
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'bachi',
    'Bachi'
  ),
  (
    'd4e5f6a7-b8c9-0123-def0-234567890123',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'crimebaker',
    'Crimebaker'
  )
ON CONFLICT (venue_id, slug) DO NOTHING;
