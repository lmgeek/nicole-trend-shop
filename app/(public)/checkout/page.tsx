'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Building2, Wallet, Check, Loader2, MapPin, User, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PaymentMethod {
  _id: string;
  name: string;
  type: string;
  description: string;
  instructions: string;
  config: Record<string, any>;
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const total = getTotal();

  const [step, setStep] = useState<'info' | 'payment' | 'confirm'>('info');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Italia',
  });

  useEffect(() => {
    if (items.length === 0 && step !== 'confirm') {
      router.push('/carrello');
      return;
    }
    fetch('/api/public/payment-methods')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPaymentMethods(data);
          setSelectedPayment(data[0]._id);
        }
      })
      .catch(console.error);
  }, [items.length, router, step]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/public/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
          },
          paymentMethod: selectedPayment,
          shippingAddress: {
            street: customer.street,
            city: customer.city,
            postalCode: customer.postalCode,
            country: customer.country,
          },
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore durante il checkout');

      setOrderId(data._id);
      clearCart();
      setStep('confirm');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find((m) => m._id === selectedPayment);

  if (step === 'confirm') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-heading text-4xl font-semibold text-foreground mb-4">
            Ordine Confermato!
          </h1>
          <p className="text-gray-500 mb-2">
            Grazie per il tuo acquisto, {customer.name}.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            ID Ordine: <span className="font-mono">{orderId}</span>
          </p>

          {selectedMethod && (
            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
              <h3 className="font-heading font-medium text-foreground mb-2">
                Metodo di Pagamento: {selectedMethod.name}
              </h3>
              {selectedMethod.instructions && (
                <p
                  className="text-sm text-gray-600 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: selectedMethod.instructions }}
                />
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/collezione"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-white px-8 py-3.5 rounded-xl font-medium hover:bg-foreground/90 transition-colors"
            >
              Continua lo Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-foreground px-8 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Torna alla Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
      <Link
        href="/carrello"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Torna al Carrello
      </Link>

      <h1 className="font-heading text-4xl font-semibold text-foreground mb-10">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-foreground text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Dati di Spedizione
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="admin-label">
                  <User className="w-3.5 h-3.5 inline mr-1.5" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Mario Rossi"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">
                    <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="admin-input"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="mario@email.com"
                  />
                </div>
                <div>
                  <label className="admin-label">
                    <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                    Telefono
                  </label>
                  <input
                    type="tel"
                    className="admin-input"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+39 333 1234567"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">
                  <MapPin className="w-3.5 h-3.5 inline mr-1.5" />
                  Indirizzo *
                </label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={customer.street}
                  onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                  placeholder="Via Roma 1"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="admin-label">Città *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="Milano"
                  />
                </div>
                <div>
                  <label className="admin-label">CAP *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    placeholder="20100"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="admin-label">Paese *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={customer.country}
                    onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!customer.name || !customer.email || !customer.street || !customer.city || !customer.postalCode) {
                  setError('Compila tutti i campi obbligatori');
                  return;
                }
                setError('');
                setStep('payment');
              }}
              className="mt-6 w-full bg-foreground text-white py-3.5 rounded-xl font-medium hover:bg-foreground/90 transition-colors"
            >
              Continua con il Pagamento
            </button>
          </motion.div>

          {/* Step 2: Payment */}
          <AnimatePresence>
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-foreground text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    Metodo di Pagamento
                  </h2>
                </div>

                {paymentMethods.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nessun metodo di pagamento disponibile.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method._id}
                        onClick={() => setSelectedPayment(method._id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          selectedPayment === method._id
                            ? 'border-foreground bg-foreground/5'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedPayment === method._id
                              ? 'bg-foreground text-white'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {method.type === 'bank_transfer' && <Building2 className="w-5 h-5" />}
                          {method.type === 'paypal' && <Wallet className="w-5 h-5" />}
                          {method.type === 'cash_on_delivery' && <CreditCard className="w-5 h-5" />}
                          {method.type === 'card' && <CreditCard className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{method.name}</p>
                          {method.description && (
                            <p className="text-sm text-gray-500 mt-0.5">{method.description}</p>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === method._id
                              ? 'border-foreground'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedPayment === method._id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedMethod?.instructions && selectedMethod.instructions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl"
                  >
                    <p
                      className="text-sm text-amber-800 whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: selectedMethod.instructions }}
                    />
                  </motion.div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep('info')}
                    className="flex-1 bg-white border border-gray-200 text-foreground py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Indietro
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-foreground text-white py-3.5 rounded-xl font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Elaborazione...
                      </>
                    ) : (
                      `Conferma Ordine - € ${total.toFixed(2).replace('.', ',')}`
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-28"
          >
            <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
              Il Tuo Ordine
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <CreditCard className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qtà: {item.quantity} × € {item.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    € {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotale</span>
                <span>€ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Spedizione</span>
                <span className="text-green-600 font-medium">Gratuita</span>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-heading text-lg font-semibold text-foreground">Totale</span>
                  <span className="font-heading text-xl font-semibold text-foreground">
                    € {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
