import React, { useState, useEffect } from 'react';
import { categoryService } from '@/admin/services/categoryService';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Tag, AlertCircle, Image as ImageIcon } from 'lucide-react';
import StatCard from '@/admin/components/StatCard';
import EmptyState from '@/admin/components/EmptyState';
import HoverImagePreview from '@/admin/components/HoverImagePreview';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questa categoria?')) return;
    try { await categoryService.delete(id); setCategories(categories.filter(c => c._id !== id)); }
    catch (err) { setError(err.message); }
  };

  const handleToggleEnabled = async (id, current) => {
    try {
      const updated = await categoryService.toggleEnabled(id, !current);
      setCategories(categories.map(c => c._id === id ? updated : c));
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading-spinner" /></div>;
  if (error) return <div className="admin-error"><AlertCircle className="w-4 h-4" />{error}</div>;

  const enabledCount = categories.filter(c => c.enabled).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="admin-page-title">Categorie</h1>
          <p className="admin-page-subtitle">Gestisci le categorie del catalogo</p>
        </div>
        <Link to="/admin/categorie/nuovo" className="admin-btn-primary">
          <Plus className="w-4 h-4" />
          Nuova Categoria
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard icon="tag" label="Totale Categorie" value={categories.length} />
        <StatCard icon="tag" label="Categorie Attive" value={enabledCount} />
      </div>

      {categories.length === 0 ? (
        <div className="admin-table-wrapper">
          <EmptyState icon={Tag} title="Nessuna categoria" description="Crea la tua prima categoria per organizzare il catalogo." action={<Link to="/admin/categorie/nuovo" className="admin-btn-primary"><Plus className="w-4 h-4" />Aggiungi Categoria</Link>} />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Immagine</th>
                <th>Nome</th>
                <th>Slug</th>
                <th>Stato</th>
                <th className="text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id}>
                  <td>
                    {cat.image ? (
                      <HoverImagePreview src={cat.image} alt={cat.name} />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td>
                    <code className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-500">{cat.slug}</code>
                  </td>
                  <td>
                    <button onClick={() => handleToggleEnabled(cat._id, cat.enabled)} className={`admin-badge ${cat.enabled ? 'admin-badge-success' : 'admin-badge-danger'} cursor-pointer hover:opacity-80 transition-opacity`}>
                      {cat.enabled ? 'Attiva' : 'Disattivata'}
                    </button>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/categorie/${cat._id}/modifica`} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(cat._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
