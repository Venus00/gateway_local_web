/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Query,
    Res,
} from '@nestjs/common';

import { AppService } from './app.service';
@Controller('acl')
export class AppController {
    constructor(private appService: AppService) {

    }

    @Post('auth')
    async checkmqttAuth(@Body() data,
        @Res() res) {
        console.log(data)
        try {
            const result = await this.appService.checkUserAccess(data);
            return res.status(HttpStatus.OK).json(result);

        } catch (error) {
            return res.status(HttpStatus.OK).json({
                result: 'deny'
            })
        }
    }


    @Post('mqtt')
    async checkmqtt(@Body() data, @Res() res) {
        console.log("mqtt acl", data)
        return res.status(HttpStatus.BAD_REQUEST).json({
            result: 'deny'
        })
    }



}