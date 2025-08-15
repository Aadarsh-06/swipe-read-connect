-- Enable Row Level Security on BOOKS table
ALTER TABLE "BOOKS" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read books (public app)
CREATE POLICY "Everyone can view books" 
ON "BOOKS" 
FOR SELECT 
USING (true);

-- Add an id column for easier management
ALTER TABLE "BOOKS" 
ADD COLUMN id SERIAL PRIMARY KEY;