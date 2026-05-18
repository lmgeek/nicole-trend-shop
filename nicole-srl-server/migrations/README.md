# Sistema de Migraciones

## Come funziona

Le migrazioni vengono eseguite automaticamente all'avvio del server. Ogni migrazione viene registrata nella collezione `migrations` di MongoDB. Se una migrazione è già stata applicata, viene saltata.

## Struttura

```
server/migrations/
├── runner.js              # Motore di esecuzione
├── models/Migration.js    # Modello per tracciare le migrazioni
├── index.js               # Registro di tutte le migrazioni
├── 001-initial-seed.js    # Prima migrazione (seed iniziale)
└── TEMPLATE.js            # Template per nuove migrazioni
```

## Come creare una nuova migrazione

1. Copiare `TEMPLATE.js` e rinominarlo con formato: `NNN-nome-descrizione.js`
   ```
   cp server/migrations/TEMPLATE.js server/migrations/002-add-new-field.js
   ```

2. Modificare il nome nell'export:
   ```js
   export default { name: '002-add-new-field', up };
   ```

3. Registrare la migrazione in `server/migrations/index.js`:
   ```js
   import migration001 from './001-initial-seed.js';
   import migration002 from './002-add-new-field.js';

   const migrations = [
     migration001,
     migration002,
   ];

   export default migrations;
   ```

4. Implementare la logica nel metodo `up()`:
   ```js
   const up = async (models) => {
     const { Product } = models;
     // Logica di migrazione
   };
   ```

## Esempi comuni

### Aggiungere un campo a documenti esistenti
```js
const up = async (models) => {
  const { Product } = models;
  await Product.updateMany(
    { newField: { $exists: false } },
    { $set: { newField: 'default' } }
  );
};
```

### Inserire nuovi dati seed
```js
const up = async (models) => {
  const { Category } = models;
  const exists = await Category.findOne({ slug: 'nuova' });
  if (!exists) {
    await Category.create({ name: 'NUOVA', slug: 'nuova', enabled: true });
  }
};
```

### Rinominare un campo
```js
const up = async (models) => {
  const { Product } = models;
  await Product.updateMany(
    { oldField: { $exists: true }, newField: { $exists: false } },
    [{ $set: { newField: '$oldField' }, $unset: ['oldField'] }]
  );
};
```

## Docker

### Produzione (Portainer/Cloud)
```bash
docker compose up -d
```

### Sviluppo (con hot-reload)
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Le migrazioni si eseguono automaticamente ad ogni avvio del container server.
