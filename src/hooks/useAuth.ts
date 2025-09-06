import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface UseAuthResult {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let profileCreationInProgress = new Set<string>();

    const init = async () => {
      try {
        console.log('Initializing auth state...');
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        const session = data.session;
        console.log('Current session:', session ? 'Found' : 'None');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && !profileCreationInProgress.has(session.user.id)) {
          profileCreationInProgress.add(session.user.id);
          setTimeout(async () => {
            await ensureProfile(session.user);
            profileCreationInProgress.delete(session.user.id);
          }, 0);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (isMounted) {
          console.log('Auth loading complete');
          setLoading(false);
        }
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;
      
      console.log('Auth state changed:', event, newSession ? 'Session present' : 'No session');
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user && !profileCreationInProgress.has(newSession.user.id)) {
        profileCreationInProgress.add(newSession.user.id);
        setTimeout(async () => {
          await ensureProfile(newSession.user);
          profileCreationInProgress.delete(newSession.user.id);
        }, 100);
      }
    });

    init();

    return () => {
      console.log('Cleaning up auth hook...');
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);


  const signOut = useMemo(() => {
    return async () => {
      await supabase.auth.signOut();
    };
  }, []);

  return { user, session, loading, signOut };
};

async function ensureProfile(user: User): Promise<void> {
  if (!user?.id) return;
  
  try {
    console.log('Checking profile for user:', user.id);
    const { data: existing, error: selectError } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (selectError) {
      console.warn("Profile select error:", selectError.message);
    }

    if (!existing) {
      console.log('Creating new profile for user:', user.id);
      const meta: any = user.user_metadata || {};
      const emailLocal = user.email ? String(user.email).split('@')[0] : undefined;
      const displayName = meta.preferred_username || meta.user_name || meta.full_name || emailLocal || "Reader";
      const avatarUrl = meta.avatar_url || null;
      const { error: insertError } = await supabase.from("profiles").insert({
        user_id: user.id,
        display_name: displayName,
        avatar_url: avatarUrl,
      });
      if (insertError) {
        console.warn("Profile insert error:", insertError.message);
      } else {
        console.log('Profile created successfully for user:', user.id);
      }
    } else {
      console.log('Profile already exists for user:', user.id);
    }
  } catch (e) {
    console.warn("ensureProfile error", e);
  }
}