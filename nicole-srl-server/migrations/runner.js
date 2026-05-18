import Migration from './models/Migration.js';

const runMigrations = async (migrations, models) => {
  console.log('🔄 Verifica migrazioni...');

  for (const migration of migrations) {
    const exists = await Migration.findOne({ name: migration.name });
    if (exists) {
      console.log(`⏭️  Migrazione "${migration.name}" già applicata`);
      continue;
    }

    try {
      console.log(`🚀 Applicando migrazione: ${migration.name}`);
      await migration.up(models);
      await Migration.create({ name: migration.name, appliedAt: new Date() });
      console.log(`✅ Migrazione "${migration.name}" completata`);
    } catch (error) {
      console.error(`❌ Errore nella migrazione "${migration.name}":`, error.message);
      throw error;
    }
  }

  console.log('🎉 Tutte le migrazioni completate');
};

export default runMigrations;
