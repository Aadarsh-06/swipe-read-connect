import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase-config";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RealtimeStatus } from "@/components/RealtimeStatus";
import { ArrowLeft, Check } from "lucide-react";

interface MessageRow {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

type Message = MessageRow & { pending?: boolean };

const Chat = () => {
  const { user } = useAuth();
  const { recipientId } = useParams<{ recipientId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const conversationFilter = (row: MessageRow) => {
    if (!user || !recipientId) return false;
    return (
      (row.sender_id === user.id && row.recipient_id === recipientId) ||
      (row.sender_id === recipientId && row.recipient_id === user.id)
    );
  };

  const loadMessages = async () => {
    if (!user || !recipientId) return;
    const { data } = await supabase
      .from("messages")
      .select("id,sender_id,recipient_id,content,created_at")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    if (data) {
      setMessages((prev) => {
        // Keep any pending local messages that are not yet in DB
        const pending = prev.filter((m) => m.pending);
        const merged = [...data, ...pending];
        merged.sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || ''));
        return merged;
      });
    }
  };

  useEffect(() => {
    if (!user || !recipientId) return;

    console.log('🔧 Chat useEffect triggered:', { userId: user.id, recipientId });

    // Test real-time connection first
    const testChannel = supabase.channel('test-connection');
    testChannel
      .on('broadcast', { event: 'test' }, (payload) => {
        console.log('✅ Real-time test successful:', payload);
      })
      .subscribe((status) => {
        console.log('🧪 Test channel status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time connection is working!');
          // Send a test message
          testChannel.send({
            type: 'broadcast',
            event: 'test',
            payload: { message: 'Real-time test' }
          });
        }
      });

    // Initial load
    loadMessages();

    // Clear previous channel if any
    if (channelRef.current) {
      console.log('🧹 Clearing previous channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Subscribe to realtime inserts in both directions with filters
    const channelName = `chat-${user.id}-${recipientId}`;
    console.log('📡 Creating channel:', channelName);
    const channel = supabase.channel(channelName);

    channel
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "messages", 
        filter: `sender_id=eq.${user.id}` 
      }, (payload) => {
        console.log('📨 Received message from current user:', payload);
        const row = payload.new as MessageRow;
        if (conversationFilter(row)) {
          setMessages((prev) => {
            // Replace pending temp if same content and recent
            const tempIdx = prev.findIndex((m) => m.pending && m.content === row.content && m.sender_id === row.sender_id);
            if (tempIdx !== -1) {
              const clone = [...prev];
              clone[tempIdx] = { ...row };
              return clone.sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || ''));
            }
            if (prev.some(m => m.id === row.id)) return prev;
            return [...prev, row].sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || ''));
          });
        }
      })
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "messages", 
        filter: `sender_id=eq.${recipientId}` 
      }, (payload) => {
        console.log('📨 Received message from recipient:', payload);
        const row = payload.new as MessageRow;
        if (conversationFilter(row)) {
          setMessages((prev) => (prev.some(m => m.id === row.id) ? prev : [...prev, row]).sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || '')));
        }
      })
      .subscribe((status) => {
        console.log(`📡 Chat subscription status: ${status}`);
        // Fallback polling if subscription fails or disconnects
        if (status !== "SUBSCRIBED") {
          console.warn('⚠️ Chat real-time disconnected, falling back to polling');
          if (!pollRef.current) {
            pollRef.current = setInterval(loadMessages, 2000);
          }
        } else {
          console.log('✅ Chat real-time connected successfully');
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      });

    channelRef.current = channel;

    // Fallback polling safety net
    if (!pollRef.current) {
      console.log('🔄 Starting fallback polling');
      pollRef.current = setInterval(loadMessages, 4000);
    }

    return () => {
      console.log('🧹 Cleaning up chat channel');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      // Clean up test channel
      supabase.removeChannel(testChannel);
    };
  }, [user, recipientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (!user || !recipientId || !text.trim()) return;
    const content = text.trim();
    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();

    console.log('📤 Sending message:', { content, recipientId, userId: user.id });

    // Optimistic append
    setMessages((prev) => [...prev, { id: tempId, sender_id: user.id, recipient_id: recipientId, content, created_at: now, pending: true }]);
    setText("");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // Persist
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: user.id, recipient_id: recipientId, content })
      .select("id,sender_id,recipient_id,content,created_at")
      .single();

    if (!error && data) {
      console.log('✅ Message sent successfully:', data);
      // Reconcile pending temp with actual row
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === tempId);
        if (idx !== -1) {
          const clone = [...prev];
          clone[idx] = data;
          return clone.sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || ''));
        }
        // If not found (realtime already added it), ensure no duplicates
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data].sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || ''));
      });
    } else {
      console.error('❌ Failed to send message:', error);
      // Mark as failed (or remove)
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, pending: false } : m)));
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
              <CardTitle className="text-lg">Chat</CardTitle>
              <RealtimeStatus channelName={`chat-${user.id}-${recipientId}`} />
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] sm:max-w-[65%] px-3 py-2 rounded-2xl ${
                    m.sender_id === user.id 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted text-muted-foreground rounded-tl-sm'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words hyphens-auto">
                      {m.content}
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                      <span className="shrink-0">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {m.sender_id === user.id && (
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
            
            {/* Input Area */}
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

export default Chat;