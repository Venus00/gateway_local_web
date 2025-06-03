/* eslint-disable prettier/prettier */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { broker, licence, event, subscriptionPlan, tenant, users } from './schema';
import { eq } from 'drizzle-orm';




async function seed() {
    const pool1 = new Pool({
        connectionString: 'postgres://nextronic:nextronic@154.144.229.22:5432/nextronic',
        user: 'nextronic',
        password: 'nextronic',
    });
    const pool2 = new Pool({
        connectionString: 'postgres://nextronic:nextronic@79.137.64.203:5432/nextronic',
        user: 'nextronic',
        password: 'nextronic',
    })
    try {
        const db1 = drizzle({ client: pool1 });
        const db2 = drizzle({ client: pool2 })
        const eventResult: any[] = [];
        const eventList = await db1.select().from(event).where(eq(event.deviceId, 75))
        if (eventList) {
            console.log(eventList

            )

            for (let i = 0; i < eventList.length; i++) {
                const { id, ...data } = eventList[i]
                await db2.insert(event).values({
                    ...data,
                    deviceId: 4,
                });
            }
            console.log(eventResult)
            await db2.insert(event).values(eventResult);

        }
    } catch (error) {
        console.log(error);
        console.log('already exist');
    }
}

seed();
