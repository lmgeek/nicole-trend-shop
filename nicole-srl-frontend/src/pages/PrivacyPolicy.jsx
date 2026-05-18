import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-12">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <p className="text-foreground/70 leading-relaxed">
                La presente Privacy Policy descrive le modalità di gestione dei dati personali degli utenti che visitano e utilizzano questo sito online.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                Raccolta dei dati
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Durante la navigazione o l'acquisto, possiamo raccogliere alcune informazioni personali, tra cui:
              </p>
              <ul className="list-disc list-inside text-foreground/70 space-y-2">
                <li>nome e cognome</li>
                <li>indirizzo di spedizione</li>
                <li>indirizzo email</li>
                <li>numero di telefono</li>
                <li>dati necessari per la gestione degli ordini</li>
              </ul>
              <p className="text-foreground/70 leading-relaxed mt-4">
                I dati vengono utilizzati esclusivamente per:
              </p>
              <ul className="list-disc list-inside text-foreground/70 space-y-2">
                <li>elaborare e spedire gli ordini</li>
                <li>fornire assistenza clienti</li>
                <li>comunicazioni relative agli acquisti effettuati</li>
                <li>adempiere agli obblighi fiscali e amministrativi</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                Protezione dei dati
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                I dati personali vengono trattati nel rispetto della normativa vigente e protetti attraverso adeguate misure di sicurezza, al fine di garantirne riservatezza e protezione.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                Condivisione dei dati
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                I dati potranno essere condivisi esclusivamente con soggetti coinvolti nella gestione del servizio, come:
              </p>
              <ul className="list-disc list-inside text-foreground/70 space-y-2">
                <li>corrieri per la spedizione degli ordini</li>
                <li>piattaforme di pagamento</li>
                <li>consulenti amministrativi e fiscali</li>
              </ul>
              <p className="text-foreground/70 leading-relaxed mt-4">
                I dati non verranno ceduti a terzi per finalità commerciali.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                Diritti dell'utente
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                L'utente può in qualsiasi momento richiedere:
              </p>
              <ul className="list-disc list-inside text-foreground/70 space-y-2">
                <li>accesso ai propri dati</li>
                <li>modifica o aggiornamento</li>
                <li>cancellazione dei dati personali</li>
                <li>limitazione del trattamento</li>
              </ul>
              <p className="text-foreground/70 leading-relaxed mt-4">
                Per qualsiasi richiesta relativa alla privacy è possibile contattarci tramite i recapiti presenti sul sito.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                Cookie
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                Questo sito può utilizzare cookie tecnici e di navigazione per migliorare l'esperienza dell'utente e garantire il corretto funzionamento della piattaforma.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
