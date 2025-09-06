import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, handleAuthError, getAuthRedirectUrl } from "@/lib/supabase-config";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import booksBackground from "@/assets/books-background.jpg";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setInfo(null);
      if (!email || !password) throw new Error("Email and password are required");
      if (password !== confirm) throw new Error("Passwords do not match");
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { 
          emailRedirectTo: getAuthRedirectUrl(),
          data: {
            signup_source: 'bookble_web'
          }
        }
      });
      if (error) throw error;
      if (data.session) {
        navigate("/");
      } else {
        setInfo("Success! Check your email for a confirmation link. Click the link in your email to activate your account, then you can sign in.");
      }
    } catch (e: any) {
      setError(handleAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${booksBackground})` }}
    >
      <div className="absolute inset-0 bg-background/90"></div>
      <div className="relative z-10 w-full max-w-md p-6">
        <Card className="border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Bookble</span>
            </div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Join and start matching with readers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" className="bg-input/80" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a password" className="bg-input/80" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" placeholder="Confirm your password" className="bg-input/80" value={confirm} onChange={(e) => setConfirm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); }} />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            {info && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="text-sm text-green-800">{info}</div>
              </div>
            )}
            <Button className="w-full" size="lg" disabled={loading} onClick={onSubmit}>{loading ? "Creating..." : "Sign Up"}</Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;