import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

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

  const swipeBook = (direction: 'left' | 'right') => {
    // Prevent multiple swipes during animation
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    // You can add logic here to save user preferences
    console.log(`Swiped ${direction} on book: ${books[currentBookIndex]?.["Book-Title"]}`);
    
    // Wait for animation to complete before showing next book
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
    swipeDirection
  };
};