import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Users, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import booksBackground from "@/assets/books-background.jpg";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const Index = () => {
  const { profile } = useProfile();
  const { user, signOut } = useAuth();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${booksBackground})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/95"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md border-b z-50 relative">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-lg sm:text-xl font-bold">UnHinged</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/community" className="hidden md:block">
              <Button variant="ghost" size="sm">Community</Button>
            </Link>
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 sm:gap-2 rounded-full px-1 sm:px-2 py-1 hover:bg-muted">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback>{(profile.display_name || 'R')[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs sm:text-sm font-medium max-w-[80px] sm:max-w-[120px] truncate hidden xs:block">{profile.display_name || 'Reader'}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Signed in</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/signin" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/signup" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
            <Link to="/swipe">
              <Button size="sm" className="text-xs sm:text-sm px-3 sm:px-4">Start Swiping</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Swipe Books.<br />Find Readers.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/80 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto font-medium px-4">
              The fastest way to discover your next favorite book
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Link to="/swipe" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-full shadow-2xl hover:scale-105 transition-all duration-300">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  Start Swiping
                </Button>
              </Link>
              <Link to="/community" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-full border-2 border-accent/30 hover:border-accent hover:scale-105 transition-all duration-300 bg-accent/10">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  Community
                </Button>
              </Link>
              {!user && (
                <Link to="/signin" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-full border-2 border-primary/30 hover:border-primary hover:scale-105 transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base sm:text-lg px-2">
                  Swipe through thousands of books instantly
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-destructive" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Match</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base sm:text-lg px-2">
                  Connect with readers who love the same books
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base sm:text-lg px-2">
                  Discuss books and share recommendations
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-background/90 backdrop-blur-sm border-t py-8 sm:py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold">UnHinged</span>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t text-center text-sm sm:text-base text-muted-foreground">
            <p>UnHinged</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
