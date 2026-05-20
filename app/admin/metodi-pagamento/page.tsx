'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Building2, Wallet, CreditCard, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PaymentMethod {
  _id: string;
  name: string;
  type: string;
  enabled: boolean;
  description: string;
  instructions: string;
  config: Record<string, any>;
  order: number;
}

const typeIcons: Record<string, any> = {
  bank_transfer: Building2,
  paypal: Wallet,
  cash_on_delivery: CreditCard,
  card: CreditCard,
};

const typeLabels: Record<string, string> = {
  bank_transfer: 'Bonifico Bancario',
  paypal: 'PayPal',
  cash_on_delivery: 'Contrassegno',
  card: 'Carta di Credito',
};

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: 'bank_transfer',
    description: '',
    instructions: '',
    order: 0,
    config: {} as Record<string, any>,
  });

  const loadMethods = () => {
    fetch('/api/payment-methods')
      .then((res) => res.json())
      .then((data) => {
        setMethods(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadMethods();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', type: 'bank_transfer', description: '', instructions: '', order: methods.length, config: {} });
    setShowForm(true);
  };

  const openEdit = (method: PaymentMethod) => {
    setEditing(method);
    setForm({
      name: method.name,
      type: method.type,
      description: method.description,
      instructions: method.instructions,
      order: method.order,
      config: method.config || {},
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);

    try {
      const url = editing ? `/api/payment-methods/${editing._id}` : '/api/payment-methods';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Errore durante il salvataggio');

      setShowForm(false);
      loadMethods();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo metodo di pagamento?')) return;

    try {
      const res = await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Errore durante l\'eliminazione');
      loadMethods();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleEnabled = async (method: PaymentMethod) => {
    try {
      const res = await fetch(`/api/payment-methods/${method._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !method.enabled }),
      });
      if (!res.ok) throw new Error('Errore');
      loadMethods();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Metodi di Pagamento</h1>
          <p className="text-sm text-gray-500 mt-1">Gestisci i metodi di pagamento per il checkout</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-foreground text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Aggiungi
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nessun metodo di pagamento configurato</p>
          <button onClick={openCreate} className="mt-4 text-sm text-foreground font-medium underline">
            Aggiungi il primo metodo
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((method, index) => {
            const Icon = typeIcons[method.type] || CreditCard;
            return (
              <motion.div
                key={method._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-medium text-foreground">{method.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {typeLabels[method.type] || method.type}
                    </span>
                  </div>
                  {method.description && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{method.description}</p>
                  )}
                </div>

                <button
                  onClick={() => toggleEnabled(method)}
                  className="flex items-center gap-1.5 text-sm"
                >
                  {method.enabled ? (
                    <ToggleRight className="w-8 h-8 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-300" />
                  )}
                </button>

                <button
                  onClick={() => openEdit(method)}
                  className="p-2 rounded-lg text-gray-400 hover:text-foreground hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(method._id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  {editing ? 'Modifica Metodo' : 'Nuovo Metodo'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="admin-label">Nome *</label>
                  <input
                    className="admin-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="es. Bonifico Bancario"
                  />
                </div>

                <div>
                  <label className="admin-label">Tipo *</label>
                  <select
                    className="admin-input"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="bank_transfer">Bonifico Bancario</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash_on_delivery">Contrassegno</option>
                    <option value="card">Carta di Credito</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Descrizione</label>
                  <input
                    className="admin-input"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Breve descrizione del metodo"
                  />
                </div>

                <div>
                  <label className="admin-label">Istruzioni</label>
                  <textarea
                    className="admin-input min-h-[100px]"
                    value={form.instructions}
                    onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                    placeholder="Istruzioni visualizzate al cliente dopo l'ordine (supporta HTML)"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="admin-label">Configurazione JSON (opzionale)</label>
                  <textarea
                    className="admin-input font-mono text-sm"
                    value={JSON.stringify(form.config, null, 2)}
                    onChange={(e) => {
                      try {
                        setForm({ ...form, config: JSON.parse(e.target.value) });
                      } catch {
                        // invalid JSON, ignore
                      }
                    }}
                    placeholder='{"iban": "IT00...", "paypal_email": "..."}'
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-white border border-gray-200 text-foreground py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name}
                  className="flex-1 bg-foreground text-white py-3 rounded-xl font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    'Salva'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
