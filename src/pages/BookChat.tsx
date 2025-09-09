import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RealtimeStatus } from "@/components/RealtimeStatus";
import { ArrowLeft, Check, BookOpen } from "lucide-react";

interface BookChatMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface BookInfo {
  id: number;
  "Book-Title": string | null;
  "Book-Author": string | null;
  "Image-URL-L": string | null;
}

type Message = BookChatMessage & { pending?: boolean };

const BookChat = () => {
  const { user } = useAuth();
  const { bookId } = useParams<{ bookId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const loadMessages = async () => {
    if (!user || !bookId) return;
    const { data } = await supabase
      .from("book_chats")
      .select("id, user_id, content, created_at")
      .eq("book_id", parseInt(bookId))
      .order("created_at", { ascending: true });
    
    if (data) {
      // Get unique user IDs from messages
      const userIds = [...new Set(data.map(msg => msg.user_id))];
      
      // Fetch profiles for these users
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);
      
      // Merge messages with profile data
      const messagesWithProfiles = data.map(msg => ({
        ...msg,
        profiles: profiles?.find(p => p.user_id === msg.user_id) || { display_name: null, avatar_url: null }
      }));
      
      setMessages((prev) => {
        const pending = prev.filter((m) => m.pending);
        const merged = [...messagesWithProfiles, ...pending];
        merged.sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || ''));
        return merged;
      });
    }
  };

  const loadBookInfo = async () => {
    if (!bookId) return;
    const { data } = await supabase
      .from("BOOKS")
      .select('"Book-Title", "Book-Author", "Image-URL-L", id')
      .eq("id", parseInt(bookId))
      .single();
    
    if (data) {
      setBookInfo(data);
    }
  };

  useEffect(() => {
    if (!user || !bookId) return;

    console.log('🔧 BookChat useEffect triggered:', { userId: user.id, bookId });

    loadMessages();
    loadBookInfo();

    // Clear previous channel if any
    if (channelRef.current) {
      console.log('🧹 Clearing previous BookChat channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Subscribe to realtime inserts - simplified approach
    const channelName = `book-chat-${bookId}`;
    console.log('📡 Creating BookChat channel:', channelName);
    const channel = supabase.channel(channelName);

    channel
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "book_chats",
        filter: `book_id=eq.${bookId}`
      }, async (payload) => {
        console.log('📨 Received BookChat message:', payload);
        const row = payload.new as BookChatMessage;
        
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some(m => m.id === row.id)) {
            return prev;
          }
          
          // Remove any pending messages with same content from same user
          const filteredPrev = prev.filter(m => 
            !(m.pending && m.content === row.content && m.user_id === row.user_id)
          );
          
          const newMessage: Message = {
            ...row,
            profiles: { display_name: null, avatar_url: null }
          };
          
          return [...filteredPrev, newMessage].sort((a: any, b: any) => 
            (a.created_at || '').localeCompare(b.created_at || '')
          );
        });
        
        // Fetch profile info asynchronously
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("user_id", row.user_id)
            .single();
          
          setMessages((prev) => 
            prev.map(m => 
              m.id === row.id 
                ? { ...m, profiles: profile || { display_name: null, avatar_url: null } }
                : m
            )
          );
        } catch (error) {
          console.warn('Failed to fetch profile for new message:', error);
        }
      })
      .subscribe((status) => {
        console.log(`📡 BookChat subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log('✅ BookChat real-time connected successfully');
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, bookId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (!user || !bookId || !text.trim()) return;
    const content = text.trim();
    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();

    // Optimistic append
    setMessages((prev) => [...prev, { 
      id: tempId, 
      user_id: user.id, 
      content, 
      created_at: now, 
      pending: true,
      profiles: { display_name: null, avatar_url: null }
    }]);
    setText("");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // Persist
    const { data, error } = await supabase
      .from("book_chats")
      .insert({ user_id: user.id, book_id: parseInt(bookId), content })
      .select("id, user_id, content, created_at")
      .single();

    if (!error && data) {
      // Get the user's profile for the message
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user.id)
        .single();
      
      const messageWithProfile = {
        ...data,
        profiles: profile || { display_name: null, avatar_url: null }
      };
      
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === tempId);
        if (idx !== -1) {
          console.log('📤 Replacing temp message with real message:', tempId, '->', data.id);
          const clone = [...prev];
          clone[idx] = messageWithProfile;
          return clone.sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || ''));
        } else {
          console.log('📤 Temp message not found, checking for duplicates:', data.id);
          // Check if real-time already added this message
          if (prev.some(m => m.id === data.id)) {
            console.log('📤 Message already exists from real-time, skipping');
            return prev;
          }
          // Add the message if it doesn't exist
          return [...prev, messageWithProfile].sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || ''));
        }
      });
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign in to chat</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/signin"><Button>Sign In</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Community
          </Link>
        </div>
        
        <Card className="h-[calc(100vh-140px)] min-h-[500px] flex flex-col shadow-lg">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              {bookInfo ? (
                <div className="flex items-center gap-3">
                  {bookInfo["Image-URL-L"] && (
                    <img 
                      src={bookInfo["Image-URL-L"]} 
                      alt={bookInfo["Book-Title"] || "Book cover"}
                      className="w-12 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{bookInfo["Book-Title"] || "Book Chat"}</CardTitle>
                    {bookInfo["Book-Author"] && (
                      <p className="text-sm text-muted-foreground">by {bookInfo["Book-Author"]}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle className="text-lg">Book Chat</CardTitle>
                </div>
              )}
              <RealtimeStatus channelName={`book-chat-${bookId}`} />
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.user_id === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] sm:max-w-[65%] px-3 py-2 rounded-2xl ${
                    m.user_id === user.id 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted text-muted-foreground rounded-tl-sm'
                  }`}>
                    {m.user_id !== user.id && (
                      <div className="text-xs font-semibold mb-1 opacity-80">
                        {m.profiles?.display_name || 'Anonymous Reader'}
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words hyphens-auto">
                      {m.content}
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                      <span className="shrink-0">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {m.user_id === user.id && (
                        <span className="inline-flex items-center gap-1 shrink-0">
                          <Check className="h-3 w-3" /> 
                          {m.pending ? 'Sending…' : 'Sent'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} className="h-1" />
            </div>
            
            <div className="border-t bg-background p-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="Type a message..." 
                    onKeyDown={(e) => { 
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }} 
                    className="min-h-[44px] resize-none"
                    maxLength={1000}
                  />
                </div>
                <Button 
                  onClick={send} 
                  disabled={!text.trim()} 
                  className="min-h-[44px] px-6"
                  size="default"
                >
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookChat;