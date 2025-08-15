import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Users, MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">BookSwipe</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
          </div>
          <div className="space-x-2">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Discover Books.<br />Find Book Lovers.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Swipe through amazing books, match with fellow readers, and discover your next favorite read together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Swiping Books
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How BookSwipe Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Discover Books</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Swipe through curated book recommendations tailored to your interests and reading preferences.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle>Match & Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  When you and another reader both love the same book, you'll instantly match and can start chatting.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle>Chat & Share</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Discuss your favorite books, share recommendations, and build meaningful connections through literature.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Simple. Fun. Effective.</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">1. Create Your Profile</h3>
                  <p className="text-muted-foreground">Tell us about your reading preferences and favorite genres.</p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">2. Start Swiping</h3>
                  <p className="text-muted-foreground">Swipe right on books you love, left on those you don't.</p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">3. Make Connections</h3>
                  <p className="text-muted-foreground">Match with readers who share your literary tastes.</p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">4. Discover Together</h3>
                  <p className="text-muted-foreground">Chat about books and find your next great read.</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium">Join thousands of book lovers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Next Favorite Book?</h2>
          <p className="text-xl mb-8 opacity-90">Join BookSwipe today and connect with fellow book enthusiasts.</p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            Start Your Book Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BookSwipe</span>
            </div>
            <div className="flex space-x-6 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 BookSwipe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
