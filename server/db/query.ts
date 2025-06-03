import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { broker, event, tenant, users } from './schema';
import * as argon2 from 'argon2';
import { PgColumn } from 'drizzle-orm/pg-core';
import { and, eq, lt } from 'drizzle-orm';




function hashGenerate(value: string, secret: string) {
    return argon2.hash(value, { secret: Buffer.from(secret) });
}

async function seed() {
    const pool = new Pool({
        connectionString: "postgres://nextronic:nextronic@cloud.digisense.es:5432/nextronic",
        user: 'nextronic',
        password: 'nextronic'
    });
    try {
        const db = drizzle({ client: pool });
        //insert default tenant
        // console.log((await db.select().from(event).where(eq(event.deviceId,68))).length)
        // await db.delete(event).where(eq(event.deviceId,68))
        // console.log((await db.select().from(event).where(eq(event.deviceId,68))).length)
        await db.delete(event).where(and(eq(event.deviceId, 41)))

        console.log("done");
    } catch (error) {
        console.log(error)
        console.log("already exist")
    }
}

seed();


