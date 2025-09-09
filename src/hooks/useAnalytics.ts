// Analytics disabled - using no-op functions

/**
 * Analytics hook with no-op functions (Vercel Analytics removed)
 * This maintains the same API but doesn't track anything
 */
export const useAnalytics = () => {
  // No-op functions to prevent errors
  const trackSignUp = (method: 'email' | 'google' = 'email') => {};
  const trackSignIn = (method: 'email' | 'google' = 'email') => {};
  const trackBookSwipe = (direction: 'left' | 'right', bookTitle?: string) => {};
  const trackBookMatch = (bookTitle?: string, matchCount?: number) => {};
  const trackMessageSent = (chatType: 'private' | 'book_group') => {};
  const trackCommunityVisit = () => {};
  const trackProfileUpdate = () => {};
  const trackSwipeSessionStart = () => {};
  const trackSwipeSessionComplete = (totalSwipes: number, likes: number) => {};

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

// Direct tracking functions for use outside components (no-op)
export const analytics = {
  trackSignUp: (method: 'email' | 'google' = 'email') => {},
  trackSignIn: (method: 'email' | 'google' = 'email') => {},
  trackBookSwipe: (direction: 'left' | 'right', bookTitle?: string) => {},
  trackBookMatch: (bookTitle?: string, matchCount?: number) => {},
  trackMessageSent: (chatType: 'private' | 'book_group') => {},
  trackCommunityVisit: () => {},
  trackProfileUpdate: () => {},
  trackSwipeSessionStart: () => {},
  trackSwipeSessionComplete: (totalSwipes: number, likes: number) => {}
};
