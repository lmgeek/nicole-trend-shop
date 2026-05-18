// TEMPLATE PER NUOVE MIGRAZIONI
// Copiare questo file e rinominarlo con il formato: NNN-nome-descrizione.js
// Esempio: 002-add-product-sizes.js

const up = async (models) => {
  const { Product } = models;

  // Esempio: aggiungere un nuovo campo a tutti i documenti esistenti
  await Product.updateMany(
    { sizes: { $exists: false } },
    { $set: { sizes: [] } }
  );

  console.log('  ✅ Migrazione applicata');
};

export default { name: 'NNN-nome-migrazione', up };
