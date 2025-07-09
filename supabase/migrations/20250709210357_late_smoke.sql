/*
  # GitHub Events Table Schema

  1. New Tables
    - `github_events`
      - `id` (uuid, primary key)
      - `action_type` (text, constrained to 'push', 'pull_request', 'merge')
      - `author` (text, not null)
      - `from_branch` (text, nullable for push events)
      - `to_branch` (text, not null)
      - `timestamp` (timestamptz, not null)
      - `repository` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `github_events` table
    - Add policy for public read access
    - Add policy for authenticated users to insert events

  3. Indexes
    - Index on action_type for filtering
    - Index on repository for grouping
    - Index on timestamp (descending) for chronological ordering

  4. Constraints
    - Check constraint to ensure action_type is one of the allowed values
*/

-- Create the github_events table
CREATE TABLE IF NOT EXISTS github_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL CHECK (action_type = ANY (ARRAY['push'::text, 'pull_request'::text, 'merge'::text])),
  author text NOT NULL,
  from_branch text,
  to_branch text NOT NULL,
  timestamp timestamptz NOT NULL,
  repository text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE github_events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to github_events"
  ON github_events
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to insert events
CREATE POLICY "Allow authenticated users to insert github_events"
  ON github_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_github_events_action_type ON github_events USING btree (action_type);
CREATE INDEX IF NOT EXISTS idx_github_events_repository ON github_events USING btree (repository);
CREATE INDEX IF NOT EXISTS idx_github_events_timestamp ON github_events USING btree (timestamp DESC);