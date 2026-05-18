import React, { useState, useEffect } from 'react';
import { productService } from '@/admin/services/productService';
import { categoryService } from '@/admin/services/categoryService';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Pencil, Star, Search, Filter, Package, AlertCircle } from 'lucide-react';
import StatCard from '@/admin/components/StatCard';
import EmptyState from '@/admin/components/EmptyState';
import HoverImagePreview from '@/admin/components/HoverImagePreview';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Errore nel caricamento dei prodotti');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      const updated = await productService.update(id, { isFeatured: !currentFeatured });
      setProducts(products.map(p => p._id === id ? updated : p));
    } catch (err) {
      setError(err.message);
    }
  };

  const getCategoryName = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? cat.name : slug;
  };

  const formatPrice = (price) => `€ ${price?.toFixed(2).replace('.', ',') || '0,00'}`;

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalProducts = products.length;
  const featuredCount = products.filter(p => p.isFeatured).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="admin-error"><AlertCircle className="w-4 h-4" />{error}</div>;
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="admin-page-title">Prodotti</h1>
          <p className="admin-page-subtitle">Gestisci il catalogo del tuo negozio</p>
        </div>
        <Link to="/admin/prodotti/nuovo" className="admin-btn-primary">
          <Plus className="w-4 h-4" />
          Nuovo Prodotto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="package" label="Totale Prodotti" value={totalProducts} />
        <StatCard icon="star" label="Preferiti" value={featuredCount} />
        <StatCard icon="trend" label="Valore Totale" value={formatPrice(totalValue)} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca prodotti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`admin-btn-secondary ${showFilters ? 'bg-gray-100' : ''}`}
        >
          <Filter className="w-4 h-4" />
          Filtri
        </button>
      </div>

      {showFilters && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-xl border border-gray-100">
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, cat.slug]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(c => c !== cat.slug));
                  }
                }}
                className="w-3.5 h-3.5 rounded border-gray-300 text-foreground focus:ring-foreground/20"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-sm text-gray-500 hover:text-gray-700 px-2"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="admin-table-wrapper">
          <EmptyState
            icon={Package}
            title={searchQuery || selectedCategories.length > 0 ? 'Nessun risultato' : 'Nessun prodotto'}
            description={searchQuery || selectedCategories.length > 0 ? 'Prova a modificare i filtri di ricerca.' : 'Inizia aggiungendo il tuo primo prodotto al catalogo.'}
            action={!searchQuery && selectedCategories.length === 0 && (
              <Link to="/admin/prodotti/nuovo" className="admin-btn-primary">
                <Plus className="w-4 h-4" />
                Aggiungi Prodotto
              </Link>
            )}
          />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Prodotto</th>
                <th>Categoria</th>
                <th>Prezzo</th>
                <th>Scorta</th>
                <th className="text-center">Preferiti</th>
                <th className="text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {product.images && product.images.length > 0 ? (
                        <HoverImagePreview src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.brand && <p className="text-xs text-gray-400">{product.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge-neutral">{getCategoryName(product.category)}</span>
                  </td>
                  <td className="font-medium">{formatPrice(product.price)}</td>
                  <td>
                    <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title={product.isFeatured ? 'Rimuovi dai Preferiti' : 'Aggiungi ai Preferiti'}
                    >
                      <Star className={`w-4 h-4 transition-colors ${product.isFeatured ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/prodotti/${product._id}/modifica`} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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

export default ProductList;
