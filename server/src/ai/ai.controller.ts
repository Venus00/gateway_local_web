import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Response } from 'express';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {

    // constructor(private aiService:AiService){}
    // @Get('')
    // async getBrokers(@Res() res:Response)
    // {
    //   try {
        
    //     return res.status(HttpStatus.OK).json({});
    //   } catch (error) {
    //     return res.status(HttpStatus.BAD_REQUEST) 
    //   }
    // }
}
