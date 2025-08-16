import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";

interface MatchScore {
  user_id: string;
  count: number;
  display_name: string | null;
  avatar_url: string | null;
}

const TopMatch = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [top, setTop] = useState<MatchScore | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data: likes } = await supabase
        .from("user_book_preferences")
        .select("book_id")
        .eq("user_id", user.id)
        .eq("preference", true);
      const likedIds = (likes || []).map(l => l.book_id);
      if (likedIds.length === 0) {
        setTop(null);
        setLoading(false);
        return;
      }
      const { data: others } = await supabase
        .from("user_book_preferences")
        .select("user_id, book_id")
        .in("book_id", likedIds)
        .neq("user_id", user.id)
        .eq("preference", true);
      const counts = new Map<string, number>();
      for (const row of others || []) {
        counts.set(row.user_id, (counts.get(row.user_id) || 0) + 1);
      }
      const best = Array.from(counts.entries()).sort((a,b) => b[1]-a[1])[0];
      if (!best) {
        setTop(null);
        setLoading(false);
        return;
      }
      const otherId = best[0];
      const count = best[1];
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .eq("user_id", otherId)
        .maybeSingle();
      setTop({ user_id: otherId, count, display_name: profile?.display_name || null, avatar_url: profile?.avatar_url || null });
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Top Match</CardTitle>
            <CardDescription>Sign in to see your top match</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/signin"><Button>Sign In</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!top) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No top match yet</CardTitle>
            <CardDescription>Like more books to find your best match.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/swipe"><Button>Go Swipe</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="items-center text-center">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={top.avatar_url || undefined} />
            <AvatarFallback>{(top.display_name || 'R')[0]}</AvatarFallback>
          </Avatar>
          <CardTitle>{top.display_name || 'Reader'}</CardTitle>
          <CardDescription>{top.count} shared likes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button onClick={() => navigate(`/chat/${top.user_id}`)}>Message this reader</Button>
          <Link to="/community"><Button variant="outline">Back to Community</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopMatch;