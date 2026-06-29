-- Drahtesel Website — Supabase Schema
-- Run this in the Supabase SQL Editor to set up the database

-- ── Key-Value store (replaces all JSON files) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS kv_store (
  key        TEXT PRIMARY KEY,
  data       JSONB NOT NULL DEFAULT 'null'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Row Level Security ──────────────────────────────────────────────────────────
ALTER TABLE kv_store ENABLE ROW LEVEL SECURITY;

-- Anyone can read (weekly_pins, reviews, etc. are public data)
CREATE POLICY "allow_public_read"
  ON kv_store FOR SELECT
  USING (true);

-- Only the service role (server-side) can write — anon key cannot write
-- (No INSERT/UPDATE policy = blocked for anon, allowed for service_role which bypasses RLS)

-- ── Seed initial empty rows (prevents "not found" errors) ──────────────────────
INSERT INTO kv_store (key, data) VALUES
  ('reviews',           '[]'::jsonb),
  ('faqs',              '[]'::jsonb),
  ('settings',          '{"passwordHash": null}'::jsonb),
  ('shop_bikes',        '[]'::jsonb),
  ('reports',           '[]'::jsonb),
  ('weekly_pins',       '[]'::jsonb),
  ('predefined_routes', '[]'::jsonb),
  ('interest_pins',     '[]'::jsonb),
  ('tour_pois',         '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ── Storage bucket for uploaded images ─────────────────────────────────────────
-- Run these in the Storage section of Supabase dashboard, or via the API:
-- 1. Create a bucket named "uploads" and set it to PUBLIC
-- 2. The folder structure will be:
--    uploads/bikes/      ← bike shop images
--    uploads/pin-images/ ← discovery pin images
