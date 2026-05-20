'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Package, Users, ShoppingCart, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';

interface Stats {
  products: number;
  clients: number;
  sales: number;
  revenue: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, clients: 0, sales: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, clients, sales] = await Promise.all([
          fetch('/api/products').then((r) => r.json()),
          fetch('/api/clients').then((r) => r.json()),
          fetch('/api/sales').then((r) => r.json()),
        ]);
        const revenue = (Array.isArray(sales) ? sales : []).reduce((sum: number, s: any) => sum + (s.total || 0), 0);
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          clients: Array.isArray(clients) ? clients.length : 0,
          sales: Array.isArray(sales) ? sales.length : 0,
          revenue,
        });
      } catch (err) {
        console.error('Errore nel caricamento delle statistiche:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => `\u20ac ${amount.toFixed(2).replace('.', ',')}`;

  const cards = [
    { label: 'Prodotti', value: stats.products, icon: Package, link: '/admin/prodotti', color: 'bg-blue-50 text-blue-600' },
    { label: 'Clienti', value: stats.clients, icon: Users, link: '/admin/clienti', color: 'bg-green-50 text-green-600' },
    { label: 'Vendite', value: stats.sales, icon: ShoppingCart, link: '/admin/vendite', color: 'bg-purple-50 text-purple-600' },
    { label: 'Ricavo Totale', value: formatCurrency(stats.revenue), icon: TrendingUp, link: '/admin/vendite', color: 'bg-amber-50 text-amber-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Panoramica del tuo negozio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.link} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Navigazione Rapida</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Prodotti', href: '/admin/prodotti' },
            { label: 'Categorie', href: '/admin/categorie' },
            { label: 'Clienti', href: '/admin/clienti' },
            { label: 'Vendite', href: '/admin/vendite' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
