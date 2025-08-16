import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface MatchItem {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  book_count: number;
}

const Community = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      // Aggregate matches by other user and count of shared liked books
      const { data: rawMatches, error } = await supabase.rpc("", {} as any);
      // Supabase free tier: emulate RPC in client with queries
      if (error) {
        // Fallback client-side aggregation
        const { data: likes, error: likesErr } = await supabase
          .from("user_book_preferences")
          .select("book_id")
          .eq("user_id", user.id)
          .eq("preference", true);
        if (!likesErr && likes && likes.length > 0) {
          const likedIds = likes.map(l => l.book_id);
          const { data: otherLikes } = await supabase
            .from("user_book_preferences")
            .select("user_id, book_id")
            .in("book_id", likedIds)
            .neq("user_id", user.id)
            .eq("preference", true);
          const counts = new Map<string, number>();
          for (const row of otherLikes || []) {
            counts.set(row.user_id, (counts.get(row.user_id) || 0) + 1);
          }
          const otherUserIds = Array.from(counts.keys());
          if (otherUserIds.length > 0) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("user_id, display_name, avatar_url")
              .in("user_id", otherUserIds);
            const items: MatchItem[] = (profiles || []).map(p => ({
              user_id: p.user_id as string,
              display_name: p.display_name,
              avatar_url: p.avatar_url,
              book_count: counts.get(p.user_id as string) || 0,
            })).sort((a, b) => b.book_count - a.book_count);
            setMatches(items);
          } else {
            setMatches([]);
          }
        } else {
          setMatches([]);
        }
      }
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Community</CardTitle>
            <CardDescription>Sign in to see matches</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/signin"><Button>Sign In</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 container mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Community Matches</h1>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No matches yet</CardTitle>
            <CardDescription>Like some books to find fellow readers.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <Card key={m.user_id} className="flex flex-col">
              <CardHeader className="flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={m.avatar_url || undefined} />
                  <AvatarFallback>{(m.display_name || 'R')[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{m.display_name || 'Reader'}</CardTitle>
                  <CardDescription>{m.book_count} shared likes</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button className="w-full" onClick={() => navigate(`/chat/${m.user_id}`)}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Message
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;