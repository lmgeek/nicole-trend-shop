import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '@/admin/services/userService';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      userService.getById(id).then(data => { if (data) setUser({ name: data.name, email: data.email, role: data.role }); else setError('Utente non trovato'); }).catch(err => setError(err.message));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!user.name || !user.email) { setError('Compila tutti i campi'); return; }
    if (!isEditMode && !user.password) { setError('Inserisci una password'); return; }
    try {
      setLoading(true);
      const data = { name: user.name, email: user.email, role: user.role };
      if (user.password) data.password = user.password;
      if (isEditMode) { await userService.update(id, data); setSuccess('Utente aggiornato'); }
      else { await userService.create(data); setSuccess('Utente creato'); setUser({ name: '', email: '', password: '', role: 'user' }); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (loading && isEditMode) return <div className="admin-loading"><div className="admin-loading-spinner" /></div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/utenti')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="admin-page-title">{isEditMode ? 'Modifica Utente' : 'Nuovo Utente'}</h1>
          <p className="admin-page-subtitle">{isEditMode ? 'Aggiorna le informazioni utente' : 'Crea un nuovo utente admin'}</p>
        </div>
      </div>

      {error && <div className="admin-error mb-6">{error}</div>}
      {success && <div className="admin-success mb-6">{success}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="name">Nome</label>
            <input id="name" name="name" type="text" value={user.name} onChange={handleChange} required className="admin-input" placeholder="Nome completo" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={user.email} onChange={handleChange} required className="admin-input" placeholder="email@esempio.com" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="password">
              {isEditMode ? 'Password (opzionale)' : 'Password'}
            </label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={user.password} onChange={handleChange} required={!isEditMode} className="admin-input pr-10" placeholder={isEditMode ? 'Lascia vuoto per mantenere' : '••••••••'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="role">Ruolo</label>
            <select id="role" name="role" value={user.role} onChange={handleChange} className="admin-input">
              <option value="user">Utente</option>
              <option value="admin">Amministratore</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button type="submit" disabled={loading} className="admin-btn-primary">
            {loading ? 'Salvataggio...' : isEditMode ? 'Aggiorna' : 'Crea Utente'}
          </button>
          <button type="button" onClick={() => navigate('/admin/utenti')} className="admin-btn-secondary">Annulla</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
