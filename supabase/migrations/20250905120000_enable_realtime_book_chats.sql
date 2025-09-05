-- Enable Realtime on book_chats table
-- This ensures book chat messages update in real-time

-- Add book_chats to the realtime publication if not already present
DO $$
DECLARE
  relid regclass;
BEGIN
  SELECT 'public.book_chats'::regclass INTO relid;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE pr.prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
      AND n.nspname = 'public'
      AND c.relname = 'book_chats'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.book_chats';
  END IF;
END$$;

-- Also ensure matches table has real-time for community updates
DO $$
DECLARE
  relid regclass;
BEGIN
  SELECT 'public.matches'::regclass INTO relid;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE pr.prpubid = (SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime')
      AND n.nspname = 'public'
      AND c.relname = 'matches'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.matches';
  END IF;
END$$;
