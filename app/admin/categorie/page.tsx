'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  enabled: boolean;
  image?: string;
}

export default function CategoriePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa categoria?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const toggleEnabled = async (category: Category) => {
    setToggling(category._id);
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !category.enabled }),
      });
      if (!res.ok) throw new Error('Errore');
      setCategories((prev) =>
        prev.map((c) => (c._id === category._id ? { ...c, enabled: !c.enabled } : c))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(null);
    }
  };

  const filtered = categories.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Caricamento categorie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categorie</h1>
          <p className="text-gray-500 mt-1">{categories.length} categorie totali</p>
        </div>
        <Link href="/admin/categorie/nuovo" className="inline-flex items-center gap-2 bg-foreground text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
          <Plus className="w-4 h-4" />
          Nuova Categoria
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Cerca categorie..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat) => (
          <div key={cat._id} className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow ${!cat.enabled ? 'border-gray-200 opacity-60' : 'border-gray-100'}`}>
            <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-xs">Nessuna immagine</span>
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <button onClick={() => toggleEnabled(cat)} disabled={toggling === cat._id}>
                  {cat.enabled ? (
                    <ToggleRight className="w-7 h-7 text-green-500 drop-shadow-sm" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-gray-300 drop-shadow-sm" />
                  )}
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{cat.name}</h3>
              <p className="text-xs text-gray-500 font-mono mt-1">{cat.slug}</p>
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-50">
                <Link href={`/admin/categorie/${cat._id}/modifica`} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(cat._id)} disabled={deleting === cat._id} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">Nessuna categoria trovata.</div>
        )}
      </div>
    </div>
  );
}
