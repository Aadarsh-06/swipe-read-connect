import { BookCard } from "@/components/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Swipe = () => {
  const { currentBook, hasMoreBooks, loading, error, swipeBook, totalBooks, currentIndex } = useBooks();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg">Loading amazing books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!hasMoreBooks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-4">
          <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">You've reached the end!</h2>
          <p className="text-lg text-muted-foreground mb-6">
            You've swiped through all {totalBooks} books. Great job exploring!
          </p>
          <Link to="/">
            <Button size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">BookSwipe</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} of {totalBooks}
          </div>
        </div>
      </header>

      {/* Main Swipe Area */}
      <main className="pt-24 pb-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto p-4">
          {currentBook && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Discover Your Next Read</h1>
                <p className="text-muted-foreground">
                  Swipe right if you love it, left to pass
                </p>
              </div>
              
              <BookCard 
                book={currentBook} 
                onSwipe={swipeBook}
              />
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>💡 Tip: Love a book? Swipe right to add it to your favorites!</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Swipe;