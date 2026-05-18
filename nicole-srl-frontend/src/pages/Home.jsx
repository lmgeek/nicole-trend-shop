import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import LifestyleSection from "../components/home/LifestyleSection";
import InstagramSection from "../components/home/InstagramSection";
import BannerCTA from "../components/home/BannerCTA";
import BrandCarousel from "../components/home/BrandCarousel";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div style={{ marginTop: '5rem' }}>
        <BrandCarousel />
      </div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <LifestyleSection />
      <BannerCTA />
      <InstagramSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}