import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function ChiSiamoPage() {
  return (
    <div className="pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 max-w-3xl">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-3">La Nostra Storia</p>
          <h1 className="font-heading text-4xl md:text-6xl font-semibold text-foreground leading-tight mb-8">
            Chi<br /><span className="italic font-light">Siamo</span>
          </h1>
          <p className="font-body text-base md:text-lg text-foreground/70 leading-relaxed">
            Nicole Trend Shop nasce dalla passione per la moda italiana e dal desiderio di rendere l&apos;eleganza accessibile a tutte le donne.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="shadow-lg">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img src="/images/products/lifestyle-1.jpg" alt="Donna italiana in boutique con outfit elegante primaverile" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8">
            <div>
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">La Nostra Missione</h3>
              <p className="font-body text-base text-foreground/70 leading-relaxed">
                Selezioniamo con cura ogni pezzo della nostra collezione per garantire qualità, stile e comfort. Dalla calzatura all&apos;accessorio, ogni prodotto racconta una storia di artigianalità italiana.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">Qualità Senza Compromessi</h3>
              <p className="font-body text-base text-foreground/70 leading-relaxed">
                Collaboriamo con i migliori artigiani per portarti abbigliamento e accessori che combinano materiali pregiati con un design contemporaneo.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">Servizio Personalizzato</h3>
              <p className="font-body text-base text-foreground/70 leading-relaxed">
                Siamo sempre a tua disposizione tramite WhatsApp e Instagram per consigli di stile, informazioni sulle taglie e supporto personalizzato.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Stile Italiano', desc: "Ogni prodotto riflette la tradizione e l'innovazione del design made in Italy." },
            { title: 'Attenzione al Cliente', desc: 'Un servizio dedicato e personalizzato per ogni esigenza, dalla scelta alla consegna.' },
            { title: 'Tendenze Attuali', desc: 'Aggiorniamo costantemente la nostra collezione con le ultime tendenze della moda.' },
          ].map((value) => (
            <div key={value.title} className="bg-card rounded-2xl p-8">
              <h4 className="font-heading text-xl font-semibold text-foreground mb-3">{value.title}</h4>
              <p className="font-body text-sm text-foreground/60 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
