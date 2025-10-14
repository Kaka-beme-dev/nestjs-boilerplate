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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const migrate_mongo_1 = require("migrate-mongo");
dotenv.config();
async function main() {
    const arg = process.argv[2] || 'up';
    const username = encodeURIComponent(process.env.DATABASE_USERNAME || 'root');
    const password = encodeURIComponent(process.env.DATABASE_PASSWORD || 'secret');
    const host = process.env.DATABASE_HOST || 'localhost';
    const port = process.env.DATABASE_PORT || '27017';
    const dbName = process.env.DATABASE_NAME || 'api';
    const connectionUrl = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
    console.log('✅ Migrations connectionUrl:', connectionUrl);
    const myConfig = {
        mongodb: {
            url: connectionUrl || 'mongodb://root:secret@mongo:27017',
            databaseName: process.env.DATABASE_NAME || 'api',
            options: {},
        },
        migrationsDir: path.resolve(__dirname, './migrations'),
        changelogCollectionName: 'changelog',
    };
    migrate_mongo_1.config.set(myConfig);
    global.migrateMongoConfig = myConfig;
    const { db, client } = await migrate_mongo_1.database.connect();
    try {
        if (arg === 'up') {
            const migrated = await (0, migrate_mongo_1.up)(db, client);
            console.log('✅ Migrations applied:', migrated);
        }
        else if (arg === 'down') {
            const rolled = await (0, migrate_mongo_1.down)(db, client);
            console.log('↩️ Migrations rolled back:', rolled);
        }
        else {
            console.log('Usage: ts-node run-migrations.ts [up|down]');
        }
    }
    catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
    finally {
        await client.close();
    }
}
main();
//# sourceMappingURL=run-migrations.js.map