'use client';

import { useEffect } from 'react';
import { useAppLoading } from '@/lib/app-loading-context';

export default function SiteLoader() {
  const { pageReady } = useAppLoading();

  useEffect(() => {
    if (pageReady) {
      document.body.style.overflow = '';
      const loader = document.getElementById('site-loader');
      if (loader) {
        loader.classList.add('opacity-0');
        setTimeout(() => { loader.remove(); }, 600);
      }
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [pageReady]);

  return (
    <div
      id="site-loader"
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-500"
    >
      <div className="flex flex-col items-center">
        <img
          src="/images/nicole.png"
          alt="Nicole Trend Shop"
          className="h-24 w-auto mb-4"
        />
        <p className="font-heading text-sm italic text-foreground/60 tracking-[0.25em] uppercase">
          Abbigliamento e Accessori
        </p>
      </div>
    </div>
  );
}
