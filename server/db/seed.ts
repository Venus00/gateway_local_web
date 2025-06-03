/* eslint-disable prettier/prettier */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { broker, licence, subscriptionPlan, tenant, users } from './schema';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export const plans = [
  {
    name: "FREE",
    description: "Up to 10 devices",
    price: JSON.stringify([{
      custom: false,
      amount: 0.0,
      currency: "€",
      billing_period: "month",
    },
    {
      custom: false,
      amount: 0.0,
      currency: "€",
      billing_period: "year",
    }
    ]),
    specs: JSON.stringify({
      entity: {
        value: 2,
        title: "✓ 2 Entities",
      },
      device: {
        value: 2,
        title: "✓ ≤ 2 devices",
      },
      deviceType: {
        value: 2,
        title: "✓ ≤ 2 device types",
      },
      broker: {
        value: 2,
        title: "✓ 2 brokers",
      },
      connection: {
        value: 2,
        title: "✓ 2 connections",
      },
      users: {
        value: 1,
        title: "✓ 1 admin",
      },
      retention: {
        value: 7,
        title: "✓ 7 days",
      },
    }),
  },
  {
    name: "LIGHT",
    description: "Up to 25 devices",
    price: JSON.stringify([{
      custom: false,
      amount: 150.0,
      currency: "€",
      billing_period: "month",
    }, {
      custom: false,
      amount: 137.50,
      currency: "€",
      billing_period: "year",
    }]),
    specs: JSON.stringify({
      entity: {
        value: 10,
        title: "✓ 10 Entities",
      },
      device: {
        value: 25,
        title: "✓ ≤ 25 devices",
      },
      deviceType: {
        value: 25,
        title: "✓ ≤ 25 device types",
      },
      broker: {
        value: 5,
        title: "✓ 5 brokers",
      },
      connection: {
        value: 20,
        title: "✓ 20 connections",
      },
      users: {
        value: 1,
        title: "✓ 1 admin",
      },
      retention: {
        value: 7,
        title: "✓ 7 days",
      },
    }),
  },
  {
    name: "STANDARD",
    description: "Up to 50 devices",
    price: JSON.stringify([{
      custom: false,
      amount: 375.0,
      currency: "€",
      billing_period: "month",
    }, {
      custom: false,
      amount: 343.75,
      currency: "€",
      billing_period: "year",
    }]),
    specs: JSON.stringify({
      entity: {
        value: 20,
        title: "✓ 20 Entities",
      },
      device: {
        value: 50,
        title: "✓ ≤ 50 devices",
      },
      deviceType: {
        value: 50,
        title: "✓ ≤ 50 device types",
      },
      broker: {
        value: 5,
        title: "✓ 10 brokers",
      },
      connection: {
        value: 20,
        title: "✓ 20 connections",
      },
      users: {
        value: 1,
        title: "✓ 1 admin",
      },
      retention: {
        value: 30,
        title: "✓ 30 days",
      },
    }),
  },
  {
    name: "PLUS",
    description: "Up to 200 devices",
    price: JSON.stringify([{
      custom: false,
      amount: 625.0,
      currency: "€",
      billing_period: "month",
    }, {
      custom: false,
      amount: 572.92,
      currency: "€",
      billing_period: "year",
    }]),
    specs: JSON.stringify({
      entity: {
        value: 50,
        title: "✓ 50 Entities",
      },
      device: {
        value: 200,
        title: "✓ ≤ 200 devices",
      },
      deviceType: {
        value: 200,
        title: "✓ ≤ 200 device types",
      },
      broker: {
        value: 20,
        title: "✓ 20 brokers",
      },
      connection: {
        value: 50,
        title: "✓ 50 connections",
      },
      users: {
        value: 5,
        title: "✓ 5 admins",
      },
      retention: {
        value: 30,
        title: "✓ 30 days",
      },
    }),
  },
  {
    name: "CUSTOM",
    description: "Unlimited devices",
    price: JSON.stringify([{
      custom: true,
      amount: 999.0,
      currency: "€",
      billing_period: "month",
    }, {
      custom: false,
      amount: 999.00,
      currency: "€",
      billing_period: "year",
    }]),
    specs: JSON.stringify({
      entity: {
        value: 50,
        title: "✓ Custom Entities",
      },
      device: {
        value: 500,
        title: "✓ Unlimited devices",
      },
      deviceType: {
        value: 500,
        title: "✓ Unlimite device types",
      },
      broker: {
        value: 20,
        title: "✓ Custom brokers",
      },
      connection: {
        value: 50,
        title: "✓ Custom connections",
      },
      users: {
        value: 5,
        title: "✓ Custom admin",
      },
      retention: {
        value: 30,
        title: "✓ Custom retention period",
      },
    }),
  },
];
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
    const plan = await db
      .insert(subscriptionPlan)
      .values(plans)
      .onConflictDoNothing()
      .returning()
      .then((res) => res[0] ?? null);
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


    //default licence free for all tenants
    const [freePlan] = await db.select().from(subscriptionPlan).where(eq(subscriptionPlan.name, "FREE"));
    console.log(freePlan)
    if (!freePlan) {
      throw new Error("FREE plan not found");
    }
    const tenants = await db.select().from(tenant);
    for (const t of tenants) {
      const licenceItem = await db.insert(licence).values({
        name: freePlan.name,
        subscriptionPlanId: +freePlan.id,
        sessionId: '',
      })
        .onConflictDoNothing()
        .returning().then((res) => res[0] ?? null);

      if (!licenceItem) continue;
      console.log(licenceItem)
      await db.update(tenant)
        .set({ licenceId: licenceItem.id })
        .where(eq(tenant.id, t.id));
    }
  } catch (error) {
    console.log(error);
    console.log('already exist');
  }
}

seed();
