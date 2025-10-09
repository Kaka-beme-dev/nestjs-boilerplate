// scripts/generate-migration.ts
import * as fs from 'fs';
import * as path from 'path';
import glob from 'fast-glob';
import mongoose, { Schema } from 'mongoose';

const SCHEMA_GLOB = 'src/**/*.schema.ts';
// const MIGRATION_DIR = path.resolve('migrations');
const MIGRATION_DIR = path.resolve(__dirname, './migrations');

function nowStr() {
  const d = new Date();
  return d
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 12);
}

// Simple pluralize helper
function pluralize(name: string) {
  return name.endsWith('s') ? name : `${name}s`;
}

(async () => {
  console.log('🔍 Scanning for schema files...');
  const files = await glob(SCHEMA_GLOB);
  if (!files.length) {
    console.warn('⚠️  No schema files found.');
    process.exit(0);
  }

  if (!fs.existsSync(MIGRATION_DIR)) fs.mkdirSync(MIGRATION_DIR);

  const timestamp = nowStr();
  const fileName = `${timestamp}-auto-indexes.js`;
  const filePath = path.join(MIGRATION_DIR, fileName);

  let content = `module.exports = {
  async up(db, client) {
`;

  for (const file of files) {
    const absPath = path.resolve(file);
    const mod = await import(absPath);

    // Find all Mongoose Schema exports
    // const schemaEntries = Object.entries(mod).filter(([_, val]) => val instanceof Schema);
    const schemaEntries: [string, any][] = Object.entries(mod).filter(
      ([_, val]) => val instanceof Schema,
    );

    for (const [exportName, schema] of schemaEntries) {
      // Detect collection name
      let collectionName: string | undefined;

      // Priority 1: explicitly set via @Schema({ collection })
      if (schema.get('collection')) {
        collectionName = schema.get('collection');
      } else {
        // Priority 2: infer from export name (e.g. "UserSchema" -> "users")
        collectionName = pluralize(
          exportName.replace(/Schema$/i, '').toLowerCase(),
        );
      }

      const indexes = schema.indexes();
      if (!indexes.length) continue;

      content += `\n    // ${collectionName} indexes from ${path.basename(file)}\n`;
      for (const [keys, options] of indexes) {
        content += `    await db.collection("${collectionName}").createIndex(${JSON.stringify(
          keys,
        )}, ${JSON.stringify(options)});\n`;
      }
    }
  }

  content += `
  },
  async down(db, client) {
    console.log("Rollback not implemented (auto-generated)");
  }
};`;

  fs.writeFileSync(filePath, content.trim());
  console.log(`✅ Migration file created: ${fileName}`);
})();
