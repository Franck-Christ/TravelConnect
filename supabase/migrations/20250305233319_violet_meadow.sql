/*
  # Update profiles table to add username field

  1. Changes
    - Add `username` column to profiles table (unique)
    - Add index on username for faster lookups
  
  2. Security
    - No changes to existing policies needed
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);