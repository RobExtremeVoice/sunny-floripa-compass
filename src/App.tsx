import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Flights from "./pages/Flights";
import Accommodations from "./pages/Accommodations";
import Beaches from "./pages/Beaches";
import BeachDetailPage from "./pages/BeachDetail";
import Gastronomy from "./pages/Gastronomy";
import RestaurantDetail from "./pages/RestaurantDetail";
import Entertainment from "./pages/Entertainment";
import EntertainmentDetail from "./pages/EntertainmentDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/hospedagem" element={<Accommodations />} />
          <Route path="/praias" element={<Beaches />} />
          <Route path="/praias/:slug" element={<BeachDetailPage />} />
          <Route path="/gastronomia" element={<Gastronomy />} />
          <Route path="/gastronomia/:slug" element={<RestaurantDetail />} />
          <Route path="/entretenimento" element={<Entertainment />} />
          <Route path="/entretenimento/:slug" element={<EntertainmentDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
