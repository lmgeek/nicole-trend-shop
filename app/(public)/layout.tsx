import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SiteLoader from '@/components/SiteLoader';
import { CartProvider } from '@/lib/cart-context';
import { AppLoadingProvider } from '@/lib/app-loading-context';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AppLoadingProvider>
        <div className="min-h-screen">
          <SiteLoader />
          <Navbar />
          <div className="pt-20">{children}</div>
          <Footer />
          <WhatsAppButton />
        </div>
      </AppLoadingProvider>
    </CartProvider>
  );
}
