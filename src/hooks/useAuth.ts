import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface UseAuthResult {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          await ensureProfile(data.session.user);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await ensureProfile(newSession.user);
      }
    });

    init();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useMemo(() => {
    return async () => {
      await supabase.auth.signInWithOAuth({ provider: "google" });
    };
  }, []);

  const signOut = useMemo(() => {
    return async () => {
      await supabase.auth.signOut();
    };
  }, []);

  return { user, session, loading, signInWithGoogle, signOut };
};

async function ensureProfile(user: User): Promise<void> {
  try {
    const { data: existing, error: selectError } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (selectError) {
      // eslint-disable-next-line no-console
      console.warn("Profile select error:", selectError.message);
    }

    if (!existing) {
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
        // eslint-disable-next-line no-console
        console.warn("Profile insert error:", insertError.message);
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("ensureProfile error", e);
  }
}