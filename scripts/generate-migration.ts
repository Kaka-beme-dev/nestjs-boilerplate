import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import glob from 'fast-glob';
import { Schema } from 'mongoose';
// import { getMetadataArgsStorage } from 'typeorm';

const SCHEMA_GLOB = 'src/**/*.schema.ts';
const MIGRATION_DIR = path.resolve(__dirname, './migrations');

function nowStr() {
  // return new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 12);
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0'); // 01-12
  const dd = String(d.getDate()).padStart(2, '0');      // 01-31
  const hh = String(d.getHours()).padStart(2, '0');     // 00-23
  const min = String(d.getMinutes()).padStart(2, '0');  // 00-59
  const ss = String(d.getSeconds()).padStart(2, '0');   // 00-59
  return `${yyyy}_${mm}_${dd}_${hh}_${min}_${ss}`;
}

function pluralize(name: string) {
  return name.endsWith('s') ? name : `${name}s`;
}

function migrationIndexName(keys: Record<string, any>) {
  return `migration_${nowStr()}_${Object.keys(keys).join('_')}`;
}

(async () => {
  const files = await glob(SCHEMA_GLOB);
  if (!files.length) {
    console.warn('⚠️ No schema files found.');
    process.exit(0);
  }

  if (!fs.existsSync(MIGRATION_DIR)) fs.mkdirSync(MIGRATION_DIR);

  const timestamp = nowStr();
  const fileName = `${timestamp}-auto-indexes.js`;
  const filePath = path.join(MIGRATION_DIR, fileName);

  let content = `module.exports = {
  async up(db, client) {\n`;

  const downContent: string[] = [];

  for (const file of files) {
    const absPath = path.resolve(file);
    const mod = await import(absPath);

    const schemaEntries: [string, any][] = Object.entries(mod).filter(
      ([_, val]) => val instanceof Schema
    );

    for (const [exportName, schema] of schemaEntries) {
      let collectionName = schema.get('collection');
      if (!collectionName) {
        collectionName = pluralize(exportName.replace(/Schema$/i, '').toLowerCase());
      }

      const indexes: [Record<string, any>, any][] = [];

      // 1️⃣ Lấy index từ schema.indexes()
      indexes.push(...schema.indexes());

      // 2️⃣ Lấy index từ @Prop({ unique: true }) → convert thành index
      const paths = Object.keys(schema.paths);
      for (const p of paths) {
        const pathOptions = schema.paths[p].options;
        if (pathOptions.unique) {
          indexes.push([{ [p]: 1 }, { unique: true }]);
        }
      }

      if (!indexes.length) continue;

      content += `\n    // Indexes for ${collectionName}\n`;

      for (const [keys, options] of indexes) {
        const idxName = migrationIndexName(keys);

        // Block scope để tránh duplicate const
        content += `    {\n`;
        content += `      const existingIndexes = await db.collection("${collectionName}").indexes();\n`;
        content += `      if (!existingIndexes.some(idx => JSON.stringify(idx.key) === '${JSON.stringify(
          keys
        )}')) {\n`;
        content += `        await db.collection("${collectionName}").createIndex(${JSON.stringify(
          keys
        )}, {...${JSON.stringify(options)}, name: "${idxName}"});\n`;
        content += `        console.log("Created migration index: ${idxName}");\n`;
        content += `      } else { console.log("Index exists, skip"); }\n`;
        content += `    }\n`;

        downContent.push(
          `    await db.collection("${collectionName}").dropIndex("${idxName}").catch(()=>{});`
        );
      }
    }
  }

  content += `  },
  async down(db, client) {\n`;
  content += downContent.join('\n');
  content += `\n  }\n};\n`;

  fs.writeFileSync(filePath, content);
  console.log(`✅ Migration file created: ${fileName}`);
})();
