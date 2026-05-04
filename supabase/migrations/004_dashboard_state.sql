-- Single-row shared state for the v68 dashboard.
-- Holds the entire fullState object (labs, expenses, bills, dispatch,
-- soil testing parts, FY data, etc.) as JSONB.
-- All authenticated users read and write this one row.
-- Last-write-wins; concurrent edits within the same row may overwrite
-- each other (acceptable for the current 6-user scope).

BEGIN;

CREATE TABLE IF NOT EXISTS dashboard_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  CONSTRAINT singleton CHECK (id = 1)
);

INSERT INTO dashboard_state (id, data)
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE dashboard_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dashboard_state_read   ON dashboard_state;
DROP POLICY IF EXISTS dashboard_state_update ON dashboard_state;

CREATE POLICY dashboard_state_read ON dashboard_state FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY dashboard_state_update ON dashboard_state FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Add to realtime publication so all clients get UPDATE events.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'dashboard_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE dashboard_state;
  END IF;
END $$;

-- Set REPLICA IDENTITY FULL so realtime UPDATE payloads include new row.
ALTER TABLE dashboard_state REPLICA IDENTITY FULL;

COMMIT;
