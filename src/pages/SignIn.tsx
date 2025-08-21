import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const onGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (e: any) {
      setError(e?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="/background.mp4"
      />
      <div className="absolute inset-0 bg-background/85" />
      <div className="relative z-10 w-full max-w-md p-6">
        <Card className="border-border/50 backdrop-blur-md bg-card/70">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <BookOpen className="h-10 w-10 text-primary" />
              <span className="text-3xl font-bold">Bookble</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-destructive text-sm text-center">{error}</div>}
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              disabled={loading}
              onClick={onGoogle}
            >
              {loading ? "Signing in..." : "Continue with Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;