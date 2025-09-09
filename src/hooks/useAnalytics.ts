import { track } from '@vercel/analytics';

/**
 * Custom hook for tracking important user events in UnHinged app
 * This helps measure user engagement and app performance
 */
export const useAnalytics = () => {
  // Track user registration/sign up
  const trackSignUp = (method: 'email' | 'google' = 'email') => {
    track('User Sign Up', { method });
  };

  // Track successful sign in
  const trackSignIn = (method: 'email' | 'google' = 'email') => {
    track('User Sign In', { method });
  };

  // Track book swipe actions
  const trackBookSwipe = (direction: 'left' | 'right', bookTitle?: string) => {
    track('Book Swipe', { 
      direction: direction === 'right' ? 'like' : 'pass',
      book_title: bookTitle 
    });
  };

  // Track when users get a match
  const trackBookMatch = (bookTitle?: string, matchCount?: number) => {
    track('Book Match', { 
      book_title: bookTitle,
      match_count: matchCount 
    });
  };

  // Track chat message sending
  const trackMessageSent = (chatType: 'private' | 'book_group') => {
    track('Message Sent', { chat_type: chatType });
  };

  // Track when user opens community page
  const trackCommunityVisit = () => {
    track('Community Page Visit');
  };

  // Track profile completion/update
  const trackProfileUpdate = () => {
    track('Profile Updated');
  };

  // Track when user starts swiping
  const trackSwipeSessionStart = () => {
    track('Swipe Session Started');
  };

  // Track when user completes all available swipes
  const trackSwipeSessionComplete = (totalSwipes: number, likes: number) => {
    track('Swipe Session Completed', { 
      total_swipes: totalSwipes,
      total_likes: likes,
      like_rate: totalSwipes > 0 ? Math.round((likes / totalSwipes) * 100) : 0
    });
  };

  return {
    trackSignUp,
    trackSignIn,
    trackBookSwipe,
    trackBookMatch,
    trackMessageSent,
    trackCommunityVisit,
    trackProfileUpdate,
    trackSwipeSessionStart,
    trackSwipeSessionComplete
  };
};

// Direct tracking functions for use outside components
export const analytics = {
  trackSignUp: (method: 'email' | 'google' = 'email') => {
    track('User Sign Up', { method });
  },
  
  trackSignIn: (method: 'email' | 'google' = 'email') => {
    track('User Sign In', { method });
  },
  
  trackBookSwipe: (direction: 'left' | 'right', bookTitle?: string) => {
    track('Book Swipe', { 
      direction: direction === 'right' ? 'like' : 'pass',
      book_title: bookTitle 
    });
  },
  
  trackBookMatch: (bookTitle?: string, matchCount?: number) => {
    track('Book Match', { 
      book_title: bookTitle,
      match_count: matchCount 
    });
  },
  
  trackMessageSent: (chatType: 'private' | 'book_group') => {
    track('Message Sent', { chat_type: chatType });
  },
  
  trackCommunityVisit: () => {
    track('Community Page Visit');
  },
  
  trackProfileUpdate: () => {
    track('Profile Updated');
  }
};
