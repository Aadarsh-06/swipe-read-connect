import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

interface MessageRow {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

const Chat = () => {
  const { user } = useAuth();
  const { recipientId } = useParams<{ recipientId: string }>();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user || !recipientId) return;
    let isCancelled = false;

    const load = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id,sender_id,recipient_id,content,created_at")
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      if (!isCancelled) setMessages(data || []);
    };

    load();

    const channel = supabase
      .channel("chat-" + recipientId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const row = payload.new as MessageRow;
        if (
          (row.sender_id === user.id && row.recipient_id === recipientId) ||
          (row.sender_id === recipientId && row.recipient_id === user.id)
        ) {
          setMessages((prev) => [...prev, row]);
        }
      })
      .subscribe();

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user, recipientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (!user || !recipientId || !text.trim()) return;
    await supabase.from("messages").insert({ sender_id: user.id, recipient_id: recipientId, content: text.trim() });
    setText("");
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
    <div className="min-h-screen container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Community
        </Link>
      </div>
      <Card className="h-[70vh] flex flex-col">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[80%] px-3 py-2 rounded-xl ${m.sender_id === user.id ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
                <div className="whitespace-pre-wrap break-words">{m.content}</div>
                <div className="text-[10px] opacity-70 mt-1">{new Date(m.created_at).toLocaleString()}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="mt-3 flex gap-2">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
            <Button onClick={send}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;