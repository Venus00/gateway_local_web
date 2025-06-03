import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  
  @Catch(HttpException)
  export class TokenExpiredFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const exceptionResponse: any = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse.message === 'Unauthorized'
      ) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Token expired',
          path: request.url,
        });
      }
  
      response.status(status).json({
        statusCode: status,
        message: exceptionResponse.message || 'Unexpected error',
        path: request.url,
      });
    }
  }
  