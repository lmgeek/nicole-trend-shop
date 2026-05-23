'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAppLoading } from '@/lib/app-loading-context';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
}

interface HeroSlide {
  _id: string;
  type: 'product' | 'custom';
  product?: Product;
  image?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  enabled: boolean;
  order: number;
}

export default function HeroSection() {
  const { registerLoading } = useAppLoading();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const markHeroDone = registerLoading('hero');
    fetch('/api/public/hero-slides')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setSlides(data);
        }
      })
      .catch((err) => console.error('Errore caricamento hero slides:', err))
      .finally(() => {
        setLoading(false);
        markHeroDone();
      });
  }, [registerLoading]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  if (loading || slides.length === 0) return null;

  const slide = slides[currentIndex];

  const getImageUrl = () => {
    if (slide.type === 'product' && slide.product?.images?.[0]) {
      return slide.product.images[0];
    }
    return slide.image || '';
  };

  const getTitle = () => {
    if (slide.type === 'product') return slide.product?.name || '';
    return slide.title || '';
  };

  const getDescription = () => {
    if (slide.type === 'product') return slide.product?.description || '';
    return slide.description || '';
  };

  const getPrice = () => {
    if (slide.type === 'product' && slide.product?.price) {
      return `\u20ac${slide.product.price.toFixed(2)}`;
    }
    return null;
  };

  const getButtonText = () => {
    if (slide.type === 'product') return 'Acquista Ora';
    return slide.buttonText || 'Scopri di più';
  };

  const getButtonLink = () => {
    if (slide.type === 'product') return '/collezione';
    return slide.buttonLink || '/collezione';
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getImageUrl()})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all" aria-label="Previous slide">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all" aria-label="Next slide">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="max-w-md rounded-3xl bg-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8"
          >
            {slide.subtitle && (
              <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-body text-xs tracking-[0.3em] uppercase text-foreground/70 mb-4">
                {slide.subtitle}
              </motion.p>
            )}
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-heading text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-4">
              {getTitle()}
            </motion.h2>
            {getDescription() && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-body text-base text-foreground/80 leading-relaxed mb-6 line-clamp-3">
                {getDescription()}
              </motion.p>
            )}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center justify-between">
              {getPrice() && (
                <span className="font-heading text-2xl font-semibold text-foreground">{getPrice()}</span>
              )}
              <Link href={getButtonLink()} className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-body text-sm font-semibold tracking-wide uppercase hover:opacity-90 transition-all">
                {slide.type === 'product' ? <ShoppingBag className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                {getButtonText()}
              </Link>
            </motion.div>
            {slides.length > 1 && (
              <div className="flex gap-2 mt-6 justify-center">
                {slides.map((_, index) => (
                  <button key={index} onClick={() => setCurrentIndex(index)} className={`h-2 rounded-full transition-all ${index === currentIndex ? 'bg-foreground w-6' : 'bg-foreground/30 w-2'}`} aria-label={`Go to slide ${index + 1}`} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/60">Scorri</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-8 bg-white/40" />
      </motion.div>
    </section>
  );
}
