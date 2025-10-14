"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const mongoose_1 = require("mongoose");
const SCHEMA_GLOB = 'src/**/*.schema.ts';
const MIGRATION_DIR = path.resolve(__dirname, './migrations');
function nowStr() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}_${mm}_${dd}_${hh}_${min}_${ss}`;
}
function pluralize(name) {
    return name.endsWith('s') ? name : `${name}s`;
}
function migrationIndexName(keys) {
    return `migration_${nowStr()}_${Object.keys(keys).join('_')}`;
}
(async () => {
    const files = await (0, fast_glob_1.default)(SCHEMA_GLOB);
    if (!files.length) {
        console.warn('⚠️ No schema files found.');
        process.exit(0);
    }
    if (!fs.existsSync(MIGRATION_DIR))
        fs.mkdirSync(MIGRATION_DIR);
    const timestamp = nowStr();
    const fileName = `${timestamp}-auto-indexes.js`;
    const filePath = path.join(MIGRATION_DIR, fileName);
    let content = `module.exports = {
  async up(db, client) {\n`;
    const downContent = [];
    for (const file of files) {
        const absPath = path.resolve(file);
        const mod = await Promise.resolve(`${absPath}`).then(s => __importStar(require(s)));
        const schemaEntries = Object.entries(mod).filter(([_, val]) => val instanceof mongoose_1.Schema);
        for (const [exportName, schema] of schemaEntries) {
            let collectionName = schema.get('collection');
            if (!collectionName) {
                collectionName = pluralize(exportName.replace(/Schema$/i, '').toLowerCase());
            }
            const indexes = [];
            indexes.push(...schema.indexes());
            const paths = Object.keys(schema.paths);
            for (const p of paths) {
                const pathOptions = schema.paths[p].options;
                if (pathOptions.unique) {
                    indexes.push([{ [p]: 1 }, { unique: true }]);
                }
            }
            if (!indexes.length)
                continue;
            content += `\n    // Indexes for ${collectionName}\n`;
            for (const [keys, options] of indexes) {
                const idxName = migrationIndexName(keys);
                content += `    {\n`;
                content += `      const existingCollection = await db.listCollections({ name: "${collectionName}"}).toArray();\n`;
                content += `      const exists = existingCollection.length > 0;\n`;
                content += `      const existingIndexes = exists == false ? null : await db.collection("${collectionName}").indexes();\n`;
                content += `      if (existingIndexes && !existingIndexes.some(idx => JSON.stringify(idx.key) === '${JSON.stringify(keys)}')) {\n`;
                content += `        await db.collection("${collectionName}").createIndex(${JSON.stringify(keys)}, {...${JSON.stringify(options)}, name: "${idxName}"});\n`;
                content += `        console.log("Created migration index: ${idxName}");\n`;
                content += `      } else { console.log("Index exists, skip"); }\n`;
                content += `    }\n`;
                downContent.push(`    await db.collection("${collectionName}").dropIndex("${idxName}").catch(()=>{});`);
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
//# sourceMappingURL=generate-migration.js.map