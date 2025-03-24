/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users.id)
      - `trip_id` (uuid, references trips.id)
      - `passenger_name` (text, not null)
      - `passenger_phone` (text, not null)
      - `passenger_id` (text)
      - `seat_number` (text, not null)
      - `booking_date` (timestamp with time zone, not null)
      - `payment_status` (text, not null)
      - `payment_method` (text)
      - `booking_status` (text, not null)
      - `qr_code` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `bookings` table
    - Add policy for authenticated users to read their own bookings
    - Add policy for authenticated users to insert their own bookings
    - Add policy for authenticated users to update their own bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  trip_id UUID REFERENCES trips(id) NOT NULL,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  passenger_id TEXT,
  seat_number TEXT NOT NULL,
  booking_date TIMESTAMPTZ NOT NULL,
  payment_status TEXT NOT NULL,
  payment_method TEXT,
  booking_status TEXT NOT NULL,
  qr_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);