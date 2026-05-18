import React, { useState, useEffect } from 'react';
import { heroSlideService } from '@/admin/services/heroSlideService';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Image as ImageIcon, Eye, EyeOff, GripVertical } from 'lucide-react';
import EmptyState from '@/admin/components/EmptyState';

const HeroSlideList = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    heroSlideService.getAll().then(setSlides).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questa slide?')) return;
    try { await heroSlideService.delete(id); setSlides(slides.filter(s => s._id !== id)); }
    catch (err) { setError(err.message); }
  };

  const handleToggleEnabled = async (id, current) => {
    try {
      const updated = await heroSlideService.toggleEnabled(id, !current);
      setSlides(slides.map(s => s._id === id ? updated : s));
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading-spinner" /></div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="admin-page-title">Hero Slider</h1>
          <p className="admin-page-subtitle">Gestisci le slide della sezione hero nella home</p>
        </div>
        <Link to="/admin/hero/nuovo" className="admin-btn-primary">
          <Plus className="w-4 h-4" />
          Nuova Slide
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="admin-table-wrapper">
          <EmptyState icon={ImageIcon} title="Nessuna slide" description="Crea la prima slide per il hero section." action={<Link to="/admin/hero/nuovo" className="admin-btn-primary"><Plus className="w-4 h-4" />Aggiungi Slide</Link>} />
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div key={slide._id} className="admin-table-wrapper p-4 flex items-center gap-4">
              <div className="text-gray-300 cursor-grab">
                <GripVertical className="w-4 h-4" />
              </div>

              <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {slide.type === 'product' && slide.product?.images?.[0] ? (
                  <img src={slide.product.images[0]} alt={slide.product.name} className="w-full h-full object-cover" />
                ) : slide.image ? (
                  <img src={slide.image} alt={slide.title || 'Slide'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`admin-badge ${slide.type === 'product' ? 'admin-badge-info' : 'admin-badge-neutral'}`}>
                    {slide.type === 'product' ? 'Prodotto' : 'Custom'}
                  </span>
                  <span className="font-medium text-gray-900 truncate">
                    {slide.type === 'product' ? slide.product?.name : slide.title || 'Senza titolo'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {slide.type === 'product' ? slide.product?.description?.slice(0, 60) + '...' : slide.buttonText ? `${slide.buttonText} → ${slide.buttonLink}` : 'Nessun contenuto'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleEnabled(slide._id, slide.enabled)}
                  className={`p-1.5 rounded-lg transition-colors ${slide.enabled ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-300 hover:bg-gray-100'}`}
                  title={slide.enabled ? 'Disabilita' : 'Abilita'}
                >
                  {slide.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <Link to={`/admin/hero/${slide._id}/modifica`} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(slide._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlideList;
