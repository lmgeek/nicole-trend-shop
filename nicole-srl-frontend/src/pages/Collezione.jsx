import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import api from '@/services/api';

export default function Collezione() {
  const [activeFilter, setActiveFilter] = useState("TUTTO");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsData, productsData] = await Promise.all([
          api.publicProducts.getAll().then(() => api.categories.getEnabled()),
          api.publicProducts.getAll()
        ]);
        setCategories(catsData);
        setProducts(productsData);
      } catch (err) {
        console.error('Errore nel caricamento dei dati:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryOptions = ["TUTTO", ...categories.map(c => c.name)];

  const filtered = activeFilter === "TUTTO"
    ? products
    : products.filter((p) => p.category === activeFilter.toLowerCase());

  const formatPrice = (price) => {
    return `€ ${price.toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-28 pb-24 flex justify-center">
          <p className="text-lg">Caricamento...</p>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-28 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-3">
              Abbigliamento e Accessori
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-semibold text-foreground leading-tight">
              La Nostra<br /><span className="italic font-light">Collezione</span>
            </h1>
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-12">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`font-body text-xs tracking-wider uppercase px-5 py-2.5 rounded-full transition-all ${
                  activeFilter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground/60 hover:text-foreground hover:bg-card/80"
                }`}
              >
                {cat}
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
                <motion.div
                  key={product._id || product.name + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <div className="shadow-lg">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-card mb-4">
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
                      <span className="absolute top-3 left-3 bg-primary/80 text-primary-foreground font-body text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full">
                        {getCategoryName(product.category, categories)}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-heading text-base md:text-lg font-medium text-foreground mb-1">
                    {product.name}
                  </h3>
                  <p className="font-body text-sm text-foreground/60">{formatPrice(product.price)}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function getCategoryName(slug, categories) {
  const cat = categories.find(c => c.slug === slug);
  return cat ? cat.name : slug;
}
