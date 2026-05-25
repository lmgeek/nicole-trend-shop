'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images?: string[];
  brand?: string;
  sizes?: string[];
  colors?: string[];
  isFeatured?: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/public/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const formatPrice = (price: number) =>
    `\u20ac ${price.toFixed(2).replace('.', ',')}`;

  const handleAdd = () => {
    if (!product) return;
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="pt-28 pb-24 flex justify-center">
        <p className="text-lg">Caricamento...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-24 text-center">
        <p className="text-lg text-foreground/60">Prodotto non trovato.</p>
        <Link href="/collezione" className="text-sm text-foreground/80 hover:text-foreground underline mt-4 inline-block">
          Torna alla collezione
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [''];

  return (
    <div className="pb-24 md:pb-32 pt-8 md:pt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Link
          href="/collezione"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground text-sm transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Torna alla Collezione
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-card mb-4">
              {images[0] ? (
                <img src={images[currentImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-sm">Nessuna immagine</span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === currentImage ? 'border-primary' : 'border-transparent hover:border-foreground/20'
                    }`}
                  >
                    {img ? (
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {product.brand && (
              <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-2">
                {product.brand}
              </p>
            )}
            <h1 className="font-heading text-3xl md:text-5xl font-semibold text-foreground leading-tight mb-4">
              {product.name}
            </h1>
            <p className="font-heading text-2xl md:text-3xl text-foreground mb-6">
              {formatPrice(product.price)}
            </p>

            <p className="font-body text-base text-foreground/70 leading-relaxed mb-8">
              {product.description}
            </p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-body text-sm font-semibold text-foreground mb-3">Taglie</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-full text-sm font-body transition-all ${
                        selectedSize === size
                          ? 'bg-foreground text-background'
                          : 'bg-card text-foreground/70 border border-foreground/10 hover:border-foreground/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-body text-sm font-semibold text-foreground mb-3">Colori</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 rounded-full text-sm font-body transition-all ${
                        selectedColor === color
                          ? 'bg-foreground text-background'
                          : 'bg-card text-foreground/70 border border-foreground/10 hover:border-foreground/30'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <p className="font-body text-sm text-foreground/60">
                {product.stock > 0
                  ? `Disponibile (${product.stock} unità)`
                  : 'Non disponibile'}
              </p>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="w-full bg-primary text-primary-foreground font-body text-sm font-semibold px-8 py-4 rounded-full tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {added ? (
                <><Check className="w-5 h-5" /> Aggiunto al Carrello</>
              ) : (
                <><ShoppingCart className="w-5 h-5" /> Aggiungi al Carrello</>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
