import { connectDB } from '@/lib/db';
import { PaymentMethod } from '@/lib/models/PaymentMethod';

async function seedPaymentMethods() {
  await connectDB();

  const count = await PaymentMethod.countDocuments();
  if (count > 0) {
    console.log('Payment methods already exist. Skipping seed.');
    return;
  }

  const methods = [
    {
      name: 'Bonifico Bancario',
      type: 'bank_transfer',
      enabled: true,
      description: 'Paga tramite bonifico bancario',
      instructions: 'Effettua il bonifico alle seguenti coordinate:\n\nIBAN: IT00 X000 0000 0000 0000 0000 000\nIntestato a: Nicole Trend Shop S.r.l.\nCausale: Numero Ordine\n\nL\'ordine verrà evaso dopo la conferma del pagamento.',
      order: 0,
      config: {
        iban: 'IT00 X000 0000 0000 0000 0000 000',
        beneficiary: 'Nicole Trend Shop S.r.l.',
      },
    },
    {
      name: 'PayPal',
      type: 'paypal',
      enabled: true,
      description: 'Paga in modo sicuro con PayPal',
      instructions: 'Verrai reindirizzato a PayPal per completare il pagamento in modo sicuro.\n\nEmail PayPal: payments@nicoletrend.com',
      order: 1,
      config: {
        email: 'payments@nicoletrend.com',
      },
    },
    {
      name: 'Contrassegno',
      type: 'cash_on_delivery',
      enabled: true,
      description: 'Paga alla consegna',
      instructions: 'Il pagamento avverrà al momento della consegna del pacco.\nSupplemento contrassegno: € 3,00',
      order: 2,
      config: {
        fee: 3,
      },
    },
  ];

  await PaymentMethod.insertMany(methods);
  console.log('Payment methods seeded successfully!');
}

seedPaymentMethods()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
