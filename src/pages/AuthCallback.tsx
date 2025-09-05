import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase, handleAuthError } from "@/lib/supabase-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, BookOpen, Loader2 } from "lucide-react";
import booksBackground from "@/assets/books-background.jpg";

type AuthStatus = 'loading' | 'success' | 'error';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Handle different types of auth callbacks
        const hash = window.location.hash;
        const searchParams = new URLSearchParams(window.location.search);
        const hasAuthCode = searchParams.get('code');
        const hasAccessToken = hash.includes('access_token');
        const hasError = searchParams.get('error');
        
        // Check for authentication errors first
        if (hasError) {
          const errorDescription = searchParams.get('error_description') || 'Authentication failed';
          throw new Error(errorDescription);
        }

        // Handle OAuth code exchange (email confirmation, OAuth providers)
        if (hasAuthCode) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (exchangeError) {
            throw exchangeError;
          }
          if (data.session) {
            setStatus('success');
            startCountdown();
            return;
          }
        }

        // Handle hash-based tokens (some OAuth flows)
        if (hasAccessToken) {
          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            throw sessionError;
          }
          if (data.session) {
            setStatus('success');
            startCountdown();
            return;
          }
        }

        // If we get here without a session, something went wrong
        throw new Error('No valid authentication session found');
        
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(handleAuthError(err));
        setStatus('error');
      }
    };

    processAuth();
  }, [location]);

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleContinue = () => {
    navigate('/', { replace: true });
  };

  const handleRetry = () => {
    navigate('/signin', { replace: true });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${booksBackground})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/90"></div>
      
      <div className="relative z-10 w-full max-w-md p-6">
        <Card className="border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Bookble</span>
            </div>
            
            {status === 'loading' && (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
                <CardTitle className="text-xl">Confirming your account...</CardTitle>
                <CardDescription>
                  Please wait while we verify your authentication
                </CardDescription>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-xl text-green-600">Authentication Successful!</CardTitle>
                <CardDescription>
                  Welcome to Bookble! Your account has been confirmed successfully.
                </CardDescription>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="flex justify-center mb-4">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
                <CardTitle className="text-xl text-red-600">Authentication Failed</CardTitle>
                <CardDescription>
                  {error || 'There was a problem confirming your account.'}
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            {status === 'success' && (
              <>
                <p className="text-sm text-muted-foreground">
                  Redirecting you to the home page in {countdown} seconds...
                </p>
                <Button onClick={handleContinue} className="w-full">
                  Continue to Bookble
                </Button>
              </>
            )}
            
            {status === 'error' && (
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full">
                  Try Signing In Again
                </Button>
                <Button onClick={handleContinue} variant="outline" className="w-full">
                  Go to Home Page
                </Button>
              </div>
            )}
            
            {status === 'loading' && (
              <p className="text-sm text-muted-foreground">
                This may take a few moments...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthCallback;
