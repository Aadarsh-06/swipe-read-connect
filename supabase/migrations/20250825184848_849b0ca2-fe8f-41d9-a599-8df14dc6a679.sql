-- Add Instagram ID to profiles table
ALTER TABLE public.profiles ADD COLUMN instagram_id TEXT;

-- Create book chats table for group chats per book
CREATE TABLE public.book_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id INTEGER NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on book_chats
ALTER TABLE public.book_chats ENABLE ROW LEVEL SECURITY;

-- Create policies for book chats
-- Users can view book chats for books they have matched on
CREATE POLICY "Users can view book chats for matched books" 
ON public.book_chats 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.matches m 
    WHERE m.book_id = book_chats.book_id 
    AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  )
);

-- Users can insert messages for books they have matched on
CREATE POLICY "Users can insert messages for matched books" 
ON public.book_chats 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.matches m 
    WHERE m.book_id = book_chats.book_id 
    AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  )
);

-- Create index for better performance
CREATE INDEX idx_book_chats_book_id ON public.book_chats(book_id);
CREATE INDEX idx_book_chats_created_at ON public.book_chats(created_at);