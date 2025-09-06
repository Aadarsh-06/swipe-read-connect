-- Fix security vulnerability: Restrict profiles table to authenticated users only
-- This prevents public access to sensitive user data like email addresses and Instagram handles

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows authenticated users to view profiles
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- This ensures that:
-- 1. Only logged-in users can see profile data
-- 2. Anonymous/public users cannot harvest email addresses or social media handles
-- 3. Existing app functionality remains intact since users must be authenticated to use features like matching and chat