import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Book {
  id: number;
  "Book-Title": string;
  "Book-Author": string;
  "Publisher": string;
  "Year-Of-Publication": number;
  "Image-URL-S": string;
  "ISBN": string;
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

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('BOOKS')
        .select('*')
        .limit(15);

      if (error) throw error;
      setBooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const persistPreference = async (bookId: number, liked: boolean) => {
    if (!user) return null;
    const { error } = await supabase
      .from('user_book_preferences')
      .upsert({ user_id: user.id, book_id: bookId, preference: liked }, { onConflict: 'user_id,book_id' });
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to persist preference', error.message);
    }
    if (liked) {
      // After inserting like, check if any matches created that involve this user and book
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('user1_id,user2_id,book_id')
        .eq('book_id', bookId)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      if (!matchesError && matchesData) {
        // Find the other user ids in those matches
        const others = matchesData
          .map(m => (m.user1_id === user.id ? m.user2_id : m.user1_id))
          .filter(Boolean);
        if (others.length > 0) {
          setLastMatchUserIds(others);
        } else {
          setLastMatchUserIds(null);
        }
      }
    }
    return null;
  };

  const swipeBook = (direction: 'left' | 'right') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    const current = books[currentBookIndex];
    const liked = direction === 'right';

    // Save user preference asynchronously
    if (current) {
      persistPreference(current.id, liked).catch(() => {});
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
  };
};