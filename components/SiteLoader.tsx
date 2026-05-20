'use client';

import { useEffect, useState } from 'react';

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleLoad = () => {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = '';
        }, 600);
      }, 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
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
