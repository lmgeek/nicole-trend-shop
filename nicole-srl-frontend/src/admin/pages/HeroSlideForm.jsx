import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { heroSlideService } from '@/admin/services/heroSlideService';
import { productService } from '@/admin/services/productService';
import { ArrowLeft, Upload, X } from 'lucide-react';

const HeroSlideForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slide, setSlide] = useState({
    type: 'custom',
    product: '',
    image: '',
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    enabled: true,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isEditMode = !!id;

  useEffect(() => {
    productService.getAll().then(setProducts).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEditMode) {
      heroSlideService.getById(id).then(data => {
        if (data) {
          setSlide({
            type: data.type,
            product: data.product?._id || data.product || '',
            image: data.image || '',
            title: data.title || '',
            subtitle: data.subtitle || '',
            description: data.description || '',
            buttonText: data.buttonText || '',
            buttonLink: data.buttonLink || '',
            enabled: data.enabled,
          });
        } else {
          setError('Slide non trovata');
        }
      }).catch(err => setError(err.message));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSlide(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSlide(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSlide(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);

    if (slide.type === 'product' && !slide.product) {
      setError('Seleziona un prodotto'); return;
    }
    if (slide.type === 'custom' && !slide.image) {
      setError('Carica un\'immagine'); return;
    }

    try {
      setLoading(true);
      const data = { ...slide };
      if (isEditMode) {
        await heroSlideService.update(id, data);
        setSuccess('Slide aggiornata');
      } else {
        await heroSlideService.create(data);
        setSuccess('Slide creata');
        setSlide({ type: 'custom', product: '', image: '', title: '', subtitle: '', description: '', buttonText: '', buttonLink: '', enabled: true });
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (loading && isEditMode) return <div className="admin-loading"><div className="admin-loading-spinner" /></div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/hero')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="admin-page-title">{isEditMode ? 'Modifica Slide' : 'Nuova Slide'}</h1>
          <p className="admin-page-subtitle">{isEditMode ? 'Aggiorna la slide hero' : 'Crea una nuova slide per il hero section'}</p>
        </div>
      </div>

      {error && <div className="admin-error mb-6">{error}</div>}
      {success && <div className="admin-success mb-6">{success}</div>}

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="admin-form-group">
            <label className="admin-label">Tipo di slide</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${slide.type === 'product' ? 'border-foreground bg-foreground/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="type" value="product" checked={slide.type === 'product'} onChange={handleChange} className="sr-only" />
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: slide.type === 'product' ? 'hsl(var(--foreground))' : '#d1d5db' }}>
                  {slide.type === 'product' && <div className="w-2 h-2 rounded-full bg-foreground" />}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Prodotto</span>
                  <p className="text-xs text-gray-400">Usa immagine e dati di un prodotto</p>
                </div>
              </label>
              <label className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${slide.type === 'custom' ? 'border-foreground bg-foreground/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="type" value="custom" checked={slide.type === 'custom'} onChange={handleChange} className="sr-only" />
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: slide.type === 'custom' ? 'hsl(var(--foreground))' : '#d1d5db' }}>
                  {slide.type === 'custom' && <div className="w-2 h-2 rounded-full bg-foreground" />}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Custom</span>
                  <p className="text-xs text-gray-400">Immagine, testo e link personalizzati</p>
                </div>
              </label>
            </div>
          </div>

          {slide.type === 'product' ? (
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="product">Seleziona prodotto</label>
              <select id="product" name="product" value={slide.product} onChange={handleChange} className="admin-input">
                <option value="">Scegli un prodotto...</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              {slide.product && products.find(p => p._id === slide.product)?.images?.[0] && (
                <div className="mt-3 w-32 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                  <img src={products.find(p => p._id === slide.product).images[0]} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="admin-form-group">
                <label className="admin-label">Immagine</label>
                {slide.image ? (
                  <div className="relative group w-40 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                    <img src={slide.image} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="hero-image-upload" />
                    <label htmlFor="hero-image-upload" className="cursor-pointer">
                      <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Clicca per caricare un'immagine</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG</p>
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="title">Titolo</label>
                  <input id="title" name="title" type="text" value={slide.title} onChange={handleChange} className="admin-input" placeholder="es. Nuova Collezione" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="subtitle">Sottotitolo</label>
                  <input id="subtitle" name="subtitle" type="text" value={slide.subtitle} onChange={handleChange} className="admin-input" placeholder="es. Primavera/Estate 2026" />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="description">Descrizione</label>
                <textarea id="description" name="description" value={slide.description} onChange={handleChange} rows={3} className="admin-input resize-none" placeholder="Testo descrittivo della slide..." />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="buttonText">Testo bottone</label>
                  <input id="buttonText" name="buttonText" type="text" value={slide.buttonText} onChange={handleChange} className="admin-input" placeholder="es. Scopri ora" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="buttonLink">Link bottone</label>
                  <input id="buttonLink" name="buttonLink" type="text" value={slide.buttonLink} onChange={handleChange} className="admin-input" placeholder="es. /collezione" />
                </div>
              </div>
            </>
          )}

          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <div className="relative">
              <input id="enabled" type="checkbox" name="enabled" checked={slide.enabled} onChange={handleChange} className="sr-only peer" />
              <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-foreground transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Slide attiva</span>
              <p className="text-xs text-gray-400">Visibile nel hero section</p>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button type="submit" disabled={loading} className="admin-btn-primary">
            {loading ? 'Salvataggio...' : isEditMode ? 'Aggiorna' : 'Crea Slide'}
          </button>
          <button type="button" onClick={() => navigate('/admin/hero')} className="admin-btn-secondary">Annulla</button>
        </div>
      </form>
    </div>
  );
};

export default HeroSlideForm;
