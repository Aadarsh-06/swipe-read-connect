-- Manual script to enable real-time for chat tables
-- Run this in your Supabase SQL Editor

-- Enable real-time for book_chats table
ALTER PUBLICATION supabase_realtime ADD TABLE public.book_chats;

-- Enable real-time for matches table (for community updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;

-- Verify the tables are added to real-time publication
SELECT 
  schemaname,
  tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
  AND tablename IN ('messages', 'book_chats', 'matches')
ORDER BY tablename;
