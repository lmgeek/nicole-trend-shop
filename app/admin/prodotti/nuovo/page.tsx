'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X, Loader2 } from 'lucide-react';
import ImageUploader, { MultiImageUploader } from '@/components/admin/ImageUploader';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NuovoProdottoPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    isFeatured: false,
  });
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  const addImage = (base64: string) => {
    if (base64) {
      setFormData({ ...formData, images: [...formData.images, base64] });
    }
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({ ...formData, sizes: [...formData.sizes, newSize.trim()] });
      setNewSize('');
    }
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData({ ...formData, colors: [...formData.colors, newColor.trim()] });
      setNewColor('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore nel salvataggio');
      }
      router.push('/admin/prodotti');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Nuovo Prodotto</h1>
          <p className="text-gray-500 text-sm mt-1">Aggiungi un nuovo prodotto al catalogo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 resize-none" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo (€)</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40">
                <option value="">Seleziona</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <ImageUploader
            value=""
            onChange={addImage}
            aspectRatio="aspect-[4/3]"
            label="Immagine"
          />

          {formData.images.length > 0 && (
            <MultiImageUploader
              images={formData.images}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
              aspectRatio="aspect-[4/3]"
            />
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Taglie</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="S, M, L..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())} />
                <button type="button" onClick={addSize} className="px-3 py-2 rounded-lg bg-foreground text-white hover:bg-foreground/90 transition-colors text-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-md text-sm">
                    {size}
                    <button type="button" onClick={() => setFormData({ ...formData, sizes: formData.sizes.filter((_, idx) => idx !== i) })} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Colori</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Rosso, Nero..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())} />
                <button type="button" onClick={addColor} className="px-3 py-2 rounded-lg bg-foreground text-white hover:bg-foreground/90 transition-colors text-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-md text-sm">
                    {color}
                    <button type="button" onClick={() => setFormData({ ...formData, colors: formData.colors.filter((_, idx) => idx !== i) })} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded text-foreground" />
              <span className="text-sm text-gray-700">In primo piano</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Annulla
          </button>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-foreground rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {loading ? 'Salvataggio...' : 'Salva'}
          </button>
        </div>
      </form>
    </div>
  );
}
