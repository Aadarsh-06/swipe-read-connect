import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Profile = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [avatar, setAvatar] = useState(profile?.avatar_url || "");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);
      await updateProfile({ display_name: displayName || null, avatar_url: avatar || null });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please sign in.</p>
          <Link to="/signin"><Button>Sign In</Button></Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar || undefined} />
              <AvatarFallback>{(displayName || 'R')[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 grid gap-2">
              <div>
                <Label>Display name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your username" />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://…" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
            <Button onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;