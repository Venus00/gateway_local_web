import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as schema from '../../db/schema';
@Controller('tenency')
export class TenancyController {
    @Get()
    async getData(@Req() req: Request, @Res() res: Response) {
        const tenantConnection = req['tenantConnection'];
        console.log("hello")
        if (!tenantConnection) {
            return res.status(400).json({ error: 'Tenant connection not available' });
        }

        try {
            //const data = await tenantConnection.select().from(schema.users);
            res.json({ status: 'test' });
        } catch (error) {
            console.error('Error fetching data for tenant:', error);
            res.status(500).json({ error: 'Failed to fetch data for tenant' });
        }
    }
}
