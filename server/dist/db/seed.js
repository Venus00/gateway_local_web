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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema_1 = require("./schema");
const argon2 = __importStar(require("argon2"));
const uuid_1 = require("uuid");
function hashGenerate(value, secret) {
    return argon2.hash(value, { secret: Buffer.from(secret) });
}
async function seed() {
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        user: 'nextronic',
        password: 'nextronic',
    });
    try {
        const db = (0, node_postgres_1.drizzle)({ client: pool });
        const tenantItem = await db
            .insert(schema_1.tenant)
            .values({
            name: 'nextronic',
        })
            .onConflictDoNothing()
            .returning()
            .then((res) => res[0] ?? null);
        if (tenantItem) {
            const hashedPassword = await hashGenerate('2899100*-+', 'RWL4Wvh5oY63YtpR');
            const adminUser = await db
                .insert(schema_1.users)
                .values({
                email: 'admin@digisense.io',
                password: hashedPassword,
                tenantId: tenantItem.id,
                role: 'gadmin',
                isAdmin: true,
                isVerified: true,
            })
                .onConflictDoNothing()
                .returning();
            const normalUser = await db
                .insert(schema_1.users)
                .values({
                email: 'user@digisense.io',
                password: hashedPassword,
                tenantId: tenantItem.id,
                role: 'user',
                isVerified: true,
            })
                .onConflictDoNothing()
                .returning()
                .then((res) => res[0] ?? null);
            console.log('seed broker table with default broker connection ... ');
            await db.insert(schema_1.broker).values({
                tenantId: +tenantItem.id,
                clientId: (0, uuid_1.v4)(),
                topic: 'nxt/devices/+/data',
                ip: process.env.BROKER_URL || "154.144.229.22",
                port: 1883,
                name: 'digiSenseBroker',
                host: process.env.BROKER_URL || "154.144.229.22",
                username: 'nextronic',
                password: 'nextronic',
            });
            console.log('done');
        }
    }
    catch (e) {
        console.log(e);
    }
}
seed();
//# sourceMappingURL=seed.js.map