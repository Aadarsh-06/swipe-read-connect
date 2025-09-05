import { useEffect, useState, useCallback } from 'react';

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

interface PreloadedImage {
  url: string;
  loaded: boolean;
  error: boolean;
}

export const useImagePreloader = (books: Book[], currentIndex: number, preloadCount: number = 3) => {
  const [preloadedImages, setPreloadedImages] = useState<Map<string, PreloadedImage>>(new Map());

  const getImageUrls = useCallback((book: Book): string[] => {
    const urls = [];
    
    // Primary sources (from book data)
    if (book["Image-URL-L"]) urls.push(book["Image-URL-L"]);
    if (book["Image-URL-M"]) urls.push(book["Image-URL-M"]);
    if (book["Image-URL-S"]) urls.push(book["Image-URL-S"]);
    
    // Fallback sources (OpenLibrary by ISBN)
    if (book["ISBN"]) {
      urls.push(`https://covers.openlibrary.org/b/isbn/${book["ISBN"]}-L.jpg`);
      urls.push(`https://covers.openlibrary.org/b/isbn/${book["ISBN"]}-M.jpg`);
      urls.push(`https://covers.openlibrary.org/b/isbn/${book["ISBN"]}-S.jpg`);
    }
    
    return urls.filter(Boolean);
  }, []);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Set loading attributes
      img.decoding = 'async';
      img.loading = 'eager';
      
      img.onload = () => {
        setPreloadedImages(prev => new Map(prev.set(url, { url, loaded: true, error: false })));
        resolve();
      };
      
      img.onerror = () => {
        setPreloadedImages(prev => new Map(prev.set(url, { url, loaded: false, error: true })));
        reject(new Error(`Failed to load ${url}`));
      };
      
      // Start loading
      img.src = url;
    });
  }, []);

  const preloadBookImages = useCallback(async (book: Book) => {
    const urls = getImageUrls(book);
    
    // Try to load images in priority order (high-res first, fallback to lower-res)
    for (const url of urls) {
      // Skip if already processed
      if (preloadedImages.has(url)) {
        const cached = preloadedImages.get(url);
        if (cached?.loaded) return; // Found a working image
        if (cached?.error) continue; // Try next URL
      }
      
      try {
        await preloadImage(url);
        return; // Successfully loaded, stop trying other URLs
      } catch {
        continue; // Try next URL
      }
    }
  }, [getImageUrls, preloadImage, preloadedImages]);

  useEffect(() => {
    const preloadNext = async () => {
      // Preload current and next few books
      const booksToPreload = books.slice(currentIndex, currentIndex + preloadCount);
      
      // Preload in parallel but prioritize current book
      const [currentBook, ...nextBooks] = booksToPreload;
      
      // Preload current book first (highest priority)
      if (currentBook) {
        await preloadBookImages(currentBook);
      }
      
      // Preload next books in parallel
      const preloadPromises = nextBooks.map(book => preloadBookImages(book));
      Promise.allSettled(preloadPromises); // Don't await, just fire and forget
    };

    preloadNext();
  }, [books, currentIndex, preloadCount, preloadBookImages]);

  const getOptimalImageUrl = useCallback((book: Book): string | null => {
    const urls = getImageUrls(book);
    
    // Find the first loaded image
    for (const url of urls) {
      const cached = preloadedImages.get(url);
      if (cached?.loaded) return url;
    }
    
    // If no preloaded image, return the best available URL
    return urls[0] || null;
  }, [getImageUrls, preloadedImages]);

  const isImageLoaded = useCallback((book: Book): boolean => {
    const urls = getImageUrls(book);
    return urls.some(url => preloadedImages.get(url)?.loaded === true);
  }, [getImageUrls, preloadedImages]);

  const getImageLoadingState = useCallback((book: Book): 'loading' | 'loaded' | 'error' => {
    const urls = getImageUrls(book);
    
    // Check if any image is loaded
    if (urls.some(url => preloadedImages.get(url)?.loaded === true)) {
      return 'loaded';
    }
    
    // Check if all URLs have been tried and failed
    if (urls.length > 0 && urls.every(url => preloadedImages.get(url)?.error === true)) {
      return 'error';
    }
    
    return 'loading';
  }, [getImageUrls, preloadedImages]);

  return {
    getOptimalImageUrl,
    isImageLoaded,
    getImageLoadingState,
    preloadedImages: preloadedImages.size
  };
};
