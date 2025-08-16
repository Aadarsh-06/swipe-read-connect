import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Swipe from "./pages/Swipe";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";
import Chat from "./pages/Chat";
import TopMatch from "./pages/TopMatch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Swipe />} />
          <Route path="/swipe" element={<Swipe />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/community" element={<Community />} />
          <Route path="/top-match" element={<TopMatch />} />
          <Route path="/chat/:recipientId" element={<Chat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
