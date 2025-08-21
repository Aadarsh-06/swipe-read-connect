-- Allow system to insert books when users swipe on new books
CREATE POLICY "System can insert books during swipe operations" 
ON public."BOOKS" 
FOR INSERT 
WITH CHECK (true);

-- Also ensure the trigger exists for match creation
DROP TRIGGER IF EXISTS create_match_trigger ON public.user_book_preferences;
CREATE TRIGGER create_match_trigger
  AFTER INSERT OR UPDATE ON public.user_book_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.check_for_match();

-- Ensure the updated_at trigger exists for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();