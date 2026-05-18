import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '@/admin/services/productService';
import { categoryService } from '@/admin/services/categoryService';
import { ArrowLeft, Upload, X, Star, Image as ImageIcon } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', description: '', price: '', stock: '', category: '', images: [], isFeatured: false });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isEditMode = !!id;

  useEffect(() => {
    categoryService.getAll().then(data => setCategories(data.filter(c => c.enabled))).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEditMode) {
      productService.getById(id).then(data => { if (data) setProduct(data); else setError('Prodotto non trovato'); }).catch(err => setError(err.message));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setProduct(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!product.name || !product.price || !product.stock) { setError('Compila tutti i campi obbligatori'); return; }
    try {
      setLoading(true);
      const data = { ...product, price: parseFloat(product.price), stock: parseInt(product.stock, 10) };
      if (isEditMode) { await productService.update(id, data); setSuccess('Prodotto aggiornato'); }
      else { await productService.create(data); setSuccess('Prodotto creato'); setProduct({ name: '', description: '', price: '', stock: '', category: '', images: [], isFeatured: false }); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (loading && isEditMode) return <div className="admin-loading"><div className="admin-loading-spinner" /></div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/prodotti')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="admin-page-title">{isEditMode ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h1>
          <p className="admin-page-subtitle">{isEditMode ? 'Aggiorna le informazioni del prodotto' : 'Aggiungi un nuovo prodotto al catalogo'}</p>
        </div>
      </div>

      {error && <div className="admin-error mb-6">{error}</div>}
      {success && <div className="admin-success mb-6">{success}</div>}

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="name">Nome prodotto</label>
            <input id="name" name="name" type="text" value={product.name} onChange={handleChange} required className="admin-input" placeholder="es. Vestito Elegante Sofia" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="description">Descrizione</label>
            <textarea id="description" name="description" value={product.description} onChange={handleChange} rows={4} className="admin-input resize-none" placeholder="Descrivi il prodotto..." />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="price">Prezzo (€)</label>
              <input id="price" name="price" type="number" value={product.price} onChange={handleChange} required step="0.01" min="0" className="admin-input" placeholder="0.00" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="stock">Scorta</label>
              <input id="stock" name="stock" type="number" value={product.stock} onChange={handleChange} required min="0" className="admin-input" placeholder="0" />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="category">Categoria</label>
            <select id="category" name="category" value={product.category} onChange={handleChange} className="admin-input">
              <option value="">Seleziona categoria</option>
              {categories.map(cat => <option key={cat._id} value={cat.slug}>{cat.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-6 space-y-4">
          <label className="admin-label">Immagini</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors">
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Clicca per caricare immagini</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG fino a 10MB</p>
            </label>
          </div>
          {product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={img} alt={`Img ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input id="isFeatured" type="checkbox" name="isFeatured" checked={product.isFeatured} onChange={handleChange} className="sr-only peer" />
              <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-foreground transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Preferiti</span>
              <p className="text-xs text-gray-400">Mostra nella sezione "I Nostri Preferiti" della home</p>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button type="submit" disabled={loading} className="admin-btn-primary">
            {loading ? 'Salvataggio...' : isEditMode ? 'Aggiorna' : 'Crea Prodotto'}
          </button>
          <button type="button" onClick={() => navigate('/admin/prodotti')} className="admin-btn-secondary">
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
