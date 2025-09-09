-- Enable real-time for messages table (required for chat)
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Add phone number field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number text;

-- Verify real-time is enabled
SELECT 
  schemaname,
  tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
ORDER BY tablename;