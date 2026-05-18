import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from '@/services/api';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.publicProducts.getFeatured();
        setProducts(data);
      } catch (err) {
        console.error('Errore nel caricamento dei prodotti preferiti:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-24 md:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center">
            <p className="text-lg">Caricamento...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6"
        >
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-3">
              Selezione Curata
            </p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
              I Nostri<br /><span className="italic font-light">Preferiti</span>
            </h2>
          </div>
          <Link
            to="/collezione"
            className="font-body text-sm font-medium text-foreground/60 hover:text-foreground tracking-wide uppercase transition-colors underline underline-offset-4"
          >
            Vedi Tutto →
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id || product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-background mb-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">Nessuna immagine</span>
                  </div>
                )}
              </div>
              <h3 className="font-heading text-lg md:text-xl font-medium text-foreground mb-1">
                {product.name}
              </h3>
              <p className="font-body text-sm text-foreground/60">
                € {product.price.toFixed(2).replace('.', ',')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
