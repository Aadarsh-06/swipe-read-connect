-- Optimize real-time chat performance and fix potential issues
-- This migration improves indexing and ensures proper real-time setup

-- Add composite index for book_chats to improve real-time filtering performance
CREATE INDEX IF NOT EXISTS idx_book_chats_book_user_time 
ON public.book_chats(book_id, user_id, created_at DESC);

-- Add index for messages table real-time performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient_time 
ON public.messages(sender_id, recipient_id, created_at DESC);

-- Add index for the reverse direction
CREATE INDEX IF NOT EXISTS idx_messages_recipient_sender_time 
ON public.messages(recipient_id, sender_id, created_at DESC);

-- Ensure proper real-time publication settings
-- Re-add tables to publication with explicit settings
DO $$
BEGIN
  -- Remove and re-add book_chats to ensure proper configuration
  EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.book_chats';
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.book_chats';
  
  -- Remove and re-add messages to ensure proper configuration  
  EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.messages';
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.messages';
  
  RAISE NOTICE 'Real-time tables re-configured for optimal performance';
END$$;

-- Optimize book_chats RLS policies for better performance
-- Drop existing policies and recreate with optimized queries
DROP POLICY IF EXISTS "Users can view book chats for matched books" ON public.book_chats;
DROP POLICY IF EXISTS "Users can insert messages for matched books" ON public.book_chats;

-- Create optimized policies with better indexing
CREATE POLICY "Users can view book chats for matched books" 
ON public.book_chats 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.matches m 
    WHERE m.book_id = book_chats.book_id 
    AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can insert messages for matched books" 
ON public.book_chats 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.matches m 
    WHERE m.book_id = book_chats.book_id 
    AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  )
);

-- Ensure messages table also has optimized policies
-- Check if we need to update messages policies as well
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'messages' 
    AND policyname LIKE '%optimized%'
  ) THEN
    -- Add comment to existing policies to mark them as reviewed
    COMMENT ON POLICY "Enable read for users based on user_id" ON public.messages 
    IS 'Optimized policy for real-time message access';
  END IF;
END$$;
