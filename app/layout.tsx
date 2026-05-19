import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nicole Trend Shop - Abbigliamento e Accessori',
  description: "L'eleganza italiana per ogni occasione. Scopri la nostra selezione di abbigliamento e accessori pensati per la donna moderna.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${cormorant.variable} ${inter.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
