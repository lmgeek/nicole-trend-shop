'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Instagram, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useAppLoading } from '@/lib/app-loading-context';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Collezione', href: '/collezione' },
  { label: 'Chi Siamo', href: '/chi-siamo' },
  { label: 'Contatti', href: '/contatti' },
];

interface SocialConfig {
  enabled: boolean;
  url: string;
}

interface SiteConfig {
  showLogo: boolean;
  showTagline: boolean;
  menuPosition: 'left' | 'right';
  social: Record<string, SocialConfig>;
}

export default function Navbar() {
  const { registerLoading } = useAppLoading();
  const [isOpen, setIsOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const [config, setConfig] = useState<SiteConfig>({
    showLogo: true,
    showTagline: true,
    menuPosition: 'right',
    social: {
      instagram: { enabled: true, url: 'https://www.instagram.com/nicoletrend.shop/' },
      x: { enabled: false, url: '' },
      facebook: { enabled: false, url: '' },
      youtube: { enabled: false, url: '' },
      tiktok: { enabled: false, url: '' },
    },
  });

  useEffect(() => {
    const markNavDone = registerLoading('navbar');
    fetch('/api/public/site-config')
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setConfig((prev) => ({
            ...prev,
            showLogo: data.showLogo ?? true,
            showTagline: data.showTagline ?? true,
            menuPosition: data.menuPosition ?? 'right',
            social: {
              instagram: data.social?.instagram ?? prev.social.instagram,
              x: data.social?.x ?? prev.social.x,
              facebook: data.social?.facebook ?? prev.social.facebook,
              youtube: data.social?.youtube ?? prev.social.youtube,
              tiktok: data.social?.tiktok ?? prev.social.tiktok,
            },
          }));
        }
      })
      .catch(() => {})
      .finally(() => markNavDone());
  }, [registerLoading]);

  const enabledSocials = Object.entries(config.social).filter(([, v]) => v.enabled && v.url);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md shadow-sm shadow-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {config.menuPosition === 'left' && (
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
            </div>
          )}

          <div className={`flex flex-col items-start gap-0 ${config.menuPosition === 'left' ? '' : 'order-first'}`}>
            {config.showLogo && (
              <Link href="/" className="flex items-center">
                <img src="/images/nicole.png" alt="Nicole Trend Shop" className="h-16 w-auto" />
              </Link>
            )}
            {config.showTagline && (
              <p className="font-heading text-xs italic opacity-60 tracking-widest uppercase -mt-1">
                Abbigliamento e Accessori
              </p>
            )}
          </div>

          {config.menuPosition === 'right' && (
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
            </div>
          )}

          <div className="hidden md:flex items-center gap-4">
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

            {enabledSocials.map(([key, social]) => (
              <a
                key={key}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
                aria-label={key}
              >
                {key === 'instagram' && <Instagram className="w-5 h-5" />}
                {key === 'x' && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {key === 'facebook' && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                {key === 'youtube' && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                )}
                {key === 'tiktok' && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                )}
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden text-foreground p-2 ${config.menuPosition === 'left' ? 'order-first' : 'order-last'}`}
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
              {enabledSocials.map(([key, social]) => (
                <a
                  key={key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="font-body text-sm">@{key}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
