import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Heart, X, Info } from "lucide-react";

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

interface BookCardProps {
  book: Book;
  onSwipe: (direction: 'left' | 'right') => void;
  isAnimating?: boolean;
  swipeDirection?: 'left' | 'right' | null;
}

export const BookCard = ({ book, onSwipe, isAnimating, swipeDirection }: BookCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(book["Image-URL-L"] || book["Image-URL-M"] || book["Image-URL-S"] || null);
  const triedFallbacksRef = useRef<number>(0);

  useEffect(() => {
    setImgSrc(book["Image-URL-L"] || book["Image-URL-M"] || book["Image-URL-S"] || null);
    triedFallbacksRef.current = 0;
  }, [book.id]);

  const tryNextFallback = () => {
    triedFallbacksRef.current += 1;
    const candidates = [book["Image-URL-L"], book["Image-URL-M"], book["Image-URL-S"],
      book["ISBN"] ? `https://covers.openlibrary.org/b/isbn/${book["ISBN"]}-L.jpg` : undefined,
      book["ISBN"] ? `https://covers.openlibrary.org/b/isbn/${book["ISBN"]}-M.jpg` : undefined,
      book["ISBN"] ? `https://covers.openlibrary.org/b/isbn/${book["ISBN"]}-S.jpg` : undefined,
      "/fallback-cover.jpg"
    ].filter(Boolean) as string[];
    const next = candidates[triedFallbacksRef.current] || null;
    setImgSrc(next);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      const threshold = 100;
      
      if (Math.abs(dragOffset.x) > threshold) {
        onSwipe(dragOffset.x > 0 ? 'right' : 'left');
      } else {
        setDragOffset({ x: 0, y: 0 });
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getTransform = () => {
    if (isAnimating && swipeDirection) {
      const direction = swipeDirection === 'right' ? 1 : -1;
      return `translateX(${direction * 120}vw) rotate(${direction * 22}deg)`;
    }
    if (isDragging) {
      const rotation = dragOffset.x * 0.06;
      return `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`;
    }
    return 'translateX(0px) translateY(0px) rotate(0deg)';
  };

  const getOpacity = () => {
    if (isAnimating) return 0;
    if (isDragging) {
      const opacity = 1 - Math.abs(dragOffset.x) / 300;
      return Math.max(0.4, opacity);
    }
    return 1;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Card 
        className="relative w-80 h-[600px] cursor-grab active:cursor-grabbing overflow-hidden bg-card border-2 shadow-2xl transition-all duration-300 select-none"
        style={{
          transform: getTransform(),
          opacity: getOpacity(),
          transition: isAnimating ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out' : isDragging ? 'none' : 'transform 0.25s ease-out, opacity 0.25s ease-out'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Swipe Indicators */}
        {isDragging && (
          <>
            <div 
              className={`absolute top-8 right-8 z-10 p-4 rounded-full transition-opacity duration-200 ${
                dragOffset.x > 50 ? 'opacity-100 bg-green-500' : 'opacity-30 bg-green-500/20'
              }`}
            >
              <Heart className="h-8 w-8 text-white" fill="white" />
            </div>
            <div 
              className={`absolute top-8 left-8 z-10 p-4 rounded-full transition-opacity duration-200 ${
                dragOffset.x < -50 ? 'opacity-100 bg-red-500' : 'opacity-30 bg-red-500/20'
              }`}
            >
              <X className="h-8 w-8 text-white" />
            </div>
          </>
        )}

        <div className="h-full flex flex-col">
          {/* Cover full-bleed area */}
          <div className="relative flex-1">
            {imgSrc ? (
              <img 
                src={imgSrc}
                alt={book["Book-Title"]}
                className="absolute inset-0 w-full h-full object-cover"
                onError={tryNextFallback}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <span className="text-muted-foreground text-lg font-medium">No Image</span>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setDetailsOpen((s) => !s); }}
              className="absolute bottom-3 right-3 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-xs border flex items-center gap-1 hover:bg-background"
            >
              <Info className="h-3 w-3" /> Details
            </button>
          </div>
          
          {/* Footer area */}
          <div className="relative">
            <div className="p-4 space-y-1 bg-gradient-to-t from-background/95 to-background/60">
              <h3 className="font-bold text-base leading-tight line-clamp-2 text-foreground">
                {book["Book-Title"]}
              </h3>
              <p className="text-muted-foreground text-sm">
                by {book["Book-Author"]}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{book["Publisher"] || ''}</span>
                <span>{book["Year-Of-Publication"] || ''}</span>
              </div>
            </div>
            {/* Sliding details panel */}
            <div
              className={`absolute left-0 right-0 bg-background/95 backdrop-blur border-t p-4 transition-transform duration-300 ease-out ${detailsOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
              {book.summary && (
                <div className="mb-2">
                  <div className="font-semibold mb-1">Summary</div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{book.summary}</p>
                </div>
              )}
              {book.authorBio && (
                <div>
                  <div className="font-semibold mb-1">About the author</div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{book.authorBio}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 p-4 pt-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwipe('left');
              }}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <X className="h-5 w-5" />
              Pass
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwipe('right');
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Heart className="h-5 w-5" />
              Love
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};