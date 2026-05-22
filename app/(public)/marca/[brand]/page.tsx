'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand?: string;
  images?: string[];
}

export default function BrandPage() {
  const params = useParams();
  const brand = decodeURIComponent(params.brand as string);
  const { addItem } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/public/products/by-brand?brand=${encodeURIComponent(brand)}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [brand]);

  const formatPrice = (price: number) => `\u20ac ${price.toFixed(2).replace('.', ',')}`;

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

  return (
    <div className="pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Link
          href="/collezione"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla Collezione
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-3">Collezione per Marca</p>
          <h1 className="font-heading text-4xl md:text-6xl font-semibold text-foreground leading-tight">
            <span className="italic font-light">{brand}</span>
          </h1>
          <p className="text-foreground/60 mt-3 text-sm">
            {loading ? 'Caricamento...' : `${products.length} ${products.length === 1 ? 'prodotto' : 'prodotti'} disponibili`}
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-foreground/60">Caricamento...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-foreground/60">Nessun prodotto trovato per questa marca.</p>
            <Link href="/collezione" className="inline-block mt-4 text-sm text-foreground/80 hover:text-foreground underline underline-offset-4">
              Esplora tutta la collezione
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
              >
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
                      {product.category}
                    </span>

                    <button
                      onClick={() => handleAddToCart(product)}
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
