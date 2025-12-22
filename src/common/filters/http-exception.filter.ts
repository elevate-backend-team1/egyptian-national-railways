import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    if (typeof message === 'object' && 'message' in message) {
      message = (message as { message: string | string[] }).message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error: exception instanceof HttpException ? exception.name : 'Internal Server Error',
      message: message,
      path: request.url,
      timestamp: new Date().toISOString()
    });
  }
}
