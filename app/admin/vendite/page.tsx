'use client';

import { useEffect, useState } from 'react';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';

interface Sale {
  _id: string;
  clientName: string;
  client?: { name: string; email: string };
  products: { productName: string; quantity: number; price: number }[];
  total: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  pending: 'In attesa',
  processing: 'In lavorazione',
  shipped: 'Spedito',
  delivered: 'Consegnato',
  completed: 'Completato',
  cancelled: 'Annullato',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default function VenditePage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchSales(); }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => `\u20ac ${price.toFixed(2).replace('.', ',')}`;

  const formatDate = (date: string) => new Date(date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });

  const filtered = sales.filter(
    (s) =>
      (s.clientName || s.client?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      s.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filtered.reduce((sum, s) => sum + s.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Caricamento vendite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vendite</h1>
          <p className="text-gray-500 mt-1">{sales.length} vendite totali</p>
        </div>
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium">Ricavo filtrato: {formatPrice(totalRevenue)}</span>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Cerca vendite..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40" />
      </div>

      <div className="space-y-3">
        {filtered.map((sale) => (
          <div key={sale._id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{sale.clientName || sale.client?.name || 'N/D'}</h3>
                  <p className="text-xs text-gray-500">{formatDate(sale.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">{sale.products.length} prodotti</p>
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(sale.total)}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[sale.status] || 'bg-gray-100 text-gray-600'}`}>
                  {statusLabels[sale.status] || sale.status}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-2">
              {sale.products.map((p, i) => (
                <span key={i} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  {p.productName} <span className="text-gray-400">x{p.quantity}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500">Nessuna vendita trovata.</div>
        )}
      </div>
    </div>
  );
}
