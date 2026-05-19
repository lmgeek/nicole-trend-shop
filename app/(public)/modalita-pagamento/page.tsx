export const dynamic = 'force-dynamic';

export default function ModalitaPagamentoPage() {
  return (
    <main className="pt-32 pb-16 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-12">Modalità di Pagamento</h1>
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Metodi di Pagamento Disponibili</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">Accettiamo i seguenti metodi di pagamento per garantire la massima sicurezza e convenienza:</p>
            <ul className="list-disc list-inside text-foreground/70 space-y-2">
              <li><strong>Carta di Credito/Debito:</strong> Visa, Mastercard, American Express</li>
              <li><strong>PayPal:</strong> Pagamento rapido e sicuro</li>
              <li><strong>Bonifico Bancario:</strong> Pagamento anticipato (i tempi di elaborazione possono variare)</li>
              <li><strong>Contrassegno:</strong> Pagamento alla consegna (solamente per ordini in Italia)</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Sicurezza dei Pagamenti</h2>
            <p className="text-foreground/70 leading-relaxed">Tutte le transazioni sono protette con crittografia SSL per garantire la massima sicurezza dei tuoi dati.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Fatturazione</h2>
            <p className="text-foreground/70 leading-relaxed">Per ogni acquisto è possibile richiedere fattura. Contattaci dopo l&apos;ordine fornendo i tuoi dati fiscali.</p>
          </section>
          <section>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Valute Accettate</h2>
            <p className="text-foreground/70 leading-relaxed">Tutti i pagamenti vengono elaborati in Euro (€).</p>
          </section>
          <section>
            <p className="text-foreground/70 leading-relaxed">Per qualsiasi domanda relativa ai pagamenti, è possibile contattarci tramite i nostri canali dedicati.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
