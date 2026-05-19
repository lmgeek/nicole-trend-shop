'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Category {
  name: string;
  slug: string;
  image: string;
  enabled: boolean;
}

const defaultCategories = [
  { name: 'Vestiti', image: '/images/products/dress-1.jpg' },
  { name: 'Bluse', image: '/images/products/blouse-1.jpg' },
  { name: 'Gonne', image: '/images/products/skirt-1.jpg' },
  { name: 'Giacche', image: '/images/products/jacket-1.jpg' },
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    fetch('/api/categories/enabled')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data.filter((c: Category) => c.slug !== 'tutto' && c.image);
          if (filtered.length > 0) {
            setCategories(filtered.map((c: Category) => ({ name: c.name, image: c.image })));
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-3">Categorie</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            Esplora il<br /><span className="italic font-light">Nostro Mondo</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <Link href="/collezione" className="group block relative overflow-hidden rounded-2xl aspect-[3/4] bg-card">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="font-heading text-xl md:text-2xl font-semibold text-primary-foreground">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
