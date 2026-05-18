import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import saleService from '@/admin/services/saleService';
import StatCard from '@/admin/components/StatCard';
import EmptyState from '@/admin/components/EmptyState';

const statusConfig = {
  pending: { label: 'In sospeso', class: 'admin-badge-warning' },
  processing: { label: 'In lavorazione', class: 'admin-badge-info' },
  shipped: { label: 'Spedito', class: 'admin-badge-info' },
  delivered: { label: 'Consegnato', class: 'admin-badge-success' },
  completed: { label: 'Completato', class: 'admin-badge-success' },
  cancelled: { label: 'Annullato', class: 'admin-badge-danger' },
};

const VentasList = () => {
  const [vendite, setVendite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    saleService.getAll().then(data => {
      setVendite(data.map(v => ({ _id: v._id, cliente: v.clientName || 'Cliente', prodotti: v.products || [], totale: v.total, stato: v.status, createdAt: v.createdAt })));
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questa vendita?')) return;
    try { await saleService.delete(id); setVendite(vendite.filter(v => v._id !== id)); }
    catch (err) { setError(err.message); }
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading-spinner" /></div>;
  if (error) return <div className="admin-error"><AlertCircle className="w-4 h-4" />{error}</div>;

  const totalRevenue = vendite.reduce((sum, v) => sum + (v.totale || 0), 0);
  const completedCount = vendite.filter(v => v.stato === 'completed' || v.stato === 'delivered').length;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="admin-page-title">Vendite</h1>
          <p className="admin-page-subtitle">Storico ordini e vendite</p>
        </div>
        <Link to="/admin/vendite/nuovo" className="admin-btn-primary">
          <Plus className="w-4 h-4" />
          Nuova Vendita
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="cart" label="Totale Ordini" value={vendite.length} />
        <StatCard icon="trend" label="Ricavo Totale" value={`€ ${totalRevenue.toFixed(2).replace('.', ',')}`} />
        <StatCard icon="DollarSign" label="Completati" value={completedCount} />
      </div>

      {vendite.length === 0 ? (
        <div className="admin-table-wrapper">
          <EmptyState icon={ShoppingCart} title="Nessuna vendita" description="Le vendite appariranno qui quando verranno registrate." />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Prodotti</th>
                <th>Totale</th>
                <th>Stato</th>
                <th>Data</th>
                <th className="text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {vendite.map((v, i) => {
                const status = statusConfig[v.stato] || { label: v.stato, class: 'admin-badge-neutral' };
                return (
                  <tr key={v._id}>
                    <td className="text-gray-400 font-mono text-xs">{String(i + 1).padStart(3, '0')}</td>
                    <td className="font-medium text-gray-900">{v.cliente}</td>
                    <td>
                      <div className="space-y-0.5">
                        {v.prodotti.map((p, j) => (
                          <p key={j} className="text-sm text-gray-600">{p.productName || p.product} × {p.quantity}</p>
                        ))}
                      </div>
                    </td>
                    <td className="font-semibold">€ {(v.totale || 0).toFixed(2).replace('.', ',')}</td>
                    <td>
                      <span className={status.class}>{status.label}</span>
                    </td>
                    <td className="text-gray-500 text-xs">{v.createdAt ? new Date(v.createdAt).toLocaleDateString('it-IT') : '—'}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/vendite/${v._id}/modifica`} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(v._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VentasList;
