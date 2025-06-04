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
const drizzle_orm_1 = require("drizzle-orm");
function hashGenerate(value, secret) {
    return argon2.hash(value, { secret: Buffer.from(secret) });
}
async function seed() {
    const pool = new pg_1.Pool({
        connectionString: "postgres://nextronic:nextronic@cloud.digisense.es:5432/nextronic",
        user: 'nextronic',
        password: 'nextronic'
    });
    try {
        const db = (0, node_postgres_1.drizzle)({ client: pool });
        await db.delete(schema_1.event).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.event.deviceId, 41)));
        console.log("done");
    }
    catch (error) {
        console.log(error);
        console.log("already exist");
    }
}
seed();
//# sourceMappingURL=query.js.map