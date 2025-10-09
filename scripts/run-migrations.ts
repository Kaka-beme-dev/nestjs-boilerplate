import * as path from 'path';
import * as dotenv from 'dotenv';
import { up, down } from 'migrate-mongo';

dotenv.config();

async function main() {
  const arg = process.argv[2] || 'up';

  const config = {
    mongodb: {
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017',
      databaseName: process.env.DATABASE_NAME || 'api',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    migrationsDir: path.resolve(__dirname, './migrations'),
    changelogCollectionName: 'changelog',
  };

  if (arg === 'up') {
    const migrated = await up(config);
    console.log('✅ Migrations applied:', migrated);
  } else if (arg === 'down') {
    const rolled = await down(config);
    console.log('↩️ Migrations rolled back:', rolled);
  } else {
    console.log('Usage: ts-node run-migrate.ts [up|down]');
  }
}

main();
