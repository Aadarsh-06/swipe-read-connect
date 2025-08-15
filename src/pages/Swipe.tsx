import { BookCard } from "@/components/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Heart, X, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const Swipe = () => {
  const { currentBook, hasMoreBooks, loading, error, swipeBook, totalBooks, currentIndex, isAnimating, swipeDirection } = useBooks();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500/10 via-background to-pink-500/10 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
            <div className="absolute inset-0 h-16 w-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Loading amazing books...</h2>
          <p className="text-muted-foreground">Get ready to discover your next favorite read</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500/10 via-background to-orange-500/10 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-8 text-lg">{error}</p>
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!hasMoreBooks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500/10 via-background to-blue-500/10 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Amazing job!
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            You've explored all {totalBooks} books in our collection. Ready to find some matches?
          </p>
          <div className="space-y-4">
            <Link to="/">
              <Button size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full" onClick={() => window.location.reload()}>
              <RotateCcw className="h-5 w-5 mr-2" />
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500/10 via-background via-50% to-pink-500/10 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-pink-400/10 to-violet-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              BookSwipe
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              {currentIndex + 1} of {totalBooks}
            </div>
          </div>
        </div>
      </header>

      {/* Main Swipe Area */}
      <main className="pt-20 pb-8 flex flex-col items-center justify-center min-h-screen relative">
        <div className="w-full max-w-sm mx-auto px-4">
          {currentBook && (
            <>
              {/* Title Section */}
              <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Discover Your Next Read
                </h1>
                <p className="text-muted-foreground text-lg">
                  Drag or use buttons to swipe
                </p>
              </div>
              
              {/* Book Card */}
              <div className="relative h-[600px] mb-8">
                <BookCard 
                  book={currentBook} 
                  onSwipe={swipeBook}
                  isAnimating={isAnimating}
                  swipeDirection={swipeDirection}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-6 mb-6">
                <button
                  onClick={() => swipeBook('left')}
                  disabled={isAnimating}
                  className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                >
                  <X className="h-8 w-8" />
                </button>
                <button
                  onClick={() => swipeBook('right')}
                  disabled={isAnimating}
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                >
                  <Heart className="h-8 w-8" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/70 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentIndex + 1) / totalBooks) * 100}%` }}
                ></div>
              </div>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>💡 <strong>Pro tip:</strong> Drag the card or use the buttons to swipe!</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Swipe;