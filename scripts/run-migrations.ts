import * as path from 'path';
import * as dotenv from 'dotenv';
import { database, up, down, config } from 'migrate-mongo';

dotenv.config();

async function main() {
  const arg = process.argv[2] || 'up';

  const username = encodeURIComponent(process.env.DATABASE_USERNAME || 'root');
  const password = encodeURIComponent(
    process.env.DATABASE_PASSWORD || 'secret',
  );
  const host = process.env.DATABASE_HOST || 'localhost';
  const port = process.env.DATABASE_PORT || '27017';
  const dbName = process.env.DATABASE_NAME || 'api';

  // Ưu tiên DATABASE_URL nếu được định nghĩa sẵn trong .env
  const connectionUrl = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
  console.log('✅ Migrations connectionUrl:', connectionUrl);
  const myConfig = {
    mongodb: {
      url: connectionUrl || 'mongodb://root:secret@mongo:27017', //mongo:27017 là tên service mongo trong docker-compose. test local thì để localhost:27017
      databaseName: process.env.DATABASE_NAME || 'api',
      options: {},
    },
    migrationsDir: path.resolve(__dirname, './migrations'),
    changelogCollectionName: 'changelog',
  };
  //ell migrate-mongo NOT to use the migrate-mongo-config.js file migrate-mongo-config.js
  //use above myConfig instead
  config.set(myConfig);

  // 🔹 Gắn config tạm thời vào global của migrate-mongo
  (global as any).migrateMongoConfig = myConfig;

  const { db, client } = await database.connect();
  // ✅ Kết nối đúng cách

  try {
    if (arg === 'up') {
      const migrated = await up(db, client);
      console.log('✅ Migrations applied:', migrated);
    } else if (arg === 'down') {
      const rolled = await down(db, client);
      console.log('↩️ Migrations rolled back:', rolled);
    } else {
      console.log('Usage: ts-node run-migrations.ts [up|down]');
    }
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
