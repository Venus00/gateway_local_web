import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class TokenExpiredFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): any;
}
