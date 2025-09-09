import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = lazy(() => import("./pages/Index"));
const Swipe = lazy(() => import("./pages/Swipe"));
const SignIn = lazy(() => import("./pages/SignIn"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Community = lazy(() => import("./pages/Community"));
const Chat = lazy(() => import("./pages/Chat"));
const BookChat = lazy(() => import("./pages/BookChat"));
const TopMatch = lazy(() => import("./pages/TopMatch"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Profile = lazy(() => import("./pages/Profile"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading UnHinged...</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/swipe" element={<ErrorBoundary><Swipe /></ErrorBoundary>} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/community" element={<Community />} />
                <Route path="/top-match" element={<TopMatch />} />
                <Route path="/chat/:recipientId" element={<Chat />} />
                <Route path="/book-chat/:bookId" element={<BookChat />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
        {/* Vercel Analytics - tracks page views, user interactions, and custom events */}
        <ErrorBoundary fallback={null}>
          <Analytics debug={import.meta.env.DEV} />
        </ErrorBoundary>
        {/* Vercel Speed Insights - tracks Core Web Vitals and performance metrics */}
        <ErrorBoundary fallback={null}>
          <SpeedInsights debug={import.meta.env.DEV} />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
