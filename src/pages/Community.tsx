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

  const computeBlend = (sharedCount: number) => {
    const raw = 50 + sharedCount * 10;
    return Math.max(50, Math.min(100, raw));
  };

  const BlendCircle = ({ value }: { value: number }) => {
    const clamped = Math.max(50, Math.min(100, value));
    const gradient = `conic-gradient(var(--tw-gradient-to, #22c55e) ${clamped}%, rgba(0,0,0,0.08) ${clamped}% 100%)`;
    return (
      <div className="relative w-14 h-14" aria-label={`Blend score ${clamped}%`}>
        <div className="absolute inset-0 rounded-full" style={{ backgroundImage: gradient }} />
        <div className="absolute inset-1 rounded-full bg-card border" />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{clamped}%</div>
      </div>
    );
  };

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      // Read matches the current user is part of (RLS allows this)
      const { data: myMatches, error } = await supabase
        .from("matches")
        .select("user1_id,user2_id,book_id")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      if (error) {
        setMatches([]);
        setLoading(false);
        return;
      }
      const counts = new Map<string, number>();
      for (const m of myMatches || []) {
        const other = m.user1_id === user.id ? m.user2_id : m.user1_id;
        counts.set(other, (counts.get(other) || 0) + 1);
      }
      const otherIds = Array.from(counts.keys());
      if (otherIds.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", otherIds);
      const items: MatchItem[] = (profiles || []).map(p => ({
        user_id: p.user_id as string,
        display_name: p.display_name,
        avatar_url: p.avatar_url,
        book_count: counts.get(p.user_id as string) || 0,
      })).sort((a, b) => b.book_count - a.book_count);
      setMatches(items);
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
        <div className="flex flex-col gap-4">
          {matches.map((m) => {
            const blend = computeBlend(m.book_count);
            return (
              <Card key={m.user_id} className="flex flex-col">
                <CardHeader className="flex-row items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={m.avatar_url || undefined} />
                      <AvatarFallback>{(m.display_name || 'R')[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{m.display_name || 'Reader'}</CardTitle>
                      <CardDescription>{m.book_count} shared likes</CardDescription>
                    </div>
                  </div>
                  <BlendCircle value={blend} />
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full" onClick={() => navigate(`/chat/${m.user_id}`)}>
                    <MessageCircle className="h-4 w-4 mr-2" /> Message
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;