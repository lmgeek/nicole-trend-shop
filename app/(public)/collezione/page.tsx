'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand?: string;
  images?: string[];
}

interface Category {
  name: string;
  slug: string;
}

export default function CollezionePage() {
  return (
    <Suspense fallback={
      <div className="pt-28 pb-24 flex justify-center">
        <p className="text-lg">Caricamento...</p>
      </div>
    }>
      <CollezioneContent />
    </Suspense>
  );
}

function CollezioneContent() {
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const brandParam = searchParams.get('brand');

  const [activeFilter, setActiveFilter] = useState('');
  const [activeBrand, setActiveBrand] = useState<string | null>(brandParam);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, catsData] = await Promise.all([
          fetch('/api/public/products').then((res) => res.json()),
          fetch('/api/categories/enabled').then((res) => res.json()),
        ]);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(catsData) ? catsData : []);
      } catch (err) {
        console.error('Errore nel caricamento dei dati:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (brandParam) {
      setActiveBrand(brandParam);
      setActiveFilter('');
    }
  }, [brandParam]);

  const filtered = products.filter((p) => {
    const matchCategory = activeFilter === '' || p.category === activeFilter;
    const matchBrand = activeBrand === null || p.brand === activeBrand;
    return matchCategory && matchBrand;
  });

  const formatPrice = (price: number) => `\u20ac ${price.toFixed(2).replace('.', ',')}`;

  const getCategoryName = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    return cat ? cat.name : slug;
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
    });
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const clearFilters = () => {
    setActiveFilter('');
    setActiveBrand(null);
  };

  if (loading) {
    return (
      <div className="pt-28 pb-24 flex justify-center">
        <p className="text-lg">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          {/*<p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-3">Abbigliamento e Accessori</p>*/}
          <br />
          <h1 className="font-heading text-4xl md:text-6xl font-semibold text-foreground leading-tight">
            La Nostra<br /><span className="italic font-light">Collezione</span>
          </h1>
          {activeBrand && (
            <p className="text-lg text-foreground/60 mt-2">
              Marca: <span className="text-foreground font-medium">{activeBrand}</span>
            </p>
          )}
        </motion.div>

        {(activeFilter || activeBrand) && (
          <button
            onClick={clearFilters}
            className="mb-6 text-sm text-foreground/60 hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Mostra tutti i prodotti
          </button>
        )}

        <div className="flex flex-wrap gap-2 mb-12">
          <button onClick={() => { setActiveFilter(''); setActiveBrand(null); }} className={`font-body text-xs tracking-wider uppercase px-5 py-2.5 rounded-full transition-all ${activeFilter === '' && !activeBrand ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground/60 hover:text-foreground hover:bg-card/80'}`}>
            TUTTO
          </button>
          {categories.map((cat) => (
            <button key={cat.slug} onClick={() => { setActiveFilter(cat.slug); setActiveBrand(null); }} className={`font-body text-xs tracking-wider uppercase px-5 py-2.5 rounded-full transition-all ${activeFilter === cat.slug ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground/60 hover:text-foreground hover:bg-card/80'}`}>
              {cat.name}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-foreground/60">Nessun prodotto trovato.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product, index) => (
              <motion.div key={product._id || product.name + index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group">
                <Link href={`/prodotti/${product._id}`} className="block">
                  <div className="shadow-lg">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-card mb-4">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-sm">Nessuna immagine</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-primary/80 text-primary-foreground font-body text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full">
                        {getCategoryName(product.category)}
                      </span>

                      <button
                        onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-foreground hover:text-white text-foreground"
                        aria-label="Aggiungi al carrello"
                      >
                        {addedId === product._id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <h3 className="font-heading text-base md:text-lg font-medium text-foreground mb-1">{product.name}</h3>
                  <p className="font-body text-sm text-foreground/60">{formatPrice(product.price)}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
