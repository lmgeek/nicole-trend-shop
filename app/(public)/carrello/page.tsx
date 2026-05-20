'use client';

import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const router = useRouter();
  const total = getTotal();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="font-heading text-4xl font-semibold text-foreground mb-4">
            Il tuo carrello è vuoto
          </h1>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">
            Scopri la nostra collezione e trova qualcosa che ami.
          </p>
          <Link
            href="/collezione"
            className="inline-flex items-center gap-2 bg-foreground text-white px-8 py-3.5 rounded-xl font-medium hover:bg-foreground/90 transition-colors"
          >
            Scopri la Collezione
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-4xl font-semibold text-foreground mb-2">
          Carrello
        </h1>
        <p className="text-gray-500 mb-10">
          {items.length} {items.length === 1 ? 'prodotto' : 'prodotti'} nel carrello
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-5 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
              >
                <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-lg font-medium text-foreground truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    € {item.price.toFixed(2).replace('.', ',')} cad.
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600"
                        aria-label="Diminuisci quantità"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-medium text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600"
                        aria-label="Aumenta quantità"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-heading text-lg font-semibold text-foreground">
                        € {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Rimuovi prodotto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={clearCart}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors mt-4"
          >
            Svuota carrello
          </button>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-28"
          >
            <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
              Riepilogo Ordine
            </h2>

            <div className="space-y-3 text-sm">
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

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-foreground text-white py-3.5 rounded-xl font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
            >
              Procedi al Pagamento
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/collezione"
              className="block text-center text-sm text-gray-500 hover:text-foreground transition-colors mt-4"
            >
              Continua lo Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
