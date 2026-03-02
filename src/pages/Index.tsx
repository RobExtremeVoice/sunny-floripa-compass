import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import QuickSearch from "@/components/QuickSearch";
import FeaturedCards from "@/components/FeaturedCards";
import StatsBar from "@/components/StatsBar";
import Newsletter from "@/components/Newsletter";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO />
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
