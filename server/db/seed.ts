/* eslint-disable prettier/prettier */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { broker, tenant, users } from './schema';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

function hashGenerate(value: string, secret: string) {
  return argon2.hash(value, { secret: Buffer.from(secret) });
}

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: 'nextronic',
    password: 'nextronic',
  });
  try {
    const db = drizzle({ client: pool });
    //insert default plans
    //insert default tenant
    const tenantItem = await db
      .insert(tenant)
      .values({
        name: 'nextronic',
      })
      .onConflictDoNothing()
      .returning()
      .then((res) => res[0] ?? null);
    if (tenantItem) {
      //insert admin user
      const hashedPassword = await hashGenerate('2899100*-+', 'RWL4Wvh5oY63YtpR');
      const adminUser = await db
        .insert(users)
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
        .insert(users)
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
      await db.insert(broker).values({
        tenantId: +tenantItem.id,
        clientId: uuidv4(),
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
    console.log(e)
  }
}

seed();
