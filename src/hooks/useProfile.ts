import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ProfileRow {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  instagram_id: string | null;
  phone_number: string | null;
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
          .select("user_id, display_name, avatar_url, instagram_id, phone_number")
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

  const updateProfile = async (updates: Partial<Pick<ProfileRow, 'display_name' | 'avatar_url' | 'instagram_id' | 'phone_number'>>) => {
    if (!user) return;
    
    // If this is the first update and no profile exists, create one
    if (!profile) {
      const { error } = await supabase
        .from("profiles")
        .insert({ 
          user_id: user.id, 
          ...updates,
          phone_number: updates.phone_number || user.user_metadata?.phone_number
        });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);
      if (error) throw error;
    }
    
    setProfile((prev) => prev ? { ...prev, ...updates } as ProfileRow : { 
      user_id: user.id, 
      ...updates,
      phone_number: updates.phone_number || user.user_metadata?.phone_number
    } as ProfileRow);
  };

  return { profile, loading, error, updateProfile };
};