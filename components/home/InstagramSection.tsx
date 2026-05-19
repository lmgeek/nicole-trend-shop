'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const INSTAGRAM_USERNAME = 'nicoletrend.shop';

interface MockPost {
  id: string;
  permalink: string;
  media_url: string;
  caption: string;
}

export default function InstagramSection() {
  const [posts, setPosts] = useState<MockPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockPosts: MockPost[] = [
      { id: '1', permalink: 'https://www.instagram.com/p/abc123/', media_url: '/images/products/dress-2.jpg', caption: 'Nuova collezione estate 2026 ✨ #fashion #style' },
      { id: '2', permalink: 'https://www.instagram.com/p/def456/', media_url: '/images/products/blouse-2.jpg', caption: 'Eleganza senza tempo 👗 #nicoletrend' },
      { id: '3', permalink: 'https://www.instagram.com/p/ghi789/', media_url: '/images/products/jacket-1.jpg', caption: 'Giacche che fanno la differenza 🧥' },
      { id: '4', permalink: 'https://www.instagram.com/p/jkl012/', media_url: '/images/products/bag-2.jpg', caption: 'Accessori must-have 👜 #luxury' },
      { id: '5', permalink: 'https://www.instagram.com/p/mno345/', media_url: '/images/products/pants-1.jpg', caption: 'Look perfetto per ogni occasione 👖' },
      { id: '6', permalink: 'https://www.instagram.com/p/pqr678/', media_url: '/images/products/dress-1.jpg', caption: 'Vestiti che ti fanno sentire speciale ✨' },
    ];
    setPosts(mockPosts);
    setLoading(false);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-3">Seguici su Instagram</p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4">@{INSTAGRAM_USERNAME}</h2>
          <p className="font-body text-sm text-foreground/60 max-w-md mx-auto">Unisciti alla nostra community e scopri le ultime tendenze in anteprima</p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {posts.map((post, index) => (
            <motion.a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group relative aspect-square rounded-xl overflow-hidden">
              <img src={post.media_url} alt={post.caption?.slice(0, 50) || 'Instagram post'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
          <a href={`https://www.instagram.com/${INSTAGRAM_USERNAME}/`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-body text-sm font-semibold tracking-wide uppercase hover:opacity-90 transition-opacity">
            <Instagram className="w-4 h-4" />
            Seguici
          </a>
        </motion.div>
      </div>
    </section>
  );
}
