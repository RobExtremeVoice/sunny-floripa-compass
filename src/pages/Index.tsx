import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import FeaturedCards from "@/components/FeaturedCards";
import SunnyCompass from "@/components/SunnyCompass";
import StoriesSection from "@/components/StoriesSection";
import InstagramFeed from "@/components/InstagramFeed";
import Newsletter from "@/components/Newsletter";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SEO />
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturedCards />
        <SunnyCompass />
        <StoriesSection />
        <InstagramFeed />
        <Newsletter />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
