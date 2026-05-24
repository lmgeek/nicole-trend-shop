const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nicole-trend-shop';
const MIGRATIONS_DIR = __dirname;
const RUNNER_FILE = path.basename(__filename);

async function runMigrations() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!\n');

  const migrationsCol = mongoose.connection.collection('_migrations');
  const alreadyRun = await migrationsCol.find({}).toArray();
  const runNames = new Set(alreadyRun.map((m) => m.name));

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.js') && f !== RUNNER_FILE)
    .sort();

  if (files.length === 0) {
    console.log('No pending migrations found.');
    await mongoose.disconnect();
    return;
  }

  for (const file of files) {
    if (runNames.has(file)) {
      console.log(`  ✓ ${file} already applied`);
      continue;
    }
    console.log(`  → Running ${file}...`);
    const migration = require(path.join(MIGRATIONS_DIR, file));
    await migration.up(mongoose);
    await migrationsCol.insertOne({ name: file, appliedAt: new Date() });
    console.log(`  ✓ ${file} applied successfully\n`);
  }

  console.log('All migrations completed!');
  await mongoose.disconnect();
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
