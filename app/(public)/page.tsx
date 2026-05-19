export const dynamic = 'force-dynamic';

import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import LifestyleSection from '@/components/home/LifestyleSection';
import BannerCTA from '@/components/home/BannerCTA';
import InstagramSection from '@/components/home/InstagramSection';
import BrandCarousel from '@/components/home/BrandCarousel';

export default function Home() {
  return (
    <>
      <BrandCarousel />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <LifestyleSection />
      <BannerCTA />
      <InstagramSection />
    </>
  );
}
