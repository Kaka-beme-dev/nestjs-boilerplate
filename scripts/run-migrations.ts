import 'dotenv/config';
import { connect, connection } from 'mongoose';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  let { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } =
    process.env;

  // 🔧 Tạo URI tự động từ .env
  if (!DATABASE_URL || DATABASE_URL.trim() === '') {
    // DATABASE_URL = 'mongodb://localhost:27017';
    console.error('❌ Missing MONGO_URI in environment variables');
    process.exit(1);
  }
  const MONGO_URI =
    DATABASE_USERNAME && DATABASE_PASSWORD
      ? `${DATABASE_URL.replace('mongodb://', `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@`)}/${DATABASE_NAME}?authSource=admin`
      : `${DATABASE_URL}/${DATABASE_NAME}`;
  if (!MONGO_URI) {
    console.error('❌ Missing MONGO_URI in environment variables');
    process.exit(1);
  }

  const migrationsDir = path.resolve(__dirname, './migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.warn('⚠️  No migrations folder found:', migrationsDir);
    process.exit(0);
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.js') || f.endsWith('.ts'))
    .sort(); // đảm bảo chạy theo thứ tự thời gian

  if (!files.length) {
    console.warn('⚠️  No migration files found.');
    process.exit(0);
  }

  console.log(`🚀 Connecting to MongoDB...`);
  await connect(MONGO_URI);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`📦 Running migration: ${file}`);
    try {
      const { up } = await import(filePath);
      if (typeof up === 'function') {
        await up(connection.db, connection.getClient());
        console.log(`✅ Completed: ${file}`);
      } else {
        console.warn(`⚠️  Skipped: ${file} (no 'up' function)`);
      }
    } catch (err) {
      console.error(`❌ Error running ${file}:`, err);
      process.exit(1);
    }
  }

  await connection.close();
  console.log('🏁 All migrations completed.');
}

runMigrations().catch((err) => {
  console.error('💥 Migration failed:', err);
  process.exit(1);
});
