'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

interface Product {
  _id: string;
  name: string;
}

export default function NuovoHeroPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    type: 'custom' as 'product' | 'custom',
    productId: '',
    image: '',
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    enabled: true,
    order: 0,
  });

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: any = {
        type: formData.type,
        image: formData.image,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        enabled: formData.enabled,
        order: formData.order,
      };
      if (formData.type === 'product' && formData.productId) {
        body.product = formData.productId;
      }

      const res = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore nel salvataggio');
      }

      router.push('/admin/hero');
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
          <h1 className="text-2xl font-semibold text-gray-900">Nuova Hero Slide</h1>
          <p className="text-gray-500 text-sm mt-1">Aggiungi una nuova slide alla homepage</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setFormData({ ...formData, type: 'custom' })} className={`p-4 rounded-lg border-2 text-left transition-all ${formData.type === 'custom' ? 'border-foreground bg-foreground/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <span className="text-sm font-medium text-gray-900">Custom</span>
                <span className="block text-xs text-gray-500 mt-1">Immagine e testo personalizzati</span>
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, type: 'product' })} className={`p-4 rounded-lg border-2 text-left transition-all ${formData.type === 'product' ? 'border-foreground bg-foreground/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <span className="text-sm font-medium text-gray-900">Prodotto</span>
                <span className="block text-xs text-gray-500 mt-1">Usa immagine e dati del prodotto</span>
              </button>
            </div>
          </div>

          {formData.type === 'product' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prodotto</label>
              <select value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40">
                <option value="">Seleziona un prodotto</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {formData.type === 'custom' && (
            <ImageUploader
              value={formData.image}
              onChange={(base64) => setFormData({ ...formData, image: base64 })}
              aspectRatio="aspect-[16/9]"
              label="Immagine"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Nuova Collezione" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sottotitolo</label>
              <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Primavera Estate 2026" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Scopri i nuovi arrivi..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Testo Bottone</label>
              <input type="text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} placeholder="Scopri Ora" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Bottone</label>
              <input type="text" value={formData.buttonLink} onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })} placeholder="/collezione" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordine</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.enabled} onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })} className="w-4 h-4 rounded text-foreground" />
                <span className="text-sm text-gray-700">Attiva</span>
              </label>
            </div>
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
