'use client';

import { useState } from 'react';
import { Menu, X, Instagram, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Collezione', href: '/collezione' },
  { label: 'Chi Siamo', href: '/chi-siamo' },
  { label: 'Contatti', href: '/contatti' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div>
            <Link href="/" className="flex items-center">
              <img src="/images/nicole.png" alt="Nicole Trend Shop" className="h-16 w-auto" />
            </Link>
            <p className="font-heading text-xs italic opacity-60 tracking-widest uppercase">
              Abbigliamento e Accessori
            </p>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-sm font-medium text-foreground/80 hover:text-foreground tracking-wide uppercase transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            <div className="relative group">
              <Link
                href="/carrello"
                className="text-foreground/70 hover:text-foreground transition-colors relative"
                aria-label="Carrello"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-foreground text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-foreground text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {itemCount === 0 ? 'Vuoto' : 'Vedi carrello'}
              </div>
            </div>

            <a
              href="https://www.instagram.com/nicoletrend.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-t border-foreground/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-heading text-2xl text-foreground hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/carrello"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 font-heading text-2xl text-foreground hover:opacity-70 transition-opacity"
              >
                <ShoppingCart className="w-6 h-6" />
                Carrello {itemCount > 0 && `(${itemCount})`}
              </Link>
              <a
                href="https://www.instagram.com/nicoletrend.shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-body text-sm">@nicoletrend.shop</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
