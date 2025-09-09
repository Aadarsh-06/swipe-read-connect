import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
        console.log('Processing auth callback...');
        console.log('Current URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        console.log('Search:', window.location.search);
        
        // Handle different types of auth callbacks
        const searchParams = new URLSearchParams(window.location.search);
        const hasAuthCode = searchParams.get('code');
        const hasTokenHash = searchParams.get('token_hash');
        const hasError = searchParams.get('error');
        
        // Check for authentication errors first
        if (hasError) {
          const errorDescription = searchParams.get('error_description') || 'Authentication failed';
          const errorCode = searchParams.get('error_code') || '';
          
          // Handle specific error cases
          if (errorCode === 'otp_expired' || errorDescription.includes('expired')) {
            throw new Error('Your confirmation link has expired. Please try signing in to request a new confirmation email, or sign up again.');
          }
          if (errorCode === 'access_denied') {
            throw new Error('The confirmation link is no longer valid. Please try signing in to request a new confirmation email.');
          }
          
          throw new Error(errorDescription);
        }

        // Handle email confirmation with token_hash (most common for email signup)
        if (hasTokenHash) {
          console.log('Found token_hash, processing email confirmation...');
          
          // For implicit flow, we need to handle the session differently
          // Try to get session immediately
          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.error('Session error:', sessionError);
            throw sessionError;
          }
          
          if (data.session) {
            console.log('Email confirmation successful!');
            setStatus('success');
            startCountdown();
            return;
          }
          
          // If no session yet, wait a moment and try again
          console.log('No immediate session, waiting and retrying...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: retryData, error: retryError } = await supabase.auth.getSession();
          if (retryError) {
            console.error('Retry error:', retryError);
            throw retryError;
          }
          
          if (retryData.session) {
            console.log('Email confirmation successful after retry!');
            setStatus('success');
            startCountdown();
          } else {
            throw new Error('Email confirmation completed but no session found. Please try signing in manually.');
          }
          return;
        }

        // Handle OAuth code exchange (OAuth providers like Google) - should not happen with email confirmation
        if (hasAuthCode) {
          console.log('Found auth code, but this should not happen with email confirmation...');
          throw new Error('Unexpected authentication method. Please try signing in manually.');
        }

        // Handle hash-based tokens (some OAuth flows)
        const hash = window.location.hash;
        if (hash.includes('access_token')) {
          console.log('Found access token in hash...');
          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            throw sessionError;
          }
          if (data.session) {
            console.log('Hash-based auth successful!');
            setStatus('success');
            startCountdown();
            return;
          }
        }

        // If we get here without a session, check one more time
        console.log('No immediate auth tokens found, checking for existing session...');
        const { data: finalCheck } = await supabase.auth.getSession();
        if (finalCheck.session) {
          console.log('Found existing session!');
          setStatus('success');
          startCountdown();
          return;
        }

        // If we still have no session, this is likely an error
        throw new Error('Authentication completed but no valid session was established');
        
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err?.message || "An authentication error occurred");
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
              <span className="text-2xl font-bold">UnHinged</span>
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
                <CardTitle className="text-xl text-green-600">Welcome to UnHinged!</CardTitle>
                <CardDescription>
                  🎉 Your account has been successfully verified! You're all set to start discovering your next favorite book and connecting with fellow readers.
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
                  Continue to UnHinged
                </Button>
              </>
            )}
            
            {status === 'error' && (
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full">
                  Try Signing In Again
                </Button>
                <Button onClick={() => navigate('/signup', { replace: true })} variant="outline" className="w-full">
                  Sign Up with New Email
                </Button>
                <Button onClick={handleContinue} variant="ghost" className="w-full">
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
