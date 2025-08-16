import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ProfileRow {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id, display_name, avatar_url")
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) throw error;
        setProfile(data as ProfileRow);
      } catch (e: any) {
        setError(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const updateProfile = async (updates: Partial<Pick<ProfileRow, 'display_name' | 'avatar_url'>>) => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);
    if (error) throw error;
    setProfile((prev) => prev ? { ...prev, ...updates } as ProfileRow : prev);
  };

  return { profile, loading, error, updateProfile };
};