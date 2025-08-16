-- Enable Realtime on public schema and messages table
-- This is idempotent for Supabase edge cases

-- Ensure replication publication exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END$$;

-- Add messages to the publication if not already present
DO $$
DECLARE
  relid regclass;
BEGIN
  SELECT 'public.messages'::regclass INTO relid;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE pr.prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
      AND n.nspname = 'public'
      AND c.relname = 'messages'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.messages';
  END IF;
END$$;