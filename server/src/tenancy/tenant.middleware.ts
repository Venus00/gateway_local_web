import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenancyService } from './tenancy.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(
        @Inject('DB_DEV') private db: NodePgDatabase<typeof schema>,
        private readonly tenantService: TenancyService) { }

    use(req: Request, res: Response, next: NextFunction) {

        const tenantSlug = req?.headers?.host?.split('.')[0];
        //console.log("tenantSlug", tenantSlug)
        //dev test
        // if (tenantSlug?.includes('localhost')) {
        //     req['tenantSlug'] = 'cloud';
        //    return next();
        // }
        // if (!tenantSlug) {
        //     return res.status(400).json({ error: 'Tenant identifier missing' });
        // }
        //req['tenantSlug'] = tenantSlug;

        req['tenantSlug'] = 'cloud';

      return  next();
    }
}
