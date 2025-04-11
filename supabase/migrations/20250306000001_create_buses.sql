/*
  # Create buses table

  1. New Tables
    - `buses`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `type` (text, not null)
      - `capacity` (integer, not null)
      - `amenities` (jsonb, not null)
      - `status` (text, not null)
      - `agency_id` (uuid, references agencies.id)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `buses` table
    - Add policy for public to read buses data
    - Add policy for authenticated users with admin role to manage buses
*/

CREATE TABLE IF NOT EXISTS buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  amenities JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('active', 'maintenance', 'inactive')),
  agency_id UUID REFERENCES agencies(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read buses"
  ON buses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage buses"
  ON buses
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_buses_updated_at
  BEFORE UPDATE ON buses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 