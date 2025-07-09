/*
  # GitHub Events Table Schema

  1. New Tables
    - `github_events`
      - `id` (uuid, primary key)
      - `action_type` (text) - Type of GitHub action: push, pull_request, merge
      - `author` (text) - GitHub username who performed the action
      - `from_branch` (text) - Source branch (for PRs and merges)
      - `to_branch` (text) - Target branch
      - `timestamp` (timestamptz) - When the event occurred
      - `repository` (text) - Repository name
      - `created_at` (timestamptz) - When the record was created

  2. Security
    - Enable RLS on `github_events` table
    - Add policy for public read access (webhook data is generally public)
    - Add policy for authenticated users to insert events
*/

CREATE TABLE IF NOT EXISTS github_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL CHECK (action_type IN ('push', 'pull_request', 'merge')),
  author text NOT NULL,
  from_branch text,
  to_branch text NOT NULL,
  timestamp timestamptz NOT NULL,
  repository text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_github_events_timestamp ON github_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_github_events_action_type ON github_events(action_type);
CREATE INDEX IF NOT EXISTS idx_github_events_repository ON github_events(repository);

-- Enable RLS
ALTER TABLE github_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to events (GitHub webhook data is typically public)
CREATE POLICY "Allow public read access to github_events"
  ON github_events
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert events (for webhook endpoint)
CREATE POLICY "Allow authenticated users to insert github_events"
  ON github_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);