'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Instagram, MapPin, Phone, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

const WHATSAPP_URL = 'https://wa.me/393383242194?text=Benvenuti%20da%20Nicole%20Trend%20Shop%2C%20in%20cosa%20possiamo%20aiutarti%3F';

const STORE_INFO = [
  { address: 'Via Don Torello, 23', city: 'Latina', phone: '0773280894' },
  { address: 'Via Dema 15/17', city: 'Terracina', phone: '0773280894' },
];

export default function ContattiPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 max-w-3xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-3">Parliamo</p>
          <h1 className="font-heading text-4xl md:text-6xl font-semibold text-foreground leading-tight mb-8">Contattaci</h1>
          <p className="font-body text-base md:text-lg text-foreground/70 leading-relaxed">
            Hai domande, richieste speciali o semplicemente vuoi saperne di più? Siamo qui per aiutarti. Scrivici e ti risponderemo il prima possibile.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <motion.a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="group bg-primary rounded-3xl p-8 md:p-10 hover:opacity-95 transition-opacity">
            <div className="flex items-center gap-3 mb-6">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-primary-foreground">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <h3 className="font-heading text-xl font-semibold text-primary-foreground">WhatsApp</h3>
            </div>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed mb-6">
              Scrivici direttamente su WhatsApp per un&apos;assistenza rapida e personalizzata. Ti rispondiamo subito!
            </p>
            <span className="inline-block font-body text-sm font-semibold text-primary-foreground tracking-wide uppercase group-hover:underline">Chatta con noi →</span>
          </motion.a>

          <motion.a href="https://www.instagram.com/nicoletrend.shop/" target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group bg-card rounded-3xl p-8 md:p-10 border border-foreground/10 hover:border-foreground/20 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <Instagram className="w-7 h-7 text-foreground" />
              <h3 className="font-heading text-xl font-semibold text-foreground">Instagram</h3>
            </div>
            <p className="font-body text-sm text-foreground/60 leading-relaxed mb-6">
              Seguici su Instagram per scoprire le ultime novità, promozioni esclusive e ispirazioni di stile.
            </p>
            <span className="inline-block font-body text-sm font-semibold text-foreground/80 tracking-wide uppercase group-hover:underline">@nicoletrend.shop →</span>
          </motion.a>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-8">
            I Nostri <span className="italic font-light">Negozi</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STORE_INFO.map((store) => (
              <div key={store.city} className="bg-card rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{store.city}</h3>
                    <p className="font-body text-base text-foreground/70 mb-3">{store.address}</p>
                    <a href={`tel:${store.phone}`} className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                      <Phone className="w-4 h-4" />
                      <span className="font-body text-sm">{store.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-8">
            Invia un <span className="italic font-light">Messaggio</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-body text-sm font-medium text-foreground mb-2">Nome</label>
                  <input type="text" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-card border border-foreground/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Il tuo nome" />
                </div>
                <div>
                  <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-2">Email</label>
                  <input type="email" id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-card border border-foreground/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="tua@email.it" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block font-body text-sm font-medium text-foreground mb-2">Telefono</label>
                <input type="tel" id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-card border border-foreground/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Il tuo numero di telefono" />
              </div>
              <div>
                <label htmlFor="message" className="block font-body text-sm font-medium text-foreground mb-2">Messaggio</label>
                <textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-card border border-foreground/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" placeholder="Scrivi il tuo messaggio..." />
              </div>
              {status === 'success' && (
                <p className="text-green-600 text-sm text-center">Messaggio inviato con successo! Ti risponderemo presto.</p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-sm text-center">Errore nell&apos;invio. Riprova più tardi.</p>
              )}
              <button type="submit" disabled={status === 'sending'} className="w-full bg-primary text-primary-foreground font-body text-sm font-semibold px-8 py-4 rounded-full tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {status === 'sending' ? <><Loader2 className="w-4 h-4 animate-spin" /> Invio in corso...</> : 'Invia Messaggio'}
              </button>
            </form>

            <div className="bg-card rounded-3xl overflow-hidden border border-foreground/10 h-fit">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2975.678782958092!2d12.8938!3d41.5428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1335bb093152ad19%3A0x3a1a1a1a1a1a1a1!2sVia%20Don%20Torello%2C%2023%2C%2004100%20Latina%20LT!5e0!3m2!1sit!2sit!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Negozio Latina"
                className="w-full"
              />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-24 max-w-3xl">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-10">
            Domande <span className="italic font-light">Frequenti</span>
          </h2>
          <div className="space-y-6">
            {[
              { q: 'Come posso effettuare un ordine?', a: 'Puoi ordinare direttamente contattandoci su WhatsApp o tramite Instagram. Ti guideremo in ogni fase dell&apos;acquisto.' },
              { q: 'Quali metodi di pagamento accettate?', a: 'Accettiamo diversi metodi di pagamento. Contattaci su WhatsApp per conoscere tutte le opzioni disponibili.' },
              { q: 'Come funziona la spedizione?', a: 'Spediamo in tutta Italia. I tempi e i costi di spedizione variano in base alla destinazione. Scrivici per maggiori dettagli.' },
              { q: 'Posso effettuare un reso?', a: 'Sì, offriamo la possibilità di reso entro i termini previsti. Contattaci per conoscere la nostra politica di reso completa.' },
            ].map((item) => (
              <div key={item.q} className="bg-card rounded-2xl p-6 md:p-8">
                <h4 className="font-heading text-lg font-semibold text-foreground mb-3">{item.q}</h4>
                <p className="font-body text-sm text-foreground/60 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
