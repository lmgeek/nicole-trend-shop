import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Mail, Phone, MapPin, UserCheck, DollarSign, AlertCircle } from 'lucide-react';
import clientService from '@/admin/services/clientService';
import StatCard from '@/admin/components/StatCard';
import EmptyState from '@/admin/components/EmptyState';

const ClientesList = () => {
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    clientService.getAll().then(data => {
      setClienti(data.map(c => ({ _id: c._id, nome: c.name, email: c.email || '', telefono: c.phone || '', indirizzo: c.address || '', acquisti: c.totalPurchases || 0, totaleSpeso: c.totalSpent || 0 })));
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questo cliente?')) return;
    try { await clientService.delete(id); setClienti(clienti.filter(c => c._id !== id)); }
    catch (err) { setError(err.message); }
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading-spinner" /></div>;
  if (error) return <div className="admin-error"><AlertCircle className="w-4 h-4" />{error}</div>;

  const totalSpeso = clienti.reduce((sum, c) => sum + c.totaleSpeso, 0);
  const totalAcquisti = clienti.reduce((sum, c) => sum + c.acquisti, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="admin-page-title">Clienti</h1>
          <p className="admin-page-subtitle">Gestisci la rubrica clienti</p>
        </div>
        <Link to="/admin/clienti/nuovo" className="admin-btn-primary">
          <Plus className="w-4 h-4" />
          Nuovo Cliente
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="users" label="Totale Clienti" value={clienti.length} />
        <StatCard icon="cart" label="Acquisti Totali" value={totalAcquisti} />
        <StatCard icon="trend" label="Ricavo Totale" value={`€ ${totalSpeso.toFixed(2).replace('.', ',')}`} />
      </div>

      {clienti.length === 0 ? (
        <div className="admin-table-wrapper">
          <EmptyState icon={UserCheck} title="Nessun cliente" description="I clienti appariranno qui dopo il primo acquisto." />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Indirizzo</th>
                <th>Acquisti</th>
                <th>Totale Speso</th>
                <th className="text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {clienti.map(c => (
                <tr key={c._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">{c.nome.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-gray-900">{c.nome}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Mail className="w-3.5 h-3.5" />
                      {c.email || '—'}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Phone className="w-3.5 h-3.5" />
                      {c.telefono || '—'}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-gray-500 max-w-[200px] truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {c.indirizzo || '—'}
                    </div>
                  </td>
                  <td className="font-medium">{c.acquisti}</td>
                  <td className="font-medium">€ {c.totaleSpeso.toFixed(2).replace('.', ',')}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/clienti/${c._id}/modifica`} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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

export default ClientesList;
