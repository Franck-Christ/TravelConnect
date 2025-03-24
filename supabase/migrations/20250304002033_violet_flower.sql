/*
  # Create trips table

  1. New Tables
    - `trips`
      - `id` (uuid, primary key)
      - `agency_id` (uuid, references agencies.id)
      - `departure_city` (text, not null)
      - `destination_city` (text, not null)
      - `departure_time` (text, not null)
      - `arrival_time` (text, not null)
      - `duration` (text, not null)
      - `price` (numeric, not null)
      - `bus_type` (text, not null)
      - `available_seats` (integer, not null)
      - `total_seats` (integer, not null)
      - `amenities` (text array)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `trips` table
    - Add policy for public to read trips data
    - Add policy for authenticated users with admin role to manage trips
*/

CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) NOT NULL,
  departure_city TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  duration TEXT NOT NULL,
  price NUMERIC NOT NULL,
  bus_type TEXT NOT NULL,
  available_seats INTEGER NOT NULL,
  total_seats INTEGER NOT NULL,
  amenities TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trips"
  ON trips
  FOR SELECT
  TO public
  USING (true);

-- This policy would be used by admin users to manage trips
CREATE POLICY "Admins can manage trips"
  ON trips
  USING (auth.jwt() ->> 'role' = 'admin');