/*
  # Create agencies table

  1. New Tables
    - `agencies`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `logo_url` (text)
      - `rating` (numeric, default 0)
      - `review_count` (integer, default 0)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `agencies` table
    - Add policy for public to read agencies data
    - Add policy for authenticated users with admin role to manage agencies
*/

CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read agencies"
  ON agencies
  FOR SELECT
  TO public
  USING (true);

-- This policy would be used by admin users to manage agencies
CREATE POLICY "Admins can manage agencies"
  ON agencies
  USING (auth.jwt() ->> 'role' = 'admin');