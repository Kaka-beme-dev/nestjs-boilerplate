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
require("dotenv/config");
const mongoose_1 = require("mongoose");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function runMigrations() {
    let { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;
    if (!DATABASE_URL || DATABASE_URL.trim() === '') {
        console.error('❌ Missing MONGO_URI in environment variables');
        process.exit(1);
    }
    const MONGO_URI = DATABASE_USERNAME && DATABASE_PASSWORD
        ? `${DATABASE_URL.replace('mongodb://', `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@`)}/${DATABASE_NAME}?authSource=admin`
        : `${DATABASE_URL}/${DATABASE_NAME}`;
    if (!MONGO_URI) {
        console.error('❌ Missing MONGO_URI in environment variables');
        process.exit(1);
    }
    const migrationsDir = path_1.default.resolve(__dirname, './migrations');
    if (!fs_1.default.existsSync(migrationsDir)) {
        console.warn('⚠️  No migrations folder found:', migrationsDir);
        process.exit(0);
    }
    const files = fs_1.default
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.js') || f.endsWith('.ts'))
        .sort();
    if (!files.length) {
        console.warn('⚠️  No migration files found.');
        process.exit(0);
    }
    console.log(`🚀 Connecting to MongoDB...`);
    await (0, mongoose_1.connect)(MONGO_URI);
    for (const file of files) {
        const filePath = path_1.default.join(migrationsDir, file);
        console.log(`📦 Running migration: ${file}`);
        try {
            const { up } = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            if (typeof up === 'function') {
                await up(mongoose_1.connection.db, mongoose_1.connection.getClient());
                console.log(`✅ Completed: ${file}`);
            }
            else {
                console.warn(`⚠️  Skipped: ${file} (no 'up' function)`);
            }
        }
        catch (err) {
            console.error(`❌ Error running ${file}:`, err);
            process.exit(1);
        }
    }
    await mongoose_1.connection.close();
    console.log('🏁 All migrations completed.');
}
runMigrations().catch((err) => {
    console.error('💥 Migration failed:', err);
    process.exit(1);
});
//# sourceMappingURL=run-migrations-self.js.map