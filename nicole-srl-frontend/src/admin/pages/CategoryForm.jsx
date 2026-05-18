import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryService } from '@/admin/services/categoryService';
import { ArrowLeft, Upload, X } from 'lucide-react';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: '', slug: '', image: '', enabled: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      categoryService.getById(id).then(data => { if (data) setCategory(data); else setError('Categoria non trovata'); }).catch(err => setError(err.message));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setCategory(prev => ({ ...prev, name, slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCategory(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setCategory(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!category.name || !category.slug) { setError('Compila tutti i campi'); return; }
    try {
      setLoading(true);
      if (isEditMode) { await categoryService.update(id, category); setSuccess('Categoria aggiornata'); }
      else { await categoryService.create(category); setSuccess('Categoria creata'); setCategory({ name: '', slug: '', image: '', enabled: true }); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (loading && isEditMode) return <div className="admin-loading"><div className="admin-loading-spinner" /></div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/categorie')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="admin-page-title">{isEditMode ? 'Modifica Categoria' : 'Nuova Categoria'}</h1>
          <p className="admin-page-subtitle">{isEditMode ? 'Aggiorna le informazioni della categoria' : 'Crea una nuova categoria per il catalogo'}</p>
        </div>
      </div>

      {error && <div className="admin-error mb-6">{error}</div>}
      {success && <div className="admin-success mb-6">{success}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="name">Nome categoria</label>
            <input id="name" name="name" type="text" value={category.name} onChange={handleNameChange} required className="admin-input" placeholder="es. VESTITI" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="slug">Slug</label>
            <input id="slug" name="slug" type="text" value={category.slug} onChange={handleChange} required className="admin-input" placeholder="es. vestiti" />
            <p className="text-xs text-gray-400 mt-1">Generato automaticamente dal nome</p>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Immagine</label>
            {category.image ? (
              <div className="relative group w-40 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                <img src={category.image} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="cat-image-upload" />
                <label htmlFor="cat-image-upload" className="cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Clicca per caricare un'immagine</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG</p>
                </label>
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <div className="relative">
              <input id="enabled" type="checkbox" name="enabled" checked={category.enabled} onChange={handleChange} className="sr-only peer" />
              <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-foreground transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Categoria attiva</span>
              <p className="text-xs text-gray-400">Visibile nella collezione pubblica</p>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button type="submit" disabled={loading} className="admin-btn-primary">
            {loading ? 'Salvataggio...' : isEditMode ? 'Aggiorna' : 'Crea Categoria'}
          </button>
          <button type="button" onClick={() => navigate('/admin/categorie')} className="admin-btn-secondary">Annulla</button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
