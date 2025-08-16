import { BookCard } from "@/components/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Heart, X, RotateCcw, Users, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

const Swipe = () => {
  const { currentBook, hasMoreBooks, loading, error, swipeBook, totalBooks, currentIndex, isAnimating, swipeDirection, lastMatchUserIds, likesCount } = useBooks();
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (lastMatchUserIds && lastMatchUserIds.length > 0) {
      setMatchedCount(prev => prev + lastMatchUserIds.length);
      setShowMatchDialog(true);
    }
  }, [lastMatchUserIds]);

  const matchPercent = useMemo(() => {
    if (totalBooks === 0) return 0;
    return Math.round(((likesCount || 0) / totalBooks) * 100);
  }, [likesCount, totalBooks]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500/10 via-background to-pink-500/10 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
            <div className="absolute inset-0 h-16 w-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Preparing your experience...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign in to start swiping</CardTitle>
            <CardDescription>Your likes will be saved and matched with other readers.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link to="/signin"><Button>Sign In</Button></Link>
            <Link to="/signup"><Button variant="outline">Create an account</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            You finished your swipes!
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Your reading taste match score: <span className="font-bold text-foreground">{matchPercent}%</span>
          </p>
          <div className="grid gap-3">
            <Link to="/community">
              <Button size="lg" className="w-full">
                <Users className="h-5 w-5 mr-2" /> Explore Community
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/top-match')}>
              <MessageCircle className="h-5 w-5 mr-2" /> Message Your Top Match
            </Button>
            <Button variant="ghost" size="lg" className="w-full" onClick={() => window.location.reload()}>
              <RotateCcw className="h-5 w-5 mr-2" /> Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500/10 via-background via-50% to-pink-500/10 overflow-hidden">
      {/* Match dialog */}
      <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>It’s a match! 🎉</DialogTitle>
            <DialogDescription>
              You and another reader liked the same book. Start a conversation!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button variant="secondary" onClick={() => setShowMatchDialog(false)}>Keep Swiping</Button>
            <Button onClick={() => { setShowMatchDialog(false); navigate('/community'); }}>See Matches</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
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