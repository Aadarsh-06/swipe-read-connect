import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { curatedBooks, syncCuratedBooks, CuratedBook } from '@/data/books';

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

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Sync curated books to Supabase BOOKS table by ISBN; then map enriched data
      const curated = await syncCuratedBooks();
      // Build Book objects in the expected shape
      const mapped: Book[] = curated.map((c: CuratedBook) => ({
        id: (c.id as number) ?? Math.floor(Math.random() * 1_000_000),
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
      setBooks(mapped.slice(0, 15));
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
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('user1_id,user2_id,book_id')
        .eq('book_id', bookId)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      if (!matchesError && matchesData) {
        const others = matchesData
          .map(m => (m.user1_id === user.id ? m.user2_id : m.user1_id))
          .filter(Boolean);
        setLastMatchUserIds(others.length > 0 ? others : null);
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