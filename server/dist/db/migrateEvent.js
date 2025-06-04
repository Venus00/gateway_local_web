"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema_1 = require("./schema");
const drizzle_orm_1 = require("drizzle-orm");
async function seed() {
    const pool1 = new pg_1.Pool({
        connectionString: 'postgres://nextronic:nextronic@154.144.229.22:5432/nextronic',
        user: 'nextronic',
        password: 'nextronic',
    });
    const pool2 = new pg_1.Pool({
        connectionString: 'postgres://nextronic:nextronic@79.137.64.203:5432/nextronic',
        user: 'nextronic',
        password: 'nextronic',
    });
    try {
        const db1 = (0, node_postgres_1.drizzle)({ client: pool1 });
        const db2 = (0, node_postgres_1.drizzle)({ client: pool2 });
        const eventResult = [];
        const eventList = await db1.select().from(schema_1.event).where((0, drizzle_orm_1.eq)(schema_1.event.deviceId, 75));
        if (eventList) {
            console.log(eventList);
            for (let i = 0; i < eventList.length; i++) {
                const { id, ...data } = eventList[i];
                await db2.insert(schema_1.event).values({
                    ...data,
                    deviceId: 4,
                });
            }
            console.log(eventResult);
            await db2.insert(schema_1.event).values(eventResult);
        }
    }
    catch (error) {
        console.log(error);
        console.log('already exist');
    }
}
seed();
//# sourceMappingURL=migrateEvent.js.map