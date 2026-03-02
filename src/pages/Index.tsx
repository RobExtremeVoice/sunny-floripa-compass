import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import QuickSearch from "@/components/QuickSearch";
import FeaturedCards from "@/components/FeaturedCards";
import StatsBar from "@/components/StatsBar";
import Newsletter from "@/components/Newsletter";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <QuickSearch />
        <FeaturedCards />
        <StatsBar />
        <Newsletter />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
