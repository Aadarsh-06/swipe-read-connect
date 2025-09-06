import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yyupyzapcugtgjzubvie.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dXB5emFwY3VndGdqenVidmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODA0MjAsImV4cCI6MjA3MDg1NjQyMH0.OgjJNUmGKAIgVdIPWZ9e0w9DIRgVXxOzRCWp3yDa7MY";

export const createSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit', // Changed from 'pkce' to 'implicit' for email confirmation
      debug: import.meta.env.DEV, // Enable debug logs in development
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
};

// Export configured client
export const supabase = createSupabaseClient();

// Helper function to get the correct redirect URL
export const getAuthRedirectUrl = (path: string = '/auth/callback') => {
  // Always use the current origin for both development and production
  // This ensures it works with Lovable's preview URLs
  return `${window.location.origin}${path}`;
};

// Helper function for better error handling
export const handleAuthError = (error: any): string => {
  if (error?.message) {
    // Handle common Supabase auth errors
    if (error.message.includes('Invalid login credentials')) {
      return 'Invalid email or password. If you signed up recently, please check your email for a confirmation link.';
    }
    if (error.message.includes('Email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    if (error.message.includes('Invalid redirect URL')) {
      return 'The confirmation link is not properly configured. Please try signing in manually or contact support.';
    }
    if (error.message.includes('Email link is invalid or has expired')) {
      return 'Your confirmation link has expired. Please request a new confirmation email by trying to sign in, or sign up again with a fresh email.';
    }
    if (error.message.includes('otp_expired')) {
      return 'Your confirmation link has expired. Please try signing in to request a new confirmation email, or sign up again.';
    }
    if (error.message.includes('both auth code and code verifier should be non-empty')) {
      return 'Authentication configuration error. Please try signing in manually or contact support.';
    }
    if (error.message.includes('Unexpected authentication method')) {
      return 'There was an issue with the authentication method. Please try signing in manually.';
    }
    if (error.message.includes('User not found')) {
      return 'No account found with this email address.';
    }
    if (error.message.includes('too many requests')) {
      return 'Too many attempts. Please wait a moment before trying again.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};
