'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Package, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  images?: string[];
  isFeatured: boolean;
  enabled: boolean;
}

export default function ProdottiPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo prodotto?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const toggleEnabled = async (product: Product) => {
    setToggling(product._id);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !product.enabled }),
      });
      if (!res.ok) throw new Error('Errore');
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, enabled: !p.enabled } : p))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(null);
    }
  };

  const formatPrice = (price: number) => `\u20ac ${price.toFixed(2).replace('.', ',')}`;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Caricamento prodotti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Prodotti</h1>
          <p className="text-gray-500 mt-1">{products.length} prodotti totali</p>
        </div>
        <Link href="/admin/prodotti/nuovo" className="inline-flex items-center gap-2 bg-foreground text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
          <Plus className="w-4 h-4" />
          Nuovo Prodotto
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Cerca prodotti..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <div key={product._id} className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow ${!product.enabled ? 'border-gray-200 opacity-60' : 'border-gray-100'}`}>
            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
              )}
              {product.isFeatured && (
                <span className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                  Featured
                </span>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                Stock: {product.stock}
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
                <button
                  onClick={() => toggleEnabled(product)}
                  disabled={toggling === product._id}
                  className="flex-shrink-0"
                >
                  {product.enabled ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-300" />
                  )}
                </button>
              </div>
              {product.brand && <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/prodotti/${product._id}/modifica`} className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                  <button onClick={() => handleDelete(product._id)} disabled={deleting === product._id} className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">Nessun prodotto trovato.</div>
        )}
      </div>
    </div>
  );
}
