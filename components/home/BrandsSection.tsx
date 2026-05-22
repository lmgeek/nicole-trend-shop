'use client';

import Link from 'next/link';

const brands = [
  { name: 'Brend', src: '/images/marcas-transparent/brend.png' },
  { name: 'Dejavu', src: '/images/marcas-transparent/dejavu.png' },
  { name: 'Kikisix', src: '/images/marcas-transparent/kikisix.png' },
  { name: 'Lumina', src: '/images/marcas-transparent/lumina.png' },
  { name: 'Philialoft', src: '/images/marcas-transparent/philialoft.webp' },
  { name: 'Susystar', src: '/images/marcas-transparent/susystar.png' },
  { name: 'Vicbee', src: '/images/marcas-transparent/vicbee.png' },
];

export default function BrandsSection() {
  const desktopRow1 = brands.slice(0, 3);
  const desktopRow2 = brands.slice(3, 6);
  const desktopRow3 = brands.slice(6);

  const mobileRow1 = brands.slice(0, 2);
  const mobileRow2 = brands.slice(2, 4);
  const mobileRow3 = brands.slice(4, 6);
  const mobileRow4 = brands.slice(6);

  return (
    <section
      className="relative w-full pt-16 pb-10 md:pt-56 md:pb-20 bg-cover bg-no-repeat bg-[position:50%_-4rem] md:bg-[position:50%_-6rem]"
      style={{ backgroundImage: "url('/images/nicole_back.png')" }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-48 md:pt-48">
        {/* Mobile: 2-2-2-1 */}
        <div className="flex flex-col items-center gap-0 md:hidden">
          <div className="grid grid-cols-2 gap-8 justify-items-center">
            {mobileRow1.map((brand) => (
              <Link
                key={brand.name}
                href={`/marca/${encodeURIComponent(brand.name)}`}
                className="flex items-center justify-center group w-36 h-28"
              >
                <img
                  src={brand.src}
                  alt={brand.name}
                  className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 justify-items-center">
            {mobileRow2.map((brand) => (
              <Link
                key={brand.name}
                href={`/marca/${encodeURIComponent(brand.name)}`}
                className="flex items-center justify-center group w-36 h-28"
              >
                <img
                  src={brand.src}
                  alt={brand.name}
                  className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 justify-items-center">
            {mobileRow3.map((brand) => (
              <Link
                key={brand.name}
                href={`/marca/${encodeURIComponent(brand.name)}`}
                className="flex items-center justify-center group w-36 h-28"
              >
                <img
                  src={brand.src}
                  alt={brand.name}
                  className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
            ))}
          </div>

          {mobileRow4.length > 0 && (
            <div className="flex justify-center w-full">
              {mobileRow4.map((brand) => (
                <Link
                  key={brand.name}
                  href={`/marca/${encodeURIComponent(brand.name)}`}
                  className="flex items-center justify-center group w-36 h-28"
                >
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: 3-3-1 */}
        <div className="hidden md:flex md:flex-col md:items-center md:gap-0">
          <div className="grid grid-cols-3 gap-20">
            {desktopRow1.map((brand) => (
              <Link
                key={brand.name}
                href={`/marca/${encodeURIComponent(brand.name)}`}
                className="flex items-center justify-center group w-44 h-36"
              >
                <img
                  src={brand.src}
                  alt={brand.name}
                  className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-20">
            {desktopRow2.map((brand) => (
              <Link
                key={brand.name}
                href={`/marca/${encodeURIComponent(brand.name)}`}
                className="flex items-center justify-center group w-44 h-36"
              >
                <img
                  src={brand.src}
                  alt={brand.name}
                  className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
            ))}
          </div>

          {desktopRow3.length > 0 && (
            <div className="grid grid-cols-3 gap-20">
              {desktopRow3.map((brand) => (
                <Link
                  key={brand.name}
                  href={`/marca/${encodeURIComponent(brand.name)}`}
                  className="flex items-center justify-center group w-44 h-36 col-start-2"
                >
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
