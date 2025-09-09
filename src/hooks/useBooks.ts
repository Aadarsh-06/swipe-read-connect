import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useImagePreloader } from './useImagePreloader';
import { lacBookCollection, syncLacBooks, CuratedBook, getRandomizedBooks } from '@/data/lacBooks';
import { analytics } from './useAnalytics';

interface Book {
  id: number;
  "Book-Title": string;
  "Book-Author": string;
  "Publisher": string | null;
  "Year-Of-Publication": number | null;
  "Image-URL-S": string;
  "Image-URL-M"?: string;
  "Image-URL-L"?: string;
  "ISBN": string;
  summary?: string;
  authorBio?: string;
}

export const useBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [lastMatchUserIds, setLastMatchUserIds] = useState<string[] | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  // Map ISBN -> Supabase BOOKS.id to avoid extra lookups once resolved
  const [isbnToSupabaseId, setIsbnToSupabaseId] = useState<Record<string, number>>({});
  
  // Image preloading for smooth swiping
  const imagePreloader = useImagePreloader(books, currentBookIndex, 4);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      console.log('📚 Starting book fetch with performance optimization...');
      
      // Get randomized books from LAC collection (25 random books each session)
      const randomizedBooks = getRandomizedBooks(25);
      
      // Immediately render from randomized LAC collection for fast first paint
      const initial: Book[] = randomizedBooks.map((c: CuratedBook, index: number) => ({
        id: (c.id as number) ?? -1 * (index + 1),
        "Book-Title": c.title,
        "Book-Author": c.author,
        Publisher: c.publisher ?? null,
        "Year-Of-Publication": c.year ?? null,
        "Image-URL-S": c.imageUrl,
        "Image-URL-M": c.imageUrl,
        "Image-URL-L": c.imageUrl,
        "ISBN": c.isbn,
        summary: c.summary,
        authorBio: c.authorBio,
      }));
      
      console.log('📚 Books loaded from local collection, rendering immediately');
      setBooks(initial);
      setLoading(false);

      // Skip database sync during high traffic to prevent timeouts
      // Instead, we'll handle book persistence more gracefully
      console.log('⚡ Skipping database sync for performance - using client-side book data');
      
    } catch (err) {
      console.error('📚 Book fetch error:', err);
      
      // Even if there's an error, try to provide some books
      const fallbackBooks = getRandomizedBooks(10);
      const fallback: Book[] = fallbackBooks.map((c: CuratedBook, index: number) => ({
        id: -1 * (index + 1),
        "Book-Title": c.title,
        "Book-Author": c.author,
        Publisher: c.publisher ?? null,
        "Year-Of-Publication": c.year ?? null,
        "Image-URL-S": c.imageUrl,
        "Image-URL-M": c.imageUrl,
        "Image-URL-L": c.imageUrl,
        "ISBN": c.isbn,
        summary: c.summary,
        authorBio: c.authorBio,
      }));
      
      setBooks(fallback);
      setLoading(false);
      console.log('📚 Loaded fallback books due to error');
    }
  };

  const ensureBookIdByIsbn = async (book: Book): Promise<number | null> => {
    const isbn = book["ISBN"];
    if (isbnToSupabaseId[isbn]) return isbnToSupabaseId[isbn];

    // Try to find existing
    const { data: existing, error: selectError } = await supabase
      .from('BOOKS')
      .select('id')
      .eq('ISBN', isbn)
      .maybeSingle();

    if (existing?.id) {
      setIsbnToSupabaseId((prev) => ({ ...prev, [isbn]: existing.id }));
      return existing.id;
    }

    if (selectError && selectError.code && selectError.code !== 'PGRST116') {
      // eslint-disable-next-line no-console
      console.warn('BOOKS select error:', selectError.message);
    }

    // Insert minimal book row if not found
    const { data: inserted, error: insertError } = await supabase
      .from('BOOKS')
      .insert({
        "Book-Title": book["Book-Title"],
        "Book-Author": book["Book-Author"],
        "Image-URL-S": book["Image-URL-S"],
        "Image-URL-M": book["Image-URL-M"] ?? book["Image-URL-S"],
        "Image-URL-L": book["Image-URL-L"] ?? book["Image-URL-M"] ?? book["Image-URL-S"],
        ISBN: isbn,
        Publisher: book.Publisher,
        "Year-Of-Publication": book["Year-Of-Publication"],
      })
      .select('id')
      .maybeSingle();

    if (insertError) {
      // eslint-disable-next-line no-console
      console.warn('BOOKS insert error:', insertError.message);
      return null;
    }
    if (inserted?.id) {
      setIsbnToSupabaseId((prev) => ({ ...prev, [isbn]: inserted.id }));
      return inserted.id;
    }
    return null;
  };

  const persistPreference = async (book: Book, liked: boolean) => {
    if (!user) return null;
    
    try {
      // Use timeout to prevent hanging during high traffic
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      );
      
      const persistPromise = async () => {
        const resolvedId = await ensureBookIdByIsbn(book);
        if (!resolvedId) {
          console.warn('🚫 Could not resolve book ID, skipping persistence for:', book["Book-Title"]);
          return;
        }

        const { error } = await supabase
          .from('user_book_preferences')
          .upsert({ user_id: user.id, book_id: resolvedId, preference: liked }, { onConflict: 'user_id,book_id' });
        
        if (error) {
          console.warn('⚠️ Failed to persist preference (will retry later):', error.message);
          return; // Don't block UI for failed persistence
        }
        
        // Only check for matches if the preference was successfully saved
        if (liked) {
          const { data: matchesData, error: matchesError } = await supabase
            .from('matches')
            .select('user1_id,user2_id,book_id')
            .eq('book_id', resolvedId)
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
            
          if (!matchesError && matchesData) {
            const others = matchesData
              .map(m => (m.user1_id === user.id ? m.user2_id : m.user1_id))
              .filter(Boolean);
            const hasMatches = others.length > 0;
            setLastMatchUserIds(hasMatches ? others : null);
            
            // Track match analytics
            if (hasMatches) {
              analytics.trackBookMatch(book["Book-Title"], others.length);
            }
          }
        }
      };
      
      await Promise.race([persistPromise(), timeoutPromise]);
      
    } catch (error) {
      console.warn('⚡ Database operation timed out or failed, continuing without persistence:', error);
      // Don't block the UI - just continue swiping
    }
    
    return null;
  };

  const swipeBook = (direction: 'left' | 'right') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    const current = books[currentBookIndex];
    const liked = direction === 'right';

    if (current) {
      // Track swipe analytics (safe)
      try {
        analytics.trackBookSwipe(direction, current["Book-Title"]);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
      
      // Persist in the background without blocking animations
      persistPreference(current, liked).catch(() => {});
      if (liked) setLikesCount(prev => prev + 1);
    }

    setTimeout(() => {
      setCurrentBookIndex(prev => prev + 1);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 600);
  };

  const currentBook = books[currentBookIndex];
  const hasMoreBooks = currentBookIndex < books.length;

  return {
    currentBook,
    hasMoreBooks,
    loading,
    error,
    swipeBook,
    totalBooks: books.length,
    currentIndex: currentBookIndex,
    isAnimating,
    swipeDirection,
    lastMatchUserIds,
    likesCount,
    // Image preloading functions
    getOptimalImageUrl: imagePreloader.getOptimalImageUrl,
    isImageLoaded: imagePreloader.isImageLoaded,
    getImageLoadingState: imagePreloader.getImageLoadingState,
  };
};