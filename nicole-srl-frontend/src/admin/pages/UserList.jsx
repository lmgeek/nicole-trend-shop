import React, { useState, useEffect } from 'react';
import { userService } from '@/admin/services/userService';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, Shield, User, AlertCircle } from 'lucide-react';
import StatCard from '@/admin/components/StatCard';
import EmptyState from '@/admin/components/EmptyState';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    userService.getAll().then(setUsers).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questo utente?')) return;
    try { await userService.delete(id); setUsers(users.filter(u => u._id !== id)); }
    catch (err) { setError(err.message); }
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading-spinner" /></div>;
  if (error) return <div className="admin-error"><AlertCircle className="w-4 h-4" />{error}</div>;

  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="admin-page-title">Utenti</h1>
          <p className="admin-page-subtitle">Gestisci gli utenti del pannello admin</p>
        </div>
        <Link to="/admin/utenti/nuovo" className="admin-btn-primary">
          <Plus className="w-4 h-4" />
          Nuovo Utente
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard icon="users" label="Totale Utenti" value={users.length} />
        <StatCard icon="shield" label="Amministratori" value={adminCount} />
      </div>

      {users.length === 0 ? (
        <div className="admin-table-wrapper">
          <EmptyState icon={Users} title="Nessun utente" description="Crea il primo utente per accedere al pannello." action={<Link to="/admin/utenti/nuovo" className="admin-btn-primary"><Plus className="w-4 h-4" />Aggiungi Utente</Link>} />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utente</th>
                <th>Email</th>
                <th>Ruolo</th>
                <th>Creato il</th>
                <th className="text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">{(user.name || 'U').charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-500">{user.email}</td>
                  <td>
                    <span className={`admin-badge ${user.role === 'admin' ? 'admin-badge-info' : 'admin-badge-neutral'}`}>
                      {user.role === 'admin' ? <><Shield className="w-3 h-3 mr-1" />Admin</> : <><User className="w-3 h-3 mr-1" />Utente</>}
                    </span>
                  </td>
                  <td className="text-gray-500">{new Date(user.createdAt).toLocaleDateString('it-IT')}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/utenti/${user._id}/modifica`} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {!(users.filter(u => u.role === 'admin').length <= 1 && user.role === 'admin') && (
                        <button onClick={() => handleDelete(user._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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

export default UserList;
