import { Card } from "@/components/ui/card";

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
}

export const BookCard = ({ book, onSwipe }: BookCardProps) => {
  return (
    <Card className="relative w-80 h-96 mx-auto cursor-pointer overflow-hidden bg-card border-2 hover:shadow-xl transition-all duration-300">
      <div className="h-full flex flex-col">
        <div className="flex-1 p-4 flex items-center justify-center bg-muted/20">
          {book["Image-URL-S"] ? (
            <img 
              src={book["Image-URL-S"]} 
              alt={book["Book-Title"]}
              className="max-h-48 max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-32 h-48 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No Image</span>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-2">
            {book["Book-Title"]}
          </h3>
          <p className="text-muted-foreground text-sm">
            by {book["Book-Author"]}
          </p>
          <p className="text-xs text-muted-foreground">
            {book["Publisher"]} • {book["Year-Of-Publication"]}
          </p>
        </div>
        
        <div className="flex gap-2 p-4 pt-0">
          <button
            onClick={() => onSwipe('left')}
            className="flex-1 bg-destructive text-destructive-foreground py-2 px-4 rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Pass
          </button>
          <button
            onClick={() => onSwipe('right')}
            className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Love It
          </button>
        </div>
      </div>
    </Card>
  );
};