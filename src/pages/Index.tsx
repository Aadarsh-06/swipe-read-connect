import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Users, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import booksBackground from "@/assets/books-background.jpg";

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${booksBackground})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/95"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md border-b z-50 relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Bookble</span>
          </div>
          <div className="space-x-2">
            <Link to="/community">
              <Button variant="ghost">Community</Button>
            </Link>
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/swipe">
              <Button>Start Swiping</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Swipe Books.<br />Find Readers.
            </h1>
            <p className="text-2xl md:text-3xl text-foreground/80 mb-12 max-w-3xl mx-auto font-medium">
              The fastest way to discover your next favorite book
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/swipe">
                <Button size="lg" className="text-xl px-12 py-8 rounded-full shadow-2xl hover:scale-105 transition-all duration-300">
                  Start Swiping
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" size="lg" className="text-xl px-12 py-8 rounded-full border-2 border-primary/30 hover:border-primary hover:scale-105 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Swipe through thousands of books instantly
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Match</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Connect with readers who love the same books
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-10 w-10 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Discuss books and share recommendations
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-black">Start Swiping Now</h2>
          <p className="text-2xl mb-12 text-black/80 font-medium">15 swipes to find your perfect book match</p>
          <Link to="/swipe">
            <Button size="lg" variant="secondary" className="text-2xl px-16 py-10 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 bg-background text-foreground border-0">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background/90 backdrop-blur-sm border-t py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Bookble</span>
            </div>
            <div className="flex space-x-6 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 Bookble. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
