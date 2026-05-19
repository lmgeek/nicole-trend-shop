export const dynamic = 'force-dynamic';

export default function SpedizioniResiPage() {
  return (
    <main className="pt-32 pb-16 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-12">Spedizioni e Resi</h1>
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <p className="text-foreground/70 leading-relaxed">Effettuiamo spedizioni in tutta Italia tramite SDA. Gli ordini vengono elaborati con cura e spediti entro 2/3 giorni lavorativi dalla conferma dell&apos;acquisto.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Costi di Spedizione</h2>
            <ul className="list-disc list-inside text-foreground/70 space-y-2">
              <li>Spedizione standard: €5,00</li>
              <li>Spedizione gratuita per ordini superiori a €99,00</li>
              <li>Per le isole è previsto un supplemento di €2,00</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Resi</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">È possibile richiedere il reso entro 15 giorni dalla ricezione dell&apos;ordine. Per effettuare il reso, il prodotto dovrà essere rispedito al mittente nelle condizioni originali.</p>
            <p className="text-foreground/70 leading-relaxed">Le spese di spedizione per il reso sono a carico dell&apos;acquirente.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Prodotti Esclusi dal Reso</h2>
            <p className="text-foreground/70 leading-relaxed">Per motivi igienici, la bigiotteria è esclusa dalla possibilità di reso.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Cambi</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">Effettuiamo cambi di:</p>
            <ul className="list-disc list-inside text-foreground/70 space-y-2">
              <li>taglia</li><li>colore</li>
            </ul>
          </section>
          <section>
            <p className="text-foreground/70 leading-relaxed">Per assistenza o informazioni aggiuntive, è possibile contattarci tramite i nostri canali dedicati.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
