import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Heart, X } from "lucide-react";

interface Book {
  id: number;
  "Book-Title": string;
  "Book-Author": string;
  "Publisher": string;
  "Year-Of-Publication": number;
  "Image-URL-S": string;
  "ISBN": string;
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
      return `translateX(${direction * 100}vw) rotate(${direction * 30}deg)`;
    }
    if (isDragging) {
      const rotation = dragOffset.x * 0.1;
      return `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`;
    }
    return 'translateX(0px) translateY(0px) rotate(0deg)';
  };

  const getOpacity = () => {
    if (isAnimating) return 0;
    if (isDragging) {
      const opacity = 1 - Math.abs(dragOffset.x) / 300;
      return Math.max(0.3, opacity);
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
          transition: isAnimating ? 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease-out' : isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
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
          {/* Book Image */}
          <div className="flex-1 p-6 flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
            {book["Image-URL-S"] ? (
              <img 
                src={book["Image-URL-S"]} 
                alt={book["Book-Title"]}
                className="max-h-80 max-w-full object-contain shadow-lg rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-48 h-72 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center shadow-inner">
                <span className="text-muted-foreground text-lg font-medium">No Image</span>
              </div>
            )}
          </div>
          
          {/* Book Details */}
          <div className="p-6 space-y-3 bg-gradient-to-t from-background to-background/95">
            <h3 className="font-bold text-xl leading-tight line-clamp-2 text-foreground">
              {book["Book-Title"]}
            </h3>
            <p className="text-muted-foreground text-base font-medium">
              by {book["Book-Author"]}
            </p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{book["Publisher"]}</span>
              <span>{book["Year-Of-Publication"]}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 p-6 pt-0">
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