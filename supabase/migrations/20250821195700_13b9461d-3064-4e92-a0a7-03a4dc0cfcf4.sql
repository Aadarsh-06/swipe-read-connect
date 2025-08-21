-- Fix security definer function search path issues
CREATE OR REPLACE FUNCTION public.check_for_match()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Only create matches for likes (preference = true)
  IF NEW.preference = true THEN
    -- Check if another user has also liked this book
    INSERT INTO public.matches (user1_id, user2_id, book_id)
    SELECT 
      LEAST(NEW.user_id, ubp.user_id) as user1_id,
      GREATEST(NEW.user_id, ubp.user_id) as user2_id,
      NEW.book_id
    FROM public.user_book_preferences ubp
    WHERE ubp.book_id = NEW.book_id 
      AND ubp.user_id != NEW.user_id 
      AND ubp.preference = true
    ON CONFLICT (user1_id, user2_id, book_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;