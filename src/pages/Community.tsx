import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, Users, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface BookMatch {
  book_id: number;
  book_title: string | null;
  book_author: string | null;
  image_url: string | null;
  match_count: number;
  matched_users: Array<{
    user_id: string;
    display_name: string | null;
    avatar_url: string | null;
    instagram_id: string | null;
  }>;
}

const Community = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [bookMatches, setBookMatches] = useState<BookMatch[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      
      // Get all matches for the current user
      const { data: myMatches, error } = await supabase
        .from("matches")
        .select("book_id, user1_id, user2_id")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error || !myMatches) {
        setBookMatches([]);
        setLoading(false);
        return;
      }

      // Get unique book IDs
      const bookIds = [...new Set(myMatches.map(m => m.book_id))];
      
      // Get book information
      const { data: books } = await supabase
        .from("BOOKS")
        .select('"Book-Title", "Book-Author", "Image-URL-L", id')
        .in("id", bookIds);

      // Group matches by book
      const bookMap = new Map<number, {
        book: any;
        matchedUserIds: Set<string>;
      }>();

      for (const match of myMatches) {
        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        const bookInfo = books?.find(b => b.id === match.book_id);
        
        if (!bookMap.has(match.book_id)) {
          bookMap.set(match.book_id, {
            book: bookInfo,
            matchedUserIds: new Set()
          });
        }
        
        bookMap.get(match.book_id)!.matchedUserIds.add(otherUserId);
      }

      // Get profile info for all matched users
      const allUserIds = Array.from(
        new Set(Array.from(bookMap.values()).flatMap(item => Array.from(item.matchedUserIds)))
      );

      let userProfiles: any[] = [];
      if (allUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name, avatar_url, instagram_id")
          .in("user_id", allUserIds);
        userProfiles = profiles || [];
      }

      // Create final book matches structure
      const bookMatchesArray: BookMatch[] = Array.from(bookMap.entries()).map(([bookId, data]) => {
        const matchedUsers = Array.from(data.matchedUserIds).map(userId => {
          const profile = userProfiles.find(p => p.user_id === userId);
          return {
            user_id: userId,
            display_name: profile?.display_name || null,
            avatar_url: profile?.avatar_url || null,
            instagram_id: profile?.instagram_id || null
          };
        });

        return {
          book_id: bookId,
          book_title: data.book ? data.book["Book-Title"] : null,
          book_author: data.book ? data.book["Book-Author"] : null,
          image_url: data.book ? data.book["Image-URL-L"] : null,
          match_count: matchedUsers.length,
          matched_users: matchedUsers
        };
      }).sort((a, b) => b.match_count - a.match_count);

      setBookMatches(bookMatchesArray);
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
        <BookOpen className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Book Communities</h1>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : bookMatches.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No book matches yet</CardTitle>
            <CardDescription>Like some books to find fellow readers and join book discussions.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {bookMatches.map((book) => (
            <Card key={book.book_id} className="flex flex-col">
              <CardHeader className="flex-row items-start gap-4 justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {book.image_url && (
                    <img 
                      src={book.image_url} 
                      alt={book.book_title || "Book cover"}
                      className="w-16 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{book.book_title || "Unknown Title"}</CardTitle>
                    {book.book_author && (
                      <p className="text-sm text-muted-foreground mb-2">by {book.book_author}</p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {book.match_count} reader{book.match_count !== 1 ? 's' : ''} matched
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {book.matched_users.slice(0, 3).map((matchedUser) => (
                        <div key={matchedUser.user_id} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={matchedUser.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {(matchedUser.display_name || 'R')[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{matchedUser.display_name || 'Reader'}</span>
                          {matchedUser.instagram_id && (
                            <span className="text-xs text-muted-foreground">
                              {matchedUser.instagram_id}
                            </span>
                          )}
                        </div>
                      ))}
                      {book.match_count > 3 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 rounded-full px-3 py-1">
                          +{book.match_count - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button className="w-full" onClick={() => navigate(`/book-chat/${book.book_id}`)}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Join Book Discussion
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