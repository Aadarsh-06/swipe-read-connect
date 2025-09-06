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
      flowType: 'pkce', // More secure flow
      debug: import.meta.env.DEV, // Enable debug logs in development
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
      return 'Authentication configuration error. Please contact support.';
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
