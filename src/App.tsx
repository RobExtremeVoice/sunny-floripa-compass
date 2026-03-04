import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { TravelAssistantProvider } from "@/contexts/TravelAssistantContext";
import TravelAssistantDrawer from "@/components/TravelAssistantDrawer";
import BottomNav from "@/components/BottomNav";
import AIFab from "@/components/AIFab";
import ScrollToTop from "@/components/ScrollToTop";
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
import Auth from "./pages/Auth";
import TripPlanner from "./pages/TripPlanner";
import TripDetail from "./pages/TripDetail";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBeaches from "./pages/admin/AdminBeaches";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminEntertainment from "./pages/admin/AdminEntertainment";
import AdminAccommodations from "./pages/admin/AdminAccommodations";
import AdminFlights from "./pages/admin/AdminFlights";
import AdminUsers from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

// Public shell: shows BottomNav, AIFab and TravelAssistantDrawer only outside /admin
function PublicShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;
  return (
    <>
      <TravelAssistantDrawer />
      <AIFab />
      <BottomNav />
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TravelAssistantProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <PublicShell />
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
              <Route path="/auth" element={<Auth />} />
              <Route path="/planejar" element={<TripPlanner />} />
              <Route path="/planejar/:id" element={<TripDetail />} />
              {/* Admin routes — protected by AdminLayout (no public shell) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="praias" element={<AdminBeaches />} />
                <Route path="restaurantes" element={<AdminRestaurants />} />
                <Route path="entretenimento" element={<AdminEntertainment />} />
                <Route path="hospedagem" element={<AdminAccommodations />} />
                <Route path="voos" element={<AdminFlights />} />
                <Route path="usuarios" element={<AdminUsers />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </TravelAssistantProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
