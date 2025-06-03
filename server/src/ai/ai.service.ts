import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema'

@Injectable()
export class AiService {
    constructor(@Inject('DB_DEV') private db: NodePgDatabase<typeof schema>) { }


    // async loadEvents(deviceSerial:string,from:Date,to:Date)
    // {
    //     try {
    //         await this.db.select().from(schema.event).where()
    //     } catch (error) {
    //         throw new Error("error load events from db");

    //     }
    // }
}
