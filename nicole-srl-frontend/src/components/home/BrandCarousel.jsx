import React from 'react';

const brands = [
  { name: 'Brend', src: '/images/marcas/brend.png' },
  { name: 'Dejavu', src: '/images/marcas/dejavu.png' },
  { name: 'Kikisix', src: '/images/marcas/kikisix.png' },
  { name: 'Lumina', src: '/images/marcas/lumina.png' },
  { name: 'Philialoft', src: '/images/marcas/philialoft.webp' },
  { name: 'Susystar', src: '/images/marcas/susystar.png' },
];

export default function BrandCarousel() {
  return (
    <div className="bg-white py-6 overflow-hidden relative" style={{ marginTop: '80px' }}>
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .brand-scroll {
            animation: scroll 20s linear infinite;
          }
          .brand-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="overflow-hidden">
        <div className="flex brand-scroll whitespace-nowrap">
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <div key={index} className="flex-shrink-0 px-12 flex items-center justify-center">
              <img
                src={brand.src}
                alt={brand.name}
                className="h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}