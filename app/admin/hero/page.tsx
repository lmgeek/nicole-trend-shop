'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Image, Loader2 } from 'lucide-react';

interface HeroSlide {
  _id: string;
  type: 'product' | 'custom';
  product?: { _id: string; name: string; images?: string[] };
  image?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  enabled: boolean;
  order: number;
}

export default function HeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchSlides(); }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/hero-slides');
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa slide?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      setSlides((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const getSlideImage = (slide: HeroSlide) => {
    if (slide.type === 'custom' && slide.image) return slide.image;
    if (slide.type === 'product' && slide.product?.images?.[0]) return slide.product.images[0];
    return null;
  };

  const sorted = [...slides].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Caricamento hero slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hero Slides</h1>
          <p className="text-gray-500 mt-1">{slides.length} slide totali</p>
        </div>
        <Link href="/admin/hero/nuovo" className="inline-flex items-center gap-2 bg-foreground text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
          <Plus className="w-4 h-4" />
          Nuova Slide
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((slide) => {
          const img = getSlideImage(slide);
          return (
            <div key={slide._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                {img ? (
                  <img src={img} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${slide.type === 'product' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                    {slide.type === 'product' ? 'Prodotto' : 'Custom'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${slide.enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {slide.enabled ? 'Attiva' : 'Disattivata'}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                  Ordine: {slide.order}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{slide.title || slide.product?.name || 'Senza titolo'}</h3>
                {slide.subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{slide.subtitle}</p>}
                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-50">
                  <Link href={`/admin/hero/${slide._id}/modifica`} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(slide._id)} disabled={deleting === slide._id} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500">
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nessuna slide hero. Creane una nuova!</p>
          </div>
        )}
      </div>
    </div>
  );
}
