import { motion } from 'framer-motion';

export default function LifestyleSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="aspect-[3/4] rounded-2xl overflow-hidden">
              <img src="/images/products/lifestyle-1.jpg" alt="Donna elegante con vestito che cammina per una piazza italiana al tramonto" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
              <img src="/images/products/lifestyle-2.jpg" alt="Borsa e outfit in tessuto caramello su marmo con luce dorata" className="w-full h-full object-cover" />
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:pl-12">
            <p className="font-body text-base text-foreground/70 leading-relaxed mb-6 max-w-lg">
              Da Nicole Trend Shop crediamo che ogni donna debba sentirsi bella, sicura e libera di esprimere il proprio stile. Selezioniamo con passione capi moderni, femminili e versatili, pensati per accompagnare ogni momento della giornata, ogni occasione con eleganza e personalità. La nostra filosofia unisce tendenza, qualità e attenzione ai dettagli, offrendo un&apos;esperienza di shopping autentica, curata e sempre vicina alle esigenze di ogni cliente.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
