import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SiteLoader from '@/components/SiteLoader';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteLoader />
      <Navbar />
      <div className="pt-20">{children}</div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
