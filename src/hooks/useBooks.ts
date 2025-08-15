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

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('BOOKS')
        .select('*')
        .limit(50);

      if (error) throw error;
      
      setBooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const swipeBook = (direction: 'left' | 'right') => {
    // You can add logic here to save user preferences
    console.log(`Swiped ${direction} on book: ${books[currentBookIndex]?.["Book-Title"]}`);
    
    setCurrentBookIndex(prev => prev + 1);
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
    currentIndex: currentBookIndex
  };
};